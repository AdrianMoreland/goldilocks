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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const link_rules_service_1 = require("./link-rules.service");
const shipment_matcher_1 = require("../imports/shipment-matcher");
const UNSETTLED_ALIAS = {
    salesProductId: null,
    productId: null,
    noProduct: false,
};
const day = (d) => d instanceof Date ? d.toISOString().slice(0, 10) : null;
const num = (v) => v === null || v === undefined ? null : Number(v);
const join = (...parts) => parts.filter((p) => p !== null && p !== undefined && p !== '').join(' · ');
let ReviewService = class ReviewService {
    prisma;
    audit;
    rules;
    constructor(prisma, audit, rules) {
        this.prisma = prisma;
        this.audit = audit;
        this.rules = rules;
    }
    linkQuery(query) {
        const parsed = shared_types_1.ReviewLinksQuerySchema.safeParse(query);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid query.');
        return parsed.data;
    }
    pageQuery(query) {
        const parsed = shared_types_1.ReviewPageQuerySchema.safeParse(query);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid query.');
        return parsed.data;
    }
    async notOverSold() {
        const keys = (await this.overAllocatedLots())
            .map((l) => l.sourceKey)
            .filter((k) => k !== null);
        return keys.length
            ? { NOT: { linkType: 'trade_lot', toKey: { in: keys } } }
            : {};
    }
    async summary() {
        const hide = await this.notOverSold();
        const [byType, unresolvedLots, duplicates, aliases, overAllocated] = await Promise.all([
            this.prisma.entityLink.groupBy({
                by: ['linkType'],
                where: { status: 'PENDING', ...hide },
                _count: { _all: true },
            }),
            this.prisma.trade.count({ where: this.unresolvedWhere() }),
            this.prisma.trade.count({ where: this.duplicateWhere() }),
            this.prisma.productAlias.count({ where: UNSETTLED_ALIAS }),
            this.overAllocatedLots().then((l) => l.length),
        ]);
        return {
            links: Object.fromEntries(byType.map((g) => [g.linkType, g._count._all])),
            unresolvedLots,
            duplicates,
            aliases,
            overAllocated,
        };
    }
    async links(rawQuery) {
        const { type, limit, offset } = this.linkQuery(rawQuery);
        const hide = await this.notOverSold();
        const where = {
            ...hide,
            status: 'PENDING',
            ...(type ? { linkType: type } : {}),
        };
        const [total, rows] = await Promise.all([
            this.prisma.entityLink.count({ where }),
            this.prisma.entityLink.findMany({
                where,
                orderBy: { id: 'asc' },
                skip: offset,
                take: limit,
            }),
        ]);
        const wanted = new Map();
        const want = (table, key) => (wanted.get(table) ?? wanted.set(table, new Set()).get(table)).add(key);
        for (const r of rows) {
            want(r.fromTable, r.fromKey);
            want(r.toTable, r.toKey);
        }
        const described = new Map();
        for (const [table, keys] of wanted) {
            for (const [key, end] of await this.describe(table, [...keys]))
                described.set(`${table}\u0001${key}`, end);
        }
        const end = (table, key) => described.get(`${table}\u0001${key}`) ?? {
            table,
            label: key,
            detail: null,
        };
        const verdicts = await this.rules.judge(this.prisma, rows);
        const whyOf = (id) => {
            const v = verdicts.get(id);
            if (!v)
                return null;
            return v.verdict === 'CONFIRM'
                ? 'Looks right; the rules have not settled it yet.'
                : v.reason;
        };
        return {
            total,
            rows: rows.map((r) => ({
                id: r.id,
                why: whyOf(r.id),
                linkType: r.linkType,
                confidence: r.confidence,
                method: r.method,
                note: r.note,
                from: end(r.fromTable, r.fromKey),
                to: end(r.toTable, r.toKey),
            })),
        };
    }
    async describe(table, keys) {
        const out = new Map();
        const put = (key, label, detail) => out.set(key, { table, label, detail });
        const by = { sourceKey: { in: keys } };
        if (table === 'trades') {
            const ids = keys
                .map((k) => /^trade#(\d+)$/.exec(k)?.[1])
                .filter((x) => x !== undefined)
                .map(Number);
            for (const t of await this.prisma.trade.findMany({
                where: { OR: [by, { id: { in: ids } }] },
            })) {
                put(keys.includes(`trade#${t.id}`)
                    ? `trade#${t.id}`
                    : t.sourceKey, join(t.reference, t.qty !== null ? `${t.qty} ×` : null, t.productText), join(day(t.date), t.client));
            }
            const quoteKeys = keys.filter((k) => !out.has(k));
            if (quoteKeys.length) {
                for (const q of await this.prisma.quote.findMany({
                    where: { sourceKey: { in: quoteKeys } },
                    include: { customer: true },
                })) {
                    put(q.sourceKey, join(q.reference, num(q.qty) !== null ? `${num(q.qty)} ×` : null, q.productText, 'quote only on the sheet'), join(day(q.date), q.customer?.name));
                }
            }
        }
        else if (table === 'purchase_lots') {
            for (const l of await this.prisma.purchaseLot.findMany({
                where: by,
            })) {
                put(l.sourceKey, join(l.reference, l.qty !== null ? `${l.qty} ×` : null, l.productText), join(day(l.received), l.client));
            }
        }
        else if (table === 'invoice_lines') {
            for (const l of await this.prisma.zohoInvoiceLine.findMany({
                where: by,
                include: { customer: true },
            })) {
                put(l.sourceKey, join(num(l.qty) !== null ? `${num(l.qty)} ×` : null, l.itemName, l.refinery), join(day(l.date), l.customer?.name));
            }
        }
        else if (table === 'bc_sales_orders') {
            for (const o of await this.prisma.bcSalesOrder.findMany({
                where: by,
                include: { customer: true },
            })) {
                put(o.sourceKey, join(o.extDocNo, o.sourceKey), join(day(o.docDate), num(o.amount) !== null ? `€${num(o.amount)}` : null, o.customer?.name));
            }
        }
        else if (table === 'supplier_invoices') {
            for (const s of await this.prisma.supplierInvoice.findMany({
                where: by,
            }))
                put(s.sourceKey, join(s.supplier, s.number), day(s.lastDate));
        }
        else if (table === 'stock_bars') {
            for (const b of await this.prisma.stocktakeBar.findMany({
                where: by,
            }))
                put(b.sourceKey, join(b.weightLabel, b.refinery, b.serial), b.locationCode);
        }
        else if (table === 'line_serials') {
            for (const s of await this.prisma.lineSerial.findMany({
                where: by,
            }))
                put(s.sourceKey, join(s.refinery, s.serial), null);
        }
        else if (table === 'bc_shipments') {
            const nos = [...new Set(keys.map((k) => k.split('|')[0]))];
            const [ships, ledger] = await Promise.all([
                this.prisma.bcShipment.findMany({
                    where: { no: { in: nos } },
                    include: { customer: true },
                }),
                this.prisma.bcLedgerEntry.findMany({
                    where: { documentNo: { in: nos }, entryType: 'Sale' },
                }),
            ]);
            const shipOf = new Map(ships.map((x) => [x.no, x]));
            for (const key of keys) {
                const [no, itemNo] = key.split('|');
                const sh = shipOf.get(no);
                if (!sh)
                    continue;
                const lines = ledger.filter((l) => l.documentNo === no && l.itemNo === itemNo);
                const qty = lines.reduce((n, l) => n + Math.abs(Number(l.quantity)), 0);
                const amount = lines.reduce((n, l) => n + Number(l.salesAmount ?? 0), 0);
                put(key, join(no, `${qty} × item ${itemNo}`), join(day(sh.postingDate), amount ? `€${Math.round(amount * 100) / 100}` : null, sh.customer?.name));
            }
        }
        else if (table === 'bc_tracking_entries') {
            for (const e of await this.prisma.bcTrackingEntry.findMany({
                where: by,
            }))
                put(e.sourceKey, join(e.itemNo, e.serialNo), e.locationCode);
        }
        return out;
    }
    async settle(actor) {
        return this.prisma.$transaction(async (tx) => {
            const res = await this.rules.settle(tx);
            await this.audit.record(actor, 'review-settle', `${res.confirmed} confirmed by rule, ${res.asked} left to ask, ${res.overAllocated} over-allocated`, tx);
            return res;
        });
    }
    async overAllocatedLots() {
        const lots = await this.prisma.purchaseLot.findMany({
            where: { allocatedQty: { gt: 0 }, missingFromImport: false },
        });
        return lots.filter((l) => l.qty !== null && l.allocatedQty > l.qty);
    }
    async overAllocated(rawQuery) {
        const { limit, offset } = this.pageQuery(rawQuery);
        const lots = (await this.overAllocatedLots()).sort((a, b) => b.allocatedQty - b.qty - (a.allocatedQty - a.qty));
        const page = lots.slice(offset, offset + limit);
        const sales = await this.prisma.trade.findMany({
            where: {
                lotId: { in: page.map((l) => l.id) },
                missingFromImport: false,
            },
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
        });
        return {
            total: lots.length,
            rows: page.map((l) => ({
                lotId: l.id,
                reference: l.reference,
                productText: l.productText,
                received: day(l.received),
                bought: l.qty,
                sold: l.allocatedQty,
                sales: sales
                    .filter((t) => t.lotId === l.id)
                    .slice(0, 20)
                    .map((t) => ({
                    tradeId: t.id,
                    reference: t.reference,
                    date: day(t.date),
                    qty: t.qty,
                })),
            })),
        };
    }
    async decide(body, actor) {
        return this.prisma.$transaction(async (tx) => {
            const res = await tx.entityLink.updateMany({
                where: { id: { in: body.ids }, status: 'PENDING' },
                data: {
                    status: body.decision,
                    confirmedBy: actor,
                    confirmedAt: new Date(),
                },
            });
            await this.applyShipmentLinks(tx, body.ids, actor);
            await this.audit.record(actor, 'review-links', `${res.count} link${res.count === 1 ? '' : 's'} ${body.decision.toLowerCase()}`, tx);
            return { updated: res.count };
        });
    }
    async applyShipmentLinks(tx, ids, actor) {
        const confirmed = await tx.entityLink.findMany({
            where: {
                id: { in: ids },
                status: 'CONFIRMED',
                linkType: shipment_matcher_1.SHIPMENT_LINK.linkType,
                fromTable: shipment_matcher_1.SHIPMENT_LINK.fromTable,
            },
        });
        for (const l of confirmed) {
            const tradeId = await (0, shipment_matcher_1.tradeIdOfKey)(tx, l.toKey);
            if (tradeId === null)
                continue;
            await (0, shipment_matcher_1.applyShipmentLink)(tx, l.fromKey, tradeId);
            await tx.entityLink.updateMany({
                where: {
                    linkType: shipment_matcher_1.SHIPMENT_LINK.linkType,
                    fromTable: shipment_matcher_1.SHIPMENT_LINK.fromTable,
                    fromKey: l.fromKey,
                    status: 'PENDING',
                },
                data: {
                    status: 'REJECTED',
                    confirmedBy: actor,
                    confirmedAt: new Date(),
                },
            });
        }
    }
    unresolvedWhere() {
        return {
            cptyKind: 'LOT_REF',
            lotKey: { not: null },
            lotId: null,
            missingFromImport: false,
        };
    }
    duplicateWhere() {
        return { occurrence: { gt: 1 }, missingFromImport: false };
    }
    async unresolvedLots(rawQuery) {
        const { limit, offset } = this.pageQuery(rawQuery);
        const where = this.unresolvedWhere();
        const [total, rows] = await Promise.all([
            this.prisma.trade.count({ where }),
            this.prisma.trade.findMany({
                where,
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                skip: offset,
                take: limit,
            }),
        ]);
        return {
            total,
            rows: rows.map((t) => ({
                tradeId: t.id,
                reference: t.reference,
                date: day(t.date),
                qty: t.qty,
                productText: t.productText,
                lotKey: t.lotKey ?? '',
                branchCode: t.branchCode,
            })),
        };
    }
    async duplicates(rawQuery) {
        const { limit, offset } = this.pageQuery(rawQuery);
        const where = this.duplicateWhere();
        const [total, rows] = await Promise.all([
            this.prisma.trade.count({ where }),
            this.prisma.trade.findMany({
                where,
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                skip: offset,
                take: limit,
            }),
        ]);
        return {
            total,
            rows: rows.map((t) => ({
                tradeId: t.id,
                reference: t.reference,
                occurrence: t.occurrence,
                date: day(t.date),
                qty: t.qty,
                productText: t.productText,
                branchCode: t.branchCode,
            })),
        };
    }
    async salesProducts() {
        const rows = await this.prisma.salesProduct.findMany({
            orderBy: { name: 'asc' },
            include: { pricingProduct: true },
        });
        return rows.map((p) => ({
            id: p.id,
            name: p.name,
            metal: p.metal,
            genericNorm: p.genericNorm,
            refinery: p.refinery,
            pricingProductId: p.pricingProductId,
            pricingProductName: p.pricingProduct?.name ?? null,
        }));
    }
    async pricingProducts() {
        const rows = await this.prisma.product.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, metalType: true },
            orderBy: { name: 'asc' },
        });
        return rows.map((p) => ({
            id: p.id,
            name: p.name,
            metalType: p.metalType,
        }));
    }
    async createSalesProduct(body, actor) {
        if (body.pricingProductId) {
            const pricing = await this.prisma.product.findUnique({
                where: { id: body.pricingProductId },
            });
            if (!pricing)
                throw new common_1.BadRequestException(`Pricing product ${body.pricingProductId} not found.`);
        }
        const clash = await this.prisma.salesProduct.findUnique({
            where: { name: body.name },
        });
        if (clash)
            throw new common_1.ConflictException('A sales product with that name already exists.');
        const created = await this.prisma.$transaction(async (tx) => {
            const p = await tx.salesProduct.create({
                data: {
                    name: body.name,
                    metal: body.metal,
                    genericNorm: body.genericNorm,
                    refinery: (0, shared_types_1.normaliseRefinery)(body.refinery),
                    pricingProductId: body.pricingProductId ?? null,
                },
                include: { pricingProduct: true },
            });
            await this.audit.record(actor, 'sales-product-create', `sales product ${p.id} created`, tx);
            return p;
        });
        return {
            id: created.id,
            name: created.name,
            metal: created.metal,
            genericNorm: created.genericNorm,
            refinery: created.refinery,
            pricingProductId: created.pricingProductId,
            pricingProductName: created.pricingProduct?.name ?? null,
        };
    }
    async mapAlias(id, body, actor) {
        const alias = await this.prisma.productAlias.findUnique({
            where: { id },
        });
        if (!alias)
            throw new common_1.NotFoundException(`Alias ${id} not found.`);
        const chosen = [
            body.salesProductId,
            body.productId,
            body.noProduct,
        ].filter((v) => v !== undefined);
        if (chosen.length !== 1)
            throw new common_1.BadRequestException('Choose exactly one of a sales product, a pricing product or not a product.');
        let data;
        let what;
        if (body.salesProductId !== undefined) {
            const product = await this.prisma.salesProduct.findUnique({
                where: { id: body.salesProductId },
            });
            if (!product)
                throw new common_1.BadRequestException(`Sales product ${body.salesProductId} not found.`);
            data = {
                salesProductId: product.id,
                productId: null,
                noProduct: false,
                decidedBy: 'PERSON',
                suggestedProductId: null,
                suggestedSalesProductId: null,
                suggestedNoProduct: false,
                question: null,
                refinery: alias.refinery ?? (0, shared_types_1.normaliseRefinery)(product.refinery),
            };
            what = `sales product ${product.id}`;
        }
        else if (body.productId !== undefined) {
            const product = await this.prisma.product.findUnique({
                where: { id: body.productId },
            });
            if (!product)
                throw new common_1.BadRequestException(`Pricing product ${body.productId} not found.`);
            data = {
                productId: product.id,
                salesProductId: null,
                noProduct: false,
                decidedBy: 'PERSON',
                suggestedProductId: null,
                suggestedSalesProductId: null,
                suggestedNoProduct: false,
                question: null,
            };
            what = `pricing product ${product.id}`;
        }
        else {
            data = {
                noProduct: true,
                salesProductId: null,
                productId: null,
                decidedBy: 'PERSON',
                suggestedProductId: null,
                suggestedSalesProductId: null,
                suggestedNoProduct: false,
                question: null,
            };
            what = 'not a product';
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.productAlias.update({ where: { id }, data });
            await this.audit.record(actor, 'alias-map', `alias ${id} mapped to ${what}`, tx);
        });
        return { id };
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        link_rules_service_1.LinkRulesService])
], ReviewService);
//# sourceMappingURL=review.service.js.map