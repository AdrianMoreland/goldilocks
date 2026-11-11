import {
    metalInText,
    resolveRowProduct,
    type MetalType,
    type RelinkTableResult,
    type RowResolveResult,
    type RowResolverData,
} from '@goldilocks/shared-types';

/** A row as Relink sees it: only what resolving needs, plus the product fields it may fill. */
export interface RelinkRow {
    id: number;
    /** The product text as written on the row. */
    text: string;
    refinery: string | null;
    /** The row's own metal. Null when the table has none the resolver understands (a platinum or palladium tab). */
    metal: MetalType | null;
    productId: number | null;
    salesProductId: number | null;
    /** A BC item number the row names (a Zoho SKU). */
    bcItemNo?: string | null;
    /** What that BC item links to. A BC link is never replaced. */
    bc?: { productId: number | null; salesProductId: number | null } | null;
}

/** One table: which product columns it has. A table with only a specific-product column cannot keep a pricing-only result. */
export interface RelinkSpec {
    hasProductId: boolean;
}

/** The columns one row changes, each as [value it must still have, new value]. */
export interface RowChange {
    productId?: [number | null, number];
    salesProductId?: [number | null, number];
}

export type RelinkCounts = Omit<RelinkTableResult, 'written'>;

export interface RelinkPlan {
    counts: RelinkCounts;
    /** Rows to write, for the fill and (only when `correct` was asked for) the correction. */
    changes: { id: number; change: RowChange }[];
}

export interface RelinkLookups {
    /** Metal of each pricing product and of each specific product, to keep a correction inside one metal. */
    pricingMetal: ReadonlyMap<number, string>;
    salesMetal: ReadonlyMap<number, string | null>;
}

const metalFits = (row: string, product: string | null | undefined): boolean =>
    !!product &&
    (product === row ||
        (product === 'PGM' && (row === 'PLATINUM' || row === 'PALLADIUM')));

/**
 * Plans the product fields of one table. `full` is the resolver data exactly as a tradesheet import has it; `person`
 * is the same with only a person's decisions and no BC items: a row is corrected only when the person's own decision
 * is what resolves its name. Fill never changes a product that is already there; correction needs a person's
 * decision for the name, the same metal, and never touches a BC-linked row. Nothing is ever cleared.
 */
export function planRelink(
    rows: readonly RelinkRow[],
    spec: RelinkSpec,
    full: RowResolverData,
    person: RowResolverData,
    lookups: RelinkLookups,
    correct: boolean,
): RelinkPlan {
    const counts: RelinkCounts = {
        rowsChecked: 0,
        fill: 0,
        correct: 0,
        pricingOnlyNoColumn: 0,
        unresolved: 0,
        notProduct: 0,
    };
    const changes: RelinkPlan['changes'] = [];
    // The ~11,000 invoice lines hold few distinct names: resolve each once.
    const memo = new Map<string, RowResolveResult | null>();
    const resolve = (
        data: RowResolverData,
        tag: string,
        r: RelinkRow,
    ): RowResolveResult | null => {
        const metal = r.metal ?? metalInText(r.text);
        if (!metal) return null;
        const k = [tag, r.text, r.refinery, metal, r.bcItemNo].join('\u0000');
        if (memo.has(k)) return memo.get(k) ?? null;
        const res = resolveRowProduct(
            {
                productText: r.text,
                metal,
                refinery: r.refinery,
                bcItemNo: r.bcItemNo ?? null,
            },
            data,
        );
        memo.set(k, res);
        return res;
    };

    for (const r of rows) {
        counts.rowsChecked++;
        const primaryEmpty = spec.hasProductId
            ? r.productId === null
            : r.salesProductId === null;
        const res = resolve(full, 'full', r);
        if (res?.method === 'NOT_PRODUCT') {
            counts.notProduct++;
            continue;
        }
        // A BC item's own links come first, where the row names one.
        const targetPid = r.bc?.productId ?? res?.pricingProductId ?? null;
        const targetSp =
            r.bc?.salesProductId ??
            (res?.salesProductId == null ? null : Number(res.salesProductId));

        if (primaryEmpty && targetPid === null && targetSp === null) {
            counts.unresolved++;
            continue;
        }
        if (
            !spec.hasProductId &&
            r.salesProductId === null &&
            targetSp === null &&
            targetPid !== null
        ) {
            counts.pricingOnlyNoColumn++;
            continue;
        }

        // Correction: a person's decision for the name, same metal, row not BC-linked.
        const corr: RowChange = {};
        if (!r.bc && res?.method === 'ALIAS') {
            const pr = resolve(person, 'person', r);
            const same =
                pr?.method === 'ALIAS' &&
                pr.pricingProductId === res.pricingProductId &&
                pr.salesProductId === res.salesProductId;
            const rowMetal = metalInText(r.text) ?? r.metal;
            const targetMetal =
                pr?.salesProductId != null
                    ? (lookups.salesMetal.get(Number(pr.salesProductId)) ??
                      (pr.pricingProductId !== null
                          ? lookups.pricingMetal.get(pr.pricingProductId)
                          : null))
                    : pr?.pricingProductId != null
                      ? lookups.pricingMetal.get(pr.pricingProductId)
                      : null;
            if (same && pr && rowMetal && metalFits(rowMetal, targetMetal)) {
                const toSp =
                    pr.salesProductId === null
                        ? null
                        : Number(pr.salesProductId);
                // A generic decision never overrides a row that already names a specific product.
                const generic = toSp === null && r.salesProductId !== null;
                if (
                    spec.hasProductId &&
                    !generic &&
                    r.productId !== null &&
                    pr.pricingProductId !== null &&
                    r.productId !== pr.pricingProductId
                )
                    corr.productId = [r.productId, pr.pricingProductId];
                if (
                    toSp !== null &&
                    r.salesProductId !== null &&
                    r.salesProductId !== toSp
                )
                    corr.salesProductId = [r.salesProductId, toSp];
            }
        }
        const corrects = Object.keys(corr).length > 0;
        if (corrects) counts.correct++;

        // Fill: only empty fields.
        const fill: RowChange = {};
        if (spec.hasProductId && r.productId === null && targetPid !== null)
            fill.productId = [null, targetPid];
        if (r.salesProductId === null && targetSp !== null) {
            // A specific product only goes onto a row whose pricing product it belongs to.
            const pidAfter =
                correct && corr.productId
                    ? corr.productId[1]
                    : (fill.productId?.[1] ?? r.productId);
            const consistent =
                !spec.hasProductId ||
                targetPid === null ||
                pidAfter === targetPid;
            if (consistent) fill.salesProductId = [null, targetSp];
        }
        const fills = Object.keys(fill).length > 0;
        if (fills) counts.fill++;

        const change: RowChange = { ...fill, ...(correct ? corr : {}) };
        if (Object.keys(change).length > 0) changes.push({ id: r.id, change });
    }
    return { counts, changes };
}

export interface ChangeGroup {
    change: RowChange;
    ids: number[];
}

/** Rows with the same change share one write. */
export function groupChanges(plan: RelinkPlan['changes']): ChangeGroup[] {
    const groups = new Map<string, ChangeGroup>();
    for (const { id, change } of plan) {
        const k = [
            change.productId?.join('>'),
            change.salesProductId?.join('>'),
        ]
            .map((p) => p ?? '-')
            .join('|');
        const g = groups.get(k);
        if (g) g.ids.push(id);
        else groups.set(k, { change, ids: [id] });
    }
    return [...groups.values()];
}
