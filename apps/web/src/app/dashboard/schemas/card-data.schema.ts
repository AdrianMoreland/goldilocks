import { z } from "zod"
import {MetalType, MetalTypeEnum} from "@goldilocks/shared-types";

export const ArrowDirectionEnum = z.enum(['up', 'down', 'neutral']);

export const MetalCardDataSchema = z.object({
    metal: MetalTypeEnum,
    price: z.number(),
    showChange: z.boolean(),
    change: z.number().optional(),
    changePercent: z.number().optional(),
    direction: z.enum(["up", "down", "neutral"]).optional(),
    isCustomPrice: z.boolean(),
    marketPrice: z.number().optional(),
})

export type MetalCardData = z.infer<typeof MetalCardDataSchema>
