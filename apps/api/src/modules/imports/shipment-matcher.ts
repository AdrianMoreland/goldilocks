import type { Prisma } from '../../../prisma/generated/client';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';

type Db = Prisma.TransactionClient | PrismaService;

/** Link type and tables of a shipment-to-sale link. One link per (shipment, BC item): a shipment can hold several sales. */
export const SHIPMENT_LINK = {
    linkType: 'bc_trade',
    fromTable: 'bc_shipments',
    toTable: 'trades',
} as const;

/** How far before the collection a sale can be; collection usually follows the sale within weeks. */
const WINDOW_BEFORE_DAYS = 120;
/** Sheets are sometimes filled in a day or two after BC posts. */
const WINDOW_AFTER_DAYS = 3;
const DAY = 86_400_000;
/** At most this many sales are suggested for one shipment line. */
const MAX_SUGGESTIONS = 3;

/** The key a link stores for a sale: the workbook key when it has one, else its id. */
export function tradeLinkKey(t: {
    id: number;
    sourceKey: string | null;
}): string {
    return t.sourceKey ?? `trade#${t.id}`;
}

/** The sale a stored link key names. */
export async function tradeIdOfKey(
    db: Db,
    key: string,
): Promise<number | null> {
    const m = key.match(/^trade#(\d+)$/);
    if (m) return Number(m[1]);
    const t = await db.trade.findFirst({
        where: { sourceKey: key },
        select: { id: true },
    });
    return t?.id ?? null;
}

/** The amount BC took agrees with the sheet's receipt: within €1 or 0.5%, with or without 23% VAT. */
export function amountAgrees(
    receipt: number | null,
    bcAmount: number,
): boolean {
    if (receipt === null || bcAmount <= 0) return false;
    const tol = Math.max(1, bcAmount * 0.005);
    return (
        Math.abs(receipt - bcAmount) <= tol ||
        Math.abs(receipt - bcAmount * 1.23) <= tol * 1.23
    );
}

export interface ShipmentLine {
    shipmentNo: string;
    itemNo: string;
    customerId: number;
    postedOn: Date;
    productId: number | null;
    qty: number;
    amount: number;
}

export interface SaleCandidate {
    id: number;
    sourceKey: string | null;
    customerId: number | null;
    client: string;
    date: Date | null;
    productId: number | null;
    qty: number | null;
    receipt: number | null;
}

export type LineDecision =
    | { outcome: 'LINK'; trade: SaleCandidate }
    | { outcome: 'SUGGEST'; trades: SaleCandidate[]; note: string }
    | { outcome: 'NONE'; reason: string };

/**
 * One shipment line against the sales it could be. A sale fits when it is the same customer (by id, or by the name
 * a tradesheet row carries), the same product and quantity, and dated up to 120 days before the collection. One fit
 * whose amount also agrees is linked; anything less certain is suggested for a person to confirm.
 */
export function decideLine(
    line: ShipmentLine,
    candidates: readonly SaleCandidate[],
    customerName: string | null,
    taken: ReadonlySet<number>,
): LineDecision {
    if (line.productId === null)
        return { outcome: 'NONE', reason: 'BC_ITEM_HAS_NO_PRODUCT' };
    const name = customerName?.trim().toLowerCase() ?? null;
    const from = line.postedOn.getTime() - WINDOW_BEFORE_DAYS * DAY;
    const to = line.postedOn.getTime() + WINDOW_AFTER_DAYS * DAY;
    const fits = candidates.filter(
        (t) =>
            !taken.has(t.id) &&
            (t.customerId === line.customerId ||
                (t.customerId === null &&
                    name !== null &&
                    t.client.trim().toLowerCase() === name)) &&
            t.productId === line.productId &&
            t.qty === line.qty &&
            t.date !== null &&
            t.date.getTime() >= from &&
            t.date.getTime() <= to,
    );
    const agreeing = fits.filter((t) => amountAgrees(t.receipt, line.amount));
    if (agreeing.length === 1) return { outcome: 'LINK', trade: agreeing[0] };
    if (fits.length === 0) return { outcome: 'NONE', reason: 'NO_SALE_FITS' };
    // Closest in time first.
    const ranked = [...fits].sort(
        (a, b) =>
            Math.abs(a.date!.getTime() - line.postedOn.getTime()) -
            Math.abs(b.date!.getTime() - line.postedOn.getTime()),
    );
    if (fits.length === 1)
        return {
            outcome: 'SUGGEST',
            trades: ranked,
            note: 'AMOUNT_DIFFERS',
        };
    return {
        outcome: 'SUGGEST',
        trades: ranked.slice(0, MAX_SUGGESTIONS),
        note: 'SEVERAL_SALES_FIT',
    };
}

export interface MatchCounts {
    /** Shipment lines linked to a sale by customer, product, quantity and amount. */
    linked: number;
    /** Shipment lines with sales suggested in the Review tab. */
    suggested: number;
    /** Shipment lines with no sale that fits. */
    unmatched: number;
}

/**
 * Matches the shipments that have no sale yet (no tradesheet reference, no Zoho invoice) and that are not already
 * linked or waiting in review. Writes nothing when `dry`.
 */
export async function matchShipments(
    db: Db,
    dry: boolean,
): Promise<MatchCounts> {
    const counts: MatchCounts = { linked: 0, suggested: 0, unmatched: 0 };
    const shipments = await db.bcShipment.findMany({
        where: {
            tradeId: null,
            zohoInvoiceId: null,
            customerId: { not: null },
            missingFromImport: false,
            postingDate: { not: null },
        },
        select: { no: true, customerId: true, postingDate: true },
    });
    if (shipments.length === 0) return counts;

    const existing = await db.entityLink.findMany({
        where: {
            linkType: SHIPMENT_LINK.linkType,
            fromTable: SHIPMENT_LINK.fromTable,
            status: { in: ['PENDING', 'CONFIRMED'] },
        },
        select: { fromKey: true, toKey: true, status: true },
    });
    const handled = new Set(existing.map((l) => l.fromKey));

    const ledger = await db.bcLedgerEntry.findMany({
        where: {
            documentNo: { in: shipments.map((s) => s.no) },
            entryType: 'Sale',
        },
        select: {
            documentNo: true,
            itemNo: true,
            quantity: true,
            salesAmount: true,
        },
    });
    const items = await db.bcItem.findMany({
        where: { itemNo: { in: [...new Set(ledger.map((l) => l.itemNo))] } },
        select: { itemNo: true, productId: true },
    });
    const productOf = new Map(items.map((i) => [i.itemNo, i.productId]));
    const byNo = new Map(shipments.map((s) => [s.no, s]));

    const groups = new Map<string, ShipmentLine>();
    for (const l of ledger) {
        const s = byNo.get(l.documentNo)!;
        const key = `${l.documentNo}|${l.itemNo}`;
        if (handled.has(key)) continue;
        const g = groups.get(key) ?? {
            shipmentNo: l.documentNo,
            itemNo: l.itemNo,
            customerId: s.customerId!,
            postedOn: s.postingDate!,
            productId: productOf.get(l.itemNo) ?? null,
            qty: 0,
            amount: 0,
        };
        g.qty += Math.abs(Number(l.quantity));
        g.amount += Number(l.salesAmount ?? 0);
        groups.set(key, g);
    }
    if (groups.size === 0) return counts;

    const customerIds = [
        ...new Set([...groups.values()].map((g) => g.customerId)),
    ];
    const customers = await db.customer.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true },
    });
    const nameOf = new Map(customers.map((c) => [c.id, c.name]));
    const earliest = Math.min(
        ...[...groups.values()].map((g) => g.postedOn.getTime()),
    );
    const trades = await db.trade.findMany({
        where: {
            state: { not: 'QUOTE' },
            missingFromImport: false,
            date: { gte: new Date(earliest - WINDOW_BEFORE_DAYS * DAY) },
            OR: [
                { customerId: { in: customerIds } },
                {
                    customerId: null,
                    client: {
                        in: customers.map((c) => c.name),
                        mode: 'insensitive',
                    },
                },
            ],
        },
        select: {
            id: true,
            sourceKey: true,
            customerId: true,
            client: true,
            date: true,
            productId: true,
            qty: true,
            receipt: true,
        },
    });
    const candidates: SaleCandidate[] = trades.map((t) => ({
        ...t,
        receipt: t.receipt === null ? null : Number(t.receipt),
    }));

    // Sales already linked to a shipment, by reference or by an earlier match.
    const taken = new Set<number>(
        (
            await db.bcShipment.findMany({
                where: { tradeId: { not: null } },
                select: { tradeId: true },
            })
        ).map((s) => s.tradeId!),
    );
    for (const l of existing.filter((x) => x.status === 'CONFIRMED')) {
        const id = await tradeIdOfKey(db, l.toKey);
        if (id !== null) taken.add(id);
    }

    // Lines in collection order, so an earlier collection claims its sale first.
    const ordered = [...groups.values()].sort(
        (a, b) => a.postedOn.getTime() - b.postedOn.getTime(),
    );
    for (const line of ordered) {
        const d = decideLine(
            line,
            candidates,
            nameOf.get(line.customerId) ?? null,
            taken,
        );
        const fromKey = `${line.shipmentNo}|${line.itemNo}`;
        if (d.outcome === 'NONE') {
            counts.unmatched++;
            continue;
        }
        if (d.outcome === 'LINK') {
            counts.linked++;
            taken.add(d.trade.id);
            if (!dry) {
                await db.entityLink.createMany({
                    data: [
                        {
                            ...SHIPMENT_LINK,
                            fromKey,
                            toKey: tradeLinkKey(d.trade),
                            method: 'CUSTOMER_PRODUCT_QTY_AMOUNT',
                            confidence: 'EXACT',
                            status: 'CONFIRMED',
                            confirmedBy: 'import',
                            confirmedAt: new Date(),
                        },
                    ],
                    skipDuplicates: true,
                });
                await applyShipmentLink(db, fromKey, d.trade.id);
            }
            continue;
        }
        counts.suggested++;
        if (!dry)
            await db.entityLink.createMany({
                data: d.trades.map((t) => ({
                    ...SHIPMENT_LINK,
                    fromKey,
                    toKey: tradeLinkKey(t),
                    method: 'CUSTOMER_PRODUCT_QTY',
                    confidence: 'PROBABLE' as const,
                    status: 'PENDING' as const,
                    note: d.note,
                })),
                skipDuplicates: true,
            });
    }
    return counts;
}

/**
 * A confirmed shipment-to-sale link takes effect: the shipment points at the sale (when it has none yet) and the
 * collection events of that item on that shipment name the sale.
 */
export async function applyShipmentLink(
    db: Db,
    fromKey: string,
    tradeId: number,
): Promise<void> {
    const [shipmentNo, itemNo] = fromKey.split('|');
    if (!shipmentNo || !itemNo) return;
    await db.bcShipment.updateMany({
        where: { no: shipmentNo, tradeId: null },
        data: { tradeId },
    });
    await db.itemEvent.updateMany({
        where: {
            sourceRef: shipmentNo,
            tradeId: null,
            item: { bcItemNo: itemNo },
        },
        data: { tradeId },
    });
}
