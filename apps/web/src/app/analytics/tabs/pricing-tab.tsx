import { useState } from "react"
import type { AnalyticsMetal, AnalyticsPreset } from "@goldilocks/shared-types"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChartCard, Empty, KpiRow, TabSkeleton } from "../components/kit"
import { RankedBars, Slope, TimeLine } from "../components/charts"
import { METAL_COLOR } from "../components/colors"
import { dayLabel, fmt, titleCase } from "../format"
import { useAnalyticsTab } from "./use-tab"
import { TabError } from "./tab-error"

const METALS: AnalyticsMetal[] = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]

/** For whoever sets prices: where spot is heading, how far each metal moved, and where premiums sit. */
export function PricingTab({ preset }: { preset: AnalyticsPreset }) {
    const q = useAnalyticsTab("pricing", preset)
    const [metal, setMetal] = useState<AnalyticsMetal>("GOLD")
    if (q.isPending) return <TabSkeleton />
    if (q.isError) return <TabError onRetry={() => void q.refetch()} />
    const d = q.data
    const series = d.spot.map((s) => ({ day: s.day, value: s[metal] }))
    const values = series.map((s) => s.value).filter((v): v is number => v !== null)
    const avg = values.length ? values.reduce((a, v) => a + v, 0) / values.length : null
    const premiums = d.premiums
        .filter((p) => p.metal === metal)
        .sort((a, b) => b.premium - a.premium)
        .slice(0, 12)
        .map((p) => ({ label: p.name, value: p.premium }))
    const historyDays = [...new Set(d.premiumHistory.map((h) => h.day))]
    const history = historyDays.map((day) => ({
        day,
        ...Object.fromEntries(d.premiumHistory.filter((h) => h.day === day).map((h) => [h.metal, h.premium])),
    }))
    const metalPicker = (
        <ToggleGroup type="single" size="sm" variant="outline" value={metal} onValueChange={(v) => v && setMetal(v as AnalyticsMetal)} aria-label="Metal">
            {METALS.map((m) => (
                <ToggleGroupItem key={m} value={m} className="flex-none px-3 text-xs">{titleCase(m)}</ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
    return (
        <div className="space-y-4">
            <KpiRow kpis={d.kpis} />
            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                <ChartCard title={`${titleCase(metal)} spot`} description="€/oz, daily close" action={metalPicker}>
                    {values.length < 2 ? (
                        <Empty>No spot history for this period.</Empty>
                    ) : (
                        <TimeLine
                            data={series}
                            xKey="day"
                            series={[{ key: "value", label: titleCase(metal), color: METAL_COLOR[metal] }]}
                            format={(n) => fmt.eur(n)}
                            reference={avg === null ? undefined : { value: avg, label: `average ${fmt.eur(avg)}` }}
                            height={260}
                        />
                    )}
                </ChartCard>
                <ChartCard title="Change over the period" description="Indexed to 100 at the start">
                    {d.change.length === 0 ? (
                        <Empty>Not enough spot history.</Empty>
                    ) : (
                        <Slope
                            left={dayLabel(d.period.current.from)}
                            right={dayLabel(d.period.current.to)}
                            items={d.change.map((c) => ({
                                key: c.metal,
                                label: titleCase(c.metal),
                                start: c.start,
                                end: c.end,
                                color: METAL_COLOR[c.metal],
                                dashed: c.metal === "PALLADIUM",
                            }))}
                        />
                    )}
                </ChartCard>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
                <ChartCard title={`Price premium, ${titleCase(metal).toLowerCase()} products`} description="Highest 12, over the spot value">
                    {premiums.length === 0 ? <Empty>No active products for this metal.</Empty> : <RankedBars data={premiums} format={(n) => fmt.pct(n)} color="var(--price)" />}
                </ChartCard>
                <ChartCard title="Average Price premium over time" description="From the daily price snapshot" notes={d.notes} chart="premiumHistory">
                    {history.length < 2 ? (
                        <Empty>{d.snapshotSince ? `Recording since ${dayLabel(d.snapshotSince)}; a trend needs two days.` : "Recording has not started yet."}</Empty>
                    ) : (
                        <TimeLine
                            data={history}
                            xKey="day"
                            series={METALS.filter((m) => d.premiumHistory.some((h) => h.metal === m)).map((m) => ({ key: m, label: titleCase(m), color: METAL_COLOR[m], dashed: m === "PALLADIUM" }))}
                            format={(n) => fmt.pct(n)}
                        />
                    )}
                </ChartCard>
            </div>
            <ChartCard title="Market modes" description="Company-wide switches, set in Admin">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    {(["weekend", "volatile", "shortage"] as const).map((m) => (
                        <Badge key={m} variant={d.marketMode[m] ? "default" : "outline"}>
                            {titleCase(m)}: {d.marketMode[m] ? "on" : "off"}
                        </Badge>
                    ))}
                    {d.marketMode.updatedAt && (
                        <span className="text-muted-foreground text-xs">
                            Last changed {dayLabel(d.marketMode.updatedAt.slice(0, 10))}
                            {d.marketMode.updatedBy ? ` by ${d.marketMode.updatedBy}` : ""}
                        </span>
                    )}
                </div>
            </ChartCard>
        </div>
    )
}
