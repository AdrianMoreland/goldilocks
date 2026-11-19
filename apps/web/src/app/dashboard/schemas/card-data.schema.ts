import { z } from "zod"
import {MetalTypeEnum, FetchSourceEnum} from "@goldilocks/shared-types";

export const ArrowDirectionEnum = z.enum(['up', 'down', 'neutral']);

/**
 * Per-card freshness (fresh/late/stale/closed follow spotFreshness in shared-types):
 *  - fresh: fetched within the last cron cycle.
 *  - late: a scheduled fetch was missed (amber).
 *  - stale: no new price for 25 minutes or more (red): type a spot or refresh before quoting.
 *  - closed: the market is shut and this is its closing price.
 *  - fallback: a live fetch was just attempted and failed - this is the
 *    last-known-good price serving in its place, said explicitly rather
 *    than silently shown as current.
 *  - failed: this metal is in the backend's degradedMetals list - no
 *    usable price anywhere, still showing €0.00.
 */
export const CardFreshnessEnum = z.enum(['fresh', 'late', 'stale', 'closed', 'fallback', 'failed']);

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
    /** When the market price was struck (vendor time). */
    snapshotAt: z.iso.datetime().optional(),
    /** When we received it from the vendor. */
    lastFetchAt: z.iso.datetime().optional(),
    /** Age of the market price when the card was built (refreshed by the workbook's minute tick). */
    priceAgeMs: z.number().nullable().optional(),
    fetchSource: FetchSourceEnum.optional(),
})

export type MetalCardData = z.infer<typeof MetalCardDataSchema>
