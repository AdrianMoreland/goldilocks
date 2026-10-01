import { z } from 'zod';
import { ProductSchema } from './product.schema';
import { SpotPriceSchema, HistoricSpotSchema, MetalTypeEnum } from './spot-price.schema';


export const MarketDataResponseSchema = z.object({
  spotPrices: z.array(SpotPriceSchema),
  historicSpot: z.array(HistoricSpotSchema),
  products: z.array(ProductSchema),
  /** The actual timestamp of the spot-price snapshot being shown — the oldest `timestamp` across spotPrices, not "when the request happened". A cache/DB hit can be minutes old even though the request itself just ran. */
  fetchedAt: z.iso.datetime(),
  /**
   * Set when one or more metals fell all the way through cache → DB → the
   * live API without finding a usable (non-zero, non-stale) price, so the
   * UI ends up showing €0.00 for them. Null when every metal resolved to a
   * real price. The frontend surfaces this as a toast rather than silently
   * showing zero with no explanation.
   */
  priceWarning: z.string().nullable(),
  /** Same information as priceWarning, structured — lets the UI mark individual metal cards as failed rather than only showing one combined text warning. */
  degradedMetals: z.array(MetalTypeEnum),
});

export const RefreshResponseSchema = z.object({
  spot: SpotPriceSchema,
  products: z.array(ProductSchema),
  fetchedAt: z.iso.datetime(),
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