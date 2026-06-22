// web/src/lib/api.ts
import { z } from "zod";

// Define the product schema according to your backend DTO
export const ProductSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  weight: z.number(),

  metalType: z.enum(['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']), // ✅ strict

  description: z.string(),

  spreadBuy: z.number(),
  spreadSell: z.number(),

  priceBuy: z.number(),
  priceSell: z.number(),
  priceSellVatExcl: z.number(),

  vatRate: z.number(),
  stock: z.number(),
  isActive: z.boolean(),

  spotPrice: z.number(), // ✅ REQUIRED

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ProductDTO = z.infer<typeof ProductSchema>;

export type SpotOverrideRequest = Partial<Record<MetalType, number>>;
// ─────────────────────────────────────────────────────────────────────────────
// Spot prices
//
// MUST match the backend GetLastSnapshotDto exactly:
//
//   id                    string
//   metalType             'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM'
//   currency              string   ('USD')
//   currentPrice          number
//   previousPrice         number
//   priceChangePercentage number
//   timestamp             Date/string  (ISO string over the wire)
//   updatedAt             Date/string
//   __v                   number
//
// The old schema used `metal` and `price` — those were wrong field names
// that would always fail to parse a real backend response.
// ───────────────────────────────────────────────────────────
export const MetalTypeEnum = z.enum(['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']);
export type MetalType = z.infer<typeof MetalTypeEnum>;



export const SpotPriceSchema = z.object({
  id: z.string(),
  metalType: MetalTypeEnum,
  currency: z.string(),
  currentPrice: z.number(),
  previousPrice: z.number(),
  priceChangePercentage: z.number(),
  timestamp: z.string(),   // ISO date string from JSON serialisation
  updatedAt: z.string(),
  __v: z.number(),
});

export type SpotPriceDTO = z.infer<typeof SpotPriceSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Convenience: spot prices keyed by metal (used by dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export const SpotPriceMapSchema = z.record(MetalTypeEnum, SpotPriceSchema);
export type SpotPriceMapDTO = z.infer<typeof SpotPriceMapSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Combined shape for endpoints that return products + spot prices together
// ─────────────────────────────────────────────────────────────────────────────

export const SpotAndProductsSchema = z.object({
  products: z.array(ProductSchema),
  spotPrices: SpotPriceMapSchema,
});

export type SpotAndProductsDTO = z.infer<typeof SpotAndProductsSchema>;


/*
export const SpotPriceSchema = z.object({
  metal: z.enum(['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']),
  price: z.number(),
  currency: z.string(),
  timestamp: z.number(),

  previousPrice: z.number().optional(),
  changePercent: z.number().optional(),
});

export type SpotPriceDTO = z.infer<typeof SpotPriceSchema>;

// Define a schema for all spot prices
export const SpotPricesSchema = z.object({
  GOLD: SpotPriceSchema.optional(),
  SILVER: SpotPriceSchema.optional(),
  PLATINUM: SpotPriceSchema.optional(),
  PALLADIUM: SpotPriceSchema.optional(),
});

export type SpotPricesDTO = z.infer<typeof SpotPricesSchema>;

// Define a combined schema for the API response that includes both products and spot prices
export const SpotAndProductsSchema = z.object({
  products: z.array(ProductSchema),
  spotPrices: SpotPricesSchema,
});

export type SpotAndProductsDTO = z.infer<typeof SpotAndProductsSchema>;*/

// Generic fetch helper
export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}