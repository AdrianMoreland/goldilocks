import { PauseIcon } from "lucide-react"
import type { FetchSource, SpotFreshness } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useNextFetchCountdown } from "@/hooks/use-next-fetch-countdown.hook"
import { FETCH_SOURCE_LABEL } from "../utils/fetch-source"
import { formatAge, formatSnapshotTime } from "../utils/formatters"
import { FRESHNESS_ADVICE, FRESHNESS_DOT_CLASS, FRESHNESS_LABEL, FRESHNESS_TEXT_CLASS } from "../utils/freshness"

interface DataFreshnessIndicatorProps {
    freshness: SpotFreshness
    /** When the market price was struck (the vendor's time), not when we fetched it. */
    snapshotAt: string | null
    /** When we last received the prices from the vendor. */
    lastFetchAt: string | null
    fetchSource?: FetchSource
    autoRefreshPaused: boolean
}

/**
 * Top-nav price status: "● As of 17:55 · 12 min ago". The time is the market
 * time of the prices in the table; the dot says whether the feed is keeping
 * up (green, amber after a missed fetch, red after 25 minutes without one,
 * grey while the market is closed). Where the prices were read from and when
 * we fetched them are in the tooltip.
 */
export function DataFreshnessIndicator({ freshness, snapshotAt, lastFetchAt, fetchSource, autoRefreshPaused }: DataFreshnessIndicatorProps) {
    const countdown = useNextFetchCountdown()
    const { state } = freshness
    const time = snapshotAt ? formatSnapshotTime(snapshotAt) : "…"
    const priceAge = formatAge(freshness.priceAgeMs)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className="focus-visible:ring-ring/50 flex cursor-help items-center gap-1.5 rounded px-1 text-xs outline-none focus-visible:ring-[3px]"
                    tabIndex={0}
                    aria-label={`Prices as of ${time}, ${priceAge}. ${FRESHNESS_LABEL[state]}.${autoRefreshPaused ? " Auto-refresh paused." : ""}`}
                >
                    <span className={cn("size-2 shrink-0 rounded-full", FRESHNESS_DOT_CLASS[state])} aria-hidden />
                    <span className={cn("hidden whitespace-nowrap tabular-nums md:inline", FRESHNESS_TEXT_CLASS[state])}>
                        As of {time}
                        {snapshotAt && <span className="hidden lg:inline"> · {priceAge}</span>}
                    </span>
                    {autoRefreshPaused && (
                        <span className="text-muted-foreground hidden items-center gap-0.5 whitespace-nowrap md:inline-flex">
                            <PauseIcon className="size-3" aria-hidden />
                            Paused
                        </span>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-80 space-y-1">
                <p className="font-medium">
                    Market price as of {time} ({priceAge}).
                </p>
                <p className="opacity-80">{FRESHNESS_ADVICE[state]}</p>
                {lastFetchAt && (
                    <p className="opacity-80">
                        Fetched from the price API at {formatSnapshotTime(lastFetchAt)} ({formatAge(freshness.fetchAgeMs)})
                        {fetchSource ? `, read just now from the ${FETCH_SOURCE_LABEL[fetchSource].toLowerCase()}` : ""}. The feed runs about 10 minutes behind the market.
                    </p>
                )}
                <p className="opacity-80">
                    {autoRefreshPaused
                        ? "Auto-refresh is paused: prices change only when someone clicks refresh. An admin can resume it in the Admin panel."
                        : `Next automatic fetch in ${countdown}. Use the refresh button to fetch now.`}
                </p>
            </TooltipContent>
        </Tooltip>
    )
}
