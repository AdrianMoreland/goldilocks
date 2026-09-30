import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FETCH_SOURCE_LABEL } from "../utils/fetch-source"
import { formatSnapshotTime } from "../utils/formatters"
import type { FetchSource } from "@goldilocks/shared-types"

interface StalePricesBannerProps {
    lastUpdatedRelative: string
    snapshotAt?: string | null
    fetchSource?: FetchSource
    onRefresh: () => void
    refreshing: boolean
}

/** Shown above the metal cards whenever the current snapshot is older than STALE_THRESHOLD_MS — a persistent banner rather than a toast, since a toast disappearing after a few seconds isn't enough weight for "you might be pricing off a stale number". Says where the numbers came from and offers the fix. */
export function StalePricesBanner({ lastUpdatedRelative, snapshotAt, fetchSource, onRefresh, refreshing }: StalePricesBannerProps) {
    return (
        <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1">
                Prices may be outdated — the price API struck them at {formatSnapshotTime(snapshotAt)} ({lastUpdatedRelative})
                {fetchSource && fetchSource !== "live" ? `, read back from the ${FETCH_SOURCE_LABEL[fetchSource].toLowerCase()}` : ""}.
            </span>
            <Button type="button" size="sm" variant="outline" className="h-7 cursor-pointer gap-1.5" disabled={refreshing} onClick={onRefresh}>
                <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Fetch live prices
            </Button>
        </div>
    )
}
