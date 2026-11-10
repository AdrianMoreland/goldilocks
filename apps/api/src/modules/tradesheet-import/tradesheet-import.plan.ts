import {
    assignOccurrences,
    classifyTab,
    mapPurchaseHeaders,
    mapSaleHeaders,
    normaliseBackfillHeaders,
    parsePurchaseRow,
    parseSaleRow,
    referenceMatchKey,
    resolveRowProduct,
    type HeaderMap,
    type ImportSource,
    type ParsedPurchase,
    type ParsedSale,
    type PlanCounts,
    type PlanRow,
    type PlanRowStatus,
    type PurchaseField,
    type RowResolveMethod,
    type RowResolverData,
    type SaleField,
    type SheetRow,
    type TabKind,
    type TabPlan,
    type TradesheetImportPlan,
    type TradesheetTab,
} from '@goldilocks/shared-types';

/**
 * Reading a tab and comparing it with what Goldilocks holds. Pure: the service loads the existing rows and writes
 * the result, this file decides what each row is (added, changed, restored, unchanged, missing) and what is wrong
 * with it. Nothing here touches the database.
 */

export type PlanMetal = 'GOLD' | 'SILVER';

export interface ExistingTrade {
    id: number;
    referenceKey: string;
    occurrence: number;
    fingerprint: string;
    missingFromImport: boolean;
    sourceMonth: string;
    sourceTab: string;
    client: string;
    qty: number | null;
    productText: string;
    cptyRaw: string | null;
    state: string;
    collected: boolean;
    cost: number | null;
    receipt: number | null;
    notes: string | null;
    /** The lot it was linked to before this import, so that lot is rechecked if CPTY now names another. */
    lotKey: string | null;
    productKey: string | null;
    productId: number | null;
    issues: string[];
}

export interface ExistingLot {
    id: number;
    referenceKey: string;
    occurrence: number;
    fingerprint: string;
    missingFromImport: boolean;
    sourceMonth: string;
    sourceTab: string;
    client: string;
    qty: number | null;
    productText: string;
    pricePaid: number | null;
    hedgedAt: number | null;
    commentsRaw: string | null;
    productKey: string | null;
    productId: number | null;
    issues: string[];
}

interface Keyed {
    referenceKey: string;
    occurrence: number;
    metal: PlanMetal;
    productKey: string | null;
    productId: number | null;
    /** How the product was found, for the preview counts. Null when the row has no product text. */
    how: RowResolveMethod | null;
    /** Issues from the parser plus the ones only the planner can see (duplicates, wrong metal, bad quantity). */
    issues: string[];
    duplicate: boolean;
}

export interface ParsedSaleRow extends Keyed {
    parsed: ParsedSale;
    /** Whole-number quantity, or null when the sheet's quantity is missing or fractional. */
    qty: number | null;
}

export interface ParsedLotRow extends Keyed {
    parsed: ParsedPurchase;
    qty: number | null;
}

export interface ParsedTab {
    name: string;
    kind: TabKind | null;
    problems: string[];
    metal: PlanMetal | null;
    sales: ParsedSaleRow[];
    lots: ParsedLotRow[];
}

const SALE_REQUIRED: SaleField[] = [
    'reference',
    'client',
    'product',
    'cpty',
    'date',
];
const PURCHASE_REQUIRED: PurchaseField[] = ['reference', 'client', 'product'];

const tabMetal = (kind: TabKind): PlanMetal =>
    kind.includes('SILVER') ? 'SILVER' : 'GOLD';

/** Turns one tab's cells into parsed rows. A tab it cannot read is returned with its problems and no rows. */
export function parseTab(
    tab: TradesheetTab,
    products: RowResolverData,
    source: ImportSource = 'TRADESHEET',
): ParsedTab {
    const { kind, skipReason } = classifyTab(tab.name, source);
    const headers =
        source === 'BACKFILL'
            ? normaliseBackfillHeaders(tab.headers)
            : tab.headers;
    const empty: ParsedTab = {
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
    const saleMap = isSale ? mapSaleHeaders(headers) : undefined;
    const purchaseMap = !isSale ? mapPurchaseHeaders(headers) : undefined;
    const missing = isSale
        ? SALE_REQUIRED.filter(
              (f) => (saleMap as HeaderMap<SaleField>)[f] === undefined,
          )
        : PURCHASE_REQUIRED.filter(
              (f) => (purchaseMap as HeaderMap<PurchaseField>)[f] === undefined,
          );
    if (missing.length > 0) {
        return {
            ...empty,
            metal: tabMetal(kind),
            problems: missing.map((f) => `Missing column: ${f}.`),
        };
    }

    const metal = tabMetal(kind);
    const toRow = (r: TradesheetTab['rows'][number]): SheetRow =>
        r.cells.map((value, i) => ({
            value,
            fill: r.fills?.[String(i)] ?? null,
        }));

    if (isSale) {
        const parsed = tab.rows
            .map((r) =>
                parseSaleRow(toRow(r), saleMap as HeaderMap<SaleField>, r.row),
            )
            .filter((s): s is ParsedSale => s !== null);
        return { ...empty, metal, sales: keyRows(parsed, products, metal) };
    }
    const parsed = tab.rows
        .map((r) =>
            parsePurchaseRow(
                toRow(r),
                purchaseMap as HeaderMap<PurchaseField>,
                r.row,
            ),
        )
        .filter((p): p is ParsedPurchase => p !== null);
    return { ...empty, metal, lots: keyRows(parsed, products, metal) };
}

function keyRows<T extends ParsedSale | ParsedPurchase>(
    parsed: T[],
    products: RowResolverData,
    metal: PlanMetal,
): Array<Keyed & { parsed: T; qty: number | null }> {
    const occurrences = assignOccurrences(parsed.map((p) => p.reference));
    const counts = new Map<string, number>();
    for (const p of parsed) {
        const k = referenceMatchKey(p.reference);
        counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return parsed.map((p, i) => {
        const referenceKey = referenceMatchKey(p.reference);
        const issues = [...p.issues];
        const times = counts.get(referenceKey) ?? 1;
        const duplicate = times > 1;
        if (duplicate)
            issues.push(`Reference appears ${times} times in this file.`);

        const match = p.product
            ? resolveRowProduct({ productText: p.product, metal }, products)
            : null;
        // The resolved product's metal says what it is; the text's own metal only counts when nothing resolved.
        const productMetal =
            match?.pricingProductId != null
                ? products.catalogue.find(
                      (c) => c.id === match.pricingProductId,
                  )?.metalType
                : undefined;
        const saysMetal = productMetal ?? match?.metalFromText ?? null;
        if (saysMetal && saysMetal !== metal)
            issues.push(
                `Product says ${saysMetal.toLowerCase()} but the tab is ${metal.toLowerCase()}.`,
            );

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

// --- comparing with what is stored ---------------------------------------------------

const slot = (referenceKey: string, occurrence: number) =>
    `${referenceKey}#${occurrence}`;
const sameMoney = (a: number | null, b: number | null) =>
    a === null || b === null ? a === b : Math.abs(a - b) < 0.00005;

export interface PlannedSale extends ParsedSaleRow {
    status: PlanRowStatus;
    changedFields: string[];
    existing: ExistingTrade | null;
}
export interface PlannedLot extends ParsedLotRow {
    status: PlanRowStatus;
    changedFields: string[];
    existing: ExistingLot | null;
}

export interface TabReconciliation {
    name: string;
    kind: TabKind | null;
    problems: string[];
    sales: PlannedSale[];
    lots: PlannedLot[];
    /** Stored rows from this month and tab that the file no longer contains. */
    missingTradeIds: number[];
    missingLotIds: number[];
}

function diffTrade(e: ExistingTrade, r: ParsedSaleRow): string[] {
    const p = r.parsed;
    const out: string[] = [];
    if (e.client !== p.client) out.push('client');
    if (e.qty !== r.qty) out.push('qty');
    if (e.productText !== p.product) out.push('product');
    if ((e.cptyRaw ?? '') !== p.cpty.raw) out.push('cpty');
    if (e.state !== p.state) out.push('state');
    if (e.collected !== p.collected.collected) out.push('collected');
    if (!sameMoney(e.cost, p.cost)) out.push('cost');
    if (!sameMoney(e.receipt, p.receipt)) out.push('receipt');
    if ((e.notes ?? '') !== (p.notes ?? '')) out.push('notes');
    return out;
}

function diffLot(e: ExistingLot, r: ParsedLotRow): string[] {
    const p = r.parsed;
    const out: string[] = [];
    if (e.client !== p.client) out.push('client');
    if (e.qty !== r.qty) out.push('qty');
    if (e.productText !== p.product) out.push('product');
    if (!sameMoney(e.pricePaid, p.pricePaid)) out.push('price paid');
    if (!sameMoney(e.hedgedAt, p.hedgedAt)) out.push('hedged at');
    if ((e.commentsRaw ?? '') !== (p.comments ?? '')) out.push('comments');
    return out;
}

function statusOf(
    existing: { fingerprint: string; missingFromImport: boolean } | null,
    fingerprint: string,
    changed: () => string[],
): { status: PlanRowStatus; changedFields: string[] } {
    if (!existing) return { status: 'ADDED', changedFields: [] };
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

/**
 * Compares a parsed tab with the stored rows. `existingTrades` / `existingLots` are every stored row whose
 * reference appears in the file plus every stored row from this month and tab, so a row that moved between
 * months is updated in place and a row that vanished is found.
 */
export function reconcileTab(
    parsed: ParsedTab,
    sheetMonth: string,
    existingTrades: ExistingTrade[],
    existingLots: ExistingLot[],
): TabReconciliation {
    const tradesBySlot = new Map(
        existingTrades.map((t) => [slot(t.referenceKey, t.occurrence), t]),
    );
    const lotsBySlot = new Map(
        existingLots.map((l) => [slot(l.referenceKey, l.occurrence), l]),
    );

    const sales: PlannedSale[] = parsed.sales.map((r) => {
        const existing =
            tradesBySlot.get(slot(r.referenceKey, r.occurrence)) ?? null;
        return {
            ...r,
            existing,
            ...statusOf(existing, r.parsed.fingerprint, () =>
                existing ? diffTrade(existing, r) : [],
            ),
        };
    });
    const lots: PlannedLot[] = parsed.lots.map((r) => {
        const existing =
            lotsBySlot.get(slot(r.referenceKey, r.occurrence)) ?? null;
        return {
            ...r,
            existing,
            ...statusOf(existing, r.parsed.fingerprint, () =>
                existing ? diffLot(existing, r) : [],
            ),
        };
    });

    const inFile = (
        rows: Array<{ referenceKey: string; occurrence: number }>,
    ) => new Set(rows.map((r) => slot(r.referenceKey, r.occurrence)));
    const fileTrades = inFile(parsed.sales);
    const fileLots = inFile(parsed.lots);
    const here = (r: {
        sourceMonth: string;
        sourceTab: string;
        missingFromImport: boolean;
    }) =>
        r.sourceMonth === sheetMonth &&
        r.sourceTab === parsed.name &&
        !r.missingFromImport;

    // Only a tab that was actually read can say a row is gone.
    const read = parsed.kind !== null && parsed.problems.length === 0;
    return {
        name: parsed.name,
        kind: parsed.kind,
        problems: parsed.problems,
        sales,
        lots,
        missingTradeIds: read
            ? existingTrades
                  .filter(
                      (t) =>
                          here(t) &&
                          !fileTrades.has(slot(t.referenceKey, t.occurrence)),
                  )
                  .map((t) => t.id)
            : [],
        missingLotIds: read
            ? existingLots
                  .filter(
                      (l) =>
                          here(l) &&
                          !fileLots.has(slot(l.referenceKey, l.occurrence)),
                  )
                  .map((l) => l.id)
            : [],
    };
}

// --- the preview ------------------------------------------------------------------------

const zeroCounts = (): PlanCounts => ({
    added: 0,
    changed: 0,
    restored: 0,
    unchanged: 0,
    missing: 0,
    flagged: 0,
});

const addCounts = (a: PlanCounts, b: PlanCounts): PlanCounts => ({
    added: a.added + b.added,
    changed: a.changed + b.changed,
    restored: a.restored + b.restored,
    unchanged: a.unchanged + b.unchanged,
    missing: a.missing + b.missing,
    flagged: a.flagged + b.flagged,
});

export function summariseTab(rec: TabReconciliation): TabPlan {
    const counts = zeroCounts();
    const rows: PlanRow[] = [];
    const unmatched = new Map<string, number>();
    const productMatches = { saved: 0, rule: 0, none: 0 };

    const all: Array<PlannedSale | PlannedLot> = [...rec.sales, ...rec.lots];
    for (const r of all) {
        if (r.status === 'ADDED') counts.added++;
        else if (r.status === 'CHANGED') counts.changed++;
        else if (r.status === 'RESTORED') counts.restored++;
        else counts.unchanged++;
        if (r.issues.length > 0) counts.flagged++;
        if (r.how) {
            if (r.how === 'NONE') productMatches.none++;
            else if (r.how === 'RULE') productMatches.rule++;
            else productMatches.saved++;
        }
        if (r.how === 'NONE')
            unmatched.set(
                r.parsed.product,
                (unmatched.get(r.parsed.product) ?? 0) + 1,
            );

        const isSale = 'cpty' in r.parsed;
        const sale = isSale ? (r.parsed as ParsedSale) : null;
        const fromColour =
            !!sale &&
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

export function summarise(
    fileName: string,
    sheetMonth: string,
    recs: TabReconciliation[],
    warnings: string[] = [],
): TradesheetImportPlan {
    const tabs = recs.map(summariseTab);
    return {
        fileName,
        sheetMonth,
        tabs,
        totals: tabs.reduce((acc, t) => addCounts(acc, t.counts), zeroCounts()),
        warnings,
    };
}
