import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../../infrastructure/prisma/prisma.service';
import {RedisService} from '../../redis/redis.service';
import {SpotPrice, HistoricSpot, MetalType} from '@goldilocks/shared-types';
import {MetalPriceApiClient} from '../../infrastructure/metal-price-api/metal-price-api.client';
import {Decimal} from "../../../prisma/generated/internal/prismaNamespace";
import {MetalSpotPrice} from "../../../prisma/generated/client";

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

const CACHE_TTL_SECONDS = 3600;
const HISTORIC_LOOKBACK_DAYS = 365;

function toNumber(value: Decimal | number | undefined | null): number {
    if (value === undefined || value === null) return 0;
    if (value instanceof Decimal) return value.toNumber();
    return value;
}

/**
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
 */
@Injectable()
export class MetalsProvider {
    private readonly logger = new Logger(MetalsProvider.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly metalPriceApi: MetalPriceApiClient,
    ) {
    }

    // ── Reads ────────────────────────────────────────────────────────────

    // ── Orchestration — Reads ───────────────────────────────────────────

    async getLatest(metal: MetalType): Promise<SpotPrice | null> {
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

    async getAllLatest(): Promise<SpotPrice[]> {
        const results = await Promise.all(ALL_METALS.map((m) => this.getLatest(m)));
        return results.filter((r): r is SpotPrice => r !== null);
    }

    /**
     * Historic spot prices for charting (last ~year).
     *
     * NOTE: HistoricSpotSchema expects { metalType, priceEur, priceGbp, timestamp }.
     * Confirm the historicSpotPrice table has matching priceEUR/priceGBP columns
     * before relying on this in production — if the migration isn't in yet,
     * this will throw rather than silently default.
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


    // ── Orchestration — Writes (cron only) ──────────────────────────────

    /**
     * Scheduled refresh (called by MetalsCron).
     * 1. Fetch fresh prices from the external API
     * 2. Diff against the latest DB row per metal for previousPrice
     * 3. Persist new rows (keeps full history)
     * 4. Overwrite Redis so the next getLatest() is instant
     */
    async fetchAndStore(): Promise<void> {
        try {
            this.logger.log('🔄 Starting scheduled metal price refresh…');

            const liveRates = await this.fetchFromExternalApi();
            if (!Object.keys(liveRates).length) {
                this.logger.warn('No prices returned from external API — aborting refresh');
                return;
            }

            const previousMap = await this.readPreviousPricesFromDb(
                Object.keys(liveRates) as MetalType[],
            );

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
    private async readFromCache(metal: MetalType): Promise<SpotPrice | null> {
        this.logger.log(`Reading latest ${metal} price from Redis cache…`);
        return this.redis.get<SpotPrice>(this.cacheKey(metal));
    }

    private async saveToCache(dto: SpotPrice): Promise<void> {
        this.logger.log(`Saving ${dto.metalType} price to Redis cache…`);
        await this.redis.set(this.cacheKey(dto.metalType), dto, CACHE_TTL_SECONDS);
        this.logger.log('✅ Metal price saved to Redis cache');
    }

    // ── Mapping ──────────────────────────────────────────────────────────

    private toDto(record: MetalSpotPrice | RawMetalRecord): SpotPrice {

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
}