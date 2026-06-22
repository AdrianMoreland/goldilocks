import {Product, MetalType, RawProduct} from '@goldilocks/shared-types';
import {Decimal} from "../../../prisma/generated/internal/prismaNamespace";
import {Product as PrismaProduct} from '../../../prisma/generated/client'

const GRAMS_PER_TROY_OUNCE = 31.1;

export function toNumber(value: Decimal | number | undefined): number {
    if (!value) return 0;
    if (value instanceof Decimal) return value.toNumber();
    return value;
}

function round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Pure pricing calculation.
 *
 * Takes a RawProduct (the shared, data-source-agnostic shape) and a
 * spot-price map, and returns a fully priced Product. No Prisma, no
 * Decimal, no NestJS, no I/O — just math against shared types, so it's
 * trivially unit-testable and has zero knowledge of where RawProduct
 * actually came from.
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
        priceSell: round2(priceSell),
        priceSellVatExcl: round2(priceSellVatExcl),
        priceBuy: round2(priceBuy),

        stock: product.stock,
        isActive: true,

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}


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

/** Spot map with every metal defaulted to 0 — a safe fallback. */
export const ZERO_SPOT_MAP: Record<MetalType, number> = {
    GOLD: 0,
    SILVER: 0,
    PLATINUM: 0,
    PALLADIUM: 0,
};