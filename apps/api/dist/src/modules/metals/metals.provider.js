"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MetalsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalsProvider = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const metal_price_api_client_1 = require("../../infrastructure/metal-price-api/metal-price-api.client");
const spot_price_cache_store_1 = require("./spot-price-cache.store");
const pricing_util_1 = require("../../common/utils/pricing.util");
const DB_STALE_MS = 30 * 60 * 1000;
function isFresh(timestampIso, maxAgeMs) {
    return Date.now() - new Date(timestampIso).getTime() < maxAgeMs;
}
function isUsablePrice(price) {
    return price !== null && price.priceEur > 0;
}
let MetalsProvider = MetalsProvider_1 = class MetalsProvider {
    prisma;
    metalPriceApi;
    spotCache;
    logger = new common_1.Logger(MetalsProvider_1.name);
    constructor(prisma, metalPriceApi, spotCache) {
        this.prisma = prisma;
        this.metalPriceApi = metalPriceApi;
        this.spotCache = spotCache;
    }
    async getLatest(metal) {
        return this.spotCache.get(metal);
    }
    async clearCache() {
        await this.spotCache.clearAll(pricing_util_1.ALL_METALS);
    }
    async getAllLatest() {
        const results = await Promise.all(pricing_util_1.ALL_METALS.map((m) => this.getLatest(m)));
        return results.filter((r) => r !== null);
    }
    async getHistoricSpots() {
        const rows = await this.readHistoricFromDb();
        if (rows.length === 0) {
            this.logger.warn('No historic spot data found — has the cron run yet?');
        }
        return rows.map((row) => ({
            metalType: row.metalType,
            priceEur: (0, pricing_util_1.toNumber)(row.priceEur),
            priceGbp: (0, pricing_util_1.toNumber)(row.priceGbp),
            timestamp: row.recordedAt.toISOString(),
        }));
    }
    async getAllLatestForLaunch() {
        const prices = [];
        const needsLiveFetch = [];
        for (const metal of pricing_util_1.ALL_METALS) {
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
        const degradedMetals = [];
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
            const lastResort = await this.spotCache.getFromDbOnly(metal);
            if (lastResort)
                prices.push(lastResort);
        }
        return { prices, degradedMetals };
    }
    async refreshAll() {
        const liveRates = await this.fetchFromExternalApi();
        const timestamp = new Date();
        const prices = [];
        const liveMetals = Object.keys(liveRates).filter((m) => (liveRates[m]?.eur ?? 0) > 0);
        if (liveMetals.length > 0) {
            const records = liveMetals.map((metal) => ({
                metalType: metal,
                priceEur: liveRates[metal].eur,
                priceGbp: liveRates[metal].gbp,
                source: 'metalpriceapi',
                timestamp,
            }));
            await this.storeInDb(records);
            const dtos = records.map((record) => this.toDto(record));
            await Promise.all(dtos.map((dto) => this.spotCache.set(dto.metalType, dto)));
            prices.push(...dtos);
            this.logger.log(`✅ Refreshed ${liveMetals.join(', ')} from the live API`);
        }
        const failedMetals = pricing_util_1.ALL_METALS.filter((m) => !liveMetals.includes(m));
        const degradedMetals = [];
        for (const metal of failedMetals) {
            this.logger.warn(`${metal}: live API didn't return a usable rate — falling back to the last stored price`);
            const dbRow = await this.spotCache.getFromDbOnly(metal);
            if (isUsablePrice(dbRow)) {
                await this.spotCache.set(metal, dbRow);
                prices.push(dbRow);
            }
            else {
                degradedMetals.push(metal);
                if (dbRow)
                    prices.push(dbRow);
            }
        }
        return { prices, degradedMetals };
    }
    toDto(record) {
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
    async fetchFromExternalApi() {
        try {
            const response = await this.metalPriceApi.livePrices();
            if (!response.success) {
                this.logger.error(`MetalPriceAPI returned success=false: ${JSON.stringify(response)}`);
                return {};
            }
            this.logger.debug(`Base=${response.base}, Timestamp=${response.timestamp}`);
            this.logger.debug(`XAU=${response.rates.XAU}`);
            this.logger.debug(`Computed EUR/XAU=${1 / response.rates.XAU}`);
            const rates = {};
            for (const [metalType, symbol] of Object.entries(pricing_util_1.SYMBOL_MAP)) {
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
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('External API fetch failed', error.stack);
            }
            else {
                this.logger.error('External API fetch failed', JSON.stringify(error));
            }
            return {};
        }
    }
    async fetchHistoricFromExternalApi(startDate, endDate) {
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
        const records = [];
        for (const [date, eurRates] of Object.entries(eurResponse.rates)) {
            const gbpRates = gbpResponse.rates[date];
            if (!gbpRates)
                continue;
            for (const [metalType, symbol] of Object.entries(pricing_util_1.SYMBOL_MAP)) {
                const eurRate = eurRates[symbol];
                const gbpRate = gbpRates[symbol];
                if (eurRate == null || gbpRate == null)
                    continue;
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
    async fetchAndStoreHistoricClose(date) {
        this.logger.log(`Fetching OHLC historic close for ${date}`);
        const recordedAt = new Date(`${date}T00:00:00.000Z`);
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const existingCount = await this.prisma.historicSpotPrice.count({
            where: { recordedAt: { gte: startOfDay, lte: endOfDay } },
        });
        if (existingCount === pricing_util_1.ALL_METALS.length) {
            this.logger.log(`Historic OHLC already exists for ${recordedAt}`);
            return;
        }
        const records = await Promise.all(Object.entries(pricing_util_1.SYMBOL_MAP).map(async ([metalType, symbol]) => {
            const [eurResponse, gbpResponse] = await Promise.all([
                this.metalPriceApi.ohlcPrices(date, 'EUR', symbol),
                this.metalPriceApi.ohlcPrices(date, 'GBP', symbol),
            ]);
            if (!eurResponse.success || !gbpResponse.success) {
                return null;
            }
            this.logger.debug(`EUR=${eurResponse.rate.close}, GBP=${gbpResponse.rate.close}`);
            this.logger.debug(`${metalType} EUR close raw=${eurResponse.rate.close} inverted=${1 / Number(eurResponse.rate.close)}`);
            return {
                metalType: metalType,
                priceEur: 1 / Number(eurResponse.rate.close),
                priceGbp: 1 / Number(gbpResponse.rate.close),
                recordedAt,
            };
        }));
        const validRecords = records.filter((r) => r !== null);
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
    async seedHistoricPrices() {
        this.logger.log('Starting historic price seed...');
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 364);
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
    async getLatestHistoricDate() {
        const latest = await this.prisma.historicSpotPrice.findFirst({
            orderBy: { recordedAt: 'desc' },
            select: { recordedAt: true },
        });
        return latest?.recordedAt ?? null;
    }
    async readHistoricFromDb() {
        const since = new Date();
        since.setDate(since.getDate() - pricing_util_1.HISTORIC_LOOKBACK_DAYS);
        this.logger.debug(`Reading historic spot prices since ${since.toISOString()} from DB…`);
        return this.prisma.historicSpotPrice.findMany({
            where: { metalType: { in: pricing_util_1.ALL_METALS }, recordedAt: { gte: since } },
            orderBy: { recordedAt: 'asc' },
            select: { metalType: true, priceEur: true, priceGbp: true, recordedAt: true },
        });
    }
    async storeInDb(records) {
        this.logger.debug(`Storing ${records.length} metal record(s) in DB…`);
        await this.prisma.metalSpotPrice.createMany({
            data: records,
        });
        this.logger.log(`💾 Saved ${records.length} metal record(s) to DB`);
    }
};
exports.MetalsProvider = MetalsProvider;
exports.MetalsProvider = MetalsProvider = MetalsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        metal_price_api_client_1.MetalPriceApiClient,
        spot_price_cache_store_1.SpotPriceCacheStore])
], MetalsProvider);
//# sourceMappingURL=metals.provider.js.map