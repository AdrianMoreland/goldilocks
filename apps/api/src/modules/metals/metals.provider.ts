
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawSpotPrice, HistoricSpot, MetalType } from '@goldilocks/shared-types';
import { MetalPriceApiClient } from '../../infrastructure/metal-price-api/metal-price-api.client';
import { SpotPriceCacheStore } from './spot-price-cache.store';
import {
    ALL_METALS,
    EMPTY_METAL_RATES, HISTORIC_LOOKBACK_DAYS, HistoricSpotRecord,
    SYMBOL_MAP,
    toNumber,
    toRawMetalSpotPrice
} from "../../common/utils/pricing.util";


/**
 * MetalsProvider — "give me metal data from the best available source."
 *
 * The single-metal cache→DB read waterfall now lives in SpotPriceCacheStore
 * (a CacheAsideStore subclass). This class owns everything that store
 * doesn't: external API calls, historic spot data, and the write path
 * (fetchAndStore / fetchAndStoreHistoricClose / seedHistoricPrices), all of
 * which still write through to the store's cache after persisting to DB —
 * exactly as before.
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

    // ── Orchestration — Reads ───────────────────────────────────────────

    async getLatest(metal: MetalType): Promise<RawSpotPrice | null> {
        return this.spotCache.get(metal);
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

    // ── Orchestration — Writes (cron only) ──────────────────────────────

    /**
     * Scheduled refresh (called by MetalsCron).
     * 1. Fetch fresh prices from the external API
     * 2. Persist new rows (keeps full history)
     * 3. Write through to the cache store so the next getLatest() is instant
     */
    async fetchAndStore(): Promise<void> {
        try {
            this.logger.log('🔄 Starting scheduled metal price refresh…');

            const liveRates = await this.fetchFromExternalApi();
            if (!Object.keys(liveRates).length) {
                this.logger.warn('No prices returned from external API — aborting refresh');
                return;
            }

            const timestamp = new Date();
            const records = Object.entries(liveRates).map(([metalType, prices]) => ({
                metalType: metalType as MetalType,
                priceEur: prices.eur,
                priceGbp: prices.gbp,
                source: 'metalpriceapi',
                timestamp,
            }));

            await this.storeInDb(records);

            const dtos: RawSpotPrice[] = records.map((record) => ({
                id: '',
                metalType: record.metalType,
                priceEur: record.priceEur,
                priceGbp: record.priceGbp,
                source: record.source,
                createdAt: new Date().toISOString(),
                timestamp: record.timestamp.toISOString(),
            }));


            await Promise.all(
                dtos.map((dto) =>
                    this.spotCache.set(dto.metalType, dto)
                )
            );

            this.logger.log('✅ Metal prices refreshed and cached');
        } catch (err) {
            this.logger.error('fetchAndStore failed', err instanceof Error ? err.stack : String(err));
        }
    }

    // ── External API ─────────────────────────────────────────────────────

    private async fetchFromExternalApi(): Promise<
        Record<MetalType, { eur: number; gbp: number }>
    > {
        try {
            const response = await this.metalPriceApi.livePrices();

            this.logger.debug(`Base=${response.base}, Timestamp=${response.timestamp}`);
            this.logger.debug(`XAU=${response.rates.XAU}`);
            this.logger.debug(`Computed EUR/XAU=${1 / response.rates.XAU}`);

            if (!response.success) {
                this.logger.error(`MetalPriceAPI returned success=false: ${JSON.stringify(response)}`);
                return EMPTY_METAL_RATES;
            }

            const rates: Record<MetalType, { eur: number; gbp: number }> = {
                GOLD: { eur: 0, gbp: 0 },
                SILVER: { eur: 0, gbp: 0 },
                PLATINUM: { eur: 0, gbp: 0 },
                PALLADIUM: { eur: 0, gbp: 0 },
            };

            for (const [metalType, symbol] of Object.entries(SYMBOL_MAP) as [MetalType, string][]) {
                const eurPerOunce = response.rates[symbol] ? 1 / response.rates[symbol] : 0;
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
            return EMPTY_METAL_RATES;
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
