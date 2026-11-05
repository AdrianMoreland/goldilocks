import { z } from 'zod';

/**
 * Stock position from the stocktake models: bars by serial and coins by quantity, taken from one stocktake (the newest
 * unless another is asked for). An imported stocktake is a sheet loaded from the import workbook, not a count done in
 * Goldilocks, and is labelled so. A bar counts as held for a customer when an open customer order names its serial.
 * Free-to-sell figures are not here: they need every product name tied to a sales product first.
 */

export const StockMetalSchema = z.enum(['GOLD', 'SILVER', 'PGM']);

export const InventoryStocktakeRefSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  countDate: z.string(),
  status: z.string(),
  /** Loaded from the import workbook rather than counted here. */
  imported: z.boolean(),
});
export type InventoryStocktakeRef = z.infer<typeof InventoryStocktakeRefSchema>;

export const InventoryPositionSchema = z.object({
  /** The stocktake the figures come from; null when none exists yet. */
  stocktake: InventoryStocktakeRefSchema.nullable(),
  /** The newest stocktakes, for choosing another. */
  available: z.array(InventoryStocktakeRefSchema),
  bars: z.object({
    total: z.number().int(),
    byMetal: z.record(z.string(), z.number().int()),
    /** Bars whose serial an open customer order names. */
    heldForCustomers: z.number().int(),
    /** Bars the stocktake lists as gone. */
    gone: z.number().int(),
  }),
  coins: z.object({
    lines: z.number().int(),
    /** Counted pieces, where a count exists. */
    pieces: z.number().int(),
    byMetal: z.record(z.string(), z.number().int()),
    uncounted: z.number().int(),
  }),
});
export type InventoryPosition = z.infer<typeof InventoryPositionSchema>;

export const InventoryBarsQuerySchema = z.object({
  stocktakeId: z.coerce.number().int().positive().optional(),
  metal: StockMetalSchema.optional(),
  branch: z.string().trim().max(10).optional(),
  where: z.enum(['held', 'free']).optional(),
  /** A serial, or part of one. Never a name. */
  q: z.string().trim().max(40).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type InventoryBarsQuery = z.infer<typeof InventoryBarsQuerySchema>;

export const InventoryBarRowSchema = z.object({
  id: z.number().int(),
  serial: z.string().nullable(),
  refinery: z.string().nullable(),
  weightLabel: z.string(),
  metal: StockMetalSchema,
  locationCode: z.string(),
  status: z.string(),
  details: z.string().nullable(),
  /** The open customer order that names this serial, if any. */
  heldFor: z
    .object({ orderId: z.number().int(), reference: z.string().nullable(), client: z.string(), status: z.string() })
    .nullable(),
});
export type InventoryBarRow = z.infer<typeof InventoryBarRowSchema>;

export const InventoryBarsResponseSchema = z.object({ total: z.number().int(), rows: z.array(InventoryBarRowSchema) });
export type InventoryBarsResponse = z.infer<typeof InventoryBarsResponseSchema>;

export const InventoryCoinsQuerySchema = z.object({
  stocktakeId: z.coerce.number().int().positive().optional(),
  metal: StockMetalSchema.optional(),
  branch: z.string().trim().max(10).optional(),
});
export type InventoryCoinsQuery = z.infer<typeof InventoryCoinsQuerySchema>;

export const InventoryCoinRowSchema = z.object({
  id: z.number().int(),
  item: z.string(),
  metal: StockMetalSchema,
  locationCode: z.string(),
  previousQty: z.number().int().nullable(),
  countedQty: z.number().int().nullable(),
  details: z.string().nullable(),
});
export type InventoryCoinRow = z.infer<typeof InventoryCoinRowSchema>;

export const InventoryCoinsResponseSchema = z.object({ rows: z.array(InventoryCoinRowSchema) });
export type InventoryCoinsResponse = z.infer<typeof InventoryCoinsResponseSchema>;
