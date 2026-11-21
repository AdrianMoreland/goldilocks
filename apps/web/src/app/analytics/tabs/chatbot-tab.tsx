import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { Columns, Donut, RankedBars, WeekHourHeatmap } from "../components/charts"
import { SINGLE } from "../components/colors"
import { dayLabel, fmt, titleCase } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

const MODE: Record<string, string> = { procedures: "Procedure questions", email: "Email replies", whatsapp: "WhatsApp replies" }

/** For admins: is the assistant used, does it answer, what does it cost, and do people find it helpful. */
export function ChatbotTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("chatbot", preset)
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    const asked = d.outcome.reduce((a, s) => a + s.value, 0)
    const rated = d.feedback.helpful + d.feedback.notHelpful
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <ChartCard title="Questions per day">
                {d.byDay.length === 0 ? <Empty>No questions in this period.</Empty> : <Columns data={d.byDay} xKey="day" xFormat={dayLabel} series={[{ key: "value", label: "Questions", color: SINGLE }]} format={fmt.count} />}
            </ChartCard>
            <div className="grid gap-4 xl:grid-cols-3">
                <ChartCard title="Outcome">
                    {asked === 0 ? <Empty>No questions.</Empty> : <Donut data={d.outcome.map((o) => ({ label: titleCase(o.label), value: o.value }))} center={fmt.count(asked)} sub="questions" format={fmt.count} />}
                </ChartCard>
                <ChartCard title="What it is used for">
                    <RankedBars data={d.byMode.map((m) => ({ label: MODE[m.label] ?? m.label, value: m.value }))} format={fmt.count} />
                </ChartCard>
                <ChartCard title="Answer time by use" description="Average, answered questions">
                    <RankedBars data={d.latencyByMode.map((m) => ({ label: MODE[m.label] ?? m.label, value: m.value }))} format={fmt.seconds} />
                </ChartCard>
            </div>
            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                <ChartCard title="When people ask" description="By weekday and hour (Dublin time)">
                    <WeekHourHeatmap cells={d.hours} unit="questions" />
                </ChartCard>
                <ChartCard title="Helpful?" description="Thumbs up or down on answers" notes={d.notes} chart="feedback">
                    {rated === 0 ? (
                        <Empty>{d.feedback.since ? "No ratings yet." : "Ratings start when the buttons go live."}</Empty>
                    ) : (
                        <div className="space-y-1">
                            <div className="text-3xl font-semibold tabular-nums">{fmt.pct(d.feedback.helpful / rated, 0)}</div>
                            <div className="text-muted-foreground text-xs">
                                helpful · {d.feedback.helpful} up, {d.feedback.notHelpful} down since {d.feedback.since ? dayLabel(d.feedback.since) : "–"}
                            </div>
                        </div>
                    )}
                </ChartCard>
            </div>
            <ChartCard title="Recent questions" description="Reply requests show only their length: they hold customer messages">
                <ul className="divide-y text-sm">
                    {d.recent.map((r) => (
                        <li key={r.at} className="flex items-center justify-between gap-3 py-2">
                            <span className="min-w-0 truncate">{r.text}</span>
                            <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{titleCase(r.status)} · {fmt.seconds(r.seconds)}</span>
                        </li>
                    ))}
                </ul>
            </ChartCard>
        </div>
    )
}
