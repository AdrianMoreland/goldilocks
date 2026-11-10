import { BadRequestException, Injectable } from '@nestjs/common';
import type {
    AllocationSummary,
    RowResolverData,
    TradesheetImportPlan,
    TradesheetImportRequest,
    TradesheetImportResult,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { Decimal } from '../../../prisma/generated/internal/prismaNamespace';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import {
    parseTab,
    reconcileTab,
    needsProductRefresh,
    summarise,
    type ExistingLot,
    type ExistingTrade,
    type PlannedLot,
    type PlannedSale,
    type TabReconciliation,
} from './tradesheet-import.plan';
import { planLotAllocation, soldMismatch } from './tradesheet-allocation';

type Db = Prisma.TransactionClient;

const toDate = (iso: string | null | undefined) =>
    iso ? new Date(`${iso}T00:00:00.000Z`) : null;

/**
 * The sheet's number as a Decimal, or null when it would not fit the column. A figure that overflows a column
 * is a typo in the sheet; losing one cell is better than failing a whole month's import.
 */
const dec = (n: number | null, integerDigits = 10): Decimal | null =>
    n === null || !Number.isFinite(n) || Math.abs(n) >= 10 ** integerDigits
        ? null
        : new Decimal(String(n));

const num = (d: { toString(): string } | null): number | null =>
    d === null ? null : Number(d.toString());

interface Built {
    plan: TradesheetImportPlan;
    recs: TabReconciliation[];
    branchIds: Record<string, number>;
}

/**
 * Mirrors the monthly trade sheets. The sheets stay the source: a reimport updates a row by its reference, adds
 * new rows, and flags (never deletes) rows the file no longer contains. Admin only; the controller enforces it.
 */
@Injectable()
export class TradesheetImportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    /** What an import would do. Writes nothing. */
    async preview(dto: TradesheetImportRequest): Promise<TradesheetImportPlan> {
        return (await this.build(dto, this.prisma)).plan;
    }

    async commit(
        dto: TradesheetImportRequest,
        actor: string,
    ): Promise<TradesheetImportResult> {
        return this.prisma.$transaction(
            async (tx) => {
                // Planned again inside the transaction, so what is written is what is on the table now.
                const built = await this.build(dto, tx);
                if (
                    !built.recs.some(
                        (r) => r.kind !== null && r.problems.length === 0,
                    )
                ) {
                    throw new BadRequestException(
                        'None of the tabs in this file could be read.',
                    );
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
                    await this.writeTrades(
                        tx,
                        rec,
                        dto.sheetMonth,
                        batch.id,
                        built.branchIds,
                    );
                    await this.writeLots(
                        tx,
                        rec,
                        dto.sheetMonth,
                        batch.id,
                        built.branchIds,
                    );
                }
                const allocation = await this.allocate(tx, built.recs);
                const t = built.plan.totals;
                await this.audit.record(
                    actor,
                    'tradesheet-import',
                    `${dto.fileName} (${dto.sheetMonth}): ${t.added} added, ${t.changed + t.restored} updated, ${t.refreshed} products filled, ${t.missing} missing, ${t.flagged} flagged; ${allocation.salesLinked} sales linked, ${allocation.lotNotImported} to a lot not imported`,
                    tx,
                );
                return { batchId: batch.id, plan: built.plan, allocation };
            },
            // Backstop: the API is ~140 ms from the database, so even batched, a big file needs room.
            { timeout: 300_000, maxWait: 10_000 },
        );
    }

    // --- matching sales to lots --------------------------------------------------------

    /**
     * Links each sale to the lot its CPTY names and works out what every touched lot has given away. Only lots
     * and sales this import changed are looked at: a lot is rechecked when it changed or when a sale citing it
     * was added, changed or moved to another lot. Sales that are flagged missing keep their items until a
     * person confirms they are gone.
     */
    private async allocate(
        tx: Db,
        recs: TabReconciliation[],
    ): Promise<AllocationSummary> {
        const keys = new Set<string>();
        for (const rec of recs) {
            for (const s of rec.sales) {
                if (s.status === 'UNCHANGED') continue;
                if (s.parsed.cpty.lotKey) keys.add(s.parsed.cpty.lotKey);
                if (s.existing?.lotKey) keys.add(s.existing.lotKey);
            }
            for (const l of rec.lots) {
                if (l.status !== 'UNCHANGED') keys.add(l.referenceKey);
            }
        }
        const summary: AllocationSummary = {
            lotsChecked: 0,
            salesLinked: 0,
            lotNotImported: 0,
            overAllocated: 0,
            soldMismatches: 0,
        };
        if (keys.size === 0) return summary;

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

        // With a repeated lot reference the first occurrence is the one sales are linked to.
        const lotByKey = new Map<string, (typeof lots)[number]>();
        for (const lot of lots) {
            if (!lotByKey.has(lot.referenceKey))
                lotByKey.set(lot.referenceKey, lot);
        }

        // Collected per lot, then written in a few set-based queries: each query is a round trip to the database.
        const unlink: Array<{ lotId: number; key: string }> = [];
        const link: Array<{ tradeId: number; lotId: number }> = [];
        const orphanIds: number[] = [];
        const totals: Array<{ lotId: number; allocatedQty: number }> = [];
        const goldLotIds: number[] = [];
        const ranges: Array<{
            lotId: number;
            fromSeq: number;
            toSeq: number;
            tradeId: number;
        }> = [];

        for (const key of lotKeys) {
            const lot = lotByKey.get(key);
            const cited = sales.filter((s) => s.lotKey === key);

            if (!lot) {
                for (const s of cited) orphanIds.push(s.id);
                summary.lotNotImported += cited.length;
                continue;
            }
            unlink.push({ lotId: lot.id, key });
            for (const s of cited) link.push({ tradeId: s.id, lotId: lot.id });

            const plan = planLotAllocation(lot.qty, cited);
            totals.push({ lotId: lot.id, allocatedQty: plan.allocatedQty });
            // Silver has no per-item rows yet; its quantity is tracked on the lot alone.
            if (lot.metal === 'GOLD') {
                goldLotIds.push(lot.id);
                for (const r of plan.ranges)
                    ranges.push({ lotId: lot.id, ...r });
            }
            summary.lotsChecked++;
            summary.salesLinked += cited.length;
            if (plan.overBy > 0) summary.overAllocated++;
            if (soldMismatch(lot, plan.allocatedQty)) summary.soldMismatches++;
        }

        // A sale that used to point at a lot but now names another one stops pointing there.
        if (unlink.length > 0) {
            await tx.$executeRaw`UPDATE trades SET "lotId" = NULL
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
            await tx.$executeRaw`UPDATE trades SET "lotId" = v.lot_id
                FROM unnest(${link.map((l) => l.tradeId)}::int[], ${link.map((l) => l.lotId)}::int[]) AS v(trade_id, lot_id)
                WHERE trades.id = v.trade_id`;
        }
        if (totals.length > 0) {
            await tx.$executeRaw`UPDATE purchase_lots SET "allocatedQty" = v.qty
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
            await tx.$executeRaw`UPDATE stock_units SET "tradeId" = v.trade_id
                FROM unnest(${ranges.map((r) => r.lotId)}::int[], ${ranges.map((r) => r.fromSeq)}::int[], ${ranges.map((r) => r.toSeq)}::int[], ${ranges.map((r) => r.tradeId)}::int[]) AS v(lot_id, from_seq, to_seq, trade_id)
                WHERE stock_units."lotId" = v.lot_id AND stock_units.seq BETWEEN v.from_seq AND v.to_seq`;
        }
        return summary;
    }

    // --- planning ---------------------------------------------------------------------

    private async build(dto: TradesheetImportRequest, db: Db): Promise<Built> {
        const products = await this.loadProducts(db);
        // A branch is named by the two-letter code the sheets use (DU, CO, BL, BC), so its name is its code.
        const branches = await db.branch.findMany({
            select: { id: true, name: true },
        });
        const branchIds: Record<string, number> = {};
        for (const b of branches) branchIds[b.name.trim().toUpperCase()] = b.id;

        const recs: TabReconciliation[] = [];
        for (const tab of dto.tabs) {
            const parsed = parseTab(tab, products, dto.source);
            const read = parsed.kind !== null && parsed.problems.length === 0;
            const trades =
                read && parsed.sales.length + parsed.lots.length > 0
                    ? await this.existingTrades(db, parsed, dto.sheetMonth)
                    : [];
            const lots =
                read && parsed.sales.length + parsed.lots.length > 0
                    ? await this.existingLots(db, parsed, dto.sheetMonth)
                    : [];
            recs.push(reconcileTab(parsed, dto.sheetMonth, trades, lots));
        }
        return {
            plan: summarise(
                dto.fileName,
                dto.sheetMonth,
                recs,
                products.decisions && products.decisions.length > 0
                    ? []
                    : [
                          'No saved product-name decisions yet: products are matched by built-in rules only.',
                      ],
            ),
            recs,
            branchIds,
        };
    }

    private async loadProducts(db: Db): Promise<RowResolverData> {
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
            })),
        };
    }

    private async existingTrades(
        db: Db,
        parsed: { name: string; sales: Array<{ referenceKey: string }> },
        sheetMonth: string,
    ): Promise<ExistingTrade[]> {
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

    private async existingLots(
        db: Db,
        parsed: { name: string; lots: Array<{ referenceKey: string }> },
        sheetMonth: string,
    ): Promise<ExistingLot[]> {
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

    // --- writing ----------------------------------------------------------------------

    private tradeData(
        r: PlannedSale,
        tab: string,
        sheetMonth: string,
        batchId: number,
        branchIds: Record<string, number>,
    ) {
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

    private async writeTrades(
        tx: Db,
        rec: TabReconciliation,
        sheetMonth: string,
        batchId: number,
        branchIds: Record<string, number>,
    ) {
        const added = rec.sales.filter((s) => s.status === 'ADDED');
        if (added.length > 0) {
            await tx.trade.createMany({
                data: added.map((s) => ({
                    ...this.tradeData(
                        s,
                        rec.name,
                        sheetMonth,
                        batchId,
                        branchIds,
                    ),
                    firstBatchId: batchId,
                })),
            });
        }
        for (const s of rec.sales) {
            if (
                (s.status === 'CHANGED' || s.status === 'RESTORED') &&
                s.existing
            ) {
                await tx.trade.update({
                    where: { id: s.existing.id },
                    data: this.tradeData(
                        s,
                        rec.name,
                        sheetMonth,
                        batchId,
                        branchIds,
                    ),
                });
            }
        }
        // An unchanged row keeps its data but picks up a better product match.
        for (const s of rec.sales) {
            if (needsProductRefresh(s) && s.existing) {
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

    private lotData(
        r: PlannedLot,
        tab: string,
        sheetMonth: string,
        batchId: number,
        branchIds: Record<string, number>,
    ) {
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

    private async writeLots(
        tx: Db,
        rec: TabReconciliation,
        sheetMonth: string,
        batchId: number,
        branchIds: Record<string, number>,
    ) {
        const added = rec.lots.filter((l) => l.status === 'ADDED');
        if (added.length > 0) {
            const created = await tx.purchaseLot.createManyAndReturn({
                data: added.map((l) => ({
                    ...this.lotData(
                        l,
                        rec.name,
                        sheetMonth,
                        batchId,
                        branchIds,
                    ),
                    firstBatchId: batchId,
                })),
                select: { id: true, referenceKey: true, occurrence: true },
            });
            const idBySlot = new Map(
                created.map((c) => [`${c.referenceKey}#${c.occurrence}`, c.id]),
            );
            // A new lot has no units yet, so all of them go in one insert without counting first.
            const units: Array<{ lotId: number; seq: number }> = [];
            for (const l of added) {
                const id = idBySlot.get(`${l.referenceKey}#${l.occurrence}`);
                if (id === undefined || l.metal !== 'GOLD') continue;
                for (let seq = 1; seq <= (l.qty ?? 0); seq++)
                    units.push({ lotId: id, seq });
            }
            if (units.length > 0)
                await tx.stockUnit.createMany({ data: units });
        }
        for (const l of rec.lots) {
            if (
                (l.status === 'CHANGED' || l.status === 'RESTORED') &&
                l.existing
            ) {
                await tx.purchaseLot.update({
                    where: { id: l.existing.id },
                    data: this.lotData(
                        l,
                        rec.name,
                        sheetMonth,
                        batchId,
                        branchIds,
                    ),
                });
                await this.syncUnits(tx, l.existing.id, l.qty, l.metal);
            }
        }
        for (const l of rec.lots) {
            if (needsProductRefresh(l) && l.existing) {
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

    /**
     * Gold gets one stock row per item at purchase (silver stays at lot quantity for now). If the quantity changes in
     * the sheet, rows are added or the highest unallocated ones removed. An item already sold is never removed.
     */
    private async syncUnits(
        tx: Db,
        lotId: number,
        qty: number | null,
        metal: 'GOLD' | 'SILVER',
    ): Promise<void> {
        if (metal !== 'GOLD') return;
        const target = qty ?? 0;
        const have = await tx.stockUnit.count({ where: { lotId } });
        if (have < target) {
            await tx.stockUnit.createMany({
                data: Array.from({ length: target - have }, (_, i) => ({
                    lotId,
                    seq: have + i + 1,
                })),
            });
        } else if (have > target) {
            await tx.stockUnit.deleteMany({
                where: { lotId, tradeId: null, seq: { gt: target } },
            });
        }
    }
}
