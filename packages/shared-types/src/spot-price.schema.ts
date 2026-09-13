import { z } from 'zod';

// ============================================================================
// SPOT PRICE WRAPPERS
// ============================================================================

// ============================================================================
// ENUMS & BASIC TYPES
// ============================================================================
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'done']);

export const MetalTypeEnum = z.enum(['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']);

export const MetalSymbolSchema = z.enum(['XAU', 'XAG', 'XPT', 'XPD']);


// ============================================================================
// CORE SCHEMAS
// ============================================================================

// Base Task schema
export const SpotPriceSchema = z.object({
  id: z.string(),
  metalType: MetalTypeEnum,
  priceEur: z.number(),
  priceGbp: z.number(),
  previousClose: z.number(),
  change: z.number(),
  changePercent: z.number(),
  source: z.string(),
  timestamp: z.iso.datetime(),
  createdAt: z.iso.datetime()
});

export const RawSpotPriceSchema = z.object({
  id: z.string(),
  metalType: MetalTypeEnum,
  priceEur: z.number(),
  priceGbp: z.number(),
  source: z.string(),
  timestamp: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const HistoricSpotSchema = z.object({
  metalType: MetalTypeEnum,
  priceEur: z.number(),
  priceGbp: z.number(),
  timestamp: z.iso.datetime(),
});

// Create Task DTO schema
export const CreateSpotPriceDtoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional().default(''),
});

export const SpotPriceArraySchema = z.array(SpotPriceSchema);

export const SpotPriceMapSchema = z.record(MetalTypeEnum, SpotPriceSchema);

// Query params schema for filtering tasks
export const TaskQueryParamsSchema = z.object({
  status: TaskStatusSchema.optional(),
  search: z.string().optional(),
});


// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TaskQueryParams = z.infer<typeof TaskQueryParamsSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type MetalType = z.infer<typeof MetalTypeEnum>;
export type MetalSymbol = z.infer<typeof MetalSymbolSchema>;
export type SpotPrice = z.infer<typeof SpotPriceSchema>;
export type HistoricSpot = z.infer<typeof HistoricSpotSchema>;
export type CreateSpotPriceDto = z.infer<typeof CreateSpotPriceDtoSchema>;
export type SpotPriceMapDTO = z.infer<typeof SpotPriceMapSchema>;
export type RawSpotPrice = z.infer<typeof RawSpotPriceSchema>;
