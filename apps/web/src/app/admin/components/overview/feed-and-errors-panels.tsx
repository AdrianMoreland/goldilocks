import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, XCircle } from "lucide-react"
import type { AdminOverview, FetchTrigger } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { formatMinutesAgo } from "@/app/dashboard/utils/formatters"
import { KIND_LABEL, useErrorLog } from "@/app/dashboard/components/admin/error-log"
import { Panel, PanelEmpty, Stat } from "../panel"
import { formatDateTime } from "../../lib/format"

const TRIGGER_LABEL: Record<FetchTrigger, string> = {
    CRON: "Cron",
    REFRESH: "Refresh",
    RETRY: "Retry",
    LAUNCH_FALLBACK: "Page load",
}

export function PriceFeedPanel() {
    const api = useAdminApi()
    const metrics = useQuery({ queryKey: queryKeys.admin.fetchMetrics, queryFn: api.getFetchMetrics, refetchInterval: 30_000 })
    const log = useQuery({ queryKey: queryKeys.admin.fetchLog, queryFn: () => api.getFetchLog(6), refetchInterval: 30_000 })
    const m = metrics.data

    return (
        <Panel title="Price feed" description="Calls to the metal-price vendor">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                <Stat label="Success, 24h" value={m ? `${Math.round(m.successRate24h * 100)}%` : "…"} tone={m && m.successRate24h < 0.9 ? "bad" : undefined} />
                <Stat label="Average call" value={m ? `${m.avgLatencyMs} ms` : "…"} />
                <Stat label="Cache hits" value={m ? `${Math.round(m.cacheHitRatio * 100)}%` : "…"} />
            </div>

            {log.data?.length === 0 ? (
                <PanelEmpty>No attempts recorded yet.</PanelEmpty>
            ) : (
                <ul className="divide-y rounded-lg border">
                    {(log.data ?? []).map((attempt) => (
                        <li key={attempt.id} className="flex items-center gap-2 px-3 py-2 text-xs">
                            {attempt.success ? (
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-500" aria-label="Succeeded" />
                            ) : (
                                <XCircle className="text-destructive size-4 shrink-0" aria-label="Failed" />
                            )}
                            <span className="text-muted-foreground w-36 shrink-0 tabular-nums whitespace-nowrap">{formatMinutesAgo(attempt.attemptedAt)}</span>
                            <span className="text-muted-foreground w-16 shrink-0 whitespace-nowrap">{TRIGGER_LABEL[attempt.triggeredBy]}</span>
                            <span className="text-muted-foreground w-16 shrink-0 tabular-nums whitespace-nowrap">{attempt.durationMs} ms</span>
                            {!attempt.success && attempt.errorMessage && (
                                <span className="text-destructive truncate" title={attempt.errorMessage}>
                                    {attempt.errorMessage}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </Panel>
    )
}

export function ErrorsPanel({ overview, onOpenLogs }: { overview: AdminOverview; onOpenLogs: () => void }) {
    const { entries, serverQuery } = useErrorLog(true)
    const total = overview.errorsByKind.reduce((s, k) => s + k.count, 0)
    const max = Math.max(1, ...overview.errorsByKind.map((k) => k.count))

    return (
        <Panel
            title="Errors, last 24 hours"
            description={total === 0 ? "None recorded" : `${total} recorded, grouped by cause`}
            action={
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={onOpenLogs}>
                    Open logs
                </Button>
            }
        >
            {overview.errorsByKind.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                    {[...overview.errorsByKind]
                        .sort((a, b) => b.count - a.count)
                        .map((k) => (
                            <li key={k.kind} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-3 text-xs">
                                <span className="truncate">{KIND_LABEL[k.kind as keyof typeof KIND_LABEL] ?? k.kind}</span>
                                <span className="bg-muted h-2 overflow-hidden rounded-full">
                                    <span className="bg-destructive/80 block h-full rounded-full" style={{ width: `${(k.count / max) * 100}%` }} />
                                </span>
                                <span className="text-right tabular-nums">{k.count}</span>
                            </li>
                        ))}
                </ul>
            )}

            {serverQuery.isError && <p className="text-destructive text-xs">Couldn&apos;t load the error log.</p>}
            {entries.length === 0 ? (
                <PanelEmpty>{serverQuery.isLoading ? "Loading…" : "No errors recorded. Nothing needs attention."}</PanelEmpty>
            ) : (
                <ul className="divide-y rounded-lg border">
                    {entries.slice(0, 5).map((entry) => (
                        <li key={`${entry.origin}-${entry.id}`} className="flex items-center gap-2 px-3 py-2">
                            <span
                                className={cn(
                                    "shrink-0 rounded border px-1.5 text-[11px]",
                                    entry.severity === "error" ? "border-destructive/40 text-destructive" : "text-muted-foreground",
                                )}
                            >
                                {KIND_LABEL[entry.kind]}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-xs" title={entry.message}>
                                {entry.message}
                            </span>
                            <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">{formatDateTime(entry.at)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </Panel>
    )
}
