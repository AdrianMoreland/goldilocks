import { AlertTriangle } from "lucide-react"
import type { SpotFreshness } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatAge, formatSnapshotTime } from "../utils/formatters"
import { FRESHNESS_ADVICE } from "../utils/freshness"

interface StalePricesNoticeProps {
    freshness: SpotFreshness
    snapshotAt: string | null
}

/**
 * Shown beside the price status while the prices are late (amber) or stale
 * (red). A bare triangle instead of a banner: it costs no layout space, yet
 * it is persistent (unlike a toast) and keyboard-focusable, so the warning
 * still opens on focus as well as on hover.
 */
export function StalePricesNotice({ freshness, snapshotAt }: StalePricesNoticeProps) {
    const red = freshness.state === "stale"

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={red ? "Prices are very old" : "Prices may be outdated"}
                    className={cn(
                        "focus-visible:ring-ring/50 flex size-9 shrink-0 cursor-help items-center justify-center rounded-md outline-none focus-visible:ring-[3px]",
                        red ? "text-red-600 hover:bg-red-500/10 dark:text-red-400" : "text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
                    )}
                >
                    <AlertTriangle className="size-5" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-72">
                <p>
                    {red ? "Prices are very old" : "Prices may be outdated"}: the market price is from {formatSnapshotTime(snapshotAt)} ({formatAge(freshness.priceAgeMs)}).
                </p>
                <p className="opacity-80">{FRESHNESS_ADVICE[freshness.state]}</p>
            </TooltipContent>
        </Tooltip>
    )
}
