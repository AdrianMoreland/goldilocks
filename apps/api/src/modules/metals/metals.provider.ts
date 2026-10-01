import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
    RawSpotPrice,
    FetchSource,
    FetchTrigger,
    MetalType,
} from '@goldilocks/shared-types';
import {
    METAL_PRICE_API,
    type MetalPriceApiPort,
} from '../../infrastructure/metal-price-api/metal-price-api.port';
import { SpotPriceCacheStore } from './spot-price-cache.store';
import { CascadeMetricsService } from './cascade-metrics.service';
import { FetchAttemptService } from './fetch-attempt.service';
import { ALL_METALS } from '../../common/utils/pricing.util';
import {
    isUsableRate,
    mapLiveRates,
    vendorAsOf,
    type MetalRates,
} from './vendor-rates';

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
function withFetchSource(
    price: RawSpotPrice,
    fetchSource: FetchSource,
    isFallback = false,
): RawSpotPrice {
    return { ...price, fetchSource, isFallback };
}

export interface MetalsRefreshResult {
    prices: RawSpotPrice[];
    /** Metals that had no usable price anywhere (live API, cache, or DB) — still 0.00, but callers can surface why. */
    degradedMetals: MetalType[];
}

/**
 * MetalsProvider — "give me the latest metal price from the best available
 * source." Historic (chart) data lives in HistoricSpotService.
 *
 * Write ownership: this class is the only writer of `metalSpotPrice` (via
 * storeInDb); SpotPriceCacheStore and FetchAttemptService only read it /
 * write their own `fetchAttempt` table. Keep it that way — a second writer
 * would have to duplicate the "never persist a zero" rule.
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
        @Inject(METAL_PRICE_API)
        private readonly metalPriceApi: MetalPriceApiPort,
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
        const results = await Promise.all(
            ALL_METALS.map((m) => this.getLatest(m)),
        );
        return results.filter((r): r is RawSpotPrice => r !== null);
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

        this.logger.warn(
            `Cache/DB insufficient for ${needsLiveFetch.join(', ')} — trying the live API as a last resort`,
        );
        const { rates: liveRates, asOf } =
            await this.fetchFromExternalApi('LAUNCH_FALLBACK');

        const resolved = needsLiveFetch.filter((metal) =>
            isUsableRate(liveRates[metal]),
        );
        prices.push(...(await this.persistLive(liveRates, resolved, asOf)));

        const degradedMetals = needsLiveFetch.filter(
            (metal) => !resolved.includes(metal),
        );
        for (const metal of degradedMetals) {
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
    async refreshAll(
        triggeredBy: FetchTrigger = 'REFRESH',
    ): Promise<MetalsRefreshResult> {
        const { rates: liveRates, asOf } =
            await this.fetchFromExternalApi(triggeredBy);

        const liveMetals = ALL_METALS.filter((metal) =>
            isUsableRate(liveRates[metal]),
        );
        const prices = await this.persistLive(liveRates, liveMetals, asOf);

        if (liveMetals.length > 0) {
            this.logger.log(
                `✅ Refreshed ${liveMetals.join(', ')} from the live API`,
            );
        }

        const failedMetals = ALL_METALS.filter((m) => !liveMetals.includes(m));
        const degradedMetals: MetalType[] = [];

        for (const metal of failedMetals) {
            this.logger.warn(
                `${metal}: live API didn't return a usable rate — falling back to the last stored price`,
            );
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
        const { rates: liveRates, asOf } =
            await this.fetchFromExternalApi('RETRY');

        if (!isUsableRate(liveRates[metal])) {
            return null;
        }

        const [price] = await this.persistLive(liveRates, [metal], asOf);
        return price;
    }

    // ── Live-price persistence ───────────────────────────────────────────

    /**
     * The single path by which a live vendor price becomes stored state:
     * insert the rows, then warm the cache. `metals` must already have been
     * filtered with isUsableRate — that is what keeps a zero out of the DB.
     */
    private async persistLive(
        rates: MetalRates,
        metals: MetalType[],
        asOf: Date,
    ): Promise<RawSpotPrice[]> {
        if (metals.length === 0) return [];

        const records = metals.map((metal) => ({
            metalType: metal,
            priceEur: rates[metal]!.eur,
            priceGbp: rates[metal]!.gbp,
            source: 'metalpriceapi',
            timestamp: asOf,
        }));

        await this.storeInDb(records);

        const dtos = records.map((record) => this.toDto(record, 'live'));
        await Promise.all(
            dtos.map((dto) => this.spotCache.set(dto.metalType, dto)),
        );
        return dtos;
    }

    private toDto(
        record: {
            metalType: MetalType;
            priceEur: number;
            priceGbp: number;
            source: string;
            timestamp: Date;
        },
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
        rates: MetalRates;
        /** When the vendor says these rates were struck (their `timestamp`), not when we asked — a cache/DB hit later shows this same time, which is what staff need to judge how old the price really is. Falls back to "now" if the vendor omits it. */
        asOf: Date;
    }> {
        const startedAt = Date.now();

        try {
            const response = await this.metalPriceApi.livePrices();

            // A quota-exceeded/error response has no `rates` object at all,
            // so check success before touching it — otherwise the real,
            // more useful "success=false" message is masked by a TypeError
            // caught below as a generic "fetch failed".
            if (!response.success) {
                this.logger.error(
                    `MetalPriceAPI returned success=false: ${JSON.stringify(response)}`,
                );
                await this.fetchAttempts.record({
                    durationMs: Date.now() - startedAt,
                    success: false,
                    errorMessage: JSON.stringify(response),
                    metalsResolved: [],
                    triggeredBy,
                });
                return { rates: {}, asOf: new Date() };
            }

            const asOf = vendorAsOf(response.timestamp);
            this.logger.debug(
                `Base=${response.base}, Timestamp=${response.timestamp}`,
            );

            const rates = mapLiveRates(response.rates, (metal, symbol) =>
                this.logger.warn(
                    `No rate returned for ${metal} (${symbol}) — keeping last known price`,
                ),
            );

            this.logger.log(
                '✅ External API fetch succeeded: ' + JSON.stringify(rates),
            );
            await this.fetchAttempts.record({
                durationMs: Date.now() - startedAt,
                success: true,
                errorMessage: null,
                metalsResolved: Object.keys(rates) as MetalType[],
                triggeredBy,
            });
            return { rates, asOf };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : JSON.stringify(error);
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

    // ── Database ─────────────────────────────────────────────────────────

    private async storeInDb(
        records: {
            metalType: MetalType;
            priceEur: number;
            priceGbp: number;
            source: string;
            timestamp: Date;
        }[],
    ): Promise<void> {
        this.logger.debug(`Storing ${records.length} metal record(s) in DB…`);

        await this.prisma.metalSpotPrice.createMany({
            data: records,
        });

        this.logger.log(`💾 Saved ${records.length} metal record(s) to DB`);
    }
}
