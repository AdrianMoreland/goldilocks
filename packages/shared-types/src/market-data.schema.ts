import { z } from 'zod';
import { ProductSchema } from './product.schema';
import { SpotPriceSchema, HistoricSpotSchema, MetalTypeEnum } from './spot-price.schema';


export const MarketDataResponseSchema = z.object({
  spotPrices: z.array(SpotPriceSchema),
  historicSpot: z.array(HistoricSpotSchema),
  products: z.array(ProductSchema),
  /** When the market price shown was struck: the vendor's own time, the oldest across spotPrices. Null when there is no price. Not when we fetched it, and not when this request ran. */
  snapshotAt: z.iso.datetime().nullable(),
  /** When we last received these prices from the vendor: the oldest fetch time across spotPrices. The freshness dot follows this. Null when there is no price. */
  lastFetchAt: z.iso.datetime().nullable(),
  /** True while the price cron is paused: nothing refreshes the prices until someone clicks Refresh. */
  autoRefreshPaused: z.boolean(),
  /**
   * Set when one or more metals fell all the way through cache → DB → the
   * live API without finding a usable (non-zero, non-stale) price, so the
   * UI ends up showing €0.00 for them. Null when every metal resolved to a
   * real price. The frontend surfaces this as a toast rather than silently
   * showing zero with no explanation.
   */
  priceWarning: z.string().nullable(),
  /** Same information as priceWarning, structured - lets the UI mark individual metal cards as failed rather than only showing one combined text warning. */
  degradedMetals: z.array(MetalTypeEnum),
});

/** The light poll behind the dashboard's price status: no products, no history. */
export const SpotStatusResponseSchema = MarketDataResponseSchema.pick({
  snapshotAt: true,
  lastFetchAt: true,
  autoRefreshPaused: true,
  degradedMetals: true,
});
export type SpotStatusResponse = z.infer<typeof SpotStatusResponseSchema>;

export const RefreshResponseSchema = z.object({
  spot: SpotPriceSchema,
  products: z.array(ProductSchema),
  snapshotAt: z.iso.datetime().nullable(),
});

// "What if" spot overrides from the UI. A string/NaN/negative here would flow
// straight into price maths, so each value must be a real positive number.
export const RecalculateOverridesSchema = z.object({
  GOLD: z.number().positive().optional(),
  SILVER: z.number().positive().optional(),
  PLATINUM: z.number().positive().optional(),
  PALLADIUM: z.number().positive().optional(),
});
export type RecalculateOverrides = z.infer<typeof RecalculateOverridesSchema>;

// A real calendar day (2026-02-30 is rejected), since the value is turned into
// a Date and used to drive paid vendor calls.
export const HistoricCloseQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
    }, 'Not a real calendar date')
    .optional(),
});
export type HistoricCloseQuery = z.infer<typeof HistoricCloseQuerySchema>;

export type MarketDataResponse = z.infer<typeof MarketDataResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;