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
exports.BcSalesProductsService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const bc_sales_products_1 = require("./bc-sales-products");
let BcSalesProductsService = class BcSalesProductsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async plan(db) {
        const [items, catalogue, sales] = await Promise.all([
            db.bcItem.findMany({
                orderBy: { itemNo: 'asc' },
                select: {
                    itemNo: true,
                    description: true,
                    productId: true,
                    salesProductId: true,
                },
            }),
            db.product.findMany({
                where: { deletedAt: null },
                select: { id: true, sku: true, name: true, metalType: true },
            }),
            db.salesProduct.findMany({
                select: { name: true, metal: true, pricingProductId: true },
            }),
        ]);
        return (0, bc_sales_products_1.planBcSalesProducts)(items, catalogue, sales);
    }
    preview() {
        return this.plan(this.prisma);
    }
    async apply(body, actor) {
        try {
            return await this.prisma.$transaction((tx) => this.applyIn(tx, body, actor), { timeout: 120_000, maxWait: 10_000 });
        }
        catch (e) {
            if (e.code === 'P2002')
                throw new common_1.ConflictException('Specific products were changed at the same time: preview again.');
            throw e;
        }
    }
    async applyIn(tx, body, actor) {
        const { rows } = await this.plan(tx);
        const chosen = body.itemNos?.length ? new Set(body.itemNos) : null;
        const picked = rows.filter((r) => !chosen || chosen.has(r.itemNo));
        const ready = picked.filter((r) => r.action === 'CREATE');
        const existing = ready.length
            ? await tx.salesProduct.findMany({
                where: { name: { in: ready.map((r) => r.name) } },
                select: {
                    id: true,
                    name: true,
                    metal: true,
                    pricingProductId: true,
                },
            })
            : [];
        const byName = new Map(existing.map((p) => [p.name, p]));
        let created = 0;
        let linked = 0;
        const skipped = picked.filter((r) => r.action === 'SKIP').length;
        for (const r of ready) {
            const found = byName.get(r.name);
            let id;
            if (found) {
                id = found.id;
                linked++;
            }
            else {
                const p = await tx.salesProduct.create({
                    data: {
                        name: r.name,
                        metal: r.metal ?? 'GOLD',
                        genericNorm: r.genericNorm,
                        refinery: (0, shared_types_1.normaliseRefinery)(r.refinery),
                        pricingProductId: r.pricingProductId,
                        active: true,
                    },
                    select: { id: true },
                });
                id = p.id;
                byName.set(r.name, {
                    id,
                    name: r.name,
                    metal: r.metal ?? 'GOLD',
                    pricingProductId: r.pricingProductId,
                });
                created++;
            }
            await tx.bcItem.update({
                where: { itemNo: r.itemNo },
                data: { salesProductId: id },
            });
        }
        if (created + linked > 0)
            await this.audit.record(actor, 'sales-products-from-bc', `${created} specific products created, ${linked} items linked to existing ones`, tx);
        return { created, linked, skipped };
    }
};
exports.BcSalesProductsService = BcSalesProductsService;
exports.BcSalesProductsService = BcSalesProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], BcSalesProductsService);
//# sourceMappingURL=bc-sales-products.service.js.map