import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { Badge } from "@/components/ui/badge"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { Donut, RankedBars, StepFlow } from "../components/charts"
import { fmt, STEP_LABEL, titleCase } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

const STEPS = Object.keys(STEP_LABEL)

/** For the order desk: which orders are stuck where, and which step is slow. */
export function OrdersTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("orders", preset)
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    const tradeTotal = d.tradeStates.reduce((a, s) => a + s.value, 0)
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <ChartCard title="Where open orders are waiting" description="Latest step each order reached; the number is days waiting there">
                {d.waiting.length === 0 ? (
                    <Empty>No open orders are being tracked.</Empty>
                ) : (
                    <div className="space-y-3">
                        {d.waiting.map((w) => (
                            <div key={w.step} className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
                                <div className="w-28 shrink-0 text-sm">
                                    {STEP_LABEL[w.step] ?? w.step} <span className="text-muted-foreground tabular-nums">{w.orders.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {w.orders.map((o) => (
                                        <Badge key={o.reference} variant={o.days >= 7 ? "destructive" : "outline"} className="tabular-nums" title={`${o.reference}: ${o.days} days at ${STEP_LABEL[w.step]}`}>
                                            {o.reference} · {o.days}d
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ChartCard>
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title="How orders move between steps" description="Band width = orders that took that step in the period" notes={d.notes} chart="stepHours">
                    {d.flow.length === 0 ? <Empty>No steps recorded in this period.</Empty> : <StepFlow links={d.flow} steps={STEPS} label={(s) => STEP_LABEL[s] ?? s} />}
                </ChartCard>
                <ChartCard title="Average time per step" description="From one recorded step to the next">
                    {d.stepHours.length === 0 ? (
                        <Empty>No steps recorded in this period.</Empty>
                    ) : (
                        <RankedBars data={d.stepHours.map((s) => ({ label: `${STEP_LABEL[s.from]} → ${STEP_LABEL[s.to]}`, value: s.hours }))} format={fmt.hours} />
                    )}
                </ChartCard>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title="Trades by state" description="Tradesheet rows dated in the period">
                    {tradeTotal === 0 ? (
                        <Empty>No trades in this period.</Empty>
                    ) : (
                        <Donut data={d.tradeStates.map((s) => ({ label: titleCase(s.label), value: s.value }))} center={fmt.count(tradeTotal)} sub="trades" format={fmt.count} />
                    )}
                </ChartCard>
                <ChartCard title="Customer order items by status" description="All items on the orders sheet, now">
                    <RankedBars data={d.orderItemStatus.map((s) => ({ label: titleCase(s.label), value: s.value }))} format={fmt.count} />
                </ChartCard>
            </div>
        </div>
    )
}
