import { z } from "zod"
import {MetalType, MetalTypeEnum, FetchSourceEnum} from "@goldilocks/shared-types";

export const ArrowDirectionEnum = z.enum(['up', 'down', 'neutral']);

/**
 * Per-card freshness:
 *  - fresh: recently priced, no issues.
 *  - stale: older than the threshold, but a real price and nothing failed.
 *  - fallback: a live fetch was just attempted and failed — this is the
 *    last-known-good price serving in its place, said explicitly rather
 *    than silently shown as current.
 *  - failed: this metal is in the backend's degradedMetals list — no
 *    usable price anywhere, still showing €0.00.
 */
export const CardFreshnessEnum = z.enum(['fresh', 'stale', 'fallback', 'failed']);

export const MetalCardDataSchema = z.object({
    metal: MetalTypeEnum,
    price: z.number(),
    showChange: z.boolean(),
    change: z.number().optional(),
    changePercent: z.number().optional(),
    direction: z.enum(["up", "down", "neutral"]).optional(),
    isCustomPrice: z.boolean(),
    marketPrice: z.number().optional(),
    freshness: CardFreshnessEnum,
    lastFetchedAt: z.iso.datetime().optional(),
    fetchSource: FetchSourceEnum.optional(),
})

export type MetalCardData = z.infer<typeof MetalCardDataSchema>
