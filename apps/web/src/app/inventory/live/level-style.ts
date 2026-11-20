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


/** Level bar fill on a tile; at zero the bar is empty, so no colour is needed for it. */
export const LEVEL_BAR: Record<StockLevel, string> = {
    ok: "bg-emerald-500",
    low: "bg-amber-500",
    zero: "bg-transparent",
}

/** A shaded cell in the all-branches matrix: tinted green when fine, amber at or under the low mark, plain at zero. */
export const LEVEL_CELL: Record<StockLevel, string> = {
    ok: "bg-emerald-500/10",
    low: "bg-amber-500/20 font-bold text-amber-800 dark:text-amber-300",
    zero: "text-muted-foreground",
}

/** The state in words, for tiles. */
export const LEVEL_WORD: Record<StockLevel, { label: string; className: string }> = {
    ok: { label: "Good", className: cn(PILL, "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300") },
    low: { label: "Running low", className: LOW_PILL },
    zero: { label: "Out of stock", className: cn(PILL, "bg-muted text-muted-foreground") },
}
