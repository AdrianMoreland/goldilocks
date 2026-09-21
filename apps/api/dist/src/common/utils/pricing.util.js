"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HISTORIC_LOOKBACK_DAYS = exports.SYMBOL_MAP = exports.ALL_METALS = exports.ZERO_SPOT_MAP = void 0;
exports.toNumber = toNumber;
exports.toRawMetalSpotPrice = toRawMetalSpotPrice;
exports.toRawProduct = toRawProduct;
exports.calculateProductPrice = calculateProductPrice;
exports.mergeMetalPrices = mergeMetalPrices;
exports.enrichSpotPrices = enrichSpotPrices;
const prismaNamespace_1 = require("../../../prisma/generated/internal/prismaNamespace");
const GRAMS_PER_TROY_OUNCE = 31.1;
function toNumber(value) {
    if (value === undefined || value === null)
        return 0;
    if (value instanceof prismaNamespace_1.Decimal)
        return value.toNumber();
    return value;
}
function round2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
function toRawMetalSpotPrice(record) {
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
function toRawProduct(product) {
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
        isActive: product.isActive,
        description: product.description,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}
function calculateProductPrice(product, spotMap) {
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
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}
function mergeMetalPrices(base, overrides) {
    const merged = { ...base };
    for (const metal of Object.keys(overrides)) {
        const value = overrides[metal];
        if (value !== undefined) {
            merged[metal] = value;
        }
    }
    return merged;
}
exports.ZERO_SPOT_MAP = {
    GOLD: 0,
    SILVER: 0,
    PLATINUM: 0,
    PALLADIUM: 0,
};
exports.ALL_METALS = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];
exports.SYMBOL_MAP = {
    GOLD: 'XAU',
    SILVER: 'XAG',
    PLATINUM: 'XPT',
    PALLADIUM: 'XPD',
};
exports.HISTORIC_LOOKBACK_DAYS = 365;
function enrichSpotPrices(spotPrices, historicMap) {
    return spotPrices.map((spot) => {
        const previousEntry = historicMap.get(spot.metalType);
        const previousClose = previousEntry?.priceEur ?? 0;
        const change = spot.priceEur - previousClose;
        const changePercent = previousClose !== 0
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
//# sourceMappingURL=pricing.util.js.map