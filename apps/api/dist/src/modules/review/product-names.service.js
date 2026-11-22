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
exports.ProductNamesService = exports.REJECTED_REASON = void 0;
exports.settledState = settledState;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const product_name_evidence_1 = require("./product-name-evidence");
const product_name_usage_1 = require("./product-name-usage");
exports.REJECTED_REASON = 'suggestion turned down';
const WAITING = {
    decidedBy: null,
    salesProductId: null,
    productId: null,
    noProduct: false,
};
function targetOf(m) {
    if (m.outcome === 'PRICING' && m.productId !== undefined)
        return { productId: m.productId };
    if (m.outcome === 'SPECIFIC' && m.salesProductId !== undefined)
        return { salesProductId: Number(m.salesProductId) };
    if (m.outcome === 'NOT_A_PRODUCT')
        return { noProduct: true };
    return null;
}
function settledState(m) {
    const target = targetOf(m);
    const certain = target !== null && m.confidence === 'CERTAIN';
    const tier = certain
        ? 'certain'
        : m.confidence === 'LIKELY' && target
            ? 'likely'
            : 'unclear';
    const productId = target && 'productId' in target ? target.productId : null;
    const salesProductId = target && 'salesProductId' in target ? target.salesProductId : null;
    const noProduct = !!target && 'noProduct' in target;
    return {
        tier,
        state: {
            productId: certain ? productId : null,
            salesProductId: certain ? salesProductId : null,
            noProduct: certain ? noProduct : false,
            decidedBy: certain ? 'RULE' : null,
            suggestedProductId: certain ? null : productId,
            suggestedSalesProductId: certain ? null : salesProductId,
            suggestedNoProduct: certain ? false : noProduct,
            confidence: tier === 'certain'
                ? 'CERTAIN'
                : tier === 'likely'
                    ? 'LIKELY'
                    : 'UNCLEAR',
            reason: m.reason,
            question: certain ? null : (m.question ?? null),
            catalogueGap: !!m.catalogueGap,
        },
    };
}
const SCAN_MAY_WRITE = {
    OR: [{ decidedBy: null }, { decidedBy: 'RULE' }],
};
const WRITE_CHUNK = 1000;
const MAX_GROUPS = 100;
const differs = (row, state) => Object.keys(state).some((k) => row[k] !== state[k]);
let ProductNamesService = class ProductNamesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async catalogue(db) {
        const [pricing, specific] = await Promise.all([
            db.product.findMany({
                where: { deletedAt: null },
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    metalType: true,
                    category: true,
                },
                orderBy: { id: 'asc' },
            }),
            db.salesProduct.findMany({
                select: {
                    id: true,
                    name: true,
                    metal: true,
                    refinery: true,
                    genericNorm: true,
                    pricingProductId: true,
                },
                orderBy: { id: 'asc' },
            }),
        ]);
        return {
            pricing: pricing.map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                metal: p.metalType,
                category: p.category,
            })),
            specific,
        };
    }
    async settle(scope, opts = {}) {
        const db = opts.db ?? this.prisma;
        const dryRun = opts.dryRun ?? false;
        const where = { ...SCAN_MAY_WRITE };
        if (scope !== 'all') {
            if ('ids' in scope)
                where.id = { in: scope.ids };
            else
                where.alias = { in: scope.aliases };
        }
        const result = {
            dryRun,
            certain: 0,
            likely: 0,
            unclear: 0,
            unchanged: 0,
        };
        const rows = await db.productAlias.findMany({ where });
        if (rows.length === 0)
            return result;
        const cat = await this.catalogue(db);
        const evidence = await this.loadEvidence(db, rows);
        const writes = [];
        for (const row of rows) {
            const seen = evidence(row);
            const m = (0, shared_types_1.matchProductName)({
                text: row.alias,
                refinery: row.refinery,
                metal: row.metalHint ?? seen.metal ?? null,
                sources: row.sources,
                metalEvidence: seen.metalEvidence,
            }, cat);
            const { tier, state } = settledState(m);
            result[tier]++;
            const turnedDown = row.decidedBy === null && row.reason === exports.REJECTED_REASON;
            if ((turnedDown && tier !== 'certain') || !differs(row, state)) {
                result.unchanged++;
                continue;
            }
            writes.push({ id: row.id, data: state });
        }
        if (!dryRun)
            await this.write(db, writes);
        return result;
    }
    async loadEvidence(db, aliases) {
        const names = [
            ...new Set(aliases
                .filter((a) => !a.metalHint)
                .map((a) => (0, product_name_usage_1.splitAlias)(a.alias).name)
                .filter(Boolean)),
        ];
        if (names.length === 0)
            return () => ({});
        const [trades, lots, zoho, orders, spots] = await Promise.all([
            db.$queryRaw `
                SELECT "productKey" AS k, "refinery" AS refinery, "metal"::text AS metal, "date"::text AS d,
                       CASE WHEN "qty" > 0 THEN ("totalPrice" / "qty")::float8 END AS unit
                FROM trades WHERE "productKey" = ANY(${names}::text[])`,
            db.$queryRaw `
                SELECT "productKey" AS k, "refinery" AS refinery, "metal"::text AS metal, "received"::text AS d,
                       COALESCE("pricePerItem", CASE WHEN "qty" > 0 THEN "pricePaid" / "qty" END)::float8 AS unit
                FROM purchase_lots WHERE "productKey" = ANY(${names}::text[])`,
            db.$queryRaw `
                SELECT COALESCE(NULLIF("productNorm", ''), "itemName") AS k, "refinery" AS refinery, NULL::text AS metal,
                       "date"::text AS d, "unitPrice"::float8 AS unit
                FROM zoho_invoice_lines
                WHERE COALESCE(NULLIF("productNorm", ''), "itemName") = ANY(${names}::text[])`,
            db.$queryRaw `
                SELECT COALESCE(NULLIF("productNorm", ''), "itemName") AS k, NULL::text AS refinery, NULL::text AS metal,
                       "date"::text AS d, "price"::float8 AS unit
                FROM zoho_purchase_order_lines
                WHERE COALESCE(NULLIF("productNorm", ''), "itemName") = ANY(${names}::text[])`,
            db.$queryRaw `
                SELECT "metalType"::text AS m, ("recordedAt" AT TIME ZONE 'UTC')::date::text AS d,
                       AVG("priceEur")::float8 AS p
                FROM historic_spot_prices GROUP BY 1, 2`,
        ]);
        const rows = [];
        for (const r of [...trades, ...lots, ...zoho, ...orders]) {
            const tab = r.metal === 'GOLD' || r.metal === 'SILVER' || r.metal === 'PGM'
                ? r.metal
                : null;
            rows.push({
                name: (0, shared_types_1.normaliseProductText)(r.k),
                refinery: (0, shared_types_1.normaliseRefinery)(r.refinery),
                tabMetal: tab,
                date: r.d,
                unitPrice: r.unit === null ? null : Number(r.unit),
            });
        }
        const index = (0, product_name_evidence_1.buildEvidenceIndex)(rows);
        const spotOn = (0, shared_types_1.spotLookup)(spots
            .filter((s) => ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'].includes(s.m))
            .map((s) => ({ metal: s.m, date: s.d, price: Number(s.p) })));
        return (row) => (0, product_name_evidence_1.evidenceFor)(row.alias, index, spotOn, { metalHint: row.metalHint });
    }
    async write(db, writes) {
        if (writes.length === 0)
            return;
        const groups = new Map();
        for (const w of writes) {
            const key = JSON.stringify(w.data);
            const g = groups.get(key);
            if (g)
                g.ids.push(w.id);
            else
                groups.set(key, { data: w.data, ids: [w.id] });
        }
        if (groups.size <= MAX_GROUPS) {
            for (const g of groups.values())
                for (let i = 0; i < g.ids.length; i += WRITE_CHUNK)
                    await db.productAlias.updateMany({
                        where: {
                            id: { in: g.ids.slice(i, i + WRITE_CHUNK) },
                            ...SCAN_MAY_WRITE,
                        },
                        data: g.data,
                    });
            return;
        }
        for (let i = 0; i < writes.length; i += WRITE_CHUNK) {
            const c = writes.slice(i, i + WRITE_CHUNK);
            const col = (f) => c.map((w) => f(w.data));
            await db.$executeRaw `
                UPDATE product_aliases AS a SET
                    "productId" = v.pid,
                    "salesProductId" = v.sid,
                    "noProduct" = v.np,
                    "decidedBy" = v.decided::"AliasDecider",
                    "suggestedProductId" = v.spid,
                    "suggestedSalesProductId" = v.ssid,
                    "suggestedNoProduct" = v.snp,
                    "confidence" = v.conf::"MatchConfidence",
                    "reason" = v.reason,
                    "question" = v.question,
                    "catalogueGap" = v.gap
                FROM unnest(
                    ${c.map((w) => w.id)}::int[],
                    ${col((d) => d.productId ?? null)}::int[],
                    ${col((d) => d.salesProductId ?? null)}::int[],
                    ${col((d) => !!d.noProduct)}::boolean[],
                    ${col((d) => d.decidedBy ?? null)}::text[],
                    ${col((d) => d.suggestedProductId ?? null)}::int[],
                    ${col((d) => d.suggestedSalesProductId ?? null)}::int[],
                    ${col((d) => !!d.suggestedNoProduct)}::boolean[],
                    ${col((d) => d.confidence ?? null)}::text[],
                    ${col((d) => d.reason ?? null)}::text[],
                    ${col((d) => d.question ?? null)}::text[],
                    ${col((d) => !!d.catalogueGap)}::boolean[]
                ) AS v(id, pid, sid, np, decided, spid, ssid, snp, conf, reason, question, gap)
                WHERE a.id = v.id AND (a."decidedBy" IS NULL OR a."decidedBy" = 'RULE')`;
        }
    }
    async settleAndRecord(scope, actor, db, label) {
        const r = await this.settle(scope, { db });
        await this.audit.record(actor, 'product-names-settle', `${label}: ${r.certain} settled by rule, ${r.likely} to confirm, ${r.unclear} to decide, ${r.unchanged} unchanged`, db);
        return r;
    }
    async registerNames(names, source, db) {
        if (names.length === 0)
            return;
        await db.productAlias.createMany({
            data: names.map((n) => ({
                alias: n.alias,
                productKey: n.alias,
                uses: n.uses,
                sources: source,
                metalHint: n.metalHint,
            })),
            skipDuplicates: true,
        });
    }
    async rescan(dryRun, actor) {
        if (dryRun)
            return this.settle('all', { dryRun: true });
        return this.prisma.$transaction((tx) => this.settleAndRecord('all', actor, tx, 'rescan'), { timeout: 300_000, maxWait: 10_000 });
    }
    async loadUsage(db) {
        const [trades, lots, zoho, orders, safe] = await Promise.all([
            db.$queryRaw `
                SELECT "productKey" AS k, "refinery" AS refinery, "metal"::text AS metal,
                       ("productId" IS NOT NULL) AS resolved, COUNT(*)::int AS n
                FROM trades WHERE "productKey" IS NOT NULL AND "productKey" <> ''
                GROUP BY 1, 2, 3, 4`,
            db.$queryRaw `
                SELECT "productKey" AS k, "refinery" AS refinery, "metal"::text AS metal,
                       ("productId" IS NOT NULL) AS resolved, COUNT(*)::int AS n
                FROM purchase_lots WHERE "productKey" IS NOT NULL AND "productKey" <> ''
                GROUP BY 1, 2, 3, 4`,
            db.$queryRaw `
                SELECT COALESCE(NULLIF("productNorm", ''), "itemName") AS k, "refinery" AS refinery,
                       NULL::text AS metal, ("salesProductId" IS NOT NULL) AS resolved, COUNT(*)::int AS n
                FROM zoho_invoice_lines GROUP BY 1, 2, 4`,
            db.$queryRaw `
                SELECT COALESCE(NULLIF("productNorm", ''), "itemName") AS k, NULL::text AS refinery,
                       NULL::text AS metal, false AS resolved, COUNT(*)::int AS n
                FROM zoho_purchase_order_lines GROUP BY 1`,
            db.$queryRaw `
                SELECT "product" AS k, "refinery" AS refinery, "metal"::text AS metal,
                       true AS resolved, COUNT(*)::int AS n
                FROM customer_order_items GROUP BY 1, 2, 3`,
        ]);
        const groups = [];
        const add = (rows, source, normalise) => {
            for (const r of rows) {
                const name = normalise ? (0, shared_types_1.normaliseProductText)(r.k) : r.k;
                if (!name)
                    continue;
                groups.push({
                    source,
                    metal: r.metal ?? null,
                    name,
                    refinery: (0, shared_types_1.normaliseRefinery)(r.refinery),
                    resolved: r.resolved,
                    count: Number(r.n),
                });
            }
        };
        add(trades, 'SALES', false);
        add(lots, 'PURCHASES', false);
        add(zoho, 'ZOHO', true);
        add(orders, 'ZOHO_PO', true);
        add(safe, 'CUSTOMER_SAFE', true);
        return (0, product_name_usage_1.buildUsageIndex)(groups);
    }
    async list(rawQuery) {
        const parsed = shared_types_1.AliasesQuerySchema.safeParse(rawQuery);
        if (!parsed.success)
            throw new common_1.BadRequestException('Invalid query.');
        const { view, limit, offset } = parsed.data;
        const settled = { decidedBy: 'RULE' };
        const [waiting, settledCount, settledRows, index] = await Promise.all([
            this.prisma.productAlias.findMany({
                where: WAITING,
                orderBy: [{ uses: 'desc' }, { alias: 'asc' }],
            }),
            this.prisma.productAlias.count({ where: settled }),
            view === 'settled'
                ? this.prisma.productAlias.findMany({
                    where: settled,
                    orderBy: [{ uses: 'desc' }, { alias: 'asc' }],
                    skip: offset,
                    take: limit,
                })
                : Promise.resolve([]),
            this.loadUsage(this.prisma),
        ]);
        const usage = new Map();
        const perRow = [];
        const confirm = [];
        const decide = [];
        for (const a of waiting) {
            const u = (0, product_name_usage_1.usageOf)(a.alias, index);
            usage.set(a.id, u);
            if (u.settledPerRow)
                perRow.push(a);
            else if (a.confidence === 'LIKELY')
                confirm.push(a);
            else
                decide.push(a);
        }
        const open = waiting.filter((a) => !usage.get(a.id)?.settledPerRow);
        const chosen = view === 'confirm'
            ? confirm
            : view === 'decide'
                ? decide
                : view === 'per-row'
                    ? perRow
                    : view === 'settled'
                        ? settledRows
                        : open;
        const rows = view === 'settled'
            ? settledRows
            : chosen.slice(offset, offset + limit);
        for (const a of rows)
            if (!usage.has(a.id))
                usage.set(a.id, (0, product_name_usage_1.usageOf)(a.alias, index));
        const names = await this.targetNames(rows);
        return {
            total: view === 'settled' ? settledCount : chosen.length,
            counts: {
                settledByRule: settledCount,
                settledPerRow: perRow.length,
                toConfirm: confirm.length,
                toDecide: decide.length,
            },
            rows: rows.map((a) => this.toRow(a, names, usage.get(a.id))),
        };
    }
    async targetNames(rows) {
        const productIds = new Set();
        const salesIds = new Set();
        for (const a of rows) {
            for (const id of [a.productId, a.suggestedProductId])
                if (id !== null)
                    productIds.add(id);
            for (const id of [a.salesProductId, a.suggestedSalesProductId])
                if (id !== null)
                    salesIds.add(id);
        }
        const [products, sales] = await Promise.all([
            productIds.size
                ? this.prisma.product.findMany({
                    where: { id: { in: [...productIds] } },
                    select: { id: true, name: true },
                })
                : Promise.resolve([]),
            salesIds.size
                ? this.prisma.salesProduct.findMany({
                    where: { id: { in: [...salesIds] } },
                    select: { id: true, name: true },
                })
                : Promise.resolve([]),
        ]);
        return {
            product: new Map(products.map((p) => [p.id, p.name])),
            sales: new Map(sales.map((p) => [p.id, p.name])),
        };
    }
    toRow(a, names, usage) {
        const pick = (productId, salesProductId, noProduct) => {
            if (salesProductId !== null)
                return {
                    kind: 'SPECIFIC',
                    id: salesProductId,
                    name: names.sales.get(salesProductId) ?? 'Unknown product',
                };
            if (productId !== null)
                return {
                    kind: 'PRICING',
                    id: productId,
                    name: names.product.get(productId) ?? 'Unknown product',
                };
            if (noProduct)
                return {
                    kind: 'NOT_A_PRODUCT',
                    id: null,
                    name: 'Not a product',
                };
            return null;
        };
        return {
            id: a.id,
            alias: a.alias,
            uses: a.uses,
            refinery: a.refinery,
            sources: a.sources,
            confidence: a.confidence,
            reason: a.reason,
            question: a.question,
            catalogueGap: a.catalogueGap,
            decidedBy: a.decidedBy,
            suggestion: pick(a.suggestedProductId, a.suggestedSalesProductId, a.suggestedNoProduct),
            settledTo: pick(a.productId, a.salesProductId, a.noProduct),
            seenIn: usage?.seenIn ?? [],
            perMetal: usage?.perMetal ?? null,
        };
    }
    hasSuggestion = (a) => a.suggestedProductId !== null ||
        a.suggestedSalesProductId !== null ||
        a.suggestedNoProduct;
    async accept(items, actor) {
        const byId = new Map(items.map((i) => [i.id, i.expected]));
        const groups = new Map();
        for (const [id, expected] of byId) {
            const key = JSON.stringify([
                expected.productId ?? null,
                expected.salesProductId ?? null,
                expected.noProduct ?? false,
            ]);
            const g = groups.get(key);
            if (g)
                g.ids.push(id);
            else
                groups.set(key, { expected, ids: [id] });
        }
        return this.prisma.$transaction(async (tx) => {
            const done = [];
            for (const g of groups.values()) {
                for (let i = 0; i < g.ids.length; i += WRITE_CHUNK) {
                    const ids = g.ids.slice(i, i + WRITE_CHUNK);
                    const where = {
                        id: { in: ids },
                        decidedBy: null,
                        suggestedProductId: g.expected.productId ?? null,
                        suggestedSalesProductId: g.expected.salesProductId ?? null,
                        suggestedNoProduct: g.expected.noProduct === true,
                    };
                    const hit = await tx.productAlias.findMany({
                        where,
                        select: { id: true },
                    });
                    if (hit.length === 0)
                        continue;
                    const matched = hit.map((h) => h.id);
                    await tx.productAlias.updateMany({
                        where: { ...where, id: { in: matched } },
                        data: {
                            productId: g.expected.productId ?? null,
                            salesProductId: g.expected.salesProductId ?? null,
                            noProduct: g.expected.noProduct === true,
                            decidedBy: 'PERSON',
                            suggestedProductId: null,
                            suggestedSalesProductId: null,
                            suggestedNoProduct: false,
                            question: null,
                        },
                    });
                    done.push(...matched);
                }
            }
            await this.audit.record(actor, 'name-suggestion-accept', `${done.length} of ${byId.size} accepted: ids ${done.join(',') || 'none'}`, tx);
            return {
                accepted: done.length,
                skipped: byId.size - done.length,
            };
        }, { timeout: 120_000, maxWait: 10_000 });
    }
    async reject(ids, actor) {
        const unique = [...new Set(ids)];
        return this.prisma.$transaction(async (tx) => {
            const rows = await tx.productAlias.findMany({
                where: { id: { in: unique }, decidedBy: null },
            });
            const done = rows.filter(this.hasSuggestion).map((a) => a.id);
            if (done.length)
                await tx.productAlias.updateMany({
                    where: { id: { in: done } },
                    data: {
                        suggestedProductId: null,
                        suggestedSalesProductId: null,
                        suggestedNoProduct: false,
                        question: null,
                        confidence: 'UNCLEAR',
                        reason: exports.REJECTED_REASON,
                    },
                });
            await this.audit.record(actor, 'name-suggestion-reject', `${done.length} of ${unique.length} turned down: ids ${done.join(',') || 'none'}`, tx);
            return { done: done.length, skipped: unique.length - done.length };
        });
    }
    async usage(id) {
        const alias = await this.prisma.productAlias.findUnique({
            where: { id },
        });
        if (!alias)
            throw new common_1.NotFoundException(`Alias ${id} not found.`);
        const { name, refinery } = (0, product_name_usage_1.splitAlias)(alias.alias);
        const sameRefinery = (r) => refinery === null || (0, shared_types_1.normaliseRefinery)(r) === refinery;
        const day = (d) => d ? d.toISOString().slice(0, 10) : null;
        const money = (v) => v === null || v === undefined
            ? null
            : Math.round(Number(v.toString()) * 100) / 100;
        const perItem = (total, qty) => total !== null && qty && qty > 0
            ? money({
                toString: () => String(Number(total.toString()) / qty),
            })
            : null;
        const take = refinery === null ? 5 : 100;
        const pickName = (p, sp) => sp?.name ?? p?.name ?? null;
        const [trades, lots, zohoNames, safeNames] = await Promise.all([
            this.prisma.trade.findMany({
                where: { productKey: name },
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                take,
                select: {
                    metal: true,
                    sourceTab: true,
                    date: true,
                    qty: true,
                    totalPrice: true,
                    refinery: true,
                    product: { select: { name: true } },
                    salesProduct: { select: { name: true } },
                },
            }),
            this.prisma.purchaseLot.findMany({
                where: { productKey: name },
                orderBy: [{ received: 'desc' }, { id: 'desc' }],
                take,
                select: {
                    metal: true,
                    sourceTab: true,
                    received: true,
                    qty: true,
                    pricePerItem: true,
                    pricePaid: true,
                    refinery: true,
                    product: { select: { name: true } },
                    salesProduct: { select: { name: true } },
                },
            }),
            this.prisma.$queryRaw `
                SELECT DISTINCT COALESCE(NULLIF("productNorm", ''), "itemName") AS k FROM zoho_invoice_lines`,
            this.prisma.$queryRaw `
                SELECT DISTINCT "product" AS k FROM customer_order_items`,
        ]);
        const matching = (rows) => rows
            .map((r) => r.k)
            .filter((k) => (0, shared_types_1.normaliseProductText)(k) === name);
        const zohoKeys = matching(zohoNames);
        const safeKeys = matching(safeNames);
        const zohoQuery = (keys) => this.prisma.zohoInvoiceLine.findMany({
            where: {
                OR: [
                    { productNorm: { in: keys } },
                    { itemName: { in: keys } },
                ],
            },
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
            take,
            select: {
                date: true,
                qty: true,
                unitPrice: true,
                refinery: true,
                salesProduct: { select: { name: true } },
            },
        });
        const safeQuery = (keys) => this.prisma.customerOrderItem.findMany({
            where: { product: { in: keys } },
            orderBy: [{ orderedOn: 'desc' }, { id: 'desc' }],
            take: 5,
            select: { metal: true, orderedOn: true, quantity: true },
        });
        const [zoho, safe] = await Promise.all([
            zohoKeys.length
                ? zohoQuery(zohoKeys)
                : Promise.resolve([]),
            safeKeys.length
                ? safeQuery(safeKeys)
                : Promise.resolve([]),
        ]);
        const bySource = [
            trades
                .filter((t) => sameRefinery(t.refinery))
                .slice(0, 5)
                .map((t) => ({
                source: 'SALES',
                metal: t.metal,
                sheet: t.sourceTab,
                date: day(t.date),
                qty: t.qty,
                unitPrice: perItem(t.totalPrice, t.qty),
                resolvedTo: pickName(t.product, t.salesProduct),
            })),
            lots
                .filter((l) => sameRefinery(l.refinery))
                .slice(0, 5)
                .map((l) => ({
                source: 'PURCHASES',
                metal: l.metal,
                sheet: l.sourceTab,
                date: day(l.received),
                qty: l.qty,
                unitPrice: l.pricePerItem
                    ? money(l.pricePerItem)
                    : perItem(l.pricePaid, l.qty),
                resolvedTo: pickName(l.product, l.salesProduct),
            })),
            zoho
                .filter((z) => sameRefinery(z.refinery))
                .slice(0, 5)
                .map((z) => ({
                source: 'ZOHO',
                metal: null,
                sheet: null,
                date: day(z.date),
                qty: z.qty === null ? null : Number(z.qty.toString()),
                unitPrice: money(z.unitPrice),
                resolvedTo: z.salesProduct?.name ?? null,
            })),
            safe.map((c) => ({
                source: 'CUSTOMER_SAFE',
                metal: c.metal,
                sheet: null,
                date: day(c.orderedOn),
                qty: c.quantity,
                unitPrice: null,
                resolvedTo: null,
            })),
        ];
        const rows = [];
        for (let i = 0; rows.length < 5 && bySource.some((l) => i < l.length); i++)
            for (const list of bySource)
                if (i < list.length && rows.length < 5)
                    rows.push(list[i]);
        return { rows };
    }
    async applyPerMetal(id, body, actor) {
        const alias = await this.prisma.productAlias.findUnique({
            where: { id },
        });
        if (!alias)
            throw new common_1.NotFoundException(`Alias ${id} not found.`);
        if (alias.decidedBy !== null)
            throw new common_1.BadRequestException('This name is already decided. Change it with Tie instead.');
        const { name, refinery } = (0, product_name_usage_1.splitAlias)(alias.alias);
        const fits = (metal, product) => product === metal ||
            (metal === 'PGM' &&
                (product === 'PLATINUM' ||
                    product === 'PALLADIUM' ||
                    product === 'PGM'));
        const targets = [];
        for (const c of body.choices) {
            if (c.salesProductId !== undefined) {
                const sp = await this.prisma.salesProduct.findUnique({
                    where: { id: c.salesProductId },
                    select: { id: true, metal: true, pricingProductId: true },
                });
                if (!sp)
                    throw new common_1.BadRequestException(`Sales product ${c.salesProductId} not found.`);
                if (sp.pricingProductId === null)
                    throw new common_1.BadRequestException('That specific product has no pricing product yet, so rows cannot take it.');
                if (!fits(c.metal, sp.metal))
                    throw new common_1.BadRequestException(`That product is not ${c.metal.toLowerCase()}.`);
                targets.push({
                    metal: c.metal,
                    data: {
                        productId: sp.pricingProductId,
                        salesProductId: sp.id,
                    },
                });
            }
            else {
                const p = await this.prisma.product.findFirst({
                    where: { id: c.productId, deletedAt: null },
                    select: { id: true, metalType: true },
                });
                if (!p)
                    throw new common_1.BadRequestException(`Pricing product ${c.productId} not found.`);
                if (!fits(c.metal, p.metalType))
                    throw new common_1.BadRequestException(`That product is not ${c.metal.toLowerCase()}.`);
                targets.push({ metal: c.metal, data: { productId: p.id } });
            }
        }
        return this.prisma.$transaction(async (tx) => {
            let trades = 0;
            let lots = 0;
            const parts = [];
            for (const t of targets) {
                const base = {
                    productKey: name,
                    metal: t.metal,
                    productId: null,
                };
                const tradeWhere = refinery
                    ? {
                        id: {
                            in: (await tx.trade.findMany({
                                where: base,
                                select: { id: true, refinery: true },
                            }))
                                .filter((r) => (0, shared_types_1.normaliseRefinery)(r.refinery) ===
                                refinery)
                                .map((r) => r.id),
                        },
                        productId: null,
                    }
                    : base;
                const lotWhere = refinery
                    ? {
                        id: {
                            in: (await tx.purchaseLot.findMany({
                                where: base,
                                select: { id: true, refinery: true },
                            }))
                                .filter((r) => (0, shared_types_1.normaliseRefinery)(r.refinery) ===
                                refinery)
                                .map((r) => r.id),
                        },
                        productId: null,
                    }
                    : base;
                const [tr, lo] = await Promise.all([
                    tx.trade.updateMany({
                        where: tradeWhere,
                        data: t.data,
                    }),
                    tx.purchaseLot.updateMany({
                        where: lotWhere,
                        data: t.data,
                    }),
                ]);
                trades += tr.count;
                lots += lo.count;
                parts.push(`${t.metal.toLowerCase()} ${tr.count} sales, ${lo.count} purchases`);
            }
            await this.audit.record(actor, 'product-name-per-metal', `name ${id}: ${parts.join('; ')}`, tx);
            return { trades, lots };
        }, { timeout: 60_000, maxWait: 10_000 });
    }
};
exports.ProductNamesService = ProductNamesService;
exports.ProductNamesService = ProductNamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], ProductNamesService);
//# sourceMappingURL=product-names.service.js.map