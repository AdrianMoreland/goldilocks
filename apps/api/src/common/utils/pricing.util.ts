import {
    MetalType,
    Product,
    SpotPrice,
    HistoricSpot,
    RawProduct,
    RawSpotPrice,
    roundBuyPrice,
    roundSellPrice,
    GRAMS_PER_TROY_OUNCE,
} from '@goldilocks/shared-types';

/**
 * Rounds a number to 2 decimal places.
 * @param value - The number to round.
 * @returns The rounded number.
 */
function round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates the pricing details for a product based on its raw data
 * and a spot-price map.
 * @param product - The raw product data.
 * @param spotMap - A map of metal types to their respective spot prices.
 * @returns The fully priced Product object.
 */
export function calculateProductPrice(
    product: RawProduct,
    spotMap: Record<MetalType, number>,
): Product {
    const marketPrice = spotMap[product.metalType] ?? 0;
    const spotPerGram = marketPrice / GRAMS_PER_TROY_OUNCE;

    const basePrice = spotPerGram * product.weight;

    const priceSellVatExcl = basePrice * (1 + product.spreadSell);
    const priceSell = priceSellVatExcl * (1 + product.vatRate);
    const priceBuy = basePrice * (1 + product.spreadBuy);

    return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        metalType: product.metalType,
        weight: round2(product.weight),
        description: product.description ?? '',

        spreadSell: product.spreadSell,
        spreadBuy: product.spreadBuy,
        vatRate: product.vatRate,

        spotPrice: round2(marketPrice),
        marketValue: round2(basePrice),
        // Quoted prices are whole euros, rounded in the dealer's favour:
        // what we charge rounds up, what we pay rounds down — the same rule
        // the Trade tool's computeTransactionPrice applies.
        priceSell: roundSellPrice(priceSell),
        priceSellVatExcl: roundSellPrice(priceSellVatExcl),
        priceBuy: roundBuyPrice(priceBuy),

        stock: product.stock,
        isActive: product.isActive,
        category: product.category ?? null,

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

/**
 * Merges a base spot-price map with an overrides map.
 * Overrides take precedence over the base values.
 * @param base - The base spot-price map.
 * @param overrides - The overrides map.
 * @returns The merged spot-price map.
 */
export function mergeMetalPrices(
    base: Record<MetalType, number>,
    overrides: Partial<Record<MetalType, number>>,
): Record<MetalType, number> {
    const merged = { ...base };

    for (const metal of Object.keys(overrides) as MetalType[]) {
        const value = overrides[metal];

        if (value !== undefined) {
            merged[metal] = value;
        }
    }

    return merged;
}

/**
 * Spot-price map with all metal types defaulted to 0.
 * Serves as a safe fallback.
 */
export const ZERO_SPOT_MAP: Record<MetalType, number> = {
    GOLD: 0,
    SILVER: 0,
    PLATINUM: 0,
    PALLADIUM: 0,
};

export const ALL_METALS: MetalType[] = [
    'GOLD',
    'SILVER',
    'PLATINUM',
    'PALLADIUM',
];

export const SYMBOL_MAP: Record<MetalType, string> = {
    GOLD: 'XAU',
    SILVER: 'XAG',
    PLATINUM: 'XPT',
    PALLADIUM: 'XPD',
};

export interface HistoricSpotRecord {
    metalType: MetalType;
    priceEur: number;
    priceGbp: number;
    recordedAt: Date;
}

/** How far back the chart can go. Five years of daily rows is ~7,300 per metal-set, so older history is thinned (see thinOldHistory). */
export const HISTORIC_LOOKBACK_DAYS = 5 * 365 + 1;
/** Rows newer than this are sent daily; older ones one per week, which a 5-year chart can't tell apart from daily. */
export const HISTORIC_DAILY_DAYS = 365;
export const HISTORIC_OLD_STEP_DAYS = 7;

/**
 * Keeps every row from the last HISTORIC_DAILY_DAYS, and from before that only
 * one calendar day in seven. The step is anchored to the epoch day, so the
 * same days are chosen on every request and the chart doesn't shimmer.
 */
export function thinOldHistory<T extends { recordedAt: Date }>(
    rows: T[],
    now: Date = new Date(),
): T[] {
    const dayMs = 24 * 60 * 60 * 1000;
    const cutoff = now.getTime() - HISTORIC_DAILY_DAYS * dayMs;
    return rows.filter(
        (row) =>
            row.recordedAt.getTime() >= cutoff ||
            Math.floor(row.recordedAt.getTime() / dayMs) %
                HISTORIC_OLD_STEP_DAYS ===
                0,
    );
}

/**
 * Enriches spot prices with historic data, calculating the previous close,
 * change, and percentage change for each metal type.
 * @param spotPrices - The array of raw spot prices.
 * @param historicMap - A map of metal types to their latest historic spot data.
 * @returns The enriched array of spot prices.
 */
export function enrichSpotPrices(
    spotPrices: RawSpotPrice[],
    historicMap: Map<MetalType, HistoricSpot>,
): SpotPrice[] {
    return spotPrices.map((spot) => {
        const previousEntry = historicMap.get(spot.metalType);
        const previousClose = previousEntry?.priceEur ?? 0;
        const change = spot.priceEur - previousClose;
        const changePercent =
            previousClose !== 0 ? (change / previousClose) * 100 : 0;

        return {
            ...spot,
            previousClose,
            change,
            changePercent,
        };
    });
}
