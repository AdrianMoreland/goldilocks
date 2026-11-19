import type { SpotFreshnessState } from "@goldilocks/shared-types"

/** Dot colour per freshness state: the header and the cards use the same scale. */
export const FRESHNESS_DOT_CLASS: Record<SpotFreshnessState, string> = {
    fresh: "bg-status-ok",
    late: "bg-status-warn",
    stale: "bg-status-bad",
    closed: "bg-muted-foreground/60",
    unknown: "bg-muted-foreground/40",
}

/** Text colour for the header's status line; quiet unless something needs attention. */
export const FRESHNESS_TEXT_CLASS: Record<SpotFreshnessState, string> = {
    fresh: "text-muted-foreground",
    late: "text-amber-700 dark:text-amber-400",
    stale: "text-red-700 dark:text-red-400",
    closed: "text-muted-foreground",
    unknown: "text-muted-foreground",
}

export const FRESHNESS_LABEL: Record<SpotFreshnessState, string> = {
    fresh: "Up to date",
    late: "A scheduled fetch was missed",
    stale: "Very old: check before quoting",
    closed: "Market closed: closing price",
    unknown: "No price yet",
}

/** One sentence on what the state means for whoever is quoting. */
export const FRESHNESS_ADVICE: Record<SpotFreshnessState, string> = {
    fresh: "The price feed is keeping up.",
    late: "A scheduled fetch was missed, so the prices may have moved.",
    stale: "No new price for 25 minutes or more. Type a spot on the card or click refresh before quoting.",
    closed: "The metals market is closed (Friday 22:00 to Sunday 23:00, UK time), so this is its closing price.",
    unknown: "No price has been loaded yet.",
}
