import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useNextFetchCountdown } from "@/hooks/use-next-fetch-countdown.hook"
import { FETCH_SOURCE_LABEL } from "../utils/fetch-source"
import { formatSnapshotTime } from "../utils/formatters"
import type { FetchSource } from "@goldilocks/shared-types"

interface DataFreshnessIndicatorProps {
    lastUpdatedRelative: string
    /** When the price API struck these prices (not when we last read them from cache/DB). */
    snapshotAt?: string | null
    fetchSource?: FetchSource
    isStale: boolean
}

/**
 * Top-nav status for the spot prices, kept quiet: a dot and one muted line
 * ("Live · 01:56:30"). Green when the prices came straight from the vendor
 * and are recent; amber (dot and text) when they were read back from cache or
 * the database or have aged past the stale threshold, so an old number is
 * never silent. The age, source and next-refresh countdown are in the tooltip.
 */
export function DataFreshnessIndicator({ lastUpdatedRelative, snapshotAt, fetchSource, isStale }: DataFreshnessIndicatorProps) {
    const countdown = useNextFetchCountdown()
    const replayed = fetchSource !== undefined && fetchSource !== "live"
    const warn = isStale || replayed
    const time = snapshotAt ? formatSnapshotTime(snapshotAt) : "…"

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className="focus-visible:ring-ring/50 flex cursor-help items-center gap-1.5 rounded px-1 text-xs outline-none focus-visible:ring-[3px]"
                    tabIndex={0}
                    aria-label={`Prices: ${fetchSource ? FETCH_SOURCE_LABEL[fetchSource] : "loading"}, struck at ${time}${warn ? ", may be outdated" : ""}`}
                >
                    <span className={cn("size-2 shrink-0 rounded-full", warn ? "bg-amber-500" : "bg-emerald-500")} aria-hidden />
                    <span className={cn("hidden whitespace-nowrap tabular-nums md:inline", warn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
                        {fetchSource ? `${FETCH_SOURCE_LABEL[fetchSource]} · ` : ""}
                        {time}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-72">
                <p>The price API struck these spot prices at {time} ({lastUpdatedRelative}).</p>
                <p className="opacity-80">
                    {fetchSource === "live" && "They came straight from a live API call."}
                    {fetchSource === "cache" && "They were read from our cache, not fetched live just now."}
                    {fetchSource === "db" && "They were read from our database, not fetched live just now."}
                </p>
                <p className="opacity-80">Next automatic refresh in {countdown}. Use the refresh button to fetch now.</p>
            </TooltipContent>
        </Tooltip>
    )
}
