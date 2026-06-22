import { z } from 'zod';
import { ProductSchema } from './product.schema';
import { SpotPriceSchema, HistoricSpotSchema } from './spot-price.schema';


export const MarketDataResponseSchema = z.object({
  spotPrices: z.array(SpotPriceSchema),
  historicSpot: z.array(HistoricSpotSchema),
  products: z.array(ProductSchema),
  fetchedAt: z.iso.datetime(),
});

export const RefreshResponseSchema = z.object({
  spot: SpotPriceSchema,
  products: z.array(ProductSchema),
  fetchedAt: z.iso.datetime(),
});

export type MarketDataResponse = z.infer<typeof MarketDataResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;