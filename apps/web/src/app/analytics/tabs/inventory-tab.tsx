import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { Columns, TreeMap } from "../components/charts"
import { METAL_COLOR } from "../components/colors"
import { dayLabel, fmt, titleCase } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

/** For whoever reorders: what each branch holds, what is running low, and how stock is moving. */
export function InventoryTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("inventory", preset)
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title="Pieces by branch" description="Gold and silver, right now">
                    <Columns
                        data={d.byBranch}
                        xKey="branch"
                        series={[
                            { key: "gold", label: "Gold", color: METAL_COLOR.GOLD },
                            { key: "silver", label: "Silver", color: METAL_COLOR.SILVER },
                        ]}
                        format={fmt.count}
                    />
                </ChartCard>
                <ChartCard title="What the stock is made of" description="Pieces by metal, then product family">
                    {d.tree.length === 0 ? (
                        <Empty>No stock lines.</Empty>
                    ) : (
                        <TreeMap data={d.tree.map((t) => ({ group: titleCase(t.metal), name: t.family, value: t.qty, color: METAL_COLOR[t.metal] ?? "var(--chart-1)" }))} format={(n) => `${fmt.count(n)} pieces`} />
                    )}
                </ChartCard>
            </div>
            <ChartCard title="Stock movements per day" description="Pieces in and out, all branches" notes={d.notes} chart="movementsByDay">
                {d.movementsByDay.length === 0 ? (
                    <Empty>{d.movementsSince ? `Movements are recorded from ${dayLabel(d.movementsSince)}.` : "No movements recorded yet."}</Empty>
                ) : (
                    <Columns
                        data={d.movementsByDay}
                        xKey="day"
                        xFormat={dayLabel}
                        series={[
                            { key: "in", label: "In", color: "var(--sequential)" },
                            { key: "out", label: "Out", color: "color-mix(in oklab, var(--foreground) 45%, var(--card))" },
                        ]}
                        format={fmt.count}
                    />
                )}
            </ChartCard>
            <ChartCard title="Low and out" description="Lines at or under their threshold (5 when none is set)">
                {d.low.length === 0 ? (
                    <Empty>Nothing is low.</Empty>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Branch</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Pieces</TableHead>
                                <TableHead className="text-right">Threshold</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {d.low.map((l) => (
                                <TableRow key={`${l.branch}:${l.product}`}>
                                    <TableCell>{l.branch}</TableCell>
                                    <TableCell>{l.product}</TableCell>
                                    <TableCell className="text-right tabular-nums">{l.qty <= 0 ? "Out" : l.qty}</TableCell>
                                    <TableCell className="text-right tabular-nums">{l.threshold}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </ChartCard>
        </div>
    )
}
