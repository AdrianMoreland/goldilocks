import { z } from 'zod';
import { MetalTypeEnum } from './spot-price.schema';

// ============================================================================
// TRADE TAB — buy/sell cart + melt calculator
//
// Ported from the Merrion Gold Apps Script tool's Api.Trade.gs /
// Api.Melt.gs. Unlike the spreadsheet version, there is no per-row
// "productSpot" snapshot to scale against — Goldilocks always prices a
// product live from (spot / troy-ounce) * weight, so the scaling step
// (computeAdjustedProductSpot in the original) is unnecessary here.
// ============================================================================

export const TradeTransactionTypeEnum = z.enum(['buying', 'selling']);
export type TradeTransactionType = z.infer<typeof TradeTransactionTypeEnum>;

// A product as offered in the Trade tab's dropdown — premium/discount are
// just the product's own spreadSell/spreadBuy expressed as a percentage,
// so no display-string parsing (unlike the spreadsheet version) is needed.
export const TradeProductSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  weight: z.number(),
  metalType: MetalTypeEnum,
  premiumPct: z.number(),
  discountPct: z.number(),
});
export type TradeProduct = z.infer<typeof TradeProductSchema>;

export const TradeBootstrapResponseSchema = z.object({
  metalType: MetalTypeEnum,
  spot: z.number(),
  minSpot: z.number(),
  maxSpot: z.number(),
  products: z.array(TradeProductSchema),
});
export type TradeBootstrapResponse = z.infer<typeof TradeBootstrapResponseSchema>;

export const TradeCartItemRequestSchema = z.object({
  productId: z.number(),
  quantity: z.coerce.number().int().min(1).default(1),
  percent: z.coerce.number().min(0),
});
export type TradeCartItemRequest = z.infer<typeof TradeCartItemRequestSchema>;

export const TradeCartRequestSchema = z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  customSpot: z.coerce.number().positive().optional(),
  items: z.array(TradeCartItemRequestSchema).min(1),
});
export type TradeCartRequest = z.infer<typeof TradeCartRequestSchema>;

export const TradeCartLineSchema = z.object({
  productId: z.number(),
  product: z.string(),
  sku: z.string(),
  weight: z.number(),
  quantity: z.number(),
  percent: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
});
export type TradeCartLine = z.infer<typeof TradeCartLineSchema>;

export const TradeCartResponseSchema = z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  spot: z.number(),
  lines: z.array(TradeCartLineSchema),
  totalWeight: z.number(),
  averagePerGram: z.number(),
  totalPrice: z.number(),
});
export type TradeCartResponse = z.infer<typeof TradeCartResponseSchema>;

// ============================================================================
// MELT / SCRAP CALCULATOR
//
// Only GOLD and SILVER have configured melt categories — Merrion Gold does
// not melt-buy platinum/palladium, matching the original MG_MELT_DATA.
// ============================================================================

export const MeltCategoryKeyEnum = z.enum(['24ct', '22ct', '90%', 'Silver']);
export type MeltCategoryKey = z.infer<typeof MeltCategoryKeyEnum>;

export const MeltCategoryDataSchema = z.object({
  metal: MetalTypeEnum,
  meltFactor: z.number(),
  purity: z.number(),
});
export type MeltCategoryData = z.infer<typeof MeltCategoryDataSchema>;

export const MeltCalculatorRequestSchema = z.object({
  category: MeltCategoryKeyEnum,
  weight: z.coerce.number().positive(),
});
export type MeltCalculatorRequest = z.infer<typeof MeltCalculatorRequestSchema>;

export const MeltCalculatorResponseSchema = z.object({
  category: MeltCategoryKeyEnum,
  metal: MetalTypeEnum,
  spot: z.number(),
  spotPerGram: z.number(),
  meltFactor: z.number(),
  purity: z.number(),
  weight: z.number(),
  meltValue: z.number(),
});
export type MeltCalculatorResponse = z.infer<typeof MeltCalculatorResponseSchema>;

// ============================================================================
// STATIC CONFIG — ported verbatim from the Apps Script tool's Config.gs
// ============================================================================

export const TRADE_METAL_SLIDER_BOUNDS: Record<
  z.infer<typeof MetalTypeEnum>,
  { min: number; max: number }
> = {
  GOLD: { min: 1000, max: 5000 },
  SILVER: { min: 10, max: 150 },
  PLATINUM: { min: 500, max: 3000 },
  PALLADIUM: { min: 500, max: 3000 },
};

export const MELT_CATEGORIES: Record<MeltCategoryKey, MeltCategoryData> = {
  '24ct': { metal: 'GOLD', meltFactor: 0.85, purity: 1.0 },
  '22ct': { metal: 'GOLD', meltFactor: 0.78776, purity: 0.916 },
  '90%': { metal: 'GOLD', meltFactor: 0.729, purity: 0.9 },
  Silver: { metal: 'SILVER', meltFactor: 0.8, purity: 0.9 },
};
