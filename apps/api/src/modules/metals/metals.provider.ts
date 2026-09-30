
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawSpotPrice, FetchSource, FetchTrigger, HistoricSpot, MetalType } from '@goldilocks/shared-types';
import { METAL_PRICE_API, type MetalPriceApiPort } from '../../infrastructure/metal-price-api/metal-price-api.port';
import { SpotPriceCacheStore } from './spot-price-cache.store';
import { CascadeMetricsService } from './cascade-metrics.service';
import { FetchAttemptService } from './fetch-attempt.service';
import {
    ALL_METALS,
    HISTORIC_LOOKBACK_DAYS, HistoricSpotRecord,
    SYMBOL_MAP,
    toNumber,
    toRawMetalSpotPrice
} from "../../common/utils/pricing.util";

// How old a DB-sourced price is allowed to be before the launch-read
// cascade (getAllLatestForLaunch) stops trusting it and falls through to a
// live API call instead. The cron refreshes every 10 minutes, so anything
// past this points to the cron having been down/failing, not just a normal
// gap between cycles.
const DB_STALE_MS = 30 * 60 * 1000;

function isFresh(timestampIso: string, maxAgeMs: number): boolean {
    return Date.now() - new Date(timestampIso).getTime() < maxAgeMs;
}

function isUsablePrice(price: RawSpotPrice | null): price is RawSpotPrice {
    return price !== null && price.priceEur > 0;
}

/**
 * Tags a price with which tier resolved it. Taking `price` as an explicit
 * `RawSpotPrice` parameter (rather than inline-spreading at each call site)
 * sidesteps a real TS narrowing trap: after `isUsablePrice(x)` returns
 * false, TS narrows `x` all the way to `null` (RawSpotPrice fully subsumes
 * the predicate's true-type), even though at runtime x can still be a real
 * RawSpotPrice with priceEur <= 0 — spreading that "narrowed-to-never"
 * value directly at the call site is a compile error, but passing it into
 * a function with its own honestly-typed parameter isn't.
 */
function withFetchSource(price: RawSpotPrice, fetchSource: FetchSource, isFallback = false): RawSpotPrice {
    return { ...price, fetchSource, isFallback };
}

export interface MetalsRefreshResult {
    prices: RawSpotPrice[];
    /** Metals that had no usable price anywhere (live API, cache, or DB) — still 0.00, but callers can surface why. */
    degradedMetals: MetalType[];
}

/**
 * MetalsProvider — "give me metal data from the best available source."
 *
 * Two read strategies live here, each suited to why it's being called:
 *   - getLatest/getAllLatest: plain cache→DB, no external call — used by
 *     Trade/Portfolio bootstraps that just need *a* price quickly. A
 *     poisoned (0.00) cache entry is skipped rather than trusted, but
 *     there's no further fallback beyond the DB.
 *   - getAllLatestForLaunch: cache→DB→live API, with a staleness check on
 *     the DB tier — used by the market-data page load, where "any value
 *     that isn't zero or ancient" is fine, but it's worth one live call
 *     before giving up.
 *   - refreshAll: live API first (that's the whole point of hitting
 *     Refresh), falling back to the last stored DB price per metal only if
 *     the API didn't return it — used by the cron and the Refresh button.
 *
 * No pricing, no products — this module knows nothing about either.
 */
@Injectable()
export class MetalsProvider {
    private readonly logger = new Logger(MetalsProvider.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject(METAL_PRICE_API) private readonly metalPriceApi: MetalPriceApiPort,
        private readonly spotCache: SpotPriceCacheStore,
        private readonly cascadeMetrics: CascadeMetricsService,
        private readonly fetchAttempts: FetchAttemptService,
    ) {}

    // ── Orchestration — Reads (cache → DB only, no external call) ───────

    async getLatest(metal: MetalType): Promise<RawSpotPrice | null> {
        return this.spotCache.get(metal);
    }

    /** Admin "Clear price cache" action from the Admin panel. */
    async clearCache(): Promise<void> {
        await this.spotCache.clearAll(ALL_METALS);
    }

    async getAllLatest(): Promise<RawSpotPrice[]> {
        const results = await Promise.all(ALL_METALS.map((m) => this.getLatest(m)));
        return results.filter((r): r is RawSpotPrice => r !== null);
    }

    /**
     * Historic spot prices for charting (last ~year).
     */
    async getHistoricSpots(): Promise<HistoricSpot[]> {
        const rows = await this.readHistoricFromDb();

        if (rows.length === 0) {
            this.logger.warn('No historic spot data found — has the cron run yet?');
        }

        return rows.map((row) => ({
            metalType: row.metalType as MetalType,
            priceEur: toNumber(row.priceEur),
            priceGbp: toNumber(row.priceGbp),
            timestamp: row.recordedAt.toISOString(),
        }));
    }

    // ── Orchestration — Launch read (cache → DB → live API last resort) ──

    /**
     * Used for the initial market-data load (and its periodic refetch) —
     * "any value that isn't zero or ancient" is acceptable, so cache and DB
     * are tried first and the live API is only a last resort per metal,
     * rather than always paying for a network call like refreshAll does.
     */
    async getAllLatestForLaunch(): Promise<MetalsRefreshResult> {
        const prices: RawSpotPrice[] = [];
        const needsLiveFetch: MetalType[] = [];

        for (const metal of ALL_METALS) {
            const cached = await this.spotCache.getCachedOnly(metal);
            if (isUsablePrice(cached)) {
                this.cascadeMetrics.recordCacheHit();
                prices.push(withFetchSource(cached, 'cache'));
                continue;
            }
            this.cascadeMetrics.recordCacheMiss();

            const dbRow = await this.spotCache.getFromDbOnly(metal);
            if (isUsablePrice(dbRow) && isFresh(dbRow.timestamp, DB_STALE_MS)) {
                await this.spotCache.set(metal, dbRow);
                prices.push(withFetchSource(dbRow, 'db'));
                continue;
            }

            needsLiveFetch.push(metal);
        }

        if (needsLiveFetch.length === 0) {
            return { prices, degradedMetals: [] };
        }

        this.logger.warn(`Cache/DB insufficient for ${needsLiveFetch.join(', ')} — trying the live API as a last resort`);
        const { rates: liveRates, asOf: timestamp } = await this.fetchFromExternalApi('LAUNCH_FALLBACK');
        const degradedMetals: MetalType[] = [];

        for (const metal of needsLiveFetch) {
            const rate = liveRates[metal];

            if (rate && rate.eur > 0) {
                const record = { metalType: metal, priceEur: rate.eur, priceGbp: rate.gbp, source: 'metalpriceapi', timestamp };
                await this.storeInDb([record]);
                const dto = this.toDto(record, 'live');
                await this.spotCache.set(metal, dto);
                prices.push(dto);
                continue;
            }

            degradedMetals.push(metal);
            // Nothing usable anywhere for this metal — surface whatever the
            // DB had (even if 0/stale) so the UI has *something* to render;
            // the caller (MarketDataService) turns degradedMetals into a
            // toast explaining why it might read 0.00.
            const lastResort = await this.spotCache.getFromDbOnly(metal);
            if (lastResort) prices.push(withFetchSource(lastResort, 'db'));
        }

        return { prices, degradedMetals };
    }

    // ── Orchestration — Writes (cron + manual Refresh) ──────────────────

    /**
     * Refresh: always tries the live API first (that's the point of
     * clicking Refresh), and only falls back to the last stored DB price
     * per metal that the API didn't return a usable rate for. Called by
     * MetalsCron (background, return value ignored), the market-data
     * Refresh endpoint (which surfaces degradedMetals as a toast), and the
     * per-metal "Retry" action — `triggeredBy` is purely bookkeeping for the
     * FetchAttempt log, distinguishing a routine cron tick from a manual
     * click when reading the System Status panel later.
     */
    async refreshAll(triggeredBy: FetchTrigger = 'REFRESH'): Promise<MetalsRefreshResult> {
        const { rates: liveRates, asOf: timestamp } = await this.fetchFromExternalApi(triggeredBy);
        const prices: RawSpotPrice[] = [];

        const liveMetals = (Object.keys(liveRates) as MetalType[]).filter((m) => (liveRates[m]?.eur ?? 0) > 0);

        if (liveMetals.length > 0) {
            const records = liveMetals.map((metal) => ({
                metalType: metal,
                priceEur: liveRates[metal]!.eur,
                priceGbp: liveRates[metal]!.gbp,
                source: 'metalpriceapi',
                timestamp,
            }));

            await this.storeInDb(records);

            const dtos = records.map((record) => this.toDto(record, 'live'));
            await Promise.all(dtos.map((dto) => this.spotCache.set(dto.metalType, dto)));
            prices.push(...dtos);

            this.logger.log(`✅ Refreshed ${liveMetals.join(', ')} from the live API`);
        }

        const failedMetals = ALL_METALS.filter((m) => !liveMetals.includes(m));
        const degradedMetals: MetalType[] = [];

        for (const metal of failedMetals) {
            this.logger.warn(`${metal}: live API didn't return a usable rate — falling back to the last stored price`);
            const dbRow = await this.spotCache.getFromDbOnly(metal);

            if (isUsablePrice(dbRow)) {
                await this.spotCache.set(metal, dbRow);
                // isFallback: true — a live fetch was just attempted for this
                // metal and failed; this is the last-known-good price serving
                // in its place, not just the normal cache/DB-preferred path.
                prices.push(withFetchSource(dbRow, 'db', true));
            } else {
                degradedMetals.push(metal);
                if (dbRow) prices.push(withFetchSource(dbRow, 'db', true)); // last resort — even a 0/unusable row, so the UI has *something*
            }
        }

        return { prices, degradedMetals };
    }

    /**
     * Admin "Retry" action on one card. The vendor API has no way to fetch
     * a single metal — one call always returns all four — so this makes
     * the same whole-basket call refreshAll does, but only stores/returns
     * the one metal the admin actually clicked retry on, and reports
     * failure for that metal specifically if the basket call didn't
     * include a usable rate for it.
     */
    async retryMetal(metal: MetalType): Promise<RawSpotPrice | null> {
        const { rates: liveRates, asOf } = await this.fetchFromExternalApi('RETRY');
        const rate = liveRates[metal];

        if (!rate || rate.eur <= 0) {
            return null;
        }

        const record = { metalType: metal, priceEur: rate.eur, priceGbp: rate.gbp, source: 'metalpriceapi', timestamp: asOf };
        await this.storeInDb([record]);
        const dto = this.toDto(record, 'live');
        await this.spotCache.set(metal, dto);
        return dto;
    }

    private toDto(
        record: { metalType: MetalType; priceEur: number; priceGbp: number; source: string; timestamp: Date },
        fetchSource: RawSpotPrice['fetchSource'],
    ): RawSpotPrice {
        return {
            id: '',
            metalType: record.metalType,
            priceEur: record.priceEur,
            priceGbp: record.priceGbp,
            source: record.source,
            createdAt: new Date().toISOString(),
            timestamp: record.timestamp.toISOString(),
            fetchSource,
        };
    }

    // ── External API ─────────────────────────────────────────────────────

    /**
     * Returns only the metals the external API actually gave us a usable
     * rate for — never a full zero-filled map. A quota-exceeded response
     * (success=false) or a thrown error (rate limit, network) used to fall
     * back to EMPTY_METAL_RATES, a fully-populated {eur:0,gbp:0} map, which
     * fetchAndStore's "did we get anything?" check (Object.keys(...).length)
     * saw as 4 non-empty entries and happily persisted — overwriting the
     * last known good price in both the DB and the Redis cache with zero.
     * Returning {} (or omitting just the metals with no rate) lets that same
     * check correctly abort instead, leaving whatever's already cached/
     * stored alone until the API is healthy again.
     */
    private async fetchFromExternalApi(triggeredBy: FetchTrigger): Promise<{
        rates: Partial<Record<MetalType, { eur: number; gbp: number }>>;
        /** When the vendor says these rates were struck (their `timestamp`), not when we asked — a cache/DB hit later shows this same time, which is what staff need to judge how old the price really is. Falls back to "now" if the vendor omits it. */
        asOf: Date;
    }> {
        const startedAt = Date.now();

        try {
            const response = await this.metalPriceApi.livePrices();

            // A quota-exceeded/error response has no `rates` object at all —
            // logging response.rates.XAU before this check used to throw and
            // get caught below as a generic "fetch failed", masking the real,
            // more useful "success=false" message this check produces.
            if (!response.success) {
                this.logger.error(`MetalPriceAPI returned success=false: ${JSON.stringify(response)}`);
                await this.fetchAttempts.record({
                    durationMs: Date.now() - startedAt,
                    success: false,
                    errorMessage: JSON.stringify(response),
                    metalsResolved: [],
                    triggeredBy,
                });
                return { rates: {}, asOf: new Date() };
            }

            // Vendor timestamps are unix seconds; ignore anything missing or
            // not in the past so a bad value can't make a price look brand new.
            const vendorMs = Number(response.timestamp) * 1000;
            const asOf = Number.isFinite(vendorMs) && vendorMs > 0 && vendorMs <= Date.now() ? new Date(vendorMs) : new Date();

            this.logger.debug(`Base=${response.base}, Timestamp=${response.timestamp}`);
            this.logger.debug(`XAU=${response.rates.XAU}`);
            this.logger.debug(`Computed EUR/XAU=${1 / response.rates.XAU}`);

            const rates: Partial<Record<MetalType, { eur: number; gbp: number }>> = {};

            for (const [metalType, symbol] of Object.entries(SYMBOL_MAP) as [MetalType, string][]) {
                const rawRate = response.rates[symbol];

                if (!rawRate) {
                    this.logger.warn(`No rate returned for ${metalType} (${symbol}) — keeping last known price`);
                    continue;
                }

                const eurPerOunce = 1 / rawRate;
                const gbpRate = response.rates.GBP ?? 0;

                rates[metalType] = {
                    eur: eurPerOunce,
                    gbp: eurPerOunce * gbpRate,
                };
            }

            this.logger.log('✅ External API fetch succeeded: ' + JSON.stringify(rates));
            await this.fetchAttempts.record({
                durationMs: Date.now() - startedAt,
                success: true,
                errorMessage: null,
                metalsResolved: Object.keys(rates) as MetalType[],
                triggeredBy,
            });
            return { rates, asOf };
        } catch (error) {
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            if (error instanceof Error) {
                this.logger.error('External API fetch failed', error.stack);
            } else {
                this.logger.error('External API fetch failed', message);
            }
            await this.fetchAttempts.record({
                durationMs: Date.now() - startedAt,
                success: false,
                errorMessage: message,
                metalsResolved: [],
                triggeredBy,
            });
            return { rates: {}, asOf: new Date() };
        }
    }

    private async fetchHistoricFromExternalApi(startDate: string, endDate: string): Promise<HistoricSpotRecord[]> {
        const [eurResponse, gbpResponse] = await Promise.all([
            this.metalPriceApi.timeframePrices(startDate, endDate, 'EUR'),
            this.metalPriceApi.timeframePrices(startDate, endDate, 'GBP'),
        ]);

        if (!eurResponse.success) {
            this.logger.error(`EUR historic failed: ${JSON.stringify(eurResponse)}`);
            return [];
        }

        if (!gbpResponse.success) {
            this.logger.error(`GBP historic failed: ${JSON.stringify(gbpResponse)}`);
            return [];
        }

        const records: HistoricSpotRecord[] = [];

        for (const [date, eurRates] of Object.entries(eurResponse.rates)) {
            const gbpRates = gbpResponse.rates[date];
            if (!gbpRates) continue;

            for (const [metalType, symbol] of Object.entries(SYMBOL_MAP) as [MetalType, string][]) {
                const eurRate = eurRates[symbol];
                const gbpRate = gbpRates[symbol];
                if (eurRate == null || gbpRate == null) continue;

                records.push({
                    metalType,
                    priceEur: 1 / Number(eurRate),
                    priceGbp: 1 / Number(gbpRate),
                    recordedAt: new Date(date),
                });
            }
        }

        return records;
    }

    async fetchAndStoreHistoricClose(date: string): Promise<void> {
        this.logger.log(`Fetching OHLC historic close for ${date}`);
        const recordedAt = new Date(`${date}T00:00:00.000Z`);
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const existingCount = await this.prisma.historicSpotPrice.count({
            where: { recordedAt: { gte: startOfDay, lte: endOfDay } },
        });

        if (existingCount === ALL_METALS.length) {
            this.logger.log(`Historic OHLC already exists for ${recordedAt}`);
            return;
        }

        const records = await Promise.all(
            Object.entries(SYMBOL_MAP).map(async ([metalType, symbol]) => {
                const [eurResponse, gbpResponse] = await Promise.all([
                    this.metalPriceApi.ohlcPrices(date, 'EUR', symbol),
                    this.metalPriceApi.ohlcPrices(date, 'GBP', symbol),
                ]);

                if (!eurResponse.success || !gbpResponse.success) {
                    return null;
                }

                this.logger.debug(`EUR=${eurResponse.rate.close}, GBP=${gbpResponse.rate.close}`);
                this.logger.debug(
                    `${metalType} EUR close raw=${eurResponse.rate.close} inverted=${1 / Number(eurResponse.rate.close)}`,
                );

                return {
                    metalType: metalType as MetalType,
                    priceEur: 1 / Number(eurResponse.rate.close),
                    priceGbp: 1 / Number(gbpResponse.rate.close),
                    recordedAt,
                };
            }),
        );

        const validRecords = records.filter((r): r is HistoricSpotRecord => r !== null);

        if (validRecords.length === 0) {
            this.logger.warn('No OHLC records generated');
            return;
        }

        await this.prisma.historicSpotPrice.createMany({
            data: validRecords,
            skipDuplicates: true,
        });

        this.logger.log(`Inserted ${validRecords.length} historic close prices for ${date}`);
    }

    async seedHistoricPrices(): Promise<void> {
        this.logger.log('Starting historic price seed...');

        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 364); // 365 days max for free plan

        const startDate = start.toISOString().slice(0, 10);
        const endDate = end.toISOString().slice(0, 10);

        const records = await this.fetchHistoricFromExternalApi(startDate, endDate);

        if (!records.length) {
            this.logger.warn('No historic records returned');
            return;
        }

        await this.prisma.historicSpotPrice.createMany({
            data: records.map((record) => ({
                metalType: record.metalType,
                priceEur: record.priceEur,
                priceGbp: record.priceGbp,
                recordedAt: record.recordedAt,
            })),
            skipDuplicates: true,
        });

        this.logger.log(`Inserted ${records.length} historic spot prices`);
    }

    // ── Database (historic only — single-metal reads now live in SpotPriceCacheStore) ──

    /**
     * Most recent date we have a historic close for, across all metals.
     * Used by MetalsCron on startup to detect a stale gap (e.g. the app
     * wasn't running when the daily cron would have fired) and backfill it.
     */
    async getLatestHistoricDate(): Promise<Date | null> {
        const latest = await this.prisma.historicSpotPrice.findFirst({
            orderBy: { recordedAt: 'desc' },
            select: { recordedAt: true },
        });
        return latest?.recordedAt ?? null;
    }

    private async readHistoricFromDb() {
        const since = new Date();
        since.setDate(since.getDate() - HISTORIC_LOOKBACK_DAYS);

        this.logger.debug(`Reading historic spot prices since ${since.toISOString()} from DB…`);
        return this.prisma.historicSpotPrice.findMany({
            where: { metalType: { in: ALL_METALS }, recordedAt: { gte: since } },
            orderBy: { recordedAt: 'asc' },
            select: { metalType: true, priceEur: true, priceGbp: true, recordedAt: true },
        });
    }

    private async storeInDb(
        records: {
            metalType: MetalType;
            priceEur: number;
            priceGbp: number;
            source: string;
            timestamp: Date;
        }[]
    ): Promise<void> {

        this.logger.debug(
            `Storing ${records.length} metal record(s) in DB…`
        );

        await this.prisma.metalSpotPrice.createMany({
            data: records,
        });

        this.logger.log(
            `💾 Saved ${records.length} metal record(s) to DB`
        );
    }
}