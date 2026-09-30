import { AlertTriangle } from "lucide-react"
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
 * Top-nav status for the spot prices: which tier served them (live API /
 * cache / database) and the price API's own snapshot time. A live, recent
 * price needs no explaining; anything read back from cache or the database
 * is called out in amber with the time it was actually struck, so nobody
 * quotes off an old number believing it was just fetched.
 */
export function DataFreshnessIndicator({ lastUpdatedRelative, snapshotAt, fetchSource, isStale }: DataFreshnessIndicatorProps) {
    const countdown = useNextFetchCountdown()
    const replayed = fetchSource !== undefined && fetchSource !== "live"
    const warn = isStale || replayed

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex cursor-help flex-col items-end leading-tight" tabIndex={0}>
                    <div className="flex items-center gap-2">
                        {fetchSource && (
                            <span
                                className={cn(
                                    "rounded px-1.5 py-0.5 text-xs font-extrabold tracking-wide uppercase",
                                    warn
                                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                                )}
                            >
                                {FETCH_SOURCE_LABEL[fetchSource]}
                            </span>
                        )}
                        <span
                            className={cn(
                                "flex items-center gap-1 text-xs font-medium whitespace-nowrap tabular-nums",
                                warn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground",
                            )}
                        >
                            {isStale && <AlertTriangle className="size-3.5 shrink-0" aria-hidden />}
                            {isStale && <span className="sr-only">Prices may be stale.</span>}
                            Price API snapshot {formatSnapshotTime(snapshotAt)}
                        </span>
                    </div>
                    <span className="hidden text-[11px] whitespace-nowrap text-muted-foreground tabular-nums md:block">
                        {lastUpdatedRelative} · next refresh in {countdown}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-72">
                <p>The price API struck these spot prices at {formatSnapshotTime(snapshotAt)}.</p>
                <p className="opacity-80">
                    {fetchSource === "live" && "They came straight from a live API call."}
                    {fetchSource === "cache" && "They were read from our cache — not fetched live just now."}
                    {fetchSource === "db" && "They were read from our database — not fetched live just now."}
                </p>
                <p className="opacity-80">Use the refresh button to fetch live prices.</p>
            </TooltipContent>
        </Tooltip>
    )
}
