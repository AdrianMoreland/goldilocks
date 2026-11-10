import {
    metalInText,
    normaliseProductText,
    pricingSkuFor,
    refineryMatch,
    type BcSalesProductRow,
    type BcSalesProductsPreview,
    type MetalType,
} from '@goldilocks/shared-types';

export interface BcItemInput {
    itemNo: string;
    description: string;
    productId: number | null;
    salesProductId: number | null;
}

export interface ExistingSalesProduct {
    name: string;
    metal: string;
    pricingProductId: number | null;
}

export interface CataloguePricingProduct {
    id: number;
    sku: string;
    name: string;
    metalType: MetalType;
}

type StockMetal = 'GOLD' | 'SILVER' | 'PGM';

const stockMetal = (m: MetalType): StockMetal =>
    m === 'GOLD' || m === 'SILVER' ? m : 'PGM';

/** The metal the item number range stands for (1xxx/2xxx gold, 3xxx/4xxx silver, 5xxx platinum group). */
function rangeMetal(itemNo: string): StockMetal | null {
    const first = /^\d/.test(itemNo) ? itemNo[0] : '';
    if (first === '1' || first === '2') return 'GOLD';
    if (first === '3' || first === '4') return 'SILVER';
    if (first === '5') return 'PGM';
    return null;
}

const deaccent = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

const METAL_WORDS = new Set(['gold', 'silver', 'platinum', 'palladium']);

/** The generic name of a description: its normalised text with the refinery's words taken out. */
export function genericNormOf(
    description: string,
    refineryWords: string | null,
): string {
    // The metal is its own field, and "mixed refiners" says no refinery: neither belongs in the generic name.
    const tokens = normaliseProductText(deaccent(description))
        .replace(
            /\bbest value\b|\bmixed[ /]refiners?\b|\bmixed[ /]other\b/g,
            ' ',
        )
        .split(' ')
        .filter((t) => t && !METAL_WORDS.has(t));
    if (refineryWords) {
        const drop = normaliseProductText(refineryWords.toLowerCase())
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
        if (tokens[0] === 'the') tokens.shift();
    }
    return tokens.join(' ');
}

/**
 * What each Business Central item would become as a specific product. Pure. An item that already has a specific
 * product is LINKED; one with no pricing product, or a pricing product its description does not fit, is SKIPped
 * with the reason; the rest are CREATE.
 */
export function planBcSalesProducts(
    items: readonly BcItemInput[],
    catalogue: readonly CataloguePricingProduct[],
    existing: readonly ExistingSalesProduct[] = [],
): BcSalesProductsPreview {
    const taken = new Map(existing.map((p) => [p.name, p]));
    const byId = new Map(catalogue.map((p) => [p.id, p]));
    const bySku = new Map(catalogue.map((p) => [p.sku, p]));

    const nameCount = new Map<string, number>();
    for (const it of items) {
        const k = it.description.trim().toLowerCase();
        nameCount.set(k, (nameCount.get(k) ?? 0) + 1);
    }

    const rows: BcSalesProductRow[] = items.map((it) => {
        const description = it.description.trim();
        const name =
            (nameCount.get(description.toLowerCase()) ?? 0) > 1
                ? `${description} (${it.itemNo})`
                : description;
        const pricing =
            it.productId !== null ? (byId.get(it.productId) ?? null) : null;
        // Only bars have a refinery; a coin's mint is part of its name.
        const match = pricing?.sku.endsWith('-BAR')
            ? refineryMatch(description)
            : null;
        const refinery = match?.refinery ?? null;

        const textMetal = metalInText(description);
        const range = rangeMetal(it.itemNo);
        const metal: StockMetal | null = pricing
            ? stockMetal(pricing.metalType)
            : textMetal
              ? stockMetal(textMetal)
              : range;

        // The suggestion trusts the words and the item number before the link, so a link to the wrong metal shows up.
        const suggestMetal: MetalType | null =
            textMetal ??
            (range === 'GOLD' || range === 'SILVER' ? range : null) ??
            pricing?.metalType ??
            null;
        const candidates = suggestMetal
            ? (pricingSkuFor(description, suggestMetal)?.candidates ?? [])
            : [];
        const suggestedSku = candidates.find((sku) => bySku.has(sku));

        // Mixed-refiner wording and metal words are noise for every item; mint words only for bars.
        const row: BcSalesProductRow = {
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

        if (it.salesProductId !== null) return { ...row, action: 'LINKED' };
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
        if (
            same &&
            (same.metal !== metal || same.pricingProductId !== pricing.id)
        )
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

    const count = (a: BcSalesProductRow['action']) =>
        rows.filter((r) => r.action === a).length;
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
