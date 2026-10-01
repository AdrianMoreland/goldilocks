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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotPriceCacheStore = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const cache_aside_store_base_1 = require("../../common/cache/cache-aside-store.base");
const pricing_util_1 = require("../../common/utils/pricing.util");
const SPOT_CACHE_TTL_SECONDS = 3600;
let SpotPriceCacheStore = class SpotPriceCacheStore extends cache_aside_store_base_1.CacheAsideStore {
    prisma;
    constructor(redis, prisma) {
        super(redis, SPOT_CACHE_TTL_SECONDS);
        this.prisma = prisma;
    }
    cacheKey(metal) {
        return `metal:${metal}`;
    }
    async fetchFromSource(metal) {
        const row = await this.prisma.metalSpotPrice.findFirst({
            where: { metalType: metal },
            orderBy: { timestamp: 'desc' },
        });
        return row ? (0, pricing_util_1.toRawMetalSpotPrice)(row) : null;
    }
    isUsable(value) {
        return value.priceEur > 0;
    }
    async getCachedOnly(metal) {
        return this.redis.get(this.cacheKey(metal));
    }
    async getFromDbOnly(metal) {
        return this.fetchFromSource(metal);
    }
    async clearAll(metals) {
        await this.redis.del(...metals.map((m) => this.cacheKey(m)));
    }
};
exports.SpotPriceCacheStore = SpotPriceCacheStore;
exports.SpotPriceCacheStore = SpotPriceCacheStore = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        prisma_service_1.PrismaService])
], SpotPriceCacheStore);
//# sourceMappingURL=spot-price-cache.store.js.map