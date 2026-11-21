import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { Columns, RankedBars, WeekHourHeatmap } from "../components/charts"
import { dayLabel, fmt, titleCase } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

const KIND: Record<string, string> = { TRADESHEET: "Tradesheet", WORKBOOK: "Workbook", BC_HISTORY: "BC history" }
const kindLabel = (k: string) => KIND[k] ?? titleCase(k)

const dateTime = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Dublin" })

/** For admins: is the price feed healthy, and are the imports running. */
export function OpsTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("ops", preset)
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <ChartCard title="Failed price-feed fetches" description="By weekday and hour (Dublin time); darker = more failures" notes={d.notes} chart="feedFailures">
                <WeekHourHeatmap cells={d.feedFailures} unit="failed fetches" />
            </ChartCard>
            <ChartCard title="Failed fetches per day" description="Successful fetches run about every 5 minutes; only failures are shown">
                {d.feedByDay.length === 0 ? (
                    <Empty>No fetches recorded in this period.</Empty>
                ) : (
                    <Columns data={d.feedByDay} xKey="day" xFormat={dayLabel} series={[{ key: "failed", label: "Failed", color: "var(--destructive)" }]} format={fmt.count} />
                )}
            </ChartCard>
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title="Recent imports">
                    {d.imports.length === 0 ? (
                        <Empty>No imports yet.</Empty>
                    ) : (
                        <ul className="divide-y text-sm">
                            {d.imports.map((i) => (
                                <li key={`${i.at}:${i.file}`} className="flex items-center justify-between gap-3 py-2">
                                    <span className="min-w-0 truncate">
                                        <b className="font-medium">{kindLabel(i.kind)}</b> · {i.file}
                                    </span>
                                    <span className="text-muted-foreground shrink-0 text-xs">{dateTime.format(new Date(i.at))} · {i.by}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </ChartCard>
                <ChartCard title="Imports by kind" description="In the period">
                    {d.importsByKind.length === 0 ? <Empty>No imports in this period.</Empty> : <RankedBars data={d.importsByKind.map((k) => ({ label: kindLabel(k.label), value: k.value }))} format={fmt.count} />}
                </ChartCard>
            </div>
        </div>
    )
}
