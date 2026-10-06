import { RawProduct, RawSpotPrice } from '@goldilocks/shared-types';
import { Decimal } from '../../../prisma/generated/internal/prismaNamespace';
import { Product as PrismaProduct } from '../../../prisma/generated/client';
import { MetalSpotPrice as PrismaSpotPrice } from '../../../prisma/generated/client';

/**
 * The only file the service lane's shared helpers need Prisma for: it turns
 * database rows into the plain shared-types shapes. Providers and cache
 * stores use it; services and pricing math never import Prisma.
 */

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
 * Converts a PrismaSpotPrice record to a RawSpotPrice object.
 * @param record - The PrismaSpotPrice record to convert.
 * @returns The converted RawSpotPrice object.
 */
export function toRawMetalSpotPrice(record: PrismaSpotPrice): RawSpotPrice {
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
export function toRawProduct(product: PrismaProduct): RawProduct {
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
        category: product.category ?? null,

        description: product.description,

        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}
