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
exports.ProductCacheStore = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const pricing_util_1 = require("../../common/utils/pricing.util");
const cache_aside_store_base_1 = require("../../common/cache/cache-aside-store.base");
const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCTS_CACHE_TTL_SECONDS = 300;
let ProductCacheStore = class ProductCacheStore extends cache_aside_store_base_1.CacheAsideStore {
    prisma;
    constructor(redis, prisma) {
        super(redis, PRODUCTS_CACHE_TTL_SECONDS);
        this.prisma = prisma;
    }
    cacheKey() {
        return PRODUCTS_CACHE_KEY;
    }
    async fetchFromSource() {
        const products = await this.prisma.product.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
        return products.map(pricing_util_1.toRawProduct);
    }
};
exports.ProductCacheStore = ProductCacheStore;
exports.ProductCacheStore = ProductCacheStore = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService, prisma_service_1.PrismaService])
], ProductCacheStore);
//# sourceMappingURL=product-cache.store.js.map