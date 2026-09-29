import { AlertTriangle } from "lucide-react"
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
        <div className="flex flex-col items-end leading-tight">
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "flex items-center gap-1 text-[11px] whitespace-nowrap text-muted-foreground",
                        isStale && "font-semibold text-amber-700 dark:text-amber-400",
                    )}
                >
                    {isStale && <AlertTriangle className="size-3 shrink-0" aria-hidden />}
                    {isStale && <span className="sr-only">Prices may be stale.</span>}
                    Updated {lastUpdatedRelative}
                </span>
                {fetchSource && (
                    <Badge variant="outline" className="hidden rounded-sm px-1 py-0 text-[11px] font-normal sm:inline-flex">
                        {FETCH_SOURCE_LABEL[fetchSource]}
                    </Badge>
                )}
            </div>
            <span className="hidden text-[11px] whitespace-nowrap text-muted-foreground tabular-nums md:block">
                Next refresh in {countdown}
            </span>
        </div>
    )
}
