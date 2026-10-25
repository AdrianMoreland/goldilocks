import {
    MetalType,
    SpotPrice,
    HistoricSpot,
    RawSpotPrice,
} from '@goldilocks/shared-types';

// The product pricing engine lives in shared-types so every app prices a product the same way.
export {
    calculateProductPrice,
    mergeMetalPrices,
} from '@goldilocks/shared-types';

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
