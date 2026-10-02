import { z } from 'zod';

/**
 * The company-wide market condition. Standard is "no mode on"; Volatile is the
 * only one used much, Weekend and Shortage rarely. One shared value, set by an
 * Admin or Manager, that every user's dashboard follows.
 */
export const MarketModeStateSchema = z.object({
  weekend: z.boolean(),
  volatile: z.boolean(),
  shortage: z.boolean(),
  /** Who last changed it (display name); null if it has never been changed. */
  updatedBy: z.string().nullable(),
  updatedAt: z.iso.datetime().nullable(),
});

export const UpdateMarketModeRequestSchema = z.object({
  weekend: z.boolean(),
  volatile: z.boolean(),
  shortage: z.boolean(),
});

export type MarketModeState = z.infer<typeof MarketModeStateSchema>;
export type UpdateMarketModeRequest = z.infer<typeof UpdateMarketModeRequestSchema>;
