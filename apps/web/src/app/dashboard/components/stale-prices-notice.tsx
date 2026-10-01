import { AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FETCH_SOURCE_LABEL } from "../utils/fetch-source"
import { formatSnapshotTime } from "../utils/formatters"
import type { FetchSource } from "@goldilocks/shared-types"

interface StalePricesNoticeProps {
    lastUpdatedRelative: string
    snapshotAt?: string | null
    fetchSource?: FetchSource
}

/**
 * Shown beside the price-status text whenever the snapshot is older than
 * STALE_THRESHOLD_MS. A bare amber triangle instead of a banner: it costs no
 * layout space, yet it is persistent (unlike a toast) and keyboard-focusable,
 * so the warning still opens on focus as well as on hover.
 */
export function StalePricesNotice({ lastUpdatedRelative, snapshotAt, fetchSource }: StalePricesNoticeProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label="Prices may be outdated"
                    className="focus-visible:ring-ring/50 flex size-9 shrink-0 cursor-help items-center justify-center rounded-md text-amber-600 outline-none hover:bg-amber-500/10 focus-visible:ring-[3px] dark:text-amber-400"
                >
                    <AlertTriangle className="size-5" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-72">
                <p>
                    Prices may be outdated: the price API struck them at {formatSnapshotTime(snapshotAt)} ({lastUpdatedRelative})
                    {fetchSource && fetchSource !== "live" ? `, read back from the ${FETCH_SOURCE_LABEL[fetchSource].toLowerCase()}` : ""}.
                </p>
                <p className="opacity-80">Use the refresh button to fetch live prices.</p>
            </TooltipContent>
        </Tooltip>
    )
}
