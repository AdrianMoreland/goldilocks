"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEvidenceIndex = buildEvidenceIndex;
exports.evidenceFor = evidenceFor;
const shared_types_1 = require("@goldilocks/shared-types");
const product_name_usage_1 = require("./product-name-usage");
function buildEvidenceIndex(rows) {
    const index = new Map();
    for (const r of rows) {
        const list = index.get(r.name);
        if (list)
            list.push(r);
        else
            index.set(r.name, [r]);
    }
    return index;
}
function rowsOf(alias, index) {
    const { name, refinery } = (0, product_name_usage_1.splitAlias)(alias);
    return (index.get(name) ?? []).filter((r) => refinery === null || r.refinery === null || r.refinery === refinery);
}
function evidenceFor(alias, index, spotOn, known) {
    const rows = rowsOf(alias, index);
    if (rows.length === 0)
        return {};
    const p = (0, shared_types_1.parseProductName)(alias);
    if (p.metals.size > 0)
        return {};
    if (known.metalHint)
        return {};
    const tabs = new Set(rows
        .map((r) => r.tabMetal)
        .filter((m) => m !== null));
    if (tabs.size === 1) {
        const only = [...tabs][0];
        if (only === 'GOLD' || only === 'SILVER')
            return { metal: only };
    }
    const price = (0, shared_types_1.priceMetalEvidence)(rows.map((r) => ({ date: r.date, unitPrice: r.unitPrice })), p.grams, spotOn);
    return price
        ? {
            metalEvidence: {
                metal: price.metal,
                from: 'price',
                rows: price.rows,
            },
        }
        : {};
}
//# sourceMappingURL=product-name-evidence.js.map