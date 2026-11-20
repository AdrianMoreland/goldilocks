import { cn } from "@/lib/utils"
import type { StockLevel } from "./live-stock-model"

/** Count colour: amber at or under the low mark, muted at zero. The word in the pill says the same thing. */
export const LEVEL_NUMBER: Record<StockLevel, string> = {
    zero: "text-muted-foreground",
    low: "text-amber-800 dark:text-amber-300",
    ok: "text-foreground",
}

export const PILL = "inline-flex items-center rounded-full px-[8px] py-[1px] text-[11px] leading-[16px] font-bold"
export const LOW_PILL = cn(PILL, "bg-warning text-warning-text")

