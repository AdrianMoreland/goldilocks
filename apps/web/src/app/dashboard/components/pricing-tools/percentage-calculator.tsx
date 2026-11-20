import * as React from "react"
import {
    ArrowDown, ArrowLeftRight, ArrowRight, ArrowUp, ChevronDown, CircleMinus, CircleX, Divide, Link as LinkIcon,
    Minus, Percent as PercentIcon, Plus, TrendingDown, TrendingUp, X, type LucideIcon,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { SectionLabel } from "./tab-widgets"
import { cn } from "@/lib/utils"
import { useNumberField } from "@/components/number-input"

type PercentMode = "of" | "isWhatPercent" | "add" | "subtract" | "change" | "deducted" | "chain"

interface ModeInfo {
    value: PercentMode
    label: string
    description: string
    icon: LucideIcon
    xLabel: string
    yLabel: string
    xIsPercent: boolean
    yIsPercent: boolean
    defaultX: number
    defaultY: number
}

// Every mode ships with a sensible non-zero default pair so the calculator
// always shows a real, already-computed example, never a blank "0" result
// that gives a first-time (or non-technical) user nothing to anchor on.
// "chain" keeps its own state, so its x/y fields are unused placeholders.
const PERCENT_MODES: ModeInfo[] = [
    { value: "of", label: "% of a value", description: "Calculate a percentage of a value", icon: PercentIcon, xLabel: "Percent", yLabel: "Value", xIsPercent: true, yIsPercent: false, defaultX: 20, defaultY: 250 },
    { value: "isWhatPercent", label: "What % is X of Y", description: "Find what percent one value is of another", icon: Divide, xLabel: "Value", yLabel: "Out of", xIsPercent: false, yIsPercent: false, defaultX: 50, defaultY: 250 },
    { value: "add", label: "Increase by %", description: "Increase a value by a percentage", icon: TrendingUp, xLabel: "Increase by", yLabel: "Starting value", xIsPercent: true, yIsPercent: false, defaultX: 15, defaultY: 200 },
    { value: "subtract", label: "Decrease by %", description: "Decrease a value by a percentage", icon: TrendingDown, xLabel: "Decrease by", yLabel: "Starting value", xIsPercent: true, yIsPercent: false, defaultX: 10, defaultY: 200 },
    { value: "change", label: "% change", description: "Calculate the percentage change between two values", icon: ArrowLeftRight, xLabel: "Before", yLabel: "After", xIsPercent: false, yIsPercent: false, defaultX: 200, defaultY: 230 },
    { value: "deducted", label: "Original before % deducted", description: "Work back to the value before a deduction", icon: CircleMinus, xLabel: "Current", yLabel: "% deducted", xIsPercent: false, yIsPercent: true, defaultX: 80, defaultY: 20 },
    { value: "chain", label: "Multi-step chain", description: "Apply several increases and decreases in a row", icon: LinkIcon, xLabel: "", yLabel: "", xIsPercent: false, yIsPercent: false, defaultX: 0, defaultY: 0 },
]

type Tone = "info" | "up" | "down"

// Colour is always paired with a word, sign or arrow, never the only signal.
const TONE: Record<Tone, { text: string; soft: string; fill: string; fillStyle?: React.CSSProperties }> = {
    info: { text: "text-sky-700 dark:text-sky-400", soft: "bg-sky-500/10", fill: "", fillStyle: { background: "var(--status-info)" } },
    up: { text: "text-emerald-600 dark:text-emerald-400", soft: "bg-emerald-600/10", fill: "bg-emerald-500" },
    down: { text: "text-destructive", soft: "bg-destructive/10", fill: "bg-red-500" },
}

const fmt = (n: number) => n.toLocaleString("en-IE", { maximumFractionDigits: 2 })
const fmt2 = (n: number) => n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const MINUS = "−"
const signed = (n: number, f: (v: number) => string) => (n < 0 ? `${MINUS}${f(Math.abs(n))}` : `+${f(n)}`)
const clampPct = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0)

function calcResult(mode: PercentMode, x: number, y: number): { value: number | null; suffix: string } {
    switch (mode) {
        case "of":
            return { value: y * (x / 100), suffix: "" }
        case "isWhatPercent":
            return { value: y !== 0 ? (x / y) * 100 : 0, suffix: "%" }
        case "add":
            return { value: y * (1 + x / 100), suffix: "" }
        case "subtract":
            return { value: y * (1 - x / 100), suffix: "" }
        case "change":
            return { value: x !== 0 ? ((y - x) / x) * 100 : 0, suffix: "%" }
        case "deducted":
            // A deduction of 100% or more has no "before" value.
            return { value: y >= 100 ? null : x / (1 - y / 100), suffix: "" }
        case "chain":
            return { value: 0, suffix: "" }
    }
}

/**
 * Percentage calculator: a collapsed mode selector that expands into a
 * picklist, plain-language pill inputs, and a result card plus a simple
 * picture whose colours follow the meaning (blue lookup, green up, red down).
 */
export function PercentageCalculator() {
    const [mode, setMode] = React.useState<PercentMode>("of")
    const [pickerOpen, setPickerOpen] = React.useState(false)
    const info = PERCENT_MODES.find((m) => m.value === mode)!
    const [x, setX] = React.useState(info.defaultX)
    const [y, setY] = React.useState(info.defaultY)

    // Switching modes reloads that mode's own default example so the
    // calculator never shows a stale, mismatched pair of numbers.
    const handleModeChange = (next: PercentMode) => {
        const nextInfo = PERCENT_MODES.find((m) => m.value === next)!
        setMode(next)
        setX(nextInfo.defaultX)
        setY(nextInfo.defaultY)
        setPickerOpen(false)
    }

    const result = calcResult(mode, x, y)

    return (
        <div className="flex flex-col gap-3">
            <ModePickerRow info={info} open={pickerOpen} onToggle={() => setPickerOpen((o) => !o)} />

            {pickerOpen ? (
                <div className="divide-border flex flex-col divide-y overflow-hidden rounded-2xl border">
                    {PERCENT_MODES.map((m) => (
                        <ModeListItem key={m.value} info={m} active={m.value === mode} onClick={() => handleModeChange(m.value)} />
                    ))}
                </div>
            ) : mode === "chain" ? (
                <ChainCalculator />
            ) : (
                <>
                    <div className="bg-card flex flex-col gap-3 rounded-2xl border p-3.5">
                        <PillField label={info.xLabel} value={x} onChange={setX} suffix={info.xIsPercent ? "%" : undefined} />
                        <PillField label={info.yLabel} value={y} onChange={setY} suffix={info.yIsPercent ? "%" : undefined} />
                    </div>

                    <SingleResult mode={mode} x={x} y={y} value={result.value} suffix={result.suffix} />

                    {result.value !== null && (
                        <div className="bg-card flex flex-col gap-2 rounded-2xl border p-3.5">
                            <SectionLabel>VISUAL</SectionLabel>
                            <PercentVisual mode={mode} x={x} y={y} result={result.value} />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function SingleResult({ mode, x, y, value, suffix }: { mode: PercentMode; x: number; y: number; value: number | null; suffix: string }) {
    if (value === null) {
        return (
            <PercentResultCard tone="info" value="—">
                The deduction must be under 100%
            </PercentResultCard>
        )
    }
    if (mode === "change") {
        const up = value >= 0
        return (
            <PercentResultCard tone={up ? "up" : "down"} value={`${up ? "+" : MINUS}${fmt(Math.abs(value))}${suffix}`} icon={up ? ArrowUp : ArrowDown}>
                {up ? "Went up" : "Went down"} from {fmt(x)} to {fmt(y)}
            </PercentResultCard>
        )
    }
    if (mode === "add") return <PercentResultCard tone="up" value={fmt(value)} icon={TrendingUp}>{signed(value - y, fmt)} on {fmt(y)}</PercentResultCard>
    if (mode === "subtract") return <PercentResultCard tone="down" value={fmt(value)} icon={TrendingDown}>{signed(value - y, fmt)} from {fmt(y)}</PercentResultCard>
    if (mode === "deducted") return <PercentResultCard tone="info" value={fmt2(value)}>Before the {fmt(y)}% deduction</PercentResultCard>
    return <PercentResultCard tone="info" value={`${fmt(value)}${suffix}`} />
}

/** Collapsed mode selector: tap to expand the full mode list below it. */
function ModePickerRow({ info, open, onToggle }: { info: ModeInfo; open: boolean; onToggle: () => void }) {
    const Icon = info.icon
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="bg-card flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left"
        >
            <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--tab-accent-soft)", color: "var(--tab-accent-text)" }}
            >
                <Icon className="size-4.5" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{info.label}</div>
                <div className="text-muted-foreground truncate text-xs">{info.description}</div>
            </div>
            <ChevronDown className={cn("text-muted-foreground size-4 shrink-0 motion-safe:transition-transform", open && "rotate-180")} />
        </button>
    )
}

/** One row in the expanded mode list. */
function ModeListItem({ info, active, onClick }: { info: ModeInfo; active: boolean; onClick: () => void }) {
    const Icon = info.icon
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn("flex cursor-pointer items-center gap-3 p-3 text-left motion-safe:transition-colors", active ? "bg-muted/70" : "bg-card hover:bg-muted/40")}
        >
            <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--tab-accent-soft)", color: "var(--tab-accent-text)" }}
            >
                <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{info.label}</div>
                <div className="text-muted-foreground truncate text-xs">{info.description}</div>
            </div>
        </button>
    )
}

/** A label + rounded "pill" input with an inline clear button, and an optional unit suffix outside the pill. */
function PillField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (value: number) => void; suffix?: string }) {
    const numberField = useNumberField({ value, onValueChange: onChange })
    return (
        <div className="flex items-center gap-3">
            <Label className="text-muted-foreground w-28 shrink-0 text-sm font-normal">{label}</Label>
            <div className="bg-muted flex min-w-0 flex-1 items-center gap-1.5 rounded-xl px-3 py-2">
                <input
                    step="any"
                    {...numberField}
                    className="w-full min-w-0 bg-transparent text-right text-base font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                    type="button"
                    onClick={() => onChange(0)}
                    // A 36px tap area around the 16px icon, in px because the theme's spacing unit is compact; the negative margin keeps the pill's height.
                    className="text-muted-foreground/60 hover:text-foreground -my-2 -mr-2 grid size-[36px] shrink-0 cursor-pointer place-items-center rounded-full"
                    aria-label={`Clear ${label}`}
                >
                    <CircleX className="size-4" />
                </button>
            </div>
            {suffix && <span className="text-muted-foreground w-4 shrink-0 text-sm font-medium">{suffix}</span>}
        </div>
    )
}

/** Centered result card: blue for a plain lookup, green for up, red for down. */
function PercentResultCard({ tone, value, icon: Icon, children }: { tone: Tone; value: string; icon?: LucideIcon; children?: React.ReactNode }) {
    const t = TONE[tone]
    return (
        <div className={cn("flex flex-col items-center gap-1 rounded-2xl p-4", t.soft)}>
            <span className={cn("text-[11px] font-bold tracking-wide uppercase", t.text)}>Result</span>
            <span className={cn("flex items-center gap-2 text-3xl font-extrabold tabular-nums", t.text)} data-testid="percent-result">
                {Icon && <Icon className="size-[26px] shrink-0" aria-hidden />}
                <span>{value}</span>
            </span>
            {children && <span className={cn("text-center text-xs font-medium", t.text)}>{children}</span>}
        </div>
    )
}

/** A bar segment sized by percentage of its container. */
function BarSegment({ widthPct, tone, className }: { widthPct: number; tone?: Tone; className?: string }) {
    const t = tone ? TONE[tone] : undefined
    return (
        <div
            className={cn("h-full motion-safe:transition-[width] motion-safe:duration-200", t?.fill, className)}
            style={{ width: `${clampPct(widthPct)}%`, ...t?.fillStyle }}
        />
    )
}

function BarLabel({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
    return (
        <div className={cn("text-muted-foreground text-[11px]", align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left")}>
            {children}
        </div>
    )
}

function LegendItem({ tone, children }: { tone: Tone; children: React.ReactNode }) {
    const t = TONE[tone]
    return (
        <span className={cn("flex items-center gap-1.5 text-xs font-semibold tabular-nums", t.text)}>
            <span aria-hidden className={cn("size-[10px] shrink-0 rounded-full", t.fill)} style={t.fillStyle} />
            {children}
        </span>
    )
}

/** A vertical block whose height is a share of the shared chart height, with its caption underneath. */
function Block({ heightPct, tone, label, value, children }: { heightPct: number; tone: Tone; label: string; value: string; children?: React.ReactNode }) {
    const t = TONE[tone]
    return (
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="flex h-[96px] w-full max-w-[84px] flex-col justify-end">
                {children}
                <div
                    className={cn("w-full rounded-md motion-safe:transition-[height] motion-safe:duration-200", t.fill)}
                    style={{ height: `${Math.max(4, clampPct(heightPct))}%`, ...t.fillStyle }}
                />
            </div>
            <div className="text-muted-foreground text-[11px]">{label}</div>
            <div className={cn("max-w-full text-xs font-bold tabular-nums break-all", t.text)}>{value}</div>
        </div>
    )
}

/**
 * Plain-div pictures (no chart library) that match the active mode, so the
 * numbers aren't the only thing telling the story.
 */
function PercentVisual({ mode, x, y, result }: { mode: PercentMode; x: number; y: number; result: number }) {
    if (mode === "of" || mode === "isWhatPercent") {
        const isOf = mode === "of"
        const pct = isOf ? clampPct(x) : y !== 0 ? clampPct((x / y) * 100) : 0
        const middle = isOf ? `${fmt(x)}% of ${fmt(y)} = ${fmt(result)}` : `${fmt(x)} is ${fmt(result)}%`
        return (
            <div className="flex flex-col gap-1">
                <div className="bg-muted h-[20px] w-full overflow-hidden rounded-full">
                    <BarSegment widthPct={pct} tone="info" />
                </div>
                <div className="flex items-start justify-between gap-2">
                    <BarLabel>0</BarLabel>
                    <BarLabel align="center">{middle}</BarLabel>
                    <BarLabel align="right">{fmt(y)}</BarLabel>
                </div>
            </div>
        )
    }

    if (mode === "add" || mode === "subtract") {
        const isAdd = mode === "add"
        const total = isAdd ? result : y
        const basePct = total > 0 ? ((isAdd ? y : result) / total) * 100 : 0
        const diff = result - y
        return (
            <div className="flex flex-col gap-2">
                <div className="bg-muted flex h-[20px] w-full overflow-hidden rounded-full">
                    <BarSegment widthPct={basePct} tone="info" />
                    <BarSegment widthPct={100 - clampPct(basePct)} tone={isAdd ? "up" : "down"} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <LegendItem tone="info">{isAdd ? "Original" : "Kept"}: {fmt(isAdd ? y : result)}</LegendItem>
                    <LegendItem tone={isAdd ? "up" : "down"}>{signed(diff, fmt)}</LegendItem>
                </div>
            </div>
        )
    }

    if (mode === "deducted") {
        const keptPct = result > 0 ? (x / result) * 100 : 0
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-end justify-center gap-3">
                    <Block heightPct={100} tone="up" label="Original" value={fmt2(result)} />
                    <ArrowRight className="text-muted-foreground mb-[34px] size-[18px] shrink-0" aria-hidden />
                    <Block heightPct={keptPct} tone="info" label="Current" value={fmt2(x)}>
                        {/* The deducted part, drawn as an empty top. */}
                        <div className="border-destructive/60 w-full flex-1 rounded-md border border-dashed" aria-hidden />
                    </Block>
                </div>
                <div className="text-muted-foreground text-center text-xs">After deducting {fmt(y)}%</div>
            </div>
        )
    }

    // "change": before/after blocks scaled to the larger value.
    const max = Math.max(x, y, 1)
    const isUp = result >= 0
    const ChangeArrow = isUp ? ArrowUp : ArrowDown
    return (
        <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-end justify-center gap-1.5">
                <Block heightPct={(x / max) * 100} tone="info" label="Before" value={fmt(x)} />
                <ArrowRight className="text-muted-foreground mb-[34px] size-[16px] shrink-0" aria-hidden />
                <Block heightPct={(y / max) * 100} tone={isUp ? "up" : "down"} label="After" value={fmt(y)} />
            </div>
            <div className={cn("flex shrink-0 flex-col items-center", TONE[isUp ? "up" : "down"].text)}>
                <ChangeArrow className="size-[36px]" strokeWidth={2.5} aria-hidden />
                <span className="text-xl font-extrabold tabular-nums">{Math.abs(result).toFixed(1)}%</span>
                <span className="text-[11px] font-semibold">{isUp ? "increase" : "decrease"}</span>
            </div>
        </div>
    )
}

interface ChainStep {
    id: number
    sign: 1 | -1
    pct: number
}

/** Start value plus a list of +/- percent steps applied one after another. */
function ChainCalculator() {
    const [start, setStart] = React.useState(100)
    const [steps, setSteps] = React.useState<ChainStep[]>([
        { id: 1, sign: 1, pct: 10 },
        { id: 2, sign: -1, pct: 80 },
    ])
    const nextId = React.useRef(3)

    const patchStep = (id: number, patch: Partial<ChainStep>) => setSteps((s) => s.map((st) => (st.id === id ? { ...st, ...patch } : st)))
    const addStep = () => setSteps((s) => [...s, { id: nextId.current++, sign: 1, pct: 10 }])

    const running: number[] = []
    let value = start
    for (const st of steps) {
        value *= 1 + (st.sign * st.pct) / 100
        running.push(value)
    }
    const net = start !== 0 ? ((value - start) / start) * 100 : 0
    const tone: Tone = value > start ? "up" : value < start ? "down" : "info"

    return (
        <>
            <div className="bg-card flex flex-col gap-3 rounded-2xl border p-3.5">
                <PillField label="Starting value" value={start} onChange={setStart} />
                <div className="flex flex-col gap-2">
                    {steps.map((st, i) => (
                        <StepRow
                            key={st.id}
                            index={i}
                            step={st}
                            running={running[i]}
                            onChange={(patch) => patchStep(st.id, patch)}
                            onRemove={() => setSteps((s) => s.filter((x) => x.id !== st.id))}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addStep}
                    className="text-muted-foreground hover:text-foreground flex h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed text-sm font-semibold"
                >
                    <Plus className="size-4" aria-hidden />
                    Add step
                </button>
            </div>

            <PercentResultCard tone={tone} value={fmt2(value)} icon={tone === "up" ? TrendingUp : tone === "down" ? TrendingDown : undefined}>
                Start {fmt2(start)} <ArrowRight className="inline size-[12px] align-[-1px]" aria-hidden /> Net change {signed(net, fmt2)}%
            </PercentResultCard>

            {steps.length > 0 && (
                <div className="bg-card flex flex-col gap-2 rounded-2xl border p-3.5">
                    <SectionLabel>STEP BREAKDOWN</SectionLabel>
                    <ol className="flex flex-col gap-1">
                        {steps.map((st, i) => {
                            const t = TONE[st.sign === 1 ? "up" : "down"]
                            return (
                                <li key={st.id} className={cn("flex items-center gap-1.5 text-sm font-semibold tabular-nums", t.text)}>
                                    <span>{i + 1}. {st.sign === 1 ? "+" : MINUS}{fmt(st.pct)}%</span>
                                    <ArrowRight className="size-[14px] shrink-0" aria-hidden />
                                    <span>{fmt2(running[i])}</span>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            )}
        </>
    )
}

function StepRow({ index, step, running, onChange, onRemove }: {
    index: number
    step: ChainStep
    running: number
    onChange: (patch: Partial<ChainStep>) => void
    onRemove: () => void
}) {
    const numberField = useNumberField({ value: step.pct, onValueChange: (pct) => onChange({ pct }) })
    const up = step.sign === 1
    const n = index + 1
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => onChange({ sign: up ? -1 : 1 })}
                aria-label={`Step ${n}: ${up ? "increase" : "decrease"}. Tap to switch`}
                // 40px circle in px because the theme's spacing unit is compact.
                className={cn("grid size-[40px] shrink-0 cursor-pointer place-items-center rounded-full text-white", up ? "bg-emerald-600" : "bg-red-600")}
            >
                {up ? <Plus className="size-[20px]" aria-hidden /> : <Minus className="size-[20px]" aria-hidden />}
            </button>
            <div className="bg-muted flex min-w-0 flex-1 items-center gap-1 rounded-xl px-3 py-2">
                <input
                    step="any"
                    {...numberField}
                    aria-label={`Step ${n} percent`}
                    className="w-full min-w-0 bg-transparent text-right text-base font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-muted-foreground text-sm font-medium">%</span>
            </div>
            <span className="text-muted-foreground w-[76px] shrink-0 text-right text-sm font-semibold tabular-nums">= {fmt2(running)}</span>
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove step ${n}`}
                className="text-muted-foreground hover:text-foreground grid size-[40px] shrink-0 cursor-pointer place-items-center rounded-full"
            >
                <X className="size-[18px]" aria-hidden />
            </button>
        </div>
    )
}
