import { z } from 'zod';
import { MetalTypeEnum } from './spot-price.schema';
import type { PortfolioProductTypeFilter, PriorityStrength } from './portfolio-builder-math';

// ============================================================================
// PORTFOLIO — P/L subtab (profit analysis)
//
// Ported from the Apps Script tool's Api.Pricing.gs calculateProfitAnalysis,
// built on the solveMissingPurchaseField/computeCurrentBuybackValue/
// computeProfit/computeRequiredSpotForTarget functions in pricing-math.ts.
// The Scenario and Builder subtabs don't need a backend contract: Scenario
// is pure client arithmetic, and Builder is a future addition.
// ============================================================================

export const ProfitAnalysisMissingFieldEnum = z.enum(['spot', 'premium', 'price']);
export type ProfitAnalysisMissingFieldDto = z.infer<typeof ProfitAnalysisMissingFieldEnum>;

export const ProfitAnalysisRequestSchema = z.object({
  metalType: MetalTypeEnum,
  productId: z.number(),
  purchaseSpot: z.coerce.number(),
  purchasePremium: z.coerce.number(),
  purchasePrice: z.coerce.number(),
  missingField: ProfitAnalysisMissingFieldEnum,
  currentSpot: z.coerce.number().positive(),
  currentDiscount: z.coerce.number().min(0).max(99.99),
  targetProfit: z.coerce.number().min(0),
});
export type ProfitAnalysisRequest = z.infer<typeof ProfitAnalysisRequestSchema>;

export const ProfitAnalysisResponseSchema = z.object({
  product: z.string(),
  productMultiplier: z.number(),
  purchaseSpot: z.number(),
  purchasePremium: z.number(),
  purchasePrice: z.number(),
  currentSpot: z.number(),
  currentDiscount: z.number(),
  currentBuybackValue: z.number(),
  profit: z.number(),
  profitPercent: z.number(),
  requiredSpot: z.number(),
  requiredPrice: z.number(),
  targetProfit: z.number(),
  targetReturn: z.number(),
});
export type ProfitAnalysisResponse = z.infer<typeof ProfitAnalysisResponseSchema>;

// ============================================================================
// PORTFOLIO — Builder subtab
//
// Ported from Api.Portfolio.gs / PortfolioMath.gs. See portfolio-builder-math.ts
// for the actual candidate-building/scoring algorithm.
// ============================================================================

// The plain TS union types these validate against live in
// portfolio-builder-math.ts (the pure-math module) — imported here rather
// than redeclared, so there's exactly one definition of each.
export const PortfolioProductTypeFilterEnum = z.enum(['either', 'bar', 'coin']) satisfies z.ZodType<PortfolioProductTypeFilter>;

export const PriorityStrengthEnum = z.enum(['none', 'low', 'medium', 'high']) satisfies z.ZodType<PriorityStrength>;

export const PortfolioBuildRequestSchema = z.object({
  metalType: MetalTypeEnum,
  budget: z.coerce.number().positive(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: z.number().optional(),
  priorityStrength: PriorityStrengthEnum,
});
export type PortfolioBuildRequest = z.infer<typeof PortfolioBuildRequestSchema>;

export const PortfolioLineItemSchema = z.object({
  product: z.string(),
  quantity: z.number(),
  weight: z.number(),
  totalWeight: z.number(),
  unitPrice: z.number(),
  totalValue: z.number(),
  premium: z.number(),
  type: z.enum(['bar', 'coin']),
  isPriority: z.boolean(),
});
export type PortfolioLineItemDto = z.infer<typeof PortfolioLineItemSchema>;

export const PortfolioStrategyResultSchema = z.object({
  strategy: z.object({
    id: z.enum(['maximum', 'balanced', 'flexible']),
    name: z.string(),
    badge: z.string(),
    description: z.string(),
  }),
  totalInvested: z.number(),
  unspent: z.number(),
  totalGrams: z.number(),
  averagePerGram: z.number(),
  averagePremium: z.number(),
  pieces: z.number(),
  largestPositionPercent: z.number(),
  flexibilityScore: z.number(),
  priorityQuantity: z.number(),
  priorityShare: z.number(),
  items: z.array(PortfolioLineItemSchema),
});
export type PortfolioStrategyResultDto = z.infer<typeof PortfolioStrategyResultSchema>;

export const PortfolioBuildResponseSchema = z.object({
  metalType: MetalTypeEnum,
  budget: z.number(),
  productType: PortfolioProductTypeFilterEnum,
  priorityProductId: z.number().nullable(),
  priorityStrength: PriorityStrengthEnum,
  results: z.array(PortfolioStrategyResultSchema),
});
export type PortfolioBuildResponse = z.infer<typeof PortfolioBuildResponseSchema>;
