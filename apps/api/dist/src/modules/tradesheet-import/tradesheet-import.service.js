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
var TradesheetImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesheetImportService = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../settings/notifications.service");
const shared_types_1 = require("@goldilocks/shared-types");
const prismaNamespace_1 = require("../../../prisma/generated/internal/prismaNamespace");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const product_names_service_1 = require("../review/product-names.service");
const tradesheet_import_plan_1 = require("./tradesheet-import.plan");
const tradesheet_allocation_1 = require("./tradesheet-allocation");
const toDate = (iso) => iso ? new Date(`${iso}T00:00:00.000Z`) : null;
const dec = (n, integerDigits = 10) => n === null || !Number.isFinite(n) || Math.abs(n) >= 10 ** integerDigits
    ? null
    : new prismaNamespace_1.Decimal(String(n));
const num = (d) => d === null ? null : Number(d.toString());
let TradesheetImportService = TradesheetImportService_1 = class TradesheetImportService {
    prisma;
    audit;
    names;
    notifications;
    logger = new common_1.Logger(TradesheetImportService_1.name);
    constructor(prisma, audit, names, notifications) {
        this.prisma = prisma;
        this.audit = audit;
        this.names = names;
        this.notifications = notifications;
    }
    async preview(dto) {
        return (await this.build(dto, this.prisma)).plan;
    }
    async commit(dto, actor) {
        let newNames = [];
        const result = await this.prisma.$transaction(async (tx) => {
            const built = await this.build(dto, tx);
            if (!built.recs.some((r) => r.kind !== null && r.problems.length === 0)) {
                throw new common_1.BadRequestException('None of the tabs in this file could be read.');
            }
            const batch = await tx.importBatch.create({
                data: {
                    fileName: dto.fileName,
                    sheetMonth: dto.sheetMonth,
                    source: dto.source,
                    importedBy: actor,
                    summary: built.plan,
                },
            });
            for (const rec of built.recs) {
                await this.writeTrades(tx, rec, dto.sheetMonth, batch.id, built.branchIds);
                await this.writeLots(tx, rec, dto.sheetMonth, batch.id, built.branchIds);
            }
            const allocation = await this.allocate(tx, built.recs);
            newNames = await this.registerNames(tx, built.recs);
            const t = built.plan.totals;
            await this.audit.record(actor, 'tradesheet-import', `${dto.fileName} (${dto.sheetMonth}): ${t.added} added, ${t.changed + t.restored} updated, ${t.refreshed} products filled, ${t.missing} missing, ${t.flagged} flagged; ${allocation.salesLinked} sales linked, ${allocation.lotNotImported} to a lot not imported`, tx);
            return { batchId: batch.id, plan: built.plan, allocation };
        }, { timeout: 300_000, maxWait: 10_000 });
        await this.settleNames(newNames, actor, result.batchId);
        const t = result.plan.totals;
        await this.notifications?.notifyAdmins({
            kind: 'import_review',
            title: `Tradesheet ${dto.sheetMonth} imported`,
            body: `${t.added} added, ${t.changed + t.restored} updated, ${t.flagged} need a look${newNames.length ? `; ${newNames.length} new product name(s) to confirm` : ''} (by ${actor}).`,
            link: '/import',
        });
        return result;
    }
    async registerNames(tx, recs) {
        const found = new Map();
        const rows = recs
            .flatMap((rec) => [...rec.sales, ...rec.lots])
            .filter((r) => r.status !== 'MISSING' &&
            r.status !== 'UNCHANGED' &&
            r.how === 'NONE' &&
            r.productKey &&
            (0, shared_types_1.aliasOk)(r.parsed.product, r.productKey));
        const plainKeys = [...new Set(rows.map((r) => r.productKey))];
        const saved = new Set(plainKeys.length === 0
            ? []
            : (await tx.productAlias.findMany({
                where: { alias: { in: plainKeys } },
                select: { alias: true },
            })).map((a) => a.alias));
        const metalsByKey = new Map();
        for (const r of rows) {
            const k = r.productKey;
            (metalsByKey.get(k) ?? metalsByKey.set(k, new Set()).get(k)).add(r.metal);
        }
        for (const r of rows) {
            const plain = r.productKey;
            const ambiguous = saved.has(plain) || (metalsByKey.get(plain)?.size ?? 0) > 1;
            const alias = (0, shared_types_1.metalAwareAlias)(plain, r.parsed.product, r.metal, ambiguous);
            const seen = found.get(alias);
            if (seen)
                seen.uses++;
            else
                found.set(alias, { alias, uses: 1, metalHint: r.metal });
        }
        const names = [...found.values()];
        await this.names.registerNames(names, 'tradesheet', tx);
        return names.map((n) => n.alias);
    }
    async settleNames(aliases, actor, batchId) {
        if (aliases.length === 0)
            return;
        try {
            await this.names.settleAndRecord({ aliases }, actor, this.prisma, `batch ${batchId} tradesheet names`);
        }
        catch (e) {
            this.logger.error(`Settling the product names of import batch ${batchId} failed; the names stay in the queue for a rescan: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    async allocate(tx, recs) {
        const keys = new Set();
        for (const rec of recs) {
            for (const s of rec.sales) {
                if (s.status === 'UNCHANGED')
                    continue;
                if (s.parsed.cpty.lotKey)
                    keys.add(s.parsed.cpty.lotKey);
                if (s.existing?.lotKey)
                    keys.add(s.existing.lotKey);
            }
            for (const l of rec.lots) {
                if (l.status !== 'UNCHANGED')
                    keys.add(l.referenceKey);
            }
        }
        const summary = {
            lotsChecked: 0,
            salesLinked: 0,
            lotNotImported: 0,
            overAllocated: 0,
            soldMismatches: 0,
        };
        if (keys.size === 0)
            return summary;
        const lotKeys = [...keys];
        const lots = await tx.purchaseLot.findMany({
            where: { referenceKey: { in: lotKeys } },
            orderBy: [{ referenceKey: 'asc' }, { occurrence: 'asc' }],
            select: {
                id: true,
                referenceKey: true,
                qty: true,
                metal: true,
                commentSoldQty: true,
            },
        });
        const sales = await tx.trade.findMany({
            where: { lotKey: { in: lotKeys }, cptyKind: 'LOT_REF' },
            select: { id: true, lotKey: true, qty: true, date: true },
        });
        const lotByKey = new Map();
        for (const lot of lots) {
            if (!lotByKey.has(lot.referenceKey))
                lotByKey.set(lot.referenceKey, lot);
        }
        const unlink = [];
        const link = [];
        const orphanIds = [];
        const totals = [];
        const goldLotIds = [];
        const ranges = [];
        for (const key of lotKeys) {
            const lot = lotByKey.get(key);
            const cited = sales.filter((s) => s.lotKey === key);
            if (!lot) {
                for (const s of cited)
                    orphanIds.push(s.id);
                summary.lotNotImported += cited.length;
                continue;
            }
            unlink.push({ lotId: lot.id, key });
            for (const s of cited)
                link.push({ tradeId: s.id, lotId: lot.id });
            const plan = (0, tradesheet_allocation_1.planLotAllocation)(lot.qty, cited);
            totals.push({ lotId: lot.id, allocatedQty: plan.allocatedQty });
            if (lot.metal === 'GOLD') {
                goldLotIds.push(lot.id);
                for (const r of plan.ranges)
                    ranges.push({ lotId: lot.id, ...r });
            }
            summary.lotsChecked++;
            summary.salesLinked += cited.length;
            if (plan.overBy > 0)
                summary.overAllocated++;
            if ((0, tradesheet_allocation_1.soldMismatch)(lot, plan.allocatedQty))
                summary.soldMismatches++;
        }
        if (unlink.length > 0) {
            await tx.$executeRaw `UPDATE trades SET "lotId" = NULL
                FROM unnest(${unlink.map((u) => u.lotId)}::int[], ${unlink.map((u) => u.key)}::text[]) AS v(lot_id, key)
                WHERE trades."lotId" = v.lot_id AND (trades."lotKey" IS NULL OR trades."lotKey" <> v.key)`;
        }
        if (orphanIds.length > 0) {
            await tx.trade.updateMany({
                where: { id: { in: orphanIds } },
                data: { lotId: null },
            });
        }
        if (link.length > 0) {
            await tx.$executeRaw `UPDATE trades SET "lotId" = v.lot_id
                FROM unnest(${link.map((l) => l.tradeId)}::int[], ${link.map((l) => l.lotId)}::int[]) AS v(trade_id, lot_id)
                WHERE trades.id = v.trade_id`;
        }
        if (totals.length > 0) {
            await tx.$executeRaw `UPDATE purchase_lots SET "allocatedQty" = v.qty
                FROM unnest(${totals.map((t) => t.lotId)}::int[], ${totals.map((t) => t.allocatedQty)}::int[]) AS v(lot_id, qty)
                WHERE purchase_lots.id = v.lot_id`;
        }
        if (goldLotIds.length > 0) {
            await tx.stockUnit.updateMany({
                where: { lotId: { in: goldLotIds } },
                data: { tradeId: null },
            });
        }
        if (ranges.length > 0) {
            await tx.$executeRaw `UPDATE stock_units SET "tradeId" = v.trade_id
                FROM unnest(${ranges.map((r) => r.lotId)}::int[], ${ranges.map((r) => r.fromSeq)}::int[], ${ranges.map((r) => r.toSeq)}::int[], ${ranges.map((r) => r.tradeId)}::int[]) AS v(lot_id, from_seq, to_seq, trade_id)
                WHERE stock_units."lotId" = v.lot_id AND stock_units.seq BETWEEN v.from_seq AND v.to_seq`;
        }
        return summary;
    }
    async build(dto, db) {
        const products = await this.loadProducts(db);
        const branches = await db.branch.findMany({
            select: { id: true, name: true },
        });
        const branchIds = {};
        for (const b of branches)
            branchIds[b.name.trim().toUpperCase()] = b.id;
        const recs = [];
        for (const tab of dto.tabs) {
            const parsed = (0, tradesheet_import_plan_1.parseTab)(tab, products, dto.source);
            const read = parsed.kind !== null && parsed.problems.length === 0;
            const trades = read && parsed.sales.length + parsed.lots.length > 0
                ? await this.existingTrades(db, parsed, dto.sheetMonth)
                : [];
            const lots = read && parsed.sales.length + parsed.lots.length > 0
                ? await this.existingLots(db, parsed, dto.sheetMonth)
                : [];
            recs.push((0, tradesheet_import_plan_1.reconcileTab)(parsed, dto.sheetMonth, trades, lots));
        }
        return {
            plan: (0, tradesheet_import_plan_1.summarise)(dto.fileName, dto.sheetMonth, recs, products.decisions && products.decisions.length > 0
                ? []
                : [
                    'No saved product-name decisions yet: products are matched by built-in rules only.',
                ]),
            recs,
            branchIds,
        };
    }
    async loadProducts(db) {
        const [catalogue, aliases, sales] = await Promise.all([
            db.product.findMany({
                where: { deletedAt: null },
                orderBy: { id: 'asc' },
                select: { id: true, sku: true, metalType: true },
            }),
            db.productAlias.findMany({
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
            db.salesProduct.findMany({
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
        ]);
        return {
            catalogue,
            salesProducts: sales,
            decisions: aliases.map((a) => ({
                key: a.alias,
                productId: a.productId,
                salesProductId: a.salesProductId,
                noProduct: a.noProduct,
                decidedBy: a.decidedBy,
                metalHint: a.metalHint,
            })),
        };
    }
    async existingTrades(db, parsed, sheetMonth) {
        const rows = await db.trade.findMany({
            where: {
                OR: [
                    {
                        referenceKey: {
                            in: parsed.sales.map((s) => s.referenceKey),
                        },
                    },
                    { sourceMonth: sheetMonth, sourceTab: parsed.name },
                ],
            },
        });
        return rows.map((r) => ({
            id: r.id,
            referenceKey: r.referenceKey,
            occurrence: r.occurrence,
            fingerprint: r.fingerprint,
            missingFromImport: r.missingFromImport,
            sourceMonth: r.sourceMonth,
            sourceTab: r.sourceTab,
            client: r.client,
            qty: r.qty,
            productText: r.productText,
            cptyRaw: r.cptyRaw,
            state: r.state,
            collected: r.collected,
            cost: num(r.cost),
            receipt: num(r.receipt),
            notes: r.notes,
            lotKey: r.lotKey,
            productKey: r.productKey,
            productId: r.productId,
            issues: r.issues,
        }));
    }
    async existingLots(db, parsed, sheetMonth) {
        const rows = await db.purchaseLot.findMany({
            where: {
                OR: [
                    {
                        referenceKey: {
                            in: parsed.lots.map((l) => l.referenceKey),
                        },
                    },
                    { sourceMonth: sheetMonth, sourceTab: parsed.name },
                ],
            },
        });
        return rows.map((r) => ({
            id: r.id,
            referenceKey: r.referenceKey,
            occurrence: r.occurrence,
            fingerprint: r.fingerprint,
            missingFromImport: r.missingFromImport,
            sourceMonth: r.sourceMonth,
            sourceTab: r.sourceTab,
            client: r.client,
            qty: r.qty,
            productText: r.productText,
            pricePaid: num(r.pricePaid),
            hedgedAt: num(r.hedgedAt),
            commentsRaw: r.commentsRaw,
            productKey: r.productKey,
            productId: r.productId,
            issues: r.issues,
        }));
    }
    tradeData(r, tab, sheetMonth, batchId, branchIds) {
        const p = r.parsed;
        return {
            reference: p.reference,
            referenceKey: r.referenceKey,
            occurrence: r.occurrence,
            metal: r.metal,
            branchCode: p.branchCode,
            branchId: p.branchCode
                ? (branchIds[p.branchCode.toUpperCase()] ?? null)
                : null,
            initials: p.initials,
            client: p.client,
            qty: r.qty,
            productText: p.product,
            productKey: r.productKey,
            productId: r.productId,
            date: toDate(p.date),
            spot: dec(p.spot, 8),
            cptyRaw: p.cpty.raw || null,
            cptyKind: p.cpty.kind,
            state: p.state,
            stateFromColour: p.stateFromColour,
            lotKey: p.cpty.lotKey ?? null,
            supplierName: p.cpty.supplier ?? null,
            supplierInvoice: p.cpty.supplierInvoice ?? null,
            collected: p.collected.collected,
            collectedSource: p.collected.source,
            collectedOn: toDate(p.collected.date),
            deferredFrom: p.deferred.from,
            deferredTo: p.deferred.to,
            cost: dec(p.cost),
            receipt: dec(p.receipt),
            profit: dec(p.profit),
            margin: dec(p.margin, 4),
            vatDue: dec(p.vatDue),
            totalPrice: dec(p.totalPrice),
            netHedging: dec(p.netHedging),
            boughtAt: dec(p.boughtAt),
            soldAt: dec(p.soldAt),
            paid: p.paid,
            notes: p.notes,
            hedgingNotes: p.hedgingNotes,
            sourceMonth: sheetMonth,
            sourceTab: tab,
            sourceRow: p.sourceRow,
            fingerprint: p.fingerprint,
            missingFromImport: false,
            issues: r.issues,
            lastBatchId: batchId,
        };
    }
    async writeTrades(tx, rec, sheetMonth, batchId, branchIds) {
        const added = rec.sales.filter((s) => s.status === 'ADDED');
        if (added.length > 0) {
            await tx.trade.createMany({
                data: added.map((s) => ({
                    ...this.tradeData(s, rec.name, sheetMonth, batchId, branchIds),
                    firstBatchId: batchId,
                })),
            });
        }
        for (const s of rec.sales) {
            if ((s.status === 'CHANGED' || s.status === 'RESTORED') &&
                s.existing) {
                await tx.trade.update({
                    where: { id: s.existing.id },
                    data: this.tradeData(s, rec.name, sheetMonth, batchId, branchIds),
                });
            }
        }
        for (const s of rec.sales) {
            if ((0, tradesheet_import_plan_1.needsProductRefresh)(s) && s.existing) {
                await tx.trade.update({
                    where: { id: s.existing.id },
                    data: {
                        productKey: s.productKey,
                        productId: s.productId,
                        issues: s.issues,
                    },
                });
            }
        }
        if (rec.missingTradeIds.length > 0) {
            await tx.trade.updateMany({
                where: { id: { in: rec.missingTradeIds } },
                data: { missingFromImport: true },
            });
        }
    }
    lotData(r, tab, sheetMonth, batchId, branchIds) {
        const p = r.parsed;
        return {
            reference: p.reference,
            referenceKey: r.referenceKey,
            occurrence: r.occurrence,
            metal: r.metal,
            branchCode: p.branchCode,
            branchId: p.branchCode
                ? (branchIds[p.branchCode.toUpperCase()] ?? null)
                : null,
            client: p.client,
            qty: r.qty,
            productText: p.product,
            productKey: r.productKey,
            productId: r.productId,
            received: toDate(p.received),
            datePaid: toDate(p.datePaid),
            pricePaid: dec(p.pricePaid),
            pricePerItem: dec(p.pricePerItem),
            hedgedAt: dec(p.hedgedAt),
            melt: p.melt,
            commentsRaw: p.comments,
            commentSoldQty: p.sold.soldCount,
            commentAllSold: p.sold.allSold,
            commentReview: p.sold.review,
            sourceMonth: sheetMonth,
            sourceTab: tab,
            sourceRow: p.sourceRow,
            fingerprint: p.fingerprint,
            missingFromImport: false,
            issues: r.issues,
            lastBatchId: batchId,
        };
    }
    async writeLots(tx, rec, sheetMonth, batchId, branchIds) {
        const added = rec.lots.filter((l) => l.status === 'ADDED');
        if (added.length > 0) {
            const created = await tx.purchaseLot.createManyAndReturn({
                data: added.map((l) => ({
                    ...this.lotData(l, rec.name, sheetMonth, batchId, branchIds),
                    firstBatchId: batchId,
                })),
                select: { id: true, referenceKey: true, occurrence: true },
            });
            const idBySlot = new Map(created.map((c) => [`${c.referenceKey}#${c.occurrence}`, c.id]));
            const units = [];
            for (const l of added) {
                const id = idBySlot.get(`${l.referenceKey}#${l.occurrence}`);
                if (id === undefined || l.metal !== 'GOLD')
                    continue;
                for (let seq = 1; seq <= (l.qty ?? 0); seq++)
                    units.push({ lotId: id, seq });
            }
            if (units.length > 0)
                await tx.stockUnit.createMany({ data: units });
        }
        for (const l of rec.lots) {
            if ((l.status === 'CHANGED' || l.status === 'RESTORED') &&
                l.existing) {
                await tx.purchaseLot.update({
                    where: { id: l.existing.id },
                    data: this.lotData(l, rec.name, sheetMonth, batchId, branchIds),
                });
                await this.syncUnits(tx, l.existing.id, l.qty, l.metal);
            }
        }
        for (const l of rec.lots) {
            if ((0, tradesheet_import_plan_1.needsProductRefresh)(l) && l.existing) {
                await tx.purchaseLot.update({
                    where: { id: l.existing.id },
                    data: {
                        productKey: l.productKey,
                        productId: l.productId,
                        issues: l.issues,
                    },
                });
            }
        }
        if (rec.missingLotIds.length > 0) {
            await tx.purchaseLot.updateMany({
                where: { id: { in: rec.missingLotIds } },
                data: { missingFromImport: true },
            });
        }
    }
    async syncUnits(tx, lotId, qty, metal) {
        if (metal !== 'GOLD')
            return;
        const target = qty ?? 0;
        const have = await tx.stockUnit.count({ where: { lotId } });
        if (have < target) {
            await tx.stockUnit.createMany({
                data: Array.from({ length: target - have }, (_, i) => ({
                    lotId,
                    seq: have + i + 1,
                })),
            });
        }
        else if (have > target) {
            await tx.stockUnit.deleteMany({
                where: { lotId, tradeId: null, seq: { gt: target } },
            });
        }
    }
};
exports.TradesheetImportService = TradesheetImportService;
exports.TradesheetImportService = TradesheetImportService = TradesheetImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        product_names_service_1.ProductNamesService,
        notifications_service_1.NotificationsService])
], TradesheetImportService);
//# sourceMappingURL=tradesheet-import.service.js.map