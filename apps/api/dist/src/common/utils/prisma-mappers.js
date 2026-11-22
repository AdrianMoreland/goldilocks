"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = toNumber;
exports.toRawMetalSpotPrice = toRawMetalSpotPrice;
exports.toRawProduct = toRawProduct;
const prismaNamespace_1 = require("../../../prisma/generated/internal/prismaNamespace");
function toNumber(value) {
    if (value === undefined || value === null)
        return 0;
    if (value instanceof prismaNamespace_1.Decimal)
        return value.toNumber();
    return value;
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
        category: product.category ?? null,
        description: product.description,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
}
//# sourceMappingURL=prisma-mappers.js.map