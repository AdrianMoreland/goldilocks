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
var ProductsProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsProvider = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const pricing_util_1 = require("../../common/utils/pricing.util");
const product_cache_store_1 = require("./product-cache.store");
let ProductsProvider = ProductsProvider_1 = class ProductsProvider {
    prisma;
    productCache;
    logger = new common_1.Logger(ProductsProvider_1.name);
    constructor(prisma, productCache) {
        this.prisma = prisma;
        this.productCache = productCache;
    }
    async getAll() {
        this.logger.log('Loading all products');
        return (await this.productCache.get('all'));
    }
    async getById(id) {
        const product = await this.prisma.product.findFirst({ where: { id, deletedAt: null } });
        return product ? (0, pricing_util_1.toRawProduct)(product) : null;
    }
    async findBySku(sku) {
        return this.prisma.product.findFirst({
            where: { sku: { equals: sku, mode: 'insensitive' } },
            select: { id: true, deletedAt: true },
        });
    }
    async getDeleted() {
        const rows = await this.prisma.product.findMany({
            where: { deletedAt: { not: null } },
            orderBy: { deletedAt: 'desc' },
        });
        return rows.map((row) => ({ ...(0, pricing_util_1.toRawProduct)(row), deletedAt: row.deletedAt.toISOString() }));
    }
    async getDeletedById(id) {
        const product = await this.prisma.product.findFirst({ where: { id, deletedAt: { not: null } } });
        return product ? (0, pricing_util_1.toRawProduct)(product) : null;
    }
    async create(data) {
        const created = await this.prisma.product.create({ data });
        await this.refreshCache();
        return (0, pricing_util_1.toRawProduct)(created);
    }
    async update(id, data) {
        const updated = await this.prisma.product.update({ where: { id }, data });
        await this.refreshCache();
        return (0, pricing_util_1.toRawProduct)(updated);
    }
    async softDelete(id) {
        const deleted = await this.prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
        await this.refreshCache();
        return (0, pricing_util_1.toRawProduct)(deleted);
    }
    async restore(id) {
        const restored = await this.prisma.product.update({ where: { id }, data: { deletedAt: null } });
        await this.refreshCache();
        return (0, pricing_util_1.toRawProduct)(restored);
    }
    async updateStock(id, stock) {
        const updated = await this.prisma.product.update({ where: { id }, data: { stock } });
        await this.refreshCache();
        return (0, pricing_util_1.toRawProduct)(updated);
    }
    async refreshCache() {
        const fresh = await this.prisma.product
            .findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } })
            .then((rows) => rows.map(pricing_util_1.toRawProduct));
        await this.productCache.set('all', fresh);
    }
};
exports.ProductsProvider = ProductsProvider;
exports.ProductsProvider = ProductsProvider = ProductsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        product_cache_store_1.ProductCacheStore])
], ProductsProvider);
//# sourceMappingURL=products.provider.js.map