"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericNormOf = genericNormOf;
exports.planBcSalesProducts = planBcSalesProducts;
const shared_types_1 = require("@goldilocks/shared-types");
const stockMetal = (m) => m === 'GOLD' || m === 'SILVER' ? m : 'PGM';
function rangeMetal(itemNo) {
    const first = /^\d/.test(itemNo) ? itemNo[0] : '';
    if (first === '1' || first === '2')
        return 'GOLD';
    if (first === '3' || first === '4')
        return 'SILVER';
    if (first === '5')
        return 'PGM';
    return null;
}
const deaccent = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const METAL_WORDS = new Set(['gold', 'silver', 'platinum', 'palladium']);
function genericNormOf(description, refineryWords) {
    const tokens = (0, shared_types_1.normaliseProductText)(deaccent(description))
        .replace(/\bbest value\b|\bmixed[ /]refiners?\b|\bmixed[ /]other\b/g, ' ')
        .split(' ')
        .filter((t) => t && !METAL_WORDS.has(t));
    if (refineryWords) {
        const drop = (0, shared_types_1.normaliseProductText)(refineryWords.toLowerCase())
            .split(' ')
            .filter(Boolean);
        if (drop.length > 0) {
            for (let i = 0; i + drop.length <= tokens.length; i++) {
                if (drop.every((t, k) => tokens[i + k] === t)) {
                    tokens.splice(i, drop.length);
                    break;
                }
            }
        }
        if (tokens[0] === 'the')
            tokens.shift();
    }
    return tokens.join(' ');
}
function planBcSalesProducts(items, catalogue, existing = []) {
    const taken = new Map(existing.map((p) => [p.name, p]));
    const byId = new Map(catalogue.map((p) => [p.id, p]));
    const bySku = new Map(catalogue.map((p) => [p.sku, p]));
    const nameCount = new Map();
    for (const it of items) {
        const k = it.description.trim().toLowerCase();
        nameCount.set(k, (nameCount.get(k) ?? 0) + 1);
    }
    const rows = items.map((it) => {
        const description = it.description.trim();
        const name = (nameCount.get(description.toLowerCase()) ?? 0) > 1
            ? `${description} (${it.itemNo})`
            : description;
        const pricing = it.productId !== null ? (byId.get(it.productId) ?? null) : null;
        const match = pricing?.sku.endsWith('-BAR')
            ? (0, shared_types_1.refineryMatch)(description)
            : null;
        const refinery = match?.refinery ?? null;
        const textMetal = (0, shared_types_1.metalInText)(description);
        const range = rangeMetal(it.itemNo);
        const metal = pricing
            ? stockMetal(pricing.metalType)
            : textMetal
                ? stockMetal(textMetal)
                : range;
        const suggestMetal = textMetal ??
            (range === 'GOLD' || range === 'SILVER' ? range : null) ??
            pricing?.metalType ??
            null;
        const candidates = suggestMetal
            ? ((0, shared_types_1.pricingSkuFor)(description, suggestMetal)?.candidates ?? [])
            : [];
        const suggestedSku = candidates.find((sku) => bySku.has(sku));
        const row = {
            itemNo: it.itemNo,
            description: it.description,
            action: 'CREATE',
            name,
            metal,
            refinery,
            genericNorm: genericNormOf(description, match?.words ?? null),
            pricingProductId: pricing?.id ?? null,
            pricingProductName: pricing?.name ?? null,
            ...(suggestedSku ? { suggestedSku } : {}),
        };
        if (it.salesProductId !== null)
            return { ...row, action: 'LINKED' };
        if (!pricing)
            return {
                ...row,
                action: 'SKIP',
                reason: 'No pricing product linked: link it in BC items first.',
            };
        if (suggestedSku && !candidates.includes(pricing.sku))
            return {
                ...row,
                action: 'SKIP',
                reason: `Pricing link looks wrong: linked to ${pricing.name}, description suggests ${suggestedSku}. Check it in BC items.`,
            };
        const same = taken.get(name);
        if (same &&
            (same.metal !== metal || same.pricingProductId !== pricing.id))
            return {
                ...row,
                action: 'SKIP',
                reason: 'A specific product with this name already exists for a different product.',
            };
        if (!metal || !row.genericNorm)
            return {
                ...row,
                action: 'SKIP',
                reason: 'Description does not say enough to name a specific product.',
            };
        return row;
    });
    const count = (a) => rows.filter((r) => r.action === a).length;
    return {
        rows,
        totals: {
            create: count('CREATE'),
            linked: count('LINKED'),
            skip: count('SKIP'),
            total: rows.length,
        },
    };
}
//# sourceMappingURL=bc-sales-products.js.map