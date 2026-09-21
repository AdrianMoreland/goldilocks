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
var MarketDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataService = void 0;
const common_1 = require("@nestjs/common");
const metals_provider_1 = require("../metals/metals.provider");
const products_provider_1 = require("../products/products.provider");
const pricing_util_1 = require("../../common/utils/pricing.util");
let MarketDataService = MarketDataService_1 = class MarketDataService {
    metalsProvider;
    productsProvider;
    logger = new common_1.Logger(MarketDataService_1.name);
    constructor(metalsProvider, productsProvider) {
        this.metalsProvider = metalsProvider;
        this.productsProvider = productsProvider;
    }
    async getMarketData() {
        this.logger.log('Loading market data');
        const { prices, degradedMetals } = await this.metalsProvider.getAllLatestForLaunch();
        return this.composeMarketData(prices, degradedMetals);
    }
    async recalculate(overrides) {
        const [spotPrices, rawProducts] = await Promise.all([
            this.metalsProvider.getAllLatest(),
            this.productsProvider.getAll(),
        ]);
        const liveMap = this.toSpotMap(spotPrices);
        const finalMap = (0, pricing_util_1.mergeMetalPrices)(liveMap, overrides);
        return rawProducts.map((p) => (0, pricing_util_1.calculateProductPrice)(p, finalMap));
    }
    async refresh() {
        const { prices, degradedMetals } = await this.metalsProvider.refreshAll();
        return this.composeMarketData(prices, degradedMetals);
    }
    async composeMarketData(spotPrices, degradedMetals) {
        const [historicSpot, rawProducts] = await Promise.all([
            this.metalsProvider.getHistoricSpots(),
            this.productsProvider.getAll(),
        ]);
        const latestHistoric = new Map();
        for (const h of historicSpot) {
            const current = latestHistoric.get(h.metalType);
            if (!current || new Date(h.timestamp) > new Date(current.timestamp)) {
                latestHistoric.set(h.metalType, h);
            }
        }
        const enrichedSpotPrices = (0, pricing_util_1.enrichSpotPrices)(spotPrices, latestHistoric);
        const spotMap = this.toSpotMap(enrichedSpotPrices);
        const products = rawProducts.map((p) => (0, pricing_util_1.calculateProductPrice)(p, spotMap));
        return {
            spotPrices: enrichedSpotPrices,
            historicSpot,
            products,
            fetchedAt: new Date().toISOString(),
            priceWarning: degradedMetals.length > 0
                ? `Live price unavailable for ${degradedMetals.join(', ')} — showing €0.00 until the price feed recovers.`
                : null,
        };
    }
    toSpotMap(spotPrices) {
        const map = { ...pricing_util_1.ZERO_SPOT_MAP };
        spotPrices.forEach((s) => {
            map[s.metalType] = s.priceEur;
        });
        return map;
    }
    async fetchHistoricClose(date) {
        this.logger.log(`Manual historic close fetch requested for ${date}`);
        await this.metalsProvider.fetchAndStoreHistoricClose(date);
        this.logger.log(`Manual historic close fetch completed for ${date}`);
    }
    async seedHistoricPrices() {
        this.logger.log('Starting historic price seed...');
        await this.metalsProvider.seedHistoricPrices();
        this.logger.log('Historic price seed completed.');
    }
};
exports.MarketDataService = MarketDataService;
exports.MarketDataService = MarketDataService = MarketDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metals_provider_1.MetalsProvider,
        products_provider_1.ProductsProvider])
], MarketDataService);
//# sourceMappingURL=market-data.service.js.map