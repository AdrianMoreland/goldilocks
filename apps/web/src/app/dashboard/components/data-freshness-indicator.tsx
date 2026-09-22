import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNextFetchCountdown } from "@/hooks/use-next-fetch-countdown.hook"
import { FETCH_SOURCE_LABEL } from "../utils/fetch-source"
import type { FetchSource } from "@goldilocks/shared-types"

interface DataFreshnessIndicatorProps {
    lastUpdatedRelative: string
    fetchSource?: FetchSource
    isStale: boolean
}

/**
 * Top-nav replacement for the old plain "Last Updated: X" text — adds a
 * badge for which tier actually served this snapshot (cache/DB/live API)
 * and a live countdown to the next scheduled cron run, so it's always
 * clear whether the price on screen is current or needs a manual refresh.
 */
export function DataFreshnessIndicator({ lastUpdatedRelative, fetchSource, isStale }: DataFreshnessIndicatorProps) {
    const countdown = useNextFetchCountdown()

    return (
        <div className="hidden flex-col items-end leading-tight md:flex">
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "text-[11px] whitespace-nowrap text-muted-foreground",
                        isStale && "font-semibold text-amber-600 dark:text-amber-500",
                    )}
                >
                    {isStale ? "⚠ Updated " : "Updated "}
                    {lastUpdatedRelative}
                </span>
                {fetchSource && (
                    <Badge variant="outline" className="h-4 rounded-sm px-1 text-[9px] font-normal">
                        {FETCH_SOURCE_LABEL[fetchSource]}
                    </Badge>
                )}
            </div>
            <span className="text-[10px] whitespace-nowrap text-muted-foreground">Next refresh in {countdown}</span>
        </div>
    )
}
