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
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_mappers_1 = require("../../common/utils/prisma-mappers");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const product_audit_1 = require("./product-audit");
const product_cache_store_1 = require("./product-cache.store");
let ProductsProvider = ProductsProvider_1 = class ProductsProvider {
    prisma;
    productCache;
    audit;
    logger = new common_1.Logger(ProductsProvider_1.name);
    constructor(prisma, productCache, audit) {
        this.prisma = prisma;
        this.productCache = productCache;
        this.audit = audit;
    }
    async getAll() {
        this.logger.log('Loading all products');
        return (await this.productCache.get('all'));
    }
    async getById(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
        return product ? (0, prisma_mappers_1.toRawProduct)(product) : null;
    }
    async getByIds(ids) {
        if (ids.length === 0)
            return [];
        const rows = await this.prisma.product.findMany({
            where: { id: { in: ids }, deletedAt: null },
        });
        return rows.map(prisma_mappers_1.toRawProduct);
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
        return rows.map((row) => ({
            ...(0, prisma_mappers_1.toRawProduct)(row),
            deletedAt: row.deletedAt.toISOString(),
        }));
    }
    async getDeletedById(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: { not: null } },
        });
        return product ? (0, prisma_mappers_1.toRawProduct)(product) : null;
    }
    async create(data, actor) {
        const created = await this.prisma.$transaction(async (tx) => {
            const row = await tx.product.create({
                data: { ...data, name: (0, shared_types_1.normalizeProductName)(data.name) },
            });
            await this.audit.record(actor, 'product', `created ${row.sku} (${row.name})`, tx);
            return row;
        });
        await this.refreshCache();
        return (0, prisma_mappers_1.toRawProduct)(created);
    }
    async update(id, data, actor, expectedUpdatedAt) {
        return this.change(id, actor, 'edited', {
            ...data,
            ...(data.name === undefined
                ? {}
                : { name: (0, shared_types_1.normalizeProductName)(data.name) }),
        }, expectedUpdatedAt);
    }
    async softDelete(id, actor) {
        return this.change(id, actor, 'deleted', { deletedAt: new Date() });
    }
    async restore(id, actor) {
        return this.change(id, actor, 'restored', { deletedAt: null });
    }
    async updateStock(id, stock, actor) {
        return this.change(id, actor, 'edited', { stock });
    }
    async change(id, actor, verb, data, expectedUpdatedAt) {
        const after = await this.prisma.$transaction(async (tx) => {
            const previous = await tx.product.findUniqueOrThrow({
                where: { id },
            });
            if (expectedUpdatedAt !== undefined &&
                previous.updatedAt.toISOString() !== expectedUpdatedAt) {
                throw new common_1.ConflictException('This product was changed by someone else since you opened it. Reload the page and try again.');
            }
            const next = await tx.product.update({ where: { id }, data });
            const changes = (0, product_audit_1.describeProductChange)((0, prisma_mappers_1.toRawProduct)(previous), (0, prisma_mappers_1.toRawProduct)(next));
            await this.audit.record(actor, 'product', `${verb} ${next.sku}${changes ? `: ${changes}` : ''}`, tx);
            return (0, prisma_mappers_1.toRawProduct)(next);
        });
        await this.refreshCache();
        return after;
    }
    async refreshCache() {
        const fresh = await this.prisma.product
            .findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        })
            .then((rows) => rows.map(prisma_mappers_1.toRawProduct));
        await this.productCache.set('all', fresh);
    }
};
exports.ProductsProvider = ProductsProvider;
exports.ProductsProvider = ProductsProvider = ProductsProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        product_cache_store_1.ProductCacheStore,
        audit_log_service_1.AuditLogService])
], ProductsProvider);
//# sourceMappingURL=products.provider.js.map