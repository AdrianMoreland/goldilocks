import { z } from 'zod';
import { MetalTypeEnum } from './spot-price.schema';

/** What triggered a call to the external metal-price vendor API. */
export const FetchTriggerEnum = z.enum(['CRON', 'REFRESH', 'RETRY', 'LAUNCH_FALLBACK']);

export const FetchAttemptSchema = z.object({
  id: z.string(),
  attemptedAt: z.iso.datetime(),
  durationMs: z.number(),
  success: z.boolean(),
  errorMessage: z.string().nullable(),
  metalsResolved: z.array(MetalTypeEnum),
  triggeredBy: FetchTriggerEnum,
});

export const FetchMetricsSchema = z.object({
  /** Fraction (0-1) of external API calls in the last 24h that succeeded. 1 when there were none to judge. */
  successRate24h: z.number(),
  totalAttempts24h: z.number(),
  failureCount24h: z.number(),
  avgLatencyMs: z.number(),
  /** Fraction (0-1) of the launch-page-load cascade's cache reads that hit — in-memory since process start, not a 24h window. */
  cacheHitRatio: z.number(),
});

export type FetchTrigger = z.infer<typeof FetchTriggerEnum>;
export type FetchAttempt = z.infer<typeof FetchAttemptSchema>;
export type FetchMetrics = z.infer<typeof FetchMetricsSchema>;
