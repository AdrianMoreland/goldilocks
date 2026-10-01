import type { MetalType, Product } from '@goldilocks/shared-types';

const GRAMS_PER_OUNCE = 31.1035;
const MAX_MATCHES = 8;
/** 1/10 oz is stored as 3.1104 g, so "0.1oz" and "3.1g" must still find it. */
const WEIGHT_TOLERANCE = 0.005;

const METAL_WORDS: Record<string, MetalType> = {
    gold: 'GOLD',
    silver: 'SILVER',
    platinum: 'PLATINUM',
    palladium: 'PALLADIUM',
};

const UNIT_GRAMS: Record<string, number> = {
    g: 1,
    gr: 1,
    gram: 1,
    grams: 1,
    kg: 1000,
    kilo: 1000,
    kilos: 1000,
    kilogram: 1000,
    kilograms: 1000,
    oz: GRAMS_PER_OUNCE,
    ounce: GRAMS_PER_OUNCE,
    ounces: GRAMS_PER_OUNCE,
};

// "100g", "1 oz", "2.5 grams", "1/10oz", "1/10 oz"
const WEIGHT =
    /(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(kilograms?|kilos?|kg|ounces?|oz|grams?|gr|g)\b/g;

/** Words that say what kind of thing is wanted, not which product. */
const FILLER = new Set(
    (
        'a an the of for in to and or with please price prices pricing cost costs buy buyback sell selling how much ' +
        'is are what whats do you have your our me my we it one some any current now today stock available ' +
        'quote quotes bar bars coin coins bullion piece pieces unit units'
    ).split(' '),
);

export interface ProductMatch {
    products: Product[];
    /** More than one product fits; the reader should list them or ask which. */
    ambiguous: boolean;
}

function fractionOrNumber(raw: string): number {
    if (raw.includes('/')) {
        const [top, bottom] = raw.split('/').map(Number);
        return bottom ? top / bottom : Number.NaN;
    }
    return Number(raw.replace(',', '.'));
}

/** Every weight mentioned in the text, in grams. */
export function parseWeightsGrams(text: string): number[] {
    const grams: number[] = [];
    for (const match of text.toLowerCase().matchAll(WEIGHT)) {
        const value = fractionOrNumber(match[1]);
        const unit = UNIT_GRAMS[match[2]];
        if (Number.isFinite(value) && value > 0 && unit)
            grams.push(value * unit);
    }
    return grams;
}

/**
 * Finds the catalogue products a free-text request is about — "100g gold
 * bar", "1oz Krugerrand", "silver coins". Pure and deterministic. A request
 * with no metal, weight or product word matches nothing: "gold" alone is
 * every gold product, which is a question to ask the customer, not an answer.
 */
export function matchProducts(
    products: Product[],
    query: string,
    metal?: MetalType,
): ProductMatch {
    const text = query.toLowerCase();

    const wantedMetal =
        metal ??
        Object.entries(METAL_WORDS).find(([word]) =>
            new RegExp(`\\b${word}\\b`).test(text),
        )?.[1];
    const weights = parseWeightsGrams(text);

    const words = text
        .replace(WEIGHT, ' ')
        .split(/[^a-z0-9']+/)
        .filter(
            (word) =>
                word.length > 1 && !FILLER.has(word) && !(word in METAL_WORDS),
        );
    const wantsBar = /\bbars?\b/.test(text);
    const wantsCoin = /\bcoins?\b/.test(text);

    if (!wantedMetal && weights.length === 0 && words.length === 0) {
        return { products: [], ambiguous: false };
    }
    // A metal on its own is too broad to be a lookup.
    if (weights.length === 0 && words.length === 0 && !wantsBar && !wantsCoin) {
        return { products: [], ambiguous: false };
    }

    const scored: { product: Product; score: number }[] = [];
    for (const product of products) {
        if (!product.isActive) continue;
        if (wantedMetal && product.metalType !== wantedMetal) continue;
        if (
            weights.length > 0 &&
            !weights.some(
                (grams) =>
                    Math.abs(product.weight - grams) / grams <=
                    WEIGHT_TOLERANCE,
            )
        ) {
            continue;
        }

        const label = `${product.name} ${product.sku}`.toLowerCase();
        const isBar = /\bbar\b/.test(product.name.toLowerCase());
        let score = 0;
        for (const word of words) if (label.includes(word)) score += 2;
        if (words.length > 0 && score === 0) continue;
        if (wantsBar && isBar) score += 1;
        if (wantsBar && !isBar) continue;
        if (wantsCoin && !isBar) score += 1;
        if (wantsCoin && isBar) continue;

        scored.push({ product, score });
    }

    scored.sort(
        (a, b) =>
            b.score - a.score ||
            a.product.weight - b.product.weight ||
            a.product.name.localeCompare(b.product.name),
    );
    const matches = scored.slice(0, MAX_MATCHES).map((s) => s.product);
    return { products: matches, ambiguous: matches.length > 1 };
}
