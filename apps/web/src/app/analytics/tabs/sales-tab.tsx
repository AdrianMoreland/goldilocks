import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { CalendarHeatmap, Columns, RankedBars, TimeLine, WeekHourHeatmap } from "../components/charts"
import { METAL_COLOR, SINGLE } from "../components/colors"
import { fmt, monthLabel } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

/** For managers, weekly or monthly: how much we made, at what margin, where and on what. */
export function SalesTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("sales", preset)
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <ChartCard title="Gross profit by month" description="Invoiced trades, stacked by metal" notes={d.notes} chart="byMonth">
                {d.byMonth.length === 0 ? (
                    <Empty>No invoiced trades in this period.</Empty>
                ) : (
                    <Columns
                        data={d.byMonth}
                        xKey="month"
                        xFormat={monthLabel}
                        stacked
                        series={[
                            { key: "goldProfit", label: "Gold", color: METAL_COLOR.GOLD },
                            { key: "silverProfit", label: "Silver", color: METAL_COLOR.SILVER },
                        ]}
                        format={fmt.eurCompact}
                        height={260}
                    />
                )}
            </ChartCard>
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title="Margin by month" description="Profit ÷ receipts, all invoiced trades">
                    {d.byMonth.length < 2 ? (
                        <Empty>A trend needs two months.</Empty>
                    ) : (
                        <TimeLine data={d.byMonth} xKey="month" xFormat={monthLabel} series={[{ key: "margin", label: "Margin", color: SINGLE }]} format={(n) => fmt.pct(n)} />
                    )}
                </ChartCard>
                <ChartCard title="Gross profit by branch">
                    {d.byBranch.length === 0 ? <Empty>No invoiced trades in this period.</Empty> : <RankedBars data={d.byBranch} format={fmt.eurCompact} />}
                </ChartCard>
            </div>
            <ChartCard title="Profit per day" description="Darker = more profit that day">
                <CalendarHeatmap days={d.byDay} from={d.period.current.from} to={d.period.current.to} format={fmt.eur} />
            </ChartCard>
            <ChartCard title="When trades are written" description="Rows added to the tradesheet, by weekday and hour (Dublin time)">
                <WeekHourHeatmap cells={d.tradeHours} unit="trades" />
            </ChartCard>
            <ChartCard title="Top products" description="By receipts; names grouped through the matched product" notes={d.notes} chart="topProducts">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Trades</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Receipts</TableHead>
                            <TableHead className="text-right">Margin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {d.topProducts.map((p) => (
                            <TableRow key={p.product}>
                                <TableCell>{p.product}</TableCell>
                                <TableCell className="text-right tabular-nums">{fmt.count(p.trades)}</TableCell>
                                <TableCell className="text-right tabular-nums">{fmt.count(p.qty)}</TableCell>
                                <TableCell className="text-right tabular-nums">{fmt.eur(p.revenue)}</TableCell>
                                <TableCell className="text-right tabular-nums">{p.margin === null ? "–" : fmt.pct(p.margin)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ChartCard>
        </div>
    )
}
