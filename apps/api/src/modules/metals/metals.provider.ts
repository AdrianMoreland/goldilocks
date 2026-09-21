
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawSpotPrice, HistoricSpot, MetalType } from '@goldilocks/shared-types';
import { MetalPriceApiClient } from '../../infrastructure/metal-price-api/metal-price-api.client';
import { SpotPriceCacheStore } from './spot-price-cache.store';
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
        private readonly metalPriceApi: MetalPriceApiClient,
        private readonly spotCache: SpotPriceCacheStore,
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
                prices.push(cached);
                continue;
            }

            const dbRow = await this.spotCache.getFromDbOnly(metal);
            if (isUsablePrice(dbRow) && isFresh(dbRow.timestamp, DB_STALE_MS)) {
                await this.spotCache.set(metal, dbRow);
                prices.push(dbRow);
                continue;
            }

            needsLiveFetch.push(metal);
        }

        if (needsLiveFetch.length === 0) {
            return { prices, degradedMetals: [] };
        }

        this.logger.warn(`Cache/DB insufficient for ${needsLiveFetch.join(', ')} — trying the live API as a last resort`);
        const liveRates = await this.fetchFromExternalApi();
        const timestamp = new Date();
        const degradedMetals: MetalType[] = [];

        for (const metal of needsLiveFetch) {
            const rate = liveRates[metal];

            if (rate && rate.eur > 0) {
                const record = { metalType: metal, priceEur: rate.eur, priceGbp: rate.gbp, source: 'metalpriceapi', timestamp };
                await this.storeInDb([record]);
                const dto = this.toDto(record);
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
            if (lastResort) prices.push(lastResort);
        }

        return { prices, degradedMetals };
    }

    // ── Orchestration — Writes (cron + manual Refresh) ──────────────────

    /**
     * Refresh: always tries the live API first (that's the point of
     * clicking Refresh), and only falls back to the last stored DB price
     * per metal that the API didn't return a usable rate for. Called by
     * both MetalsCron (background, return value ignored) and the
     * market-data Refresh endpoint (which surfaces degradedMetals as a
     * toast).
     */
    async refreshAll(): Promise<MetalsRefreshResult> {
        const liveRates = await this.fetchFromExternalApi();
        const timestamp = new Date();
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

            const dtos = records.map((record) => this.toDto(record));
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
                prices.push(dbRow);
            } else {
                degradedMetals.push(metal);
                if (dbRow) prices.push(dbRow); // last resort — even a 0/unusable row, so the UI has *something*
            }
        }

        return { prices, degradedMetals };
    }

    private toDto(record: { metalType: MetalType; priceEur: number; priceGbp: number; source: string; timestamp: Date }): RawSpotPrice {
        return {
            id: '',
            metalType: record.metalType,
            priceEur: record.priceEur,
            priceGbp: record.priceGbp,
            source: record.source,
            createdAt: new Date().toISOString(),
            timestamp: record.timestamp.toISOString(),
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
    private async fetchFromExternalApi(): Promise<
        Partial<Record<MetalType, { eur: number; gbp: number }>>
    > {
        try {
            const response = await this.metalPriceApi.livePrices();

            // A quota-exceeded/error response has no `rates` object at all —
            // logging response.rates.XAU before this check used to throw and
            // get caught below as a generic "fetch failed", masking the real,
            // more useful "success=false" message this check produces.
            if (!response.success) {
                this.logger.error(`MetalPriceAPI returned success=false: ${JSON.stringify(response)}`);
                return {};
            }

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
            return rates;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('External API fetch failed', error.stack);
            } else {
                this.logger.error('External API fetch failed', JSON.stringify(error));
            }
            return {};
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


/*
import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../../infrastructure/prisma/prisma.service';
import {RedisService} from '../../redis/redis.service';
import {SpotPrice, RawSpotPrice, HistoricSpot, MetalType} from '@goldilocks/shared-types';
import {MetalPriceApiClient} from '../../infrastructure/metal-price-api/metal-price-api.client';
import {Decimal} from "../../../prisma/generated/internal/prismaNamespace";
import {MetalSpotPrice} from "../../../prisma/generated/client";
import {SpotPriceCacheStore} from "./spot-price-cache.store";

interface RawMetalRecord {
    metalType: MetalType;
    priceGbp: number | Decimal;
    priceEur: number | Decimal;
    source: string;
    timestamp: Date;
}

const ALL_METALS: MetalType[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];

const SYMBOL_MAP: Record<MetalType, string> = {
    GOLD: 'XAU',
    SILVER: 'XAG',
    PLATINUM: 'XPT',
    PALLADIUM: 'XPD',
};

interface HistoricSpotRecord {
    metalType: MetalType;
    priceEur: number;
    priceGbp: number;
    recordedAt: Date;
}

const CACHE_TTL_SECONDS = 3600;
const HISTORIC_LOOKBACK_DAYS = 365;

function toNumber(value: Decimal | number | undefined | null): number {
    if (value === undefined || value === null) return 0;
    if (value instanceof Decimal) return value.toNumber();
    return value;
}

/!**
 * MetalsProvider — "give me metal data from the best available source."
 *
 * Strategy for a single metal's latest price:
 *   Redis hit   → return immediately
 *   Redis miss  → query DB → repopulate cache → return
 *   DB empty    → return null (cron is responsible for the first fetch)
 *
 * The external API is only ever called by fetchAndStore() (the cron job),
 * never from a read path — this keeps read latency predictable.
 *
 * Every infrastructure touchpoint (cache, DB, external API) is isolated
 * into its own named method, grouped below by concern. The orchestration
 * methods (getLatest, fetchAndStore) only ever call those — never reach
 * into Prisma/Redis/the API client directly themselves.
 *
 * No pricing, no products — this module knows nothing about either.
 *!/
@Injectable()
export class MetalsProvider {
    private readonly logger = new Logger(MetalsProvider.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly metalPriceApi: MetalPriceApiClient,
        private readonly spotCache: SpotPriceCacheStore,
    ) {
    }

    // ── Reads ────────────────────────────────────────────────────────────

    // ── Orchestration — Reads ───────────────────────────────────────────

    async getLatest(metal: MetalType): Promise<RawSpotPrice | null> {
        const cached = await this.readFromCache(metal);
        if (cached) {
            this.logger.debug(`⚡ Cache hit for ${metal}, last updated at ${cached.timestamp}`);
            return cached;
        }

        this.logger.debug(`🗄️  Cache miss for ${metal}, querying DB…`);
        const row = await this.readFromDb(metal);

        if (!row) {
            this.logger.warn(`No DB record found for ${metal}`);
            return null;
        }

        const dto = this.toDto(row);
        await this.saveToCache(dto);
        return dto;
    }

    async getAllLatest(): Promise<RawSpotPrice[]> {
        const results = await Promise.all(ALL_METALS.map((m) => this.getLatest(m)));
        return results.filter((r): r is RawSpotPrice => r !== null);
    }

    /!**
     * Historic spot prices for charting (last ~year).
     *
     * NOTE: HistoricSpotSchema expects { metalType, priceEur, priceGbp, timestamp }.
     * Confirm the historicSpotPrice table has matching priceEUR/priceGBP columns
     * before relying on this in production — if the migration isn't in yet,
     * this will throw rather than silently default.
     *!/
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


    // ── Orchestration — Writes (cron only) ──────────────────────────────

    /!**
     * Scheduled refresh (called by MetalsCron).
     * 1. Fetch fresh prices from the external API
     * 2. Diff against the latest DB row per metal for previousPrice
     * 3. Persist new rows (keeps full history)
     * 4. Overwrite Redis so the next getLatest() is instant
     *!/
    async fetchAndStore(): Promise<void> {
        try {
            this.logger.log('🔄 Starting scheduled metal price refresh…');

            const liveRates = await this.fetchFromExternalApi();
            if (!Object.keys(liveRates).length) {
                this.logger.warn('No prices returned from external API — aborting refresh');
                return;
            }

            const timestamp = new Date();
            const records: RawMetalRecord[] =
                Object.entries(liveRates)
                    .map(([metalType, prices]) => ({
                        metalType: metalType as MetalType,
                        priceEur: prices.eur,
                        priceGbp: prices.gbp,
                        source: 'metalpriceapi',
                        timestamp,
                    }));

            await this.storeInDb(records);

            const dtos = records.map((r) => this.toDto(r));
            await Promise.all(dtos.map((dto) => this.saveToCache(dto)));

            this.logger.log('✅ Metal prices refreshed and cached');
        } catch (err) {
            this.logger.error('fetchAndStore failed', err instanceof Error ? err.stack : String(err));
        }
    }


    // ── External API ─────────────────────────────────────────────────────

    private async fetchFromExternalApi(): Promise<Partial<Record<MetalType, { eur: number; gbp: number }>>> {
        try {
            const response = await this.metalPriceApi.livePrices();

            // ← ADD LOGGING HERE
            this.logger.debug(
                `Base=${response.base}, Timestamp=${response.timestamp}`,
            );

            this.logger.debug(
                `XAU=${response.rates.XAU}`,
            );

            this.logger.debug(
                `Computed EUR/XAU=${1 / response.rates.XAU}`,
            );

            if (!response.success) {
                this.logger.error(
                    `MetalPriceAPI returned success=false: ${JSON.stringify(response)}`
                );
                return {};
            }

            const rates: Partial<Record<MetalType, { eur: number; gbp: number }>> = {};
            for (const [metalType, symbol] of Object.entries(SYMBOL_MAP) as [MetalType, string][]) {
                const eurPerOunce = response.rates[symbol]
                    ? 1 / response.rates[symbol]
                    : 0;


                const gbpRate = response.rates.GBP ?? 0;


                rates[metalType] = {
                    eur: eurPerOunce,
                    gbp: eurPerOunce * gbpRate
                };
            }

            this.logger.log('✅ External API fetch succeeded: ' + JSON.stringify(rates));
            return rates;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(
                    'External API fetch failed',
                    error.stack,
                );
            } else {
                this.logger.error(
                    'External API fetch failed',
                    JSON.stringify(error),
                );
            }

            return {};
        }
    }

    private async fetchHistoricFromExternalApi(
        startDate: string,
        endDate: string,
    ): Promise<HistoricSpotRecord[]> {
        const [
            eurResponse,
            gbpResponse,
        ] = await Promise.all([
            this.metalPriceApi.timeframePrices(startDate, endDate, 'EUR',),
            this.metalPriceApi.timeframePrices(startDate, endDate, 'GBP',),
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

        for (const [date, eurRates] of Object.entries(
            eurResponse.rates
        )) {
            const gbpRates = gbpResponse.rates[date];

            if (!gbpRates) {
                continue;
            }

            for (const [metalType, symbol] of Object.entries(
                SYMBOL_MAP
            ) as [MetalType, string][]) {
                const eurRate = eurRates[symbol];
                const gbpRate = gbpRates[symbol];

                if (eurRate == null || gbpRate == null) {
                    continue;
                }

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

    async fetchAndStoreHistoricClose(
        date: string
    ): Promise<void> {

        this.logger.log(`Fetching OHLC historic close for ${date}`);
        const recordedAt = new Date(`${date}T00:00:00.000Z`);
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);


        const existingCount =
            await this.prisma.historicSpotPrice.count({
                where:{
                    recordedAt:{
                        gte:startOfDay,
                        lte:endOfDay,
                    }
                }
            });


        if(existingCount === ALL_METALS.length){
            this.logger.log(`Historic OHLC already exists for ${recordedAt}`);
            return;
        }

        const records = await Promise.all(
            Object.entries(SYMBOL_MAP).map(
                async ([metalType, symbol]) => {

                    const [
                        eurResponse,
                        gbpResponse,
                    ] = await Promise.all([
                        this.metalPriceApi.ohlcPrices(
                            date,
                            "EUR",
                            symbol
                        ),

                        this.metalPriceApi.ohlcPrices(
                            date,
                            "GBP",
                            symbol
                        ),
                    ]);

                    if(!eurResponse.success || !gbpResponse.success){
                        return null;
                    }

                    this.logger.debug(`EUR=${eurResponse.rate.close}, GBP=${gbpResponse.rate.close}`)
                    this.logger.debug(
                        `${metalType} EUR close raw=${eurResponse.rate.close} inverted=${1 / Number(eurResponse.rate.close)}`
                    );
                    return {
                        metalType: metalType as MetalType,
                        priceEur: 1 / Number(eurResponse.rate.close),
                        priceGbp: 1 / Number(gbpResponse.rate.close),
                        recordedAt,
                    };
                }
            )
        );

        const validRecords =
            records.filter(
                (r): r is HistoricSpotRecord => r !== null
            );

        if(validRecords.length === 0){
            this.logger.warn("No OHLC records generated");
            return;
        }

        await this.prisma.historicSpotPrice.createMany({
            data: validRecords,
            skipDuplicates:true,
        });

        this.logger.log(`Inserted ${validRecords.length} historic close prices for ${date}`);
    }

    async seedHistoricPrices(): Promise<void> {
        this.logger.log('Starting historic price seed...');

        const end = new Date();
        const start = new Date(end);

        // 365 days max for free plan
        start.setDate(start.getDate() - 364);

        const startDate = start.toISOString().slice(0, 10);
        const endDate = end.toISOString().slice(0, 10);

        const records =
            await this.fetchHistoricFromExternalApi(
                startDate,
                endDate,
            );


        if (!records.length) {
            this.logger.warn('No historic records returned');
            return;
        }

        await this.prisma.historicSpotPrice.createMany({
            data:
                records.map(record => ({
                    metalType: record.metalType,
                    priceEur: record.priceEur,
                    priceGbp: record.priceGbp,
                    recordedAt: record.recordedAt,
                })),
            skipDuplicates: true,
        });

        this.logger.log(`Inserted ${records.length} historic spot prices`);
    }

    // ── Database ─────────────────────────────────────────────────────────

    private async readFromDb(metal: MetalType): Promise<MetalSpotPrice | null> {
        this.logger.debug(`Reading latest ${metal} price from DB…`);
        return this.prisma.metalSpotPrice.findFirst({
            where: {metalType: metal},
            orderBy: {timestamp: 'desc'},
        });
    }

    private async readPreviousPricesFromDb(
        metals: MetalType[],
    ): Promise<Map<MetalType, Decimal | number>> {
        this.logger.debug(`Reading previous prices for ${metals.join(', ')} from DB…`);
        const rows = await this.prisma.metalSpotPrice.findMany({
            where: {metalType: {in: metals}},
            orderBy: {timestamp: 'desc'},
        });
        return new Map(rows.map((r) => [r.metalType, r.priceEur]));
    }

    private async readHistoricFromDb() {
        const since = new Date();
        since.setDate(since.getDate() - HISTORIC_LOOKBACK_DAYS);

        this.logger.debug(`Reading historic spot prices since ${since.toISOString()} from DB…`);
        return this.prisma.historicSpotPrice.findMany({
            where: {metalType: {in: ALL_METALS}, recordedAt: {gte: since}},
            orderBy: {recordedAt: 'asc'},
        });
    }

    private async storeInDb(records: RawMetalRecord[]): Promise<void> {
        this.logger.debug(`Storing ${records.length} metal record(s) in DB…`);
        await this.prisma.metalSpotPrice.createMany({data: records});
        this.logger.log(`💾 Saved ${records.length} metal record(s) to DB`);
    }

    // ── CACHE ─────────────────────────────────────────────────────
    private async readFromCache(metal: MetalType): Promise<RawSpotPrice | null> {
        this.logger.log(`Reading latest ${metal} price from Redis cache…`);
        return this.redis.get<SpotPrice>(this.cacheKey(metal));
    }

    private async saveToCache(dto: RawSpotPrice): Promise<void> {
        this.logger.log(`Saving ${dto.metalType} price to Redis cache…`);
        await this.redis.set(this.cacheKey(dto.metalType), dto, CACHE_TTL_SECONDS);
        this.logger.log('✅ Metal price saved to Redis cache');
    }

    // ── Mapping ──────────────────────────────────────────────────────────

    private toDto(
        record: MetalSpotPrice | RawMetalRecord
    ): RawSpotPrice {

        return {
            id: (record as MetalSpotPrice).id?.toString() ?? '',
            metalType: record.metalType,
            priceEur: toNumber(record.priceEur),
            priceGbp: toNumber(record.priceGbp),
            source: record.source,
            createdAt: (record as MetalSpotPrice).createdAt
                ? (record as MetalSpotPrice).createdAt.toISOString()
                : new Date().toISOString(),
            timestamp: record.timestamp ? record.timestamp.toISOString() : new Date().toISOString(),
        };
    }

    private cacheKey(metal: MetalType): string {
        return `metal:${metal}`;
    }
}*/
