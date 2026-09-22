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

export type MarketDataResponse = z.infer<typeof MarketDataResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;