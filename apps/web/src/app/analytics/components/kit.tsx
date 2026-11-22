import type { ReactNode } from "react"
import type { AnalyticsKpi, AnalyticsNote, AnalyticsPreset } from "@goldilocks/shared-types"
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { formatKpi, kpiChange, PRESET_LABEL } from "../format"

export function KpiRow({ kpis }: { kpis: AnalyticsKpi[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((k) => {
                const change = kpiChange(k)
                return (
                    <Card key={k.key} className="min-w-0 gap-1 py-4">
                        <CardContent className="space-y-1 px-4">
                            <div className="text-muted-foreground text-xs">{k.label}</div>
                            <div className="text-2xl font-semibold tabular-nums">{k.value === null ? "–" : formatKpi(k.value, k.unit)}</div>
                            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
                                {change && (
                                    <span className="text-foreground font-medium tabular-nums">
                                        {change.up ? <ArrowUp className="inline size-3" aria-hidden /> : <ArrowDown className="inline size-3" aria-hidden />} {change.text}
                                        <span className="sr-only"> against the previous period</span>
                                    </span>
                                )}
                                {change && <span>vs previous</span>}
                                {k.hint && <span>{k.hint}</span>}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export function ChartCard({
    title,
    description,
    notes,
    chart,
    action,
    children,
    className,
}: {
    title: string
    description?: string
    notes?: AnalyticsNote[]
    /** Which notes belong here (matches AnalyticsNote.chart). */
    chart?: string
    action?: ReactNode
    children: ReactNode
    className?: string
}) {
    const mine = chart ? (notes ?? []).filter((n) => n.chart === chart) : []
    return (
        <Card className={cn("min-w-0 gap-3 py-4", className)}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 px-4">
                <div className="space-y-1">
                    <CardTitle className="text-sm">{title}</CardTitle>
                    {description && <CardDescription className="text-xs">{description}</CardDescription>}
                </div>
                {action}
            </CardHeader>
            <CardContent className="space-y-2 px-4">
                {children}
                {mine.map((n) => (
                    <p key={n.text} className="text-muted-foreground flex items-start gap-1.5 text-xs">
                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                        <span>{n.text}</span>
                    </p>
                ))}
            </CardContent>
        </Card>
    )
}

export function Empty({ children }: { children: ReactNode }) {
    return <div className="text-muted-foreground flex h-40 items-center justify-center rounded-md border border-dashed text-sm">{children}</div>
}

export function TabSkeleton() {
    return (
        <div className="space-y-4" aria-busy>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-72" />
        </div>
    )
}


export function PeriodPicker({ value, onChange }: { value: AnalyticsPreset; onChange: (p: AnalyticsPreset) => void }) {
    return (
        <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={value}
            onValueChange={(v) => v && onChange(v as AnalyticsPreset)}
            aria-label="Period"
        >
            {(Object.keys(PRESET_LABEL) as AnalyticsPreset[]).map((p) => (
                <ToggleGroupItem key={p} value={p} className="flex-none px-3 text-xs">
                    {PRESET_LABEL[p]}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}
