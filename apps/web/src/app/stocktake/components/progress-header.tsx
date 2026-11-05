import { Check } from "lucide-react"
import type { StocktakeStatus } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { cn } from "@/lib/utils"
import { statusSteps } from "./status"

/** The four steps of a stocktake as a rail: done steps ticked, the current one ringed, later ones hollow. */
function StatusRail({ status }: { status: StocktakeStatus }) {
    return (
        <ol aria-label="Stocktake progress" className="flex items-center gap-2 text-xs">
            {statusSteps(status).map((step, i) => (
                <li key={step.status} aria-current={step.state === "current" ? "step" : undefined} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden className={cn("h-px w-5", step.state === "todo" ? "bg-border" : "bg-foreground/40")} />}
                    <span
                        aria-hidden
                        className={cn(
                            "flex size-4 items-center justify-center rounded-full border",
                            step.state === "done" && "bg-foreground text-background border-transparent",
                            step.state === "current" && "border-foreground border-2",
                        )}
                    >
                        {step.state === "done" && <Check className="size-2.5" strokeWidth={3} />}
                    </span>
                    <span className={cn(step.state === "todo" ? "text-muted-foreground" : "font-medium")}>{step.label}</span>
                </li>
            ))}
        </ol>
    )
}

function Fact({ value, label, warn }: { value: number; label: string; warn?: boolean }) {
    return (
        <div>
            <dd className={cn("font-mono text-sm tabular-nums", warn && value > 0 && "text-amber-700 dark:text-amber-400")}>{value}</dd>
            <dt className="text-muted-foreground text-xs">{label}</dt>
        </div>
    )
}

/** Where the count stands: the step rail, then the counted ring and the numbers someone acts on. */
export function ProgressHeader({
    status,
    lines,
    counted,
    withVariance,
    unresolved,
}: {
    status: StocktakeStatus
    lines: number
    counted: number
    withVariance: number
    unresolved: number
}) {
    return (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border p-3">
            <StatusRail status={status} />
            <div className="flex items-center gap-3">
                <ProgressRing value={counted} total={lines} label="Lines counted" />
                <dl className="flex gap-5">
                    <Fact value={counted} label={`of ${lines} counted`} />
                    <Fact value={withVariance} label="with a difference" warn />
                    <Fact value={unresolved} label="open in the register" warn />
                </dl>
            </div>
        </div>
    )
}
