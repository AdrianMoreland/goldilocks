import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { CalendarHeatmap, Columns, Donut, RankedBars } from "../components/charts"
import { SINGLE } from "../components/colors"
import { fmt, monthLabel } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

/** For accounts: what we invoiced, to whom, and what is overdue. */
export function CustomersTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("customers", preset)
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    const total = d.status.reduce((a, s) => a + s.value, 0)
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <ChartCard title="Invoiced by month" description="Zoho invoices, voids left out" notes={d.notes} chart="byMonth">
                {d.byMonth.length === 0 ? (
                    <Empty>No invoices imported for this period.</Empty>
                ) : (
                    <Columns data={d.byMonth} xKey="month" xFormat={monthLabel} series={[{ key: "total", label: "Invoiced", color: SINGLE }]} format={fmt.eurCompact} height={250} />
                )}
            </ChartCard>
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title="Top customers" description="Invoiced in the period">
                    {d.topCustomers.length === 0 ? <Empty>No invoices in this period.</Empty> : <RankedBars data={d.topCustomers} format={fmt.eurCompact} />}
                </ChartCard>
                <ChartCard title="Invoice status" description="All imported invoices">
                    <Donut data={d.status} center={fmt.count(total)} sub="invoices" format={fmt.count} />
                </ChartCard>
            </div>
            <ChartCard title="Invoiced per day" description="Darker = more invoiced that day">
                <CalendarHeatmap days={d.byDay} from={d.period.current.from} to={d.period.current.to} format={fmt.eur} />
            </ChartCard>
        </div>
    )
}
