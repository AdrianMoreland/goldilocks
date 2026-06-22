/*
import {Injectable, Logger} from '@nestjs/common'
import {PrismaService} from "../../infrastructure/prisma/prisma.service";
import {RedisService} from '../../redis/redis.service'
import {MetalType} from '../../../prisma/generated/enums'
import {MetalSpotPrice} from '../../../prisma/generated/client'
import {SpotPrice, HistoricSpot} from "@goldilocks/shared-types";
import {Decimal} from "../../../prisma/generated/internal/prismaNamespace";
import {MetalPriceApiClient} from "../../infrastructure/metal-price-api/metal-price-api.client";
import {MetalsProvider} from "./metals.provider";
import {toNumber} from "../../common/utils/pricing.util";

// ─────────────────────────────────────────────────────────────────────────────
// Internal shape used when building records for persistence
// ─────────────────────────────────────────────────────────────────────────────
interface RawMetalRecord {
    metalType: MetalType
    priceUsd: number | Decimal
    priceEur: number | Decimal
    previousPrice: number | Decimal
    source: string
    timestamp: Date
}

const ALL_METALS: MetalType[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']

const SYMBOL_MAP: Record<MetalType, string> = {
    GOLD: 'XAU',
    SILVER: 'XAG',
    PLATINUM: 'XPT',
    PALLADIUM: 'XPD',
}

interface HistoricalMetalPrice {
    date: string;
    metalType: MetalType;
    price: number;
}


// ─────────────────────────────────────────────────────────────────────────────
// Helper: safely convert Decimal / number / undefined → number
// ─────────────────────────────────────────────────────────────────────────────


@Injectable()
export class MetalsService {
    private readonly logger = new Logger(MetalsService.name);
    private api: MetalPriceApiClient;
    private readonly CACHE_TTL = 3600

    constructor(
        private readonly repo: MetalsProvider,
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {
        this.api = new MetalPriceApiClient();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 1. LAYER — EXTERNAL API
    //    Only called by fetchAndStore (cron) or when both cache and DB miss.
    //    Never called directly from a read request.
    // ═══════════════════════════════════════════════════════════════════════

    /!**
     * Hit MetalpriceAPI and return raw prices: { GOLD: 3120.5, SILVER: 31.2, … }
     * Returns an empty object on any error so callers can degrade gracefully.
     *!/
    async fetchFromExternalApi(): Promise<Partial<Record<MetalType, number>>> {
        try {
            const response = await this.api.livePrices('EUR')
            this.logger.debug('MetalpriceAPI raw response', response)

            if (!response.success) {
                this.logger.warn('MetalpriceAPI returned success=false')
                return {}
            }

            const rates: Partial<Record<MetalType, number>> = {}
            for (const [metalType, symbol] of Object.entries(SYMBOL_MAP) as [MetalType, string][]) {
                rates[metalType] =
                    response.rates[`EUR${symbol}`] ??
                    response.rates[symbol] ??
                    0
            }

            this.logger.log('✅ External API fetch succeeded: ' + JSON.stringify(rates))
            return rates
        } catch (error) {
            this.logger.error('External API fetch failed', error)
            return {}
        }
    }


    async fetchHistoricalPricesLastYear(): Promise<HistoricalMetalPrice[]> {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);

            const response = await this.api.timeframePrices(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                'EUR',
            );

            if (!response.success) {
                return [];
            }

            const prices: HistoricalMetalPrice[] = [];

            for (const [date, dayRates] of Object.entries(response.rates)) {
                for (const [metalType, symbol] of Object.entries(
                    SYMBOL_MAP,
                ) as [MetalType, string][]) {
                    prices.push({
                        date,
                        metalType,
                        price:
                            (dayRates as any)[`EUR${symbol}`] ??
                            (dayRates as any)[symbol] ??
                            0,
                    });
                }
            }

            return prices;
        } catch (error) {
            this.logger.error(
                'Historical timeframe fetch failed',
                error,
            );
            return [];
        }
    }

    //

    // ═══════════════════════════════════════════════════════════════════════
    // 2. LAYER — DATABASE (Prisma / Supabase)
    //    Source of truth. Queried only when the Redis cache misses.
    //    Also written to whenever fresh data arrives from the external API.
    // ═══════════════════════════════════════════════════════════════════════

    /!**
     * Read the most recent row for a single metal from the database.
     * Returns null if no record exists yet.
     *!/
    async readFromDb(metal: MetalType): Promise<MetalSpotPrice | null> {
        this.logger.debug('Reading from DB…')
        return this.prisma.metalSpotPrice.findFirst({
            where: {metalType: metal},
            orderBy: {timestamp: 'desc'},
        })
    }

    /!**
     * Persist a batch of raw price records to the database.
     * Designed to receive the output of buildRecords().
     *!/
    async saveToDb(records: RawMetalRecord[]): Promise<void> {
        this.logger.log(`💾 Saved ${records.length} metal record(s) to DB`)
        await this.prisma.metalSpotPrice.createMany({data: records})
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. LAYER — REDIS CACHE
    //    First stop for every read. Populated after every DB read or API fetch.
    //    Expires after CACHE_TTL so stale prices don't linger too long.
    // ═══════════════════════════════════════════════════════════════════════

    /!**
     * Read a single metal's DTO from the Redis cache.
     * Returns null on cache miss (key absent or expired).
     *!/
    async readFromCache(metal: MetalType): Promise<SpotPrice | null> {
        this.logger.debug('Reading from cache…')
        return this.redis.get<SpotPrice>(`metal:${metal}`)
    }

    /!**
     * Write a DTO into Redis under the standard key for that metal.
     *!/
    async saveToCache(dto: SpotPrice): Promise<void> {
        await this.redis.set(`metal:${dto.metalType}`, dto, this.CACHE_TTL)
        this.logger.debug(`🗄️  Cached ${dto.metalType} → ${dto.priceEur} (TTL ${this.CACHE_TTL}s)`)
    }

    /!**
     * Write multiple DTOs to Redis in parallel.
     *!/
    async saveManyToCache(dtos: SpotPrice[]): Promise<void> {
        await Promise.all(dtos.map((dto) => this.saveToCache(dto)))
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4. MAPPING — toDto
    //    Pure transformation: Prisma row or raw record → SpotPrice.
    //    No I/O, no side effects, easy to unit-test.
    // ═══════════════════════════════════════════════════════════════════════

    toDto(record: MetalSpotPrice | RawMetalRecord): SpotPrice {
        const priceEur = toNumber(record.priceEur)
        const priceGbp = toNumber(record.priceGbp) // extend later if you add a GBP conversion

        return {
            id: (record as MetalSpotPrice).id?.toString() ?? '',
            metalType: record.metalType,
            currency: 'EUR',
            priceEur,
            createdAt: (record as MetalSpotPrice).createdAt
                ? (record as MetalSpotPrice).createdAt.toISOString()
                : new Date().toISOString(),

            updatedAt: record.timestamp
                ? record.timestamp.toISOString()
                : new Date().toISOString(),
            __v: 0,
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 5. ORCHESTRATION — Public API consumed by controllers and cron jobs
    // ═══════════════════════════════════════════════════════════════════════

    /!**
     * Get the latest snapshot for ONE metal.
     *
     * Strategy (waterfall):
     *   Cache hit  → return immediately                  (fastest)
     *   Cache miss → query DB → populate cache → return  (medium)
     *   DB empty   → return null (caller can decide to trigger a fetch)
     *
     * The external API is NOT called here — that is the cron job's job.
     * This keeps read latency predictable and avoids hammering the API.
     *!/
    async getLatest(metal: MetalType): Promise<SpotPrice | null> {
        // 1. Cache
        const cached = await this.readFromCache(metal)
        if (cached) {
            this.logger.debug(`⚡ Cache hit for ${metal}, last updated at ${cached.updatedAt}`)
            return cached
        }

        // 2. Database
        this.logger.debug(`🗄️  Cache miss for ${metal}, querying DB…`)
        const row = await this.readFromDb(metal)
        if (!row) {
            this.logger.warn(`⚠️  No DB record found for ${metal}`)
            return null
        }

        const dto = this.toDto(row)
        await this.saveToCache(dto)
        return dto
    }

    /!**
     * Get the latest snapshot for ALL metals.
     * Returns only the metals that actually have data (may be fewer than 4
     * on a fresh install before the first cron run).
     *!/
    async getAllLatest(): Promise<SpotPrice[]> {
        this.logger.debug('getAllLastest called')
        const results = await Promise.all(ALL_METALS.map((m) => this.getLatest(m)))
        return results.filter((r): r is SpotPrice => r !== null)
    }

    /!**
     * Convenience shape used by the dashboard endpoint:
     * { GOLD: dto, SILVER: dto, … }
     *!/
    async getSpotMap(): Promise<Partial<Record<MetalType, SpotPrice>>> {
        const all = await this.getAllLatest()
        return Object.fromEntries(all.map((dto) => [dto.metalType, dto]))
    }

    /!**
     * Scheduled refresh (called by MetalsCron every 10 min).
     *
     * Strategy:
     *   1. Fetch fresh prices from the external API
     *   2. Read the most-recent DB rows to calculate previousPrice deltas
     *   3. Save new rows to the DB (maintains full price history)
     *   4. Overwrite the Redis cache so the next getLatest() is instant
     *!/
    async fetchAndStore(): Promise<void> {
        try {
            this.logger.log('🔄 Starting scheduled metal price refresh…')

            // 1. External API
            const liveRates = await this.fetchFromExternalApi()
            if (!Object.keys(liveRates).length) {
                this.logger.warn('No prices returned from external API — aborting refresh')
                return
            }

            // 2. Read previous prices from DB for delta calculation
            const previousRows = await this.prisma.metalSpotPrice.findMany({
                where: {metalType: {in: Object.keys(liveRates) as MetalType[]}},
                orderBy: {timestamp: 'desc'},
                // We only need the latest row per metal; distinct isn't directly
                // supported in findMany so we de-dup in JS below.
            })

            const previousMap = new Map<MetalType, Decimal | number>(
                previousRows.map((r) => [r.metalType, r.p]),
            )

            // 3. Build records
            const timestamp = new Date()
            const records: RawMetalRecord[] = (
                Object.entries(liveRates) as [MetalType, number][]
            ).map(([metalType, priceUsd]) => ({
                metalType,
                priceUsd,
                priceEur: 0, // extend later if you add a EUR conversion
                previousPrice: toNumber(previousMap.get(metalType)) || priceUsd,
                source: 'metalpriceapi',
                timestamp,
            }))

            // 4. Persist to DB
            await this.saveToDb(records)

            // 5. Refresh cache
            const dtos = records.map((r) => this.toDto(r))
            await this.saveManyToCache(dtos)

            this.logger.log('✅ Metal prices refreshed and cached')
        } catch (err) {
            this.logger.error(
                'fetchAndStore failed',
                err instanceof Error ? err.stack : String(err),
            )
        }
    }

}
*/
