import { useQuery } from "@tanstack/react-query"
import type { ProductStockLevel, StockLevelState } from "@goldilocks/shared-types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useMyPermissions } from "@/api/permissions.api"
import { useLiveStockApi } from "@/api/live-stock.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"

const STATE_STYLE: Record<StockLevelState, { dot: string; text: string; label: string }> = {
    IN: { dot: "bg-status-ok", text: "text-muted-foreground", label: "In stock" },
    LOW: { dot: "bg-status-warn", text: "text-amber-700 dark:text-amber-400", label: "Low stock" },
    OUT: { dot: "bg-status-bad", text: "text-red-700 dark:text-red-400", label: "Out of stock" },
}

/**
 * Stock per product from live stock, shared by every row (one request, cached a minute; stock edits refresh it because
 * they invalidate everything under the live-stock key). A failed load just hides the flags: prices never wait on stock.
 */
function useProductStockLevels(enabled: boolean) {
    const api = useLiveStockApi()
    return useQuery({
        enabled,
        queryKey: queryKeys.liveStock.productLevels,
        queryFn: api.productLevels,
        staleTime: 60_000,
        refetchInterval: 60_000,
        retry: 1,
        select: (levels: ProductStockLevel[]) => new Map(levels.map((l) => [l.productId, l])),
    })
}

/** A dot and the count across all branches; hover or focus shows each branch. Nothing for products stock does not track. */
export function StockFlag({ productId, className }: { productId: number; className?: string }) {
    // Hidden (and never requested) unless the role has the stock-levels feature switched on.
    const { can } = useMyPermissions()
    const allowed = can("feature.stock-levels")
    const { data } = useProductStockLevels(allowed)
    const level = allowed ? data?.get(productId) : undefined
    if (!level) return null
    const style = STATE_STYLE[level.state]
    const summary = `${style.label}: ${level.total} across all branches`
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    tabIndex={0}
                    aria-label={summary}
                    className={cn("inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums", style.text, className)}
                >
                    <span aria-hidden className={cn("inline-block size-2 rounded-full", style.dot)} />
                    {level.state === "OUT" ? "Out" : level.total}
                </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
                <div className="font-semibold">{summary}</div>
                {level.branches.map((b) => (
                    <div key={b.code} className="flex justify-between gap-4 tabular-nums">
                        <span>{b.name}</span>
                        <span>{b.qty}</span>
                    </div>
                ))}
            </TooltipContent>
        </Tooltip>
    )
}
