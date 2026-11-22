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
exports.ProductRelinkService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const product_relink_1 = require("./product-relink");
const CHUNK = 1000;
const STOCK_METAL = {
    GOLD: 'GOLD',
    SILVER: 'SILVER',
    PGM: null,
};
function zohoMetal(text) {
    const m = String(text ?? '').toUpperCase();
    if (m.includes('SILVER'))
        return 'SILVER';
    if (m.includes('PLATINUM'))
        return 'PLATINUM';
    if (m.includes('PALLADIUM'))
        return 'PALLADIUM';
    return 'GOLD';
}
let ProductRelinkService = class ProductRelinkService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async resolverData() {
        const [catalogue, aliases, sales, bcItems, refineryAliases] = await Promise.all([
            this.prisma.product.findMany({
                where: { deletedAt: null },
                orderBy: { id: 'asc' },
                select: { id: true, sku: true, metalType: true },
            }),
            this.prisma.productAlias.findMany({
                orderBy: { id: 'asc' },
                select: {
                    alias: true,
                    productId: true,
                    salesProductId: true,
                    noProduct: true,
                    decidedBy: true,
                    metalHint: true,
                },
            }),
            this.prisma.salesProduct.findMany({
                orderBy: { id: 'asc' },
                select: {
                    id: true,
                    metal: true,
                    name: true,
                    genericNorm: true,
                    refinery: true,
                    pricingProductId: true,
                },
            }),
            this.prisma.bcItem.findMany({
                select: {
                    itemNo: true,
                    productId: true,
                    salesProductId: true,
                },
            }),
            this.prisma.refineryAlias.findMany({
                select: { alias: true, refinery: true },
            }),
        ]);
        const bc = new Map(bcItems.map((b) => [b.itemNo, b]));
        const decisions = aliases.map((a) => ({
            key: a.alias,
            productId: a.productId,
            salesProductId: a.salesProductId,
            noProduct: a.noProduct,
            decidedBy: a.decidedBy,
            metalHint: a.metalHint,
        }));
        const full = {
            catalogue,
            salesProducts: sales,
            bcItems: new Map(bcItems
                .filter((b) => b.salesProductId !== null)
                .map((b) => [b.itemNo, b.salesProductId])),
            decisions,
            refineryAliases,
        };
        const person = {
            ...full,
            bcItems: undefined,
            decisions: decisions.filter((d) => d.decidedBy === 'PERSON'),
        };
        return {
            full,
            person,
            bc,
            lookups: {
                pricingMetal: new Map(catalogue.map((c) => [c.id, c.metalType])),
                salesMetal: new Map(sales.map((s) => [s.id, s.metal])),
            },
        };
    }
    async load(table, bc) {
        switch (table) {
            case 'trades': {
                const rows = await this.prisma.trade.findMany({
                    select: {
                        id: true,
                        productText: true,
                        refinery: true,
                        metal: true,
                        productId: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: true },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.productText,
                        refinery: r.refinery,
                        metal: STOCK_METAL[r.metal] ?? null,
                        productId: r.productId,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
            case 'purchase_lots': {
                const rows = await this.prisma.purchaseLot.findMany({
                    select: {
                        id: true,
                        productText: true,
                        refinery: true,
                        metal: true,
                        productId: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: true },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.productText,
                        refinery: r.refinery,
                        metal: STOCK_METAL[r.metal] ?? null,
                        productId: r.productId,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
            case 'zoho_invoice_lines': {
                const rows = await this.prisma.zohoInvoiceLine.findMany({
                    select: {
                        id: true,
                        itemName: true,
                        refinery: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: false },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.itemName,
                        refinery: r.refinery,
                        metal: zohoMetal(null),
                        productId: null,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
            case 'zoho_products': {
                const rows = await this.prisma.zohoProduct.findMany({
                    select: {
                        id: true,
                        sku: true,
                        itemName: true,
                        metal: true,
                        productId: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: true },
                    rows: rows.map((r) => {
                        const no = (0, shared_types_1.bcItemNoFromSku)(r.sku);
                        const item = no ? bc.get(no) : undefined;
                        return {
                            id: r.id,
                            text: r.itemName,
                            refinery: null,
                            metal: zohoMetal(r.metal),
                            productId: r.productId,
                            salesProductId: r.salesProductId,
                            bcItemNo: item ? no : null,
                            bc: item
                                ? {
                                    productId: item.productId,
                                    salesProductId: item.salesProductId,
                                }
                                : null,
                        };
                    }),
                };
            }
            case 'quotes': {
                const rows = await this.prisma.quote.findMany({
                    select: {
                        id: true,
                        productText: true,
                        metal: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: false },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.productText,
                        refinery: null,
                        metal: STOCK_METAL[r.metal] ?? null,
                        productId: null,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
        }
    }
    async write(tx, table, groups) {
        let written = 0;
        for (const g of groups) {
            const guard = {};
            const data = {};
            if (g.change.productId) {
                guard.productId = g.change.productId[0];
                data.productId = g.change.productId[1];
            }
            if (g.change.salesProductId) {
                guard.salesProductId = g.change.salesProductId[0];
                data.salesProductId = g.change.salesProductId[1];
            }
            for (let i = 0; i < g.ids.length; i += CHUNK) {
                const args = {
                    where: { id: { in: g.ids.slice(i, i + CHUNK) }, ...guard },
                    data,
                };
                const r = table === 'trades'
                    ? await tx.trade.updateMany(args)
                    : table === 'purchase_lots'
                        ? await tx.purchaseLot.updateMany(args)
                        : table === 'zoho_invoice_lines'
                            ? await tx.zohoInvoiceLine.updateMany(args)
                            : table === 'zoho_products'
                                ? await tx.zohoProduct.updateMany(args)
                                : await tx.quote.updateMany(args);
                written += r.count;
            }
        }
        return written;
    }
    async relink(body, actor) {
        const { dryRun, correct } = body;
        const { full, person, lookups, bc } = await this.resolverData();
        const plans = new Map();
        for (const table of shared_types_1.RELINK_TABLES) {
            const { spec, rows } = await this.load(table, bc);
            plans.set(table, (0, product_relink_1.planRelink)(rows, spec, full, person, lookups, correct));
        }
        const written = new Map();
        if (!dryRun) {
            await this.prisma.$transaction(async (tx) => {
                for (const table of shared_types_1.RELINK_TABLES) {
                    const plan = plans.get(table);
                    written.set(table, await this.write(tx, table, (0, product_relink_1.groupChanges)(plan.changes)));
                }
                await this.audit.record(actor, 'product-relink', `correct ${correct ? 'on' : 'off'}; ` +
                    shared_types_1.RELINK_TABLES.map((t) => {
                        const c = plans.get(t).counts;
                        return `${t} fill ${c.fill} correct ${correct ? c.correct : 0} written ${written.get(t)}`;
                    }).join('; '), tx);
            }, { timeout: 300_000, maxWait: 10_000 });
        }
        const out = (t) => ({
            ...plans.get(t).counts,
            written: written.get(t) ?? 0,
        });
        return {
            dryRun,
            correct,
            tables: {
                trades: out('trades'),
                purchase_lots: out('purchase_lots'),
                zoho_invoice_lines: out('zoho_invoice_lines'),
                zoho_products: out('zoho_products'),
                quotes: out('quotes'),
            },
        };
    }
};
exports.ProductRelinkService = ProductRelinkService;
exports.ProductRelinkService = ProductRelinkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], ProductRelinkService);
//# sourceMappingURL=product-relink.service.js.map