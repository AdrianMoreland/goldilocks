import {
    MetalType,
    Product,
    SpotPrice,
    HistoricSpot,
    RawProduct,
    RawSpotPrice
} from '@goldilocks/shared-types';
import { Decimal } from "../../../prisma/generated/internal/prismaNamespace";
import {Product as PrismaProduct} from '../../../prisma/generated/client'
import {MetalSpotPrice as PrismaSpotPrice } from '../../../prisma/generated/client'

const GRAMS_PER_TROY_OUNCE = 31.1;

/**
 * Converts a Decimal, number, or undefined/null value to a number.
 * Returns 0 if the value is undefined or null.
 * @param value - The value to convert.
 * @returns The numeric value.
 */
export function toNumber(value: Decimal | number | undefined | null): number {
    if (value === undefined || value === null) return 0;
    if (value instanceof Decimal) return value.toNumber();
    return value;
}


/**
 * Rounds a number to 2 decimal places.
 * @param value - The number to round.
 * @returns The rounded number.
 */
function round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}


/*
export function toRawMetalSpotPrice(
    record: PrismaSpotPrice | RawMetalRecord
): RawSpotPrice {
    return {
        id: (record as PrismaSpotPrice).id?.toString() ?? '',
        metalType: record.metalType,
        priceEur: toNumber(record.priceEur),
        priceGbp: toNumber(record.priceGbp),
        source: record.source,
        createdAt: (record as PrismaSpotPrice).createdAt
            ? (record as PrismaSpotPrice).createdAt.toISOString()
            : new Date().toISOString(),
        timestamp: record.timestamp ? record.timestamp.toISOString() : new Date().toISOString(),
    };
}
*/

/**
 * Converts a PrismaSpotPrice record to a RawSpotPrice object.
 * @param record - The PrismaSpotPrice record to convert.
 * @returns The converted RawSpotPrice object.
 */
export function toRawMetalSpotPrice(
    record: PrismaSpotPrice,
): RawSpotPrice {
    return {
        id: record.id.toString(),
        metalType: record.metalType,
        priceEur: toNumber(record.priceEur),
        priceGbp: toNumber(record.priceGbp),
        source: record.source,
        createdAt: record.createdAt.toISOString(),
        timestamp: record.timestamp.toISOString(),
    };
}

/**
 * Converts a PrismaProduct record to a RawProduct object.
 * @param product - The PrismaProduct record to convert.
 * @returns The converted RawProduct object.
 */
export function toRawProduct(
    product: PrismaProduct,
): RawProduct{
    return {
        id: product.id,
        sku: product.sku,
        name: product.name,

        metalType: product.metalType,

        weight: toNumber(product.weight),

        spreadBuy: toNumber(product.spreadBuy),
        spreadSell: toNumber(product.spreadSell),
        vatRate: toNumber(product.vatRate),

        stock: product.stock,

        description: product.description,

        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
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
        priceSell: round2(priceSell),
        priceSellVatExcl: round2(priceSellVatExcl),
        priceBuy: round2(priceBuy),

        stock: product.stock,
        isActive: true,

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

/**
 * Empty metal rates with EUR and GBP values defaulted to 0.
 * Used as a fallback for metal rates.
 */
export const EMPTY_METAL_RATES: Record<MetalType, { eur: number; gbp: number }> = {
    GOLD: { eur: 0, gbp: 0 },
    SILVER: { eur: 0, gbp: 0 },
    PLATINUM: { eur: 0, gbp: 0 },
    PALLADIUM: { eur: 0, gbp: 0 },
};

export const ALL_METALS: MetalType[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];

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

export const HISTORIC_LOOKBACK_DAYS = 365;

/**
 * Enriches spot prices with historic data, calculating the previous close,
 * change, and percentage change for each metal type.
 * @param spotPrices - The array of raw spot prices.
 * @param historicMap - A map of metal types to their latest historic spot data.
 * @returns The enriched array of spot prices.
 */
export function enrichSpotPrices(
    spotPrices: RawSpotPrice[],
    historicMap: Map<MetalType, HistoricSpot>
): SpotPrice[] {
    return spotPrices.map((spot) => {
        const previousEntry = historicMap.get(spot.metalType);
        const previousClose = previousEntry?.priceEur ?? 0;
        const change = spot.priceEur - previousClose;
        const changePercent =
            previousClose !== 0
                ? (change / previousClose) * 100
                : 0;

        return {
            ...spot,
            previousClose,
            change,
            changePercent,
        };
    });
}