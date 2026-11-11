import {
    aliasKey,
    normaliseProductText,
    normaliseRefinery,
    type AliasSeenIn,
    type AliasUsageMetal,
    type AliasUsageSource,
} from '@goldilocks/shared-types';

/** Rows that carry one product name, grouped by where they are and whether they already have a product. */
export interface UsageGroup {
    source: AliasUsageSource;
    metal: AliasUsageMetal | null;
    /** The cleaned product text. */
    name: string;
    /** The normalised refinery on the row, if any. */
    refinery: string | null;
    /** The row already has its product (a sale or purchase from its own sheet; a Zoho line with a specific product). */
    resolved: boolean;
    count: number;
}

export interface AliasUsage {
    seenIn: AliasSeenIn[];
    /** Metals the sales and purchases span, with the rows still without a product; null unless that is more than one metal and some are unresolved. */
    perMetal: { metal: AliasUsageMetal; unresolved: number }[] | null;
    /**
     * Every sale and purchase row that uses the name already has its product from its own sheet, and no Zoho line
     * using it is unresolved: the name needs no decision of its own.
     */
    settledPerRow: boolean;
}

const SOURCE_ORDER: AliasUsageSource[] = [
    'SALES',
    'PURCHASES',
    'ZOHO',
    'CUSTOMER_SAFE',
];
const METAL_ORDER: (AliasUsageMetal | null)[] = ['GOLD', 'SILVER', 'PGM', null];

/** An alias is "name" or "name|REFINERY". */
export function splitAlias(alias: string): {
    name: string;
    refinery: string | null;
} {
    const bar = alias.indexOf('|');
    if (bar < 0) return { name: alias.trim(), refinery: null };
    return {
        name: alias.slice(0, bar).trim(),
        refinery: normaliseRefinery(alias.slice(bar + 1).trim()),
    };
}

/** The alias key a row of this text and refinery would carry. */
export function rowAliasKey(
    text: string,
    refinery: string | null | undefined,
): string {
    return aliasKey(normaliseProductText(text), normaliseRefinery(refinery));
}

export type UsageIndex = Map<string, UsageGroup[]>;

export function buildUsageIndex(groups: UsageGroup[]): UsageIndex {
    const index: UsageIndex = new Map();
    for (const g of groups) {
        const list = index.get(g.name);
        if (list) list.push(g);
        else index.set(g.name, [g]);
    }
    return index;
}

export function usageOf(alias: string, index: UsageIndex): AliasUsage {
    const { name, refinery } = splitAlias(alias);
    const groups = (index.get(name) ?? []).filter(
        (g) => refinery === null || g.refinery === refinery,
    );

    const counts = new Map<string, AliasSeenIn>();
    let sheetRows = 0;
    let sheetUnresolved = 0;
    let zohoUnresolved = 0;
    const byMetal = new Map<AliasUsageMetal, number>();
    const unresolvedByMetal = new Map<AliasUsageMetal, number>();
    for (const g of groups) {
        const k = `${g.source}/${g.metal}`;
        const seen = counts.get(k);
        if (seen) seen.count += g.count;
        else
            counts.set(k, { source: g.source, metal: g.metal, count: g.count });
        if (g.source === 'SALES' || g.source === 'PURCHASES') {
            sheetRows += g.count;
            if (g.metal)
                byMetal.set(g.metal, (byMetal.get(g.metal) ?? 0) + g.count);
            if (!g.resolved) {
                sheetUnresolved += g.count;
                if (g.metal)
                    unresolvedByMetal.set(
                        g.metal,
                        (unresolvedByMetal.get(g.metal) ?? 0) + g.count,
                    );
            }
        } else if (g.source === 'ZOHO' && !g.resolved) {
            zohoUnresolved += g.count;
        }
    }

    const seenIn = [...counts.values()].sort(
        (a, b) =>
            SOURCE_ORDER.indexOf(a.source) - SOURCE_ORDER.indexOf(b.source) ||
            METAL_ORDER.indexOf(a.metal) - METAL_ORDER.indexOf(b.metal),
    );
    const perMetal =
        byMetal.size > 1 && sheetUnresolved > 0
            ? METAL_ORDER.filter(
                  (m): m is AliasUsageMetal => m !== null && byMetal.has(m),
              ).map((metal) => ({
                  metal,
                  unresolved: unresolvedByMetal.get(metal) ?? 0,
              }))
            : null;
    return {
        seenIn,
        perMetal,
        settledPerRow:
            sheetRows > 0 && sheetUnresolved === 0 && zohoUnresolved === 0,
    };
}
