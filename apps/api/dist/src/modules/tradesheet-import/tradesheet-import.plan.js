"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTab = parseTab;
exports.reconcileTab = reconcileTab;
exports.needsProductRefresh = needsProductRefresh;
exports.summariseTab = summariseTab;
exports.summarise = summarise;
const shared_types_1 = require("@goldilocks/shared-types");
const SALE_REQUIRED = [
    'reference',
    'client',
    'product',
    'cpty',
    'date',
];
const PURCHASE_REQUIRED = ['reference', 'client', 'product'];
const tabMetal = (kind) => kind.includes('SILVER') ? 'SILVER' : 'GOLD';
function parseTab(tab, products, source = 'TRADESHEET') {
    const { kind, skipReason } = (0, shared_types_1.classifyTab)(tab.name, source);
    const headers = source === 'BACKFILL'
        ? (0, shared_types_1.normaliseBackfillHeaders)(tab.headers)
        : tab.headers;
    const empty = {
        name: tab.name,
        kind,
        problems: [],
        metal: null,
        sales: [],
        lots: [],
    };
    if (!kind)
        return {
            ...empty,
            problems: [skipReason ?? 'Not a trade or purchase tab.'],
        };
    const isSale = kind === 'IE_GOLD_SALES' || kind === 'IE_SILVER_SALES';
    const saleMap = isSale ? (0, shared_types_1.mapSaleHeaders)(headers) : undefined;
    const purchaseMap = !isSale ? (0, shared_types_1.mapPurchaseHeaders)(headers) : undefined;
    const missing = isSale
        ? SALE_REQUIRED.filter((f) => saleMap[f] === undefined)
        : PURCHASE_REQUIRED.filter((f) => purchaseMap[f] === undefined);
    if (missing.length > 0) {
        return {
            ...empty,
            metal: tabMetal(kind),
            problems: missing.map((f) => `Missing column: ${f}.`),
        };
    }
    const metal = tabMetal(kind);
    const toRow = (r) => r.cells.map((value, i) => ({
        value,
        fill: r.fills?.[String(i)] ?? null,
    }));
    if (isSale) {
        const parsed = tab.rows
            .map((r) => (0, shared_types_1.parseSaleRow)(toRow(r), saleMap, r.row))
            .filter((s) => s !== null);
        return { ...empty, metal, sales: keyRows(parsed, products, metal) };
    }
    const parsed = tab.rows
        .map((r) => (0, shared_types_1.parsePurchaseRow)(toRow(r), purchaseMap, r.row))
        .filter((p) => p !== null);
    return { ...empty, metal, lots: keyRows(parsed, products, metal) };
}
function keyRows(parsed, products, metal) {
    const occurrences = (0, shared_types_1.assignOccurrences)(parsed.map((p) => p.reference));
    const counts = new Map();
    for (const p of parsed) {
        const k = (0, shared_types_1.referenceMatchKey)(p.reference);
        counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return parsed.map((p, i) => {
        const referenceKey = (0, shared_types_1.referenceMatchKey)(p.reference);
        const issues = [...p.issues];
        const times = counts.get(referenceKey) ?? 1;
        const duplicate = times > 1;
        if (duplicate)
            issues.push(`Reference appears ${times} times in this file.`);
        const match = p.product
            ? (0, shared_types_1.resolveRowProduct)({ productText: p.product, metal }, products)
            : null;
        const productMetal = match?.pricingProductId != null
            ? products.catalogue.find((c) => c.id === match.pricingProductId)?.metalType
            : undefined;
        const saysMetal = productMetal ?? match?.metalFromText ?? null;
        const pgmInSilverTab = metal === 'SILVER' &&
            (saysMetal === 'PLATINUM' || saysMetal === 'PALLADIUM');
        if (saysMetal && saysMetal !== metal && !pgmInSilverTab)
            issues.push(`Product says ${saysMetal.toLowerCase()} but the tab is ${metal.toLowerCase()}.`);
        let qty = p.qty;
        if (qty !== null && !Number.isInteger(qty)) {
            issues.push(`Quantity ${qty} is not a whole number.`);
            qty = null;
        }
        return {
            parsed: p,
            referenceKey,
            occurrence: occurrences[i] ?? 1,
            metal,
            productKey: match?.key || null,
            productId: match?.pricingProductId ?? null,
            how: match?.method ?? null,
            issues,
            duplicate,
            qty,
        };
    });
}
const slot = (referenceKey, occurrence) => `${referenceKey}#${occurrence}`;
const sameMoney = (a, b) => a === null || b === null ? a === b : Math.abs(a - b) < 0.00005;
function diffTrade(e, r) {
    const p = r.parsed;
    const out = [];
    if (e.client !== p.client)
        out.push('client');
    if (e.qty !== r.qty)
        out.push('qty');
    if (e.productText !== p.product)
        out.push('product');
    if ((e.cptyRaw ?? '') !== p.cpty.raw)
        out.push('cpty');
    if (e.state !== p.state)
        out.push('state');
    if (e.collected !== p.collected.collected)
        out.push('collected');
    if (!sameMoney(e.cost, p.cost))
        out.push('cost');
    if (!sameMoney(e.receipt, p.receipt))
        out.push('receipt');
    if ((e.notes ?? '') !== (p.notes ?? ''))
        out.push('notes');
    return out;
}
function diffLot(e, r) {
    const p = r.parsed;
    const out = [];
    if (e.client !== p.client)
        out.push('client');
    if (e.qty !== r.qty)
        out.push('qty');
    if (e.productText !== p.product)
        out.push('product');
    if (!sameMoney(e.pricePaid, p.pricePaid))
        out.push('price paid');
    if (!sameMoney(e.hedgedAt, p.hedgedAt))
        out.push('hedged at');
    if ((e.commentsRaw ?? '') !== (p.comments ?? ''))
        out.push('comments');
    return out;
}
function statusOf(existing, fingerprint, changed) {
    if (!existing)
        return { status: 'ADDED', changedFields: [] };
    if (existing.missingFromImport)
        return { status: 'RESTORED', changedFields: [] };
    if (existing.fingerprint === fingerprint)
        return { status: 'UNCHANGED', changedFields: [] };
    const fields = changed();
    return {
        status: 'CHANGED',
        changedFields: fields.length > 0 ? fields : ['other'],
    };
}
function reconcileTab(parsed, sheetMonth, existingTrades, existingLots) {
    const tradesBySlot = new Map(existingTrades.map((t) => [slot(t.referenceKey, t.occurrence), t]));
    const lotsBySlot = new Map(existingLots.map((l) => [slot(l.referenceKey, l.occurrence), l]));
    const sales = parsed.sales.map((r) => {
        const existing = tradesBySlot.get(slot(r.referenceKey, r.occurrence)) ?? null;
        return {
            ...r,
            existing,
            ...statusOf(existing, r.parsed.fingerprint, () => existing ? diffTrade(existing, r) : []),
        };
    });
    const lots = parsed.lots.map((r) => {
        const existing = lotsBySlot.get(slot(r.referenceKey, r.occurrence)) ?? null;
        return {
            ...r,
            existing,
            ...statusOf(existing, r.parsed.fingerprint, () => existing ? diffLot(existing, r) : []),
        };
    });
    const inFile = (rows) => new Set(rows.map((r) => slot(r.referenceKey, r.occurrence)));
    const fileTrades = inFile(parsed.sales);
    const fileLots = inFile(parsed.lots);
    const here = (r) => r.sourceMonth === sheetMonth &&
        r.sourceTab === parsed.name &&
        !r.missingFromImport;
    const read = parsed.kind !== null && parsed.problems.length === 0;
    return {
        name: parsed.name,
        kind: parsed.kind,
        problems: parsed.problems,
        sales,
        lots,
        missingTradeIds: read
            ? existingTrades
                .filter((t) => here(t) &&
                !fileTrades.has(slot(t.referenceKey, t.occurrence)))
                .map((t) => t.id)
            : [],
        missingLotIds: read
            ? existingLots
                .filter((l) => here(l) &&
                !fileLots.has(slot(l.referenceKey, l.occurrence)))
                .map((l) => l.id)
            : [],
    };
}
function needsProductRefresh(r) {
    return (r.status === 'UNCHANGED' &&
        !!r.existing &&
        (r.existing.productKey !== r.productKey ||
            r.existing.productId !== r.productId ||
            JSON.stringify(r.existing.issues) !== JSON.stringify(r.issues)));
}
const zeroCounts = () => ({
    added: 0,
    changed: 0,
    restored: 0,
    unchanged: 0,
    missing: 0,
    flagged: 0,
    refreshed: 0,
});
const addCounts = (a, b) => ({
    added: a.added + b.added,
    changed: a.changed + b.changed,
    restored: a.restored + b.restored,
    unchanged: a.unchanged + b.unchanged,
    missing: a.missing + b.missing,
    flagged: a.flagged + b.flagged,
    refreshed: a.refreshed + b.refreshed,
});
function summariseTab(rec) {
    const counts = zeroCounts();
    const rows = [];
    const unmatched = new Map();
    const productMatches = { saved: 0, rule: 0, none: 0, notProduct: 0 };
    const all = [...rec.sales, ...rec.lots];
    for (const r of all) {
        if (r.status === 'ADDED')
            counts.added++;
        else if (r.status === 'CHANGED')
            counts.changed++;
        else if (r.status === 'RESTORED')
            counts.restored++;
        else
            counts.unchanged++;
        if (needsProductRefresh(r))
            counts.refreshed++;
        if (r.issues.length > 0)
            counts.flagged++;
        if (r.how) {
            if (r.how === 'NONE')
                productMatches.none++;
            else if (r.how === 'NOT_PRODUCT')
                productMatches.notProduct++;
            else if (r.how === 'RULE')
                productMatches.rule++;
            else
                productMatches.saved++;
        }
        if (r.how === 'NONE')
            unmatched.set(r.parsed.product, (unmatched.get(r.parsed.product) ?? 0) + 1);
        const isSale = 'cpty' in r.parsed;
        const sale = isSale ? r.parsed : null;
        const fromColour = !!sale &&
            (sale.stateFromColour || sale.collected.source === 'FILL');
        if (r.status !== 'UNCHANGED' || r.issues.length > 0 || fromColour) {
            rows.push({
                reference: r.parsed.reference,
                sourceRow: r.parsed.sourceRow,
                status: r.status,
                changedFields: r.changedFields,
                issues: r.issues,
                fromColour,
                state: sale ? sale.state : null,
                duplicate: r.duplicate,
            });
        }
    }
    counts.missing = rec.missingTradeIds.length + rec.missingLotIds.length;
    return {
        name: rec.name,
        kind: rec.kind,
        problems: rec.problems,
        counts,
        rows,
        unmatchedProducts: [...unmatched.entries()]
            .map(([text, n]) => ({ text, rows: n }))
            .sort((a, b) => b.rows - a.rows),
        productMatches,
    };
}
function summarise(fileName, sheetMonth, recs, warnings = []) {
    const tabs = recs.map(summariseTab);
    return {
        fileName,
        sheetMonth,
        tabs,
        totals: tabs.reduce((acc, t) => addCounts(acc, t.counts), zeroCounts()),
        warnings,
    };
}
//# sourceMappingURL=tradesheet-import.plan.js.map