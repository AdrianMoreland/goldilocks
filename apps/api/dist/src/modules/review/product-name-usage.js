"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitAlias = splitAlias;
exports.rowAliasKey = rowAliasKey;
exports.buildUsageIndex = buildUsageIndex;
exports.usageOf = usageOf;
const shared_types_1 = require("@goldilocks/shared-types");
const SOURCE_ORDER = [
    'SALES',
    'PURCHASES',
    'ZOHO',
    'ZOHO_PO',
    'CUSTOMER_SAFE',
];
const METAL_ORDER = ['GOLD', 'SILVER', 'PGM', null];
function splitAlias(alias) {
    const bar = alias.indexOf('|');
    if (bar < 0)
        return { name: alias.trim(), refinery: null };
    return {
        name: alias.slice(0, bar).trim(),
        refinery: (0, shared_types_1.normaliseRefinery)(alias.slice(bar + 1).trim()),
    };
}
function rowAliasKey(text, refinery) {
    return (0, shared_types_1.aliasKey)((0, shared_types_1.normaliseProductText)(text), (0, shared_types_1.normaliseRefinery)(refinery));
}
function buildUsageIndex(groups) {
    const index = new Map();
    for (const g of groups) {
        const list = index.get(g.name);
        if (list)
            list.push(g);
        else
            index.set(g.name, [g]);
    }
    return index;
}
function usageOf(alias, index) {
    const { name, refinery } = splitAlias(alias);
    const groups = (index.get(name) ?? []).filter((g) => refinery === null || g.refinery === refinery);
    const counts = new Map();
    let sheetRows = 0;
    let sheetUnresolved = 0;
    let zohoUnresolved = 0;
    const byMetal = new Map();
    const unresolvedByMetal = new Map();
    for (const g of groups) {
        const k = `${g.source}/${g.metal}`;
        const seen = counts.get(k);
        if (seen)
            seen.count += g.count;
        else
            counts.set(k, { source: g.source, metal: g.metal, count: g.count });
        if (g.source === 'SALES' || g.source === 'PURCHASES') {
            sheetRows += g.count;
            if (g.metal)
                byMetal.set(g.metal, (byMetal.get(g.metal) ?? 0) + g.count);
            if (!g.resolved) {
                sheetUnresolved += g.count;
                if (g.metal)
                    unresolvedByMetal.set(g.metal, (unresolvedByMetal.get(g.metal) ?? 0) + g.count);
            }
        }
        else if (g.source === 'ZOHO' && !g.resolved) {
            zohoUnresolved += g.count;
        }
    }
    const seenIn = [...counts.values()].sort((a, b) => SOURCE_ORDER.indexOf(a.source) - SOURCE_ORDER.indexOf(b.source) ||
        METAL_ORDER.indexOf(a.metal) - METAL_ORDER.indexOf(b.metal));
    const perMetal = byMetal.size > 1 && sheetUnresolved > 0
        ? METAL_ORDER.filter((m) => m !== null && byMetal.has(m)).map((metal) => ({
            metal,
            unresolved: unresolvedByMetal.get(metal) ?? 0,
        }))
        : null;
    return {
        seenIn,
        perMetal,
        settledPerRow: sheetRows > 0 && sheetUnresolved === 0 && zohoUnresolved === 0,
    };
}
//# sourceMappingURL=product-name-usage.js.map