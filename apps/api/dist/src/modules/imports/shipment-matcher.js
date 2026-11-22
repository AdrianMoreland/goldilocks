"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHIPMENT_LINK = void 0;
exports.tradeLinkKey = tradeLinkKey;
exports.tradeIdOfKey = tradeIdOfKey;
exports.amountAgrees = amountAgrees;
exports.amountExact = amountExact;
exports.decideLine = decideLine;
exports.matchShipments = matchShipments;
exports.applyShipmentLink = applyShipmentLink;
exports.SHIPMENT_LINK = {
    linkType: 'bc_trade',
    fromTable: 'bc_shipments',
    toTable: 'trades',
};
const WINDOW_BEFORE_DAYS = 120;
const WINDOW_AFTER_DAYS = 3;
const DAY = 86_400_000;
const MAX_SUGGESTIONS = 3;
function tradeLinkKey(t) {
    return t.sourceKey ?? `trade#${t.id}`;
}
async function tradeIdOfKey(db, key) {
    const m = key.match(/^trade#(\d+)$/);
    if (m)
        return Number(m[1]);
    const t = await db.trade.findFirst({
        where: { sourceKey: key },
        select: { id: true },
    });
    return t?.id ?? null;
}
function amountAgrees(receipt, bcAmount) {
    if (receipt === null || bcAmount <= 0)
        return false;
    const tol = Math.max(1, bcAmount * 0.005);
    return (Math.abs(receipt - bcAmount) <= tol ||
        Math.abs(receipt - bcAmount * 1.23) <= tol * 1.23);
}
function amountExact(receipt, bcAmount) {
    if (receipt === null || bcAmount <= 0)
        return false;
    return (Math.abs(receipt - bcAmount) < 0.01 ||
        Math.abs(receipt - bcAmount * 1.23) < 0.01);
}
function decideLine(line, candidates, customerName, taken) {
    if (line.productId === null)
        return { outcome: 'NONE', reason: 'BC_ITEM_HAS_NO_PRODUCT' };
    const name = customerName?.trim().toLowerCase() ?? null;
    const from = line.postedOn.getTime() - WINDOW_BEFORE_DAYS * DAY;
    const to = line.postedOn.getTime() + WINDOW_AFTER_DAYS * DAY;
    const fits = candidates.filter((t) => !taken.has(t.id) &&
        (t.customerId === line.customerId ||
            (t.customerId === null &&
                name !== null &&
                t.client.trim().toLowerCase() === name)) &&
        t.productId === line.productId &&
        t.qty === line.qty &&
        t.date !== null &&
        t.date.getTime() >= from &&
        t.date.getTime() <= to);
    const agreeing = fits.filter((t) => amountAgrees(t.receipt, line.amount));
    if (agreeing.length === 1)
        return { outcome: 'LINK', trade: agreeing[0] };
    const exact = agreeing.filter((t) => amountExact(t.receipt, line.amount));
    if (exact.length === 1)
        return { outcome: 'LINK', trade: exact[0] };
    if (fits.length === 0)
        return { outcome: 'NONE', reason: 'NO_SALE_FITS' };
    const ranked = [...fits].sort((a, b) => Math.abs(a.date.getTime() - line.postedOn.getTime()) -
        Math.abs(b.date.getTime() - line.postedOn.getTime()));
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
async function matchShipments(db, dry) {
    const counts = { linked: 0, suggested: 0, unmatched: 0 };
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
    if (shipments.length === 0)
        return counts;
    const existing = await db.entityLink.findMany({
        where: {
            linkType: exports.SHIPMENT_LINK.linkType,
            fromTable: exports.SHIPMENT_LINK.fromTable,
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
    const groups = new Map();
    for (const l of ledger) {
        const s = byNo.get(l.documentNo);
        const key = `${l.documentNo}|${l.itemNo}`;
        if (handled.has(key))
            continue;
        const g = groups.get(key) ?? {
            shipmentNo: l.documentNo,
            itemNo: l.itemNo,
            customerId: s.customerId,
            postedOn: s.postingDate,
            productId: productOf.get(l.itemNo) ?? null,
            qty: 0,
            amount: 0,
        };
        g.qty += Math.abs(Number(l.quantity));
        g.amount += Number(l.salesAmount ?? 0);
        groups.set(key, g);
    }
    if (groups.size === 0)
        return counts;
    const customerIds = [
        ...new Set([...groups.values()].map((g) => g.customerId)),
    ];
    const customers = await db.customer.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true },
    });
    const nameOf = new Map(customers.map((c) => [c.id, c.name]));
    const earliest = Math.min(...[...groups.values()].map((g) => g.postedOn.getTime()));
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
    const candidates = trades.map((t) => ({
        ...t,
        receipt: t.receipt === null ? null : Number(t.receipt),
    }));
    const taken = new Set((await db.bcShipment.findMany({
        where: { tradeId: { not: null } },
        select: { tradeId: true },
    })).map((s) => s.tradeId));
    for (const l of existing.filter((x) => x.status === 'CONFIRMED')) {
        const id = await tradeIdOfKey(db, l.toKey);
        if (id !== null)
            taken.add(id);
    }
    const ordered = [...groups.values()].sort((a, b) => a.postedOn.getTime() - b.postedOn.getTime());
    for (const line of ordered) {
        const d = decideLine(line, candidates, nameOf.get(line.customerId) ?? null, taken);
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
                            ...exports.SHIPMENT_LINK,
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
                    ...exports.SHIPMENT_LINK,
                    fromKey,
                    toKey: tradeLinkKey(t),
                    method: 'CUSTOMER_PRODUCT_QTY',
                    confidence: 'PROBABLE',
                    status: 'PENDING',
                    note: d.note,
                })),
                skipDuplicates: true,
            });
    }
    return counts;
}
async function applyShipmentLink(db, fromKey, tradeId) {
    const [shipmentNo, itemNo] = fromKey.split('|');
    if (!shipmentNo || !itemNo)
        return;
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
//# sourceMappingURL=shipment-matcher.js.map