import { useState, type ReactNode } from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    ReferenceLine,
    Treemap,
    XAxis,
    YAxis,
} from "recharts"
import type { DayValue, FlowLink, HeatCell } from "@goldilocks/shared-types"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { dayLabel } from "../format"
import { SINGLE } from "./colors"

/**
 * The Analytics chart kit. Rules for every chart: one y-axis, a hover tooltip, thin marks, a legend whenever there
 * are two or more series, and text in text colours (series colours only on marks). Colours come from the metal and
 * sequential tokens in index.css (checked for colour-blind separation) or, for a single series, the theme's chart-1.
 */

const AXIS = { fontSize: 12 }
const GRID = <CartesianGrid vertical={false} strokeDasharray="0" className="stroke-border/60" />

export interface Series {
    key: string
    label: string
    color: string
    dashed?: boolean
}

function configOf(series: Series[]): ChartConfig {
    return Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }]))
}

/** Change over time. Several series share the one axis, so only plot measures of the same unit together. */
export function TimeLine({
    data,
    xKey,
    series,
    format,
    xFormat = dayLabel,
    height = 240,
    reference,
}: {
    data: object[]
    xKey: string
    series: Series[]
    format: (n: number) => string
    xFormat?: (v: string) => string
    height?: number
    reference?: { value: number; label: string }
}) {
    return (
        <ChartContainer config={configOf(series)} className="w-full" style={{ height }}>
            <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
                {GRID}
                <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} tickFormatter={xFormat} minTickGap={24} />
                <YAxis tickLine={false} axisLine={false} tick={AXIS} tickFormatter={format} width={64} domain={["auto", "auto"]} />
                <ChartTooltip
                    cursor={{ strokeWidth: 1 }}
                    content={<ChartTooltipContent labelFormatter={(v) => xFormat(String(v))} valueFormatter={(v) => format(Number(v))} />}
                />
                {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
                {reference && <ReferenceLine y={reference.value} strokeDasharray="4 4" className="stroke-muted-foreground" label={{ value: reference.label, fontSize: 11, position: "insideTopLeft", className: "fill-muted-foreground" }} />}
                {series.map((s) => (
                    <Line
                        key={s.key}
                        dataKey={s.key}
                        type="monotone"
                        stroke={`var(--color-${s.key})`}
                        strokeWidth={2}
                        strokeDasharray={s.dashed ? "6 4" : undefined}
                        dot={false}
                        activeDot={{ r: 4 }}
                        connectNulls
                    />
                ))}
            </LineChart>
        </ChartContainer>
    )
}

/** Compare periods or categories. Stacked when the parts add up to a meaningful whole. */
export function Columns({
    data,
    xKey,
    series,
    format,
    xFormat,
    stacked,
    height = 240,
}: {
    data: object[]
    xKey: string
    series: Series[]
    format: (n: number) => string
    xFormat?: (v: string) => string
    stacked?: boolean
    height?: number
}) {
    return (
        <ChartContainer config={configOf(series)} className="w-full" style={{ height }}>
            <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }} barGap={2}>
                {GRID}
                <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} tickFormatter={xFormat} minTickGap={12} />
                <YAxis tickLine={false} axisLine={false} tick={AXIS} tickFormatter={format} width={64} />
                <ChartTooltip
                    cursor={{ className: "fill-muted/50" }}
                    content={<ChartTooltipContent labelFormatter={(v) => (xFormat ? xFormat(String(v)) : String(v))} valueFormatter={(v) => format(Number(v))} />}
                />
                {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
                {series.map((s, i) => (
                    <Bar
                        key={s.key}
                        dataKey={s.key}
                        stackId={stacked ? "a" : undefined}
                        fill={`var(--color-${s.key})`}
                        // 2px card-coloured seam between stacked parts; rounded data end only on the top part.
                        stroke={stacked ? "var(--card)" : undefined}
                        strokeWidth={stacked ? 2 : 0}
                        radius={!stacked || i === series.length - 1 ? [4, 4, 0, 0] : 0}
                        maxBarSize={36}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    )
}

/** A ranking: horizontal bars, largest first, with the value at the end of each bar. */
export function RankedBars({
    data,
    format,
    color = SINGLE,
    height,
}: {
    data: { label: string; value: number }[]
    format: (n: number) => string
    color?: string
    height?: number
}) {
    const config: ChartConfig = { value: { label: "Value", color } }
    return (
        <ChartContainer config={config} className="w-full" style={{ height: height ?? Math.max(120, data.length * 34) }}>
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 56, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} tick={AXIS} width={140} />
                <ChartTooltip cursor={{ className: "fill-muted/50" }} content={<ChartTooltipContent hideIndicator valueFormatter={(v) => format(Number(v))} />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} maxBarSize={20} isAnimationActive={false}>
                    <LabelList dataKey="value" position="right" formatter={(v: unknown) => format(Number(v))} className="fill-foreground text-xs tabular-nums" />
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}

/** Share of a whole, five slices at most (the rest fold into "Other"), with the total in the middle. */
export function Donut({
    data,
    center,
    sub,
    format = (n) => String(n),
}: {
    data: { label: string; value: number }[]
    center: string
    sub: string
    format?: (n: number) => string
}) {
    const sorted = [...data].sort((a, b) => b.value - a.value)
    const slices = sorted.length > 5 ? [...sorted.slice(0, 4), { label: "Other", value: sorted.slice(4).reduce((a, d) => a + d.value, 0) }] : sorted
    // One hue in steps (sequential), so slices never borrow the reserved Price, Buyback or status colours.
    const shade = (i: number) => `color-mix(in oklab, var(--sequential) ${100 - i * 18}%, var(--card))`
    const config: ChartConfig = Object.fromEntries(slices.map((s, i) => [s.label, { label: s.label, color: shade(i) }]))
    return (
        <ChartContainer config={config} className="mx-auto aspect-square h-56">
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" valueFormatter={(v) => format(Number(v))} />} />
                <Pie data={slices} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="92%" stroke="var(--card)" strokeWidth={2}>
                    {slices.map((s, i) => <Cell key={s.label} fill={shade(i)} />)}
                </Pie>
                <text x="50%" y="48%" textAnchor="middle" className="fill-foreground text-xl font-semibold">{center}</text>
                <text x="50%" y="58%" textAnchor="middle" className="fill-muted-foreground text-xs">{sub}</text>
                <ChartLegend content={<ChartLegendContent nameKey="label" />} />
            </PieChart>
        </ChartContainer>
    )
}

/** Change between two points, indexed to 100 at the start so metals of very different prices share one axis. */
export function Slope({
    items,
    left,
    right,
}: {
    items: { key: string; label: string; start: number; end: number; color: string; dashed?: boolean }[]
    left: string
    right: string
}) {
    const data = [
        { x: left, ...Object.fromEntries(items.map((i) => [i.key, 100])) },
        { x: right, ...Object.fromEntries(items.map((i) => [i.key, Math.round((i.end / i.start) * 1000) / 10])) },
    ]
    const series = items.map((i) => ({ key: i.key, label: i.label, color: i.color, dashed: i.dashed }))
    const nudge = labelNudges(items.map((i) => ({ key: i.key, value: (i.end / i.start) * 100 })), 240 - 60)
    return (
        <ChartContainer config={configOf(series)} className="h-60 w-full">
            <LineChart data={data} margin={{ left: 4, right: 96, top: 12, bottom: 4 }}>
                {GRID}
                <XAxis dataKey="x" tickLine={false} axisLine={false} tick={AXIS} padding={{ left: 12, right: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={AXIS} width={40} domain={["auto", "auto"]} />
                <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `${Number(v).toFixed(1)}`} />} />
                <ChartLegend content={<ChartLegendContent />} />
                {series.map((s) => (
                    <Line key={s.key} dataKey={s.key} stroke={`var(--color-${s.key})`} strokeWidth={2} strokeDasharray={s.dashed ? "6 4" : undefined} dot={{ r: 4 }} isAnimationActive={false}>
                        <LabelList
                            dataKey={s.key}
                            content={({ x, y, index, value }) =>
                                index === 1 ? (
                                    <text x={Number(x) + 8} y={Number(y) + 4 + (nudge[s.key] ?? 0)} className="fill-foreground text-xs">
                                        {s.label} {(Number(value) - 100).toFixed(1)}%
                                    </text>
                                ) : null
                            }
                        />
                    </Line>
                ))}
            </LineChart>
        </ChartContainer>
    )
}

/**
 * Pixel offsets that keep end labels at least 13px apart. The axis covers the end values plus 100 (the start), so the
 * value-to-pixel scale is estimated from that range over the plot height.
 */
function labelNudges(ends: { key: string; value: number }[], plotHeight: number): Record<string, number> {
    const values = [100, ...ends.map((e) => e.value)]
    const range = Math.max(1e-6, Math.max(...values) - Math.min(...values))
    const px = (v: number) => -(v / range) * plotHeight
    const sorted = [...ends].sort((a, b) => b.value - a.value)
    const out: Record<string, number> = {}
    let last = -Infinity
    for (const e of sorted) {
        const y = px(e.value)
        const placed = Math.max(y, last + 13)
        out[e.key] = placed - y
        last = placed
    }
    return out
}

/** Part of a whole in two levels (metal, then product family), sized by pieces. */
export function TreeMap({ data, format }: { data: { group: string; name: string; value: number; color: string }[]; format: (n: number) => string }) {
    const groups = [...new Set(data.map((d) => d.group))].map((g) => ({
        name: g,
        children: data.filter((d) => d.group === g).map((d) => ({ name: d.name, value: d.value, fill: d.color, group: g })),
    }))
    const config: ChartConfig = {}
    return (
        <ChartContainer config={config} className="h-72 w-full">
            <Treemap
                data={groups}
                dataKey="value"
                stroke="var(--card)"
                isAnimationActive={false}
                content={<TreeCell />}
            >
                <ChartTooltip
                    content={({ active, payload }) => {
                        const p = payload?.[0]?.payload as { name?: string; value?: number; group?: string } | undefined
                        if (!active || !p?.group) return null
                        return (
                            <div className="bg-background rounded-md border px-2.5 py-1.5 text-xs shadow-sm">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-muted-foreground">{p.group} · {format(p.value ?? 0)}</div>
                            </div>
                        )
                    }}
                />
            </Treemap>
        </ChartContainer>
    )
}

function TreeCell(props: { x?: number; y?: number; width?: number; height?: number; name?: string; fill?: string; depth?: number }) {
    const { x = 0, y = 0, width = 0, height = 0, name, fill, depth } = props
    if (depth !== 2) return null
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} rx={4} fill={fill} stroke="var(--card)" strokeWidth={2} />
            {width > 70 && height > 22 && (
                <text x={x + 6} y={y + 16} className="fill-foreground text-xs font-medium">
                    {name}
                </text>
            )}
        </g>
    )
}

/** Hover tooltip for the hand-drawn charts below: follows the pointer inside the chart box. */
function useTip() {
    const [tip, setTip] = useState<{ x: number; y: number; text: ReactNode } | null>(null)
    const show = (e: React.MouseEvent, text: ReactNode) => {
        const box = (e.currentTarget as SVGElement).ownerSVGElement?.getBoundingClientRect()
        if (!box) return
        setTip({ x: e.clientX - box.left, y: e.clientY - box.top, text })
    }
    const node = tip && (
        <div
            role="tooltip"
            className="bg-background pointer-events-none absolute z-10 rounded-md border px-2.5 py-1.5 text-xs whitespace-nowrap shadow-sm"
            style={{ left: tip.x + 12, top: tip.y + 12 }}
        >
            {tip.text}
        </div>
    )
    return { show, hide: () => setTip(null), node }
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const shadeFor = (value: number, max: number) =>
    value === 0 ? "var(--muted)" : `color-mix(in oklab, var(--sequential) ${Math.round(20 + (value / max) * 80)}%, var(--card))`

/** When things happen: Monday to Sunday down, hours across, darker = more. */
export function WeekHourHeatmap({ cells, unit }: { cells: HeatCell[]; unit: string }) {
    const tip = useTip()
    const max = Math.max(1, ...cells.map((c) => c.value))
    const W = 24 * 22 + 44
    const H = 7 * 22 + 24
    return (
        <div className="relative overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="h-auto max-w-none" role="img" aria-label={`${unit} by weekday and hour`} onMouseLeave={tip.hide}>
                {WEEKDAYS.map((d, i) => (
                    <text key={d} x={0} y={i * 22 + 15} className="fill-muted-foreground text-xs">{d}</text>
                ))}
                {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
                    <text key={h} x={44 + h * 22} y={H - 4} className="fill-muted-foreground text-xs">{String(h).padStart(2, "0")}</text>
                ))}
                {cells.map((c) => (
                    <rect
                        key={`${c.weekday}:${c.hour}`}
                        x={44 + c.hour * 22}
                        y={c.weekday * 22}
                        width={20}
                        height={20}
                        rx={3}
                        fill={shadeFor(c.value, max)}
                        onMouseMove={(e) => tip.show(e, <><b>{WEEKDAYS[c.weekday]} {String(c.hour).padStart(2, "0")}:00</b> · {c.value} {unit}</>)}
                    />
                ))}
            </svg>
            {tip.node}
        </div>
    )
}

/** One square per day, weeks across, Monday at the top; darker = more. */
export function CalendarHeatmap({ days, from, to, format }: { days: DayValue[]; from: string; to: string; format: (n: number) => string }) {
    const tip = useTip()
    const byDay = new Map(days.map((d) => [d.day, d.value]))
    const max = Math.max(1, ...days.map((d) => d.value))
    const start = new Date(`${from}T00:00:00Z`)
    const end = new Date(`${to}T00:00:00Z`)
    const offset = (start.getUTCDay() + 6) % 7
    const cells: { day: string; col: number; row: number; value: number }[] = []
    for (let d = new Date(start), i = 0; d <= end; d.setUTCDate(d.getUTCDate() + 1), i++) {
        const iso = d.toISOString().slice(0, 10)
        cells.push({ day: iso, col: Math.floor((i + offset) / 7), row: (i + offset) % 7, value: byDay.get(iso) ?? 0 })
    }
    const cols = (cells.at(-1)?.col ?? 0) + 1
    const S = 14
    return (
        <div className="relative overflow-x-auto">
            <svg viewBox={`0 0 ${cols * S + 34} ${7 * S}`} width={cols * S + 34} height={7 * S} className="max-w-none" role="img" aria-label="Daily values" onMouseLeave={tip.hide}>
                {[0, 2, 4].map((r) => (
                    <text key={r} x={0} y={r * S + 10} className="fill-muted-foreground text-xs">{WEEKDAYS[r]}</text>
                ))}
                {cells.map((c) => (
                    <rect
                        key={c.day}
                        x={34 + c.col * S}
                        y={c.row * S}
                        width={S - 2}
                        height={S - 2}
                        rx={2}
                        fill={shadeFor(c.value, max)}
                        onMouseMove={(e) => tip.show(e, <><b>{dayLabel(c.day)}</b> · {format(c.value)}</>)}
                    />
                ))}
            </svg>
            {tip.node}
        </div>
    )
}

/** How orders move from step to step: steps left to right, band width = orders that took that link. */
export function StepFlow({ links, steps, label }: { links: FlowLink[]; steps: string[]; label: (s: string) => string }) {
    const tip = useTip()
    const used = steps.filter((s) => links.some((l) => l.from === s || l.to === s))
    const max = Math.max(1, ...links.map((l) => l.value))
    const W = 640
    const H = 180
    const colX = (s: string) => 48 + (used.indexOf(s) * (W - 96)) / Math.max(1, used.length - 1)
    const thick = (v: number) => 4 + (v / max) * 36
    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Orders moving between steps" onMouseLeave={tip.hide}>
                {links.map((l) => {
                    const x1 = colX(l.from) + 8
                    const x2 = colX(l.to) - 8
                    const skip = used.indexOf(l.to) - used.indexOf(l.from) > 1
                    const y = skip ? H / 2 + 46 : H / 2
                    const mid = (x1 + x2) / 2
                    return (
                        <path
                            key={`${l.from}>${l.to}`}
                            d={`M${x1},${H / 2} C${mid},${H / 2} ${mid},${y} ${mid},${y} S${x2},${H / 2} ${x2},${H / 2}`}
                            fill="none"
                            stroke="color-mix(in oklab, var(--sequential) 55%, var(--card))"
                            strokeWidth={thick(l.value)}
                            strokeOpacity={0.85}
                            onMouseMove={(e) => tip.show(e, <><b>{label(l.from)} → {label(l.to)}</b> · {l.value} orders</>)}
                        />
                    )
                })}
                {used.map((s) => (
                    <g key={s}>
                        <rect x={colX(s) - 8} y={H / 2 - 26} width={16} height={52} rx={4} className="fill-foreground" />
                        <text x={colX(s)} y={H / 2 - 34} textAnchor="middle" className="fill-foreground text-xs">{label(s)}</text>
                    </g>
                ))}
            </svg>
            {tip.node}
        </div>
    )
}
