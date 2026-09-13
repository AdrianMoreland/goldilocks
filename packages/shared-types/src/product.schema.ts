import { z } from 'zod';
import {MetalTypeEnum} from "./spot-price.schema";

// ============================================================================
// PRODUCT WRAPPERS
// ============================================================================
const isoDateString = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return undefined;
}, z.iso.datetime());

export const ProductSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  metalType: MetalTypeEnum,

  weight: z.number(),

  spotPrice: z.number(),
  spreadBuy: z.number(),
  spreadSell: z.number(),

  vatRate: z.number(),

  description: z.string(),

  // Calculated fields
  // Raw market value of this product's own weight at the current spot price
  // (spot / troy oz * weight) — no premium/discount/VAT applied. Distinct
  // from `spotPrice`, which is the flat per-ounce metal price and is the
  // same for every product of a metal; this is what the product table's
  // "Market Price" column shows per row.
  marketValue: z.number(),
  priceSell: z.number(),
  priceSellVatExcl: z.number(),
  priceBuy: z.number(),

  stock: z.number(),
  isActive: z.boolean(),

  updatedAt: isoDateString,
  createdAt: isoDateString,
});

// Raw product — what the data source actually stores, before any pricing
// calculation is applied. This is the type providers (Prisma/Redis-aware)
// hand to pure pricing functions and services. No spotPrice, no priceSell/
// priceBuy, no isActive — those only exist after calculateProductPrice().
export const RawProductSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  metalType: MetalTypeEnum,
  weight: z.number(),
  spreadBuy: z.number(),
  spreadSell: z.number(),
  vatRate: z.number(),
  stock: z.number(),
  description: z.string().nullable().optional(),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});

// Create Product DTO schema
export const CreateProductDtoSchema = z.object({
  sku: z.string(),
  name: z.string(),
  metalType: MetalTypeEnum,
  weight: z.number(),
  spreadBuy: z.number(),
  spreadSell: z.number(),
  vatRate: z.number(),
  stock: z.number(),
  description: z.string().optional(),
});

export const UpdateProductFullDtoSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().extend({
  // still allow explicit optional overrides for calculated/update-only fields
  priceSell: z.number().optional(),
  priceBuy: z.number().optional(),
  isActive: z.boolean().optional(),
});


export const ProductsSchema = z.array(ProductSchema);
export const ProductArraySchema = z.array(ProductSchema);
export const ProductMapSchema = z.record(MetalTypeEnum, ProductSchema);
export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductMapDTO = z.infer<typeof ProductMapSchema>;
export type UpdateProductFullDto = z.infer<typeof UpdateProductFullDtoSchema>;
export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
export type RawProduct = z.infer<typeof RawProductSchema>;