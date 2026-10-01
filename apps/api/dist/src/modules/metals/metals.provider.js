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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MetalsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalsProvider = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const metal_price_api_port_1 = require("../../infrastructure/metal-price-api/metal-price-api.port");
const spot_price_cache_store_1 = require("./spot-price-cache.store");
const cascade_metrics_service_1 = require("./cascade-metrics.service");
const fetch_attempt_service_1 = require("./fetch-attempt.service");
const pricing_util_1 = require("../../common/utils/pricing.util");
const vendor_rates_1 = require("./vendor-rates");
const DB_STALE_MS = 30 * 60 * 1000;
function isFresh(timestampIso, maxAgeMs) {
    return Date.now() - new Date(timestampIso).getTime() < maxAgeMs;
}
function isUsablePrice(price) {
    return price !== null && price.priceEur > 0;
}
function withFetchSource(price, fetchSource, isFallback = false) {
    return { ...price, fetchSource, isFallback };
}
let MetalsProvider = MetalsProvider_1 = class MetalsProvider {
    prisma;
    metalPriceApi;
    spotCache;
    cascadeMetrics;
    fetchAttempts;
    logger = new common_1.Logger(MetalsProvider_1.name);
    constructor(prisma, metalPriceApi, spotCache, cascadeMetrics, fetchAttempts) {
        this.prisma = prisma;
        this.metalPriceApi = metalPriceApi;
        this.spotCache = spotCache;
        this.cascadeMetrics = cascadeMetrics;
        this.fetchAttempts = fetchAttempts;
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
    async getAllLatestForLaunch() {
        const prices = [];
        const needsLiveFetch = [];
        for (const metal of pricing_util_1.ALL_METALS) {
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
        const { rates: liveRates, asOf } = await this.fetchFromExternalApi('LAUNCH_FALLBACK');
        const resolved = needsLiveFetch.filter((metal) => (0, vendor_rates_1.isUsableRate)(liveRates[metal]));
        prices.push(...(await this.persistLive(liveRates, resolved, asOf)));
        const degradedMetals = needsLiveFetch.filter((metal) => !resolved.includes(metal));
        for (const metal of degradedMetals) {
            const lastResort = await this.spotCache.getFromDbOnly(metal);
            if (lastResort)
                prices.push(withFetchSource(lastResort, 'db'));
        }
        return { prices, degradedMetals };
    }
    async refreshAll(triggeredBy = 'REFRESH') {
        const { rates: liveRates, asOf } = await this.fetchFromExternalApi(triggeredBy);
        const liveMetals = pricing_util_1.ALL_METALS.filter((metal) => (0, vendor_rates_1.isUsableRate)(liveRates[metal]));
        const prices = await this.persistLive(liveRates, liveMetals, asOf);
        if (liveMetals.length > 0) {
            this.logger.log(`✅ Refreshed ${liveMetals.join(', ')} from the live API`);
        }
        const failedMetals = pricing_util_1.ALL_METALS.filter((m) => !liveMetals.includes(m));
        const degradedMetals = [];
        for (const metal of failedMetals) {
            this.logger.warn(`${metal}: live API didn't return a usable rate — falling back to the last stored price`);
            const dbRow = await this.spotCache.getFromDbOnly(metal);
            if (isUsablePrice(dbRow)) {
                await this.spotCache.set(metal, dbRow);
                prices.push(withFetchSource(dbRow, 'db', true));
            }
            else {
                degradedMetals.push(metal);
                if (dbRow)
                    prices.push(withFetchSource(dbRow, 'db', true));
            }
        }
        return { prices, degradedMetals };
    }
    async retryMetal(metal) {
        const { rates: liveRates, asOf } = await this.fetchFromExternalApi('RETRY');
        if (!(0, vendor_rates_1.isUsableRate)(liveRates[metal])) {
            return null;
        }
        const [price] = await this.persistLive(liveRates, [metal], asOf);
        return price;
    }
    async persistLive(rates, metals, asOf) {
        if (metals.length === 0)
            return [];
        const records = metals.map((metal) => ({
            metalType: metal,
            priceEur: rates[metal].eur,
            priceGbp: rates[metal].gbp,
            source: 'metalpriceapi',
            timestamp: asOf,
        }));
        await this.storeInDb(records);
        const dtos = records.map((record) => this.toDto(record, 'live'));
        await Promise.all(dtos.map((dto) => this.spotCache.set(dto.metalType, dto)));
        return dtos;
    }
    toDto(record, fetchSource) {
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
    async fetchFromExternalApi(triggeredBy) {
        const startedAt = Date.now();
        try {
            const response = await this.metalPriceApi.livePrices();
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
            const asOf = (0, vendor_rates_1.vendorAsOf)(response.timestamp);
            this.logger.debug(`Base=${response.base}, Timestamp=${response.timestamp}`);
            const rates = (0, vendor_rates_1.mapLiveRates)(response.rates, (metal, symbol) => this.logger.warn(`No rate returned for ${metal} (${symbol}) — keeping last known price`));
            this.logger.log('✅ External API fetch succeeded: ' + JSON.stringify(rates));
            await this.fetchAttempts.record({
                durationMs: Date.now() - startedAt,
                success: true,
                errorMessage: null,
                metalsResolved: Object.keys(rates),
                triggeredBy,
            });
            return { rates, asOf };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            if (error instanceof Error) {
                this.logger.error('External API fetch failed', error.stack);
            }
            else {
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
    __param(1, (0, common_1.Inject)(metal_price_api_port_1.METAL_PRICE_API)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, spot_price_cache_store_1.SpotPriceCacheStore,
        cascade_metrics_service_1.CascadeMetricsService,
        fetch_attempt_service_1.FetchAttemptService])
], MetalsProvider);
//# sourceMappingURL=metals.provider.js.map