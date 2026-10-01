import type { AdminOverview, HealthStatus } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { Panel } from "../panel"
import { formatUptime } from "../../lib/format"

const DOT: Record<HealthStatus, string> = {
    up: "bg-emerald-500",
    degraded: "bg-amber-500",
    down: "bg-red-500",
}

const STATUS_WORD: Record<HealthStatus, string> = {
    up: "Healthy",
    degraded: "Degraded",
    down: "Down",
}

export function HealthPanel({ overview }: { overview: AdminOverview }) {
    const down = overview.health.filter((h) => h.status === "down").length
    const degraded = overview.health.filter((h) => h.status === "degraded").length
    const summary =
        down > 0
            ? `${down} ${down === 1 ? "check is" : "checks are"} down`
            : degraded > 0
              ? `${degraded} ${degraded === 1 ? "check needs" : "checks need"} attention`
              : "All systems normal"

    return (
        <Panel
            title="System health"
            description={
                <>
                    {overview.environment} · API up {formatUptime(overview.uptimeSeconds)} · Node {overview.nodeVersion} · Assistant{" "}
                    {overview.aiEnabled ? "on" : "off"}
                </>
            }
            action={
                <span
                    className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-bold",
                        down > 0
                            ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                            : degraded > 0
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    )}
                >
                    {summary}
                </span>
            }
        >
            <ul className="grid gap-x-6 sm:grid-cols-2">
                {overview.health.map((item) => (
                    <li key={item.key} className="flex items-start gap-3 border-b py-2.5 last:border-b-0 sm:nth-last-2:border-b-0">
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[item.status])} aria-hidden />
                        <div className="min-w-0">
                            <div className="text-sm font-medium">
                                {item.label} <span className="text-muted-foreground font-normal">· {STATUS_WORD[item.status]}</span>
                            </div>
                            <div className="text-muted-foreground text-xs">{item.detail}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </Panel>
    )
}
