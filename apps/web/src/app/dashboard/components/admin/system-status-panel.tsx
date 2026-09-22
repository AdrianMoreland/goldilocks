import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, RefreshCw, RotateCw, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { formatMinutesAgo } from "../../utils/formatters"
import type { MetalCardData } from "../../schemas/card-data.schema"
import type { FetchTrigger, MetalType } from "@goldilocks/shared-types"

const TRIGGER_LABEL: Record<FetchTrigger, string> = {
    CRON: "Cron",
    REFRESH: "Refresh",
    RETRY: "Retry",
    LAUNCH_FALLBACK: "Page load",
}

const FRESHNESS_DOT: Record<MetalCardData["freshness"], string> = {
    fresh: "bg-emerald-500",
    stale: "bg-amber-500",
    fallback: "bg-orange-500",
    failed: "bg-red-500",
}

function MetricTag({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-1 flex-col items-center gap-0.5 rounded-md border bg-muted/40 px-2 py-1.5">
            <span className="text-[9px] font-bold tracking-wide text-muted-foreground uppercase">{label}</span>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    )
}

interface SystemStatusPanelProps {
    /** The same per-metal freshness data the dashboard cards use — this panel is a second view onto it, not a separate source of truth. */
    metalCards: MetalCardData[]
}

/**
 * Admin-only System Status panel — adapted from the watermelon.sh
 * "Deployment Card" pattern (metric tags, a per-item status list, a
 * lightweight refresh action) using this project's own Tailwind/shadcn
 * tokens rather than pulling in framer-motion/react-icons for one widget.
 */
export function SystemStatusPanel({ metalCards }: SystemStatusPanelProps) {
    const api = useAdminApi()
    const queryClient = useQueryClient()

    const metricsQuery = useQuery({
        queryKey: queryKeys.admin.fetchMetrics,
        queryFn: api.getFetchMetrics,
        refetchInterval: 30_000,
    })

    const logQuery = useQuery({
        queryKey: queryKeys.admin.fetchLog,
        queryFn: () => api.getFetchLog(5),
        refetchInterval: 30_000,
    })

    const retryMutation = useMutation({
        mutationFn: (metal: MetalType) => api.retryMetal(metal),
        onSuccess: (_result, metal) => {
            toast.success(`${metal} retried successfully`)
            queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.fetchMetrics })
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.fetchLog })
        },
        onError: (_error, metal) => {
            toast.error(`Retry failed for ${metal} — the vendor API may still be down.`)
        },
    })

    const metrics = metricsQuery.data
    const refreshBoth = () => {
        metricsQuery.refetch()
        logQuery.refetch()
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">System Status</span>
                <Button variant="ghost" size="icon" className="size-6 cursor-pointer" onClick={refreshBoth} title="Refresh metrics">
                    <RefreshCw className="size-3" />
                </Button>
            </div>

            <div className="flex gap-2">
                <MetricTag label="Success (24h)" value={metrics ? `${Math.round(metrics.successRate24h * 100)}%` : "—"} />
                <MetricTag label="Avg Latency" value={metrics ? `${metrics.avgLatencyMs}ms` : "—"} />
                <MetricTag label="Cache Hit" value={metrics ? `${Math.round(metrics.cacheHitRatio * 100)}%` : "—"} />
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
                {metalCards.map((card) => (
                    <div
                        key={card.metal}
                        className="flex items-center justify-between gap-2 rounded-lg border bg-background/60 px-2.5 py-1.5 text-xs"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`size-1.5 shrink-0 rounded-full ${FRESHNESS_DOT[card.freshness]}`} />
                            <span className="font-medium">{card.metal}</span>
                            <span className="text-muted-foreground">{formatMinutesAgo(card.lastFetchedAt)}</span>
                        </div>
                        {card.freshness !== "fresh" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 cursor-pointer px-2 text-[10px]"
                                disabled={retryMutation.isPending && retryMutation.variables === card.metal}
                                onClick={() => retryMutation.mutate(card.metal)}
                            >
                                <RotateCw className="size-3" /> Retry
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Recent attempts</span>
                {(logQuery.data ?? []).map((attempt) => (
                    <div
                        key={attempt.id}
                        className="flex items-center gap-2 rounded-lg border bg-background/60 px-2.5 py-1.5 text-[11px]"
                    >
                        {attempt.success ? (
                            <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                        ) : (
                            <XCircle className="size-3 shrink-0 text-red-500" />
                        )}
                        <span className="shrink-0 text-muted-foreground">{formatMinutesAgo(attempt.attemptedAt)}</span>
                        <span className="shrink-0 rounded border px-1 text-[9px] font-bold text-muted-foreground uppercase">
                            {TRIGGER_LABEL[attempt.triggeredBy]}
                        </span>
                        <span className="shrink-0 text-muted-foreground">{attempt.durationMs}ms</span>
                        {!attempt.success && attempt.errorMessage && (
                            <span className="truncate text-red-500" title={attempt.errorMessage}>
                                {attempt.errorMessage}
                            </span>
                        )}
                    </div>
                ))}
                {logQuery.data?.length === 0 && (
                    <span className="text-[11px] text-muted-foreground">No attempts recorded yet.</span>
                )}
            </div>
        </div>
    )
}
