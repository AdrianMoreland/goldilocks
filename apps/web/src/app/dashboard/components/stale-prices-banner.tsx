import { AlertTriangle } from "lucide-react"

interface StalePricesBannerProps {
    lastUpdatedRelative: string
}

/** Shown above the metal cards whenever the current snapshot is older than STALE_THRESHOLD_MS — a persistent banner rather than a toast, since a toast disappearing after a few seconds isn't enough weight for "you might be pricing off a stale number". */
export function StalePricesBanner({ lastUpdatedRelative }: StalePricesBannerProps) {
    return (
        <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Prices may be outdated — last fetched {lastUpdatedRelative}. Hit refresh before quoting a price.</span>
        </div>
    )
}
