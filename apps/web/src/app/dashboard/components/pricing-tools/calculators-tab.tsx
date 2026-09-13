import * as React from "react"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { tabThemeStyle } from "./tab-theme"
import { ResultHighlight, SubtabRow } from "./tab-widgets"
import { cn } from "@/lib/utils"

type CalcSubTab = "percentage" | "weight"

const CALC_SUBTABS: { value: CalcSubTab; label: string }[] = [
    { value: "percentage", label: "Percentage" },
    { value: "weight", label: "Weight Converter" },
]

/**
 * Calculators tab — general-purpose percentage calculator + bullion weight
 * unit converter. The original Apps Script tool's exact version of this
 * panel wasn't available to port from directly (no source file for it in
 * this repo, and it wasn't shared here), so this is a best-effort rebuild
 * covering the same two tools with the units/modes a bullion desk actually
 * uses day-to-day.
 */
export function CalculatorsTab() {
    const [subTab, setSubTab] = React.useState<CalcSubTab>("percentage")

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("calc")}>
            <SubtabRow options={CALC_SUBTABS} value={subTab} onChange={setSubTab} />

            {subTab === "percentage" && <PercentageCalculator />}
            {subTab === "weight" && <WeightConverter />}
        </div>
    )
}

type PercentMode = "of" | "isWhatPercent" | "add" | "subtract" | "change"

interface ModeInfo {
    value: PercentMode
    label: string
    /** Plain-English sentence template shown above the inputs, with {x}/{y} placeholders. */
    sentence: (x: string, y: string) => string
    xLabel: string
    yLabel: string
    defaultX: number
    defaultY: number
}

// Every mode ships with a sensible non-zero default pair so the calculator
// always shows a real, already-computed example — never a blank "0" result
// that gives a first-time (or non-technical) user nothing to anchor on.
const PERCENT_MODES: ModeInfo[] = [
    { value: "of", label: "X% of Y", sentence: (x, y) => `What is ${x}% of ${y}?`, xLabel: "Percent (X)", yLabel: "Of value (Y)", defaultX: 20, defaultY: 250 },
    { value: "isWhatPercent", label: "X is what % of Y", sentence: (x, y) => `${x} is what percent of ${y}?`, xLabel: "Value (X)", yLabel: "Out of (Y)", defaultX: 50, defaultY: 250 },
    { value: "add", label: "Add X% to Y", sentence: (x, y) => `Add ${x}% on top of ${y}`, xLabel: "Percent to add (X)", yLabel: "Starting value (Y)", defaultX: 15, defaultY: 200 },
    { value: "subtract", label: "Subtract X% from Y", sentence: (x, y) => `Take ${x}% off ${y}`, xLabel: "Percent to remove (X)", yLabel: "Starting value (Y)", defaultX: 10, defaultY: 200 },
    { value: "change", label: "% change, X → Y", sentence: (x, y) => `From ${x} to ${y} — what's the change?`, xLabel: "From (X)", yLabel: "To (Y)", defaultX: 200, defaultY: 230 },
]

function calcResult(mode: PercentMode, x: number, y: number): { value: number; suffix: string } {
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
    }
}

function PercentageCalculator() {
    const [mode, setMode] = React.useState<PercentMode>("of")
    const info = PERCENT_MODES.find((m) => m.value === mode)!
    const [x, setX] = React.useState(info.defaultX)
    const [y, setY] = React.useState(info.defaultY)

    // Switching modes reloads that mode's own default example — the
    // calculator should never show a stale, mismatched pair of numbers
    // (or a blank 0) after changing what it's calculating.
    const handleModeChange = (next: PercentMode) => {
        const nextInfo = PERCENT_MODES.find((m) => m.value === next)!
        setMode(next)
        setX(nextInfo.defaultX)
        setY(nextInfo.defaultY)
    }

    const result = calcResult(mode, x, y)
    const resultText = `${result.value.toLocaleString("en-IE", { maximumFractionDigits: 2 })}${result.suffix}`

    return (
        <div className="flex flex-col gap-4">
            {/* ── Mode picker: big tappable cards, not a dense toggle row ──── */}
            <div className="grid grid-cols-1 gap-1.5">
                {PERCENT_MODES.map((m) => {
                    const active = m.value === mode
                    return (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => handleModeChange(m.value)}
                            aria-pressed={active}
                            className={cn(
                                "cursor-pointer rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors",
                                active ? "text-white" : "bg-card text-foreground hover:bg-muted/60",
                            )}
                            style={active ? { background: "var(--tab-accent)", borderColor: "var(--tab-accent)" } : undefined}
                        >
                            {m.label}
                        </button>
                    )
                })}
            </div>

            {/* ── Plain-English restatement of the calculation ─────────────── */}
            <p className="text-muted-foreground text-center text-sm">
                {info.sentence(x.toLocaleString("en-IE"), y.toLocaleString("en-IE"))}
            </p>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">{info.xLabel}</Label>
                    <Input type="number" step="0.01" value={x} onChange={(e) => setX(Number(e.target.value) || 0)} />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">{info.yLabel}</Label>
                    <Input type="number" step="0.01" value={y} onChange={(e) => setY(Number(e.target.value) || 0)} />
                </div>
            </div>

            <PercentVisual mode={mode} x={x} y={y} result={result.value} />

            <Separator />

            <ResultHighlight label="Result" value={resultText} />
        </div>
    )
}

/** A single labeled horizontal bar segment, sized by percentage of its container. */
function BarSegment({ widthPct, className, style }: { widthPct: number; className?: string; style?: React.CSSProperties }) {
    return (
        <div
            className={cn("h-full transition-[width] duration-200", className)}
            style={{ width: `${Math.max(0, Math.min(100, widthPct))}%`, ...style }}
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

/**
 * The "mini graph" the calculator needs to be usable at a glance — a plain
 * horizontal proportion bar (no charting library) whose segments visually
 * match whichever calculation mode is active, so the numbers aren't the
 * only thing telling the story.
 */
function PercentVisual({ mode, x, y, result }: { mode: PercentMode; x: number; y: number; result: number }) {
    if (mode === "of") {
        const pct = Math.max(0, Math.min(100, x))
        return (
            <div className="flex flex-col gap-1">
                <div className="bg-muted h-5 w-full overflow-hidden rounded-full">
                    <BarSegment widthPct={pct} style={{ background: "var(--tab-accent)" }} />
                </div>
                <div className="flex items-center justify-between">
                    <BarLabel>0</BarLabel>
                    <BarLabel align="center">{x}% of Y</BarLabel>
                    <BarLabel align="right">{y.toLocaleString("en-IE")}</BarLabel>
                </div>
            </div>
        )
    }

    if (mode === "isWhatPercent") {
        const pct = y !== 0 ? Math.max(0, Math.min(100, (x / y) * 100)) : 0
        return (
            <div className="flex flex-col gap-1">
                <div className="bg-muted h-5 w-full overflow-hidden rounded-full">
                    <BarSegment widthPct={pct} style={{ background: "var(--tab-accent)" }} />
                </div>
                <div className="flex items-center justify-between">
                    <BarLabel>0</BarLabel>
                    <BarLabel align="center">X = {x.toLocaleString("en-IE")}</BarLabel>
                    <BarLabel align="right">Y = {y.toLocaleString("en-IE")}</BarLabel>
                </div>
            </div>
        )
    }

    if (mode === "add") {
        const basePct = result !== 0 ? (y / result) * 100 : 0
        return (
            <div className="flex flex-col gap-1">
                <div className="bg-muted flex h-5 w-full overflow-hidden rounded-full">
                    <BarSegment widthPct={basePct} className="bg-muted-foreground/30" />
                    <BarSegment widthPct={100 - basePct} style={{ background: "var(--tab-accent)" }} />
                </div>
                <div className="flex items-center justify-between">
                    <BarLabel>Original {y.toLocaleString("en-IE")}</BarLabel>
                    <BarLabel align="right">+{x}% added</BarLabel>
                </div>
            </div>
        )
    }

    if (mode === "subtract") {
        const keepPct = 100 - Math.max(0, Math.min(100, x))
        return (
            <div className="flex flex-col gap-1">
                <div className="bg-muted flex h-5 w-full overflow-hidden rounded-full">
                    <BarSegment widthPct={keepPct} style={{ background: "var(--tab-accent)" }} />
                    <BarSegment widthPct={100 - keepPct} className="bg-destructive/30" />
                </div>
                <div className="flex items-center justify-between">
                    <BarLabel>Kept {keepPct.toFixed(0)}%</BarLabel>
                    <BarLabel align="right">−{x}% removed</BarLabel>
                </div>
            </div>
        )
    }

    // "change": two comparative bars, both scaled to the larger of X/Y.
    const max = Math.max(x, y, 1)
    const changePct = x !== 0 ? ((y - x) / x) * 100 : 0
    const isUp = changePct >= 0
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-10 shrink-0 text-[11px]">From</span>
                <div className="bg-muted h-4 flex-1 overflow-hidden rounded-full">
                    <BarSegment widthPct={(x / max) * 100} className="bg-muted-foreground/40" />
                </div>
                <span className="w-14 shrink-0 text-right text-[11px] font-medium">{x.toLocaleString("en-IE")}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-10 shrink-0 text-[11px]">To</span>
                <div className="bg-muted h-4 flex-1 overflow-hidden rounded-full">
                    <BarSegment widthPct={(y / max) * 100} style={{ background: "var(--tab-accent)" }} />
                </div>
                <span className="w-14 shrink-0 text-right text-[11px] font-medium">{y.toLocaleString("en-IE")}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
                {isUp ? <TrendingUp className="size-3.5 text-green-600" /> : <TrendingDown className="size-3.5 text-red-600" />}
                <ArrowRight className="text-muted-foreground size-3" />
                <span className={cn("text-xs font-bold", isUp ? "text-green-600" : "text-red-600")}>
                    {isUp ? "+" : ""}{changePct.toFixed(1)}%
                </span>
            </div>
        </div>
    )
}

// Grams-per-unit — the shared base every field converts through.
const WEIGHT_UNITS = [
    { key: "g", label: "Gram (g)", perGram: 1 },
    { key: "kg", label: "Kilogram (kg)", perGram: 1000 },
    { key: "ozt", label: "Troy Ounce (oz t)", perGram: 31.1034768 },
    { key: "oz", label: "Ounce, avoirdupois (oz)", perGram: 28.349523125 },
    { key: "dwt", label: "Pennyweight (dwt)", perGram: 1.55517384 },
    { key: "gr", label: "Grain (gr)", perGram: 0.06479891 },
    { key: "tola", label: "Tola", perGram: 11.6638038 },
    { key: "tael", label: "Tael (HK)", perGram: 37.429018 },
] as const

type WeightUnitKey = (typeof WEIGHT_UNITS)[number]["key"]

function WeightConverter() {
    // Grams is the single source of truth — every field below is derived
    // from it, and typing into any field converts back into grams first.
    const [grams, setGrams] = React.useState(31.1034768) // defaults to 1 troy oz

    return (
        <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">
                Type a value into any unit — every other field updates to match.
            </p>

            <div className="flex flex-col gap-2">
                {WEIGHT_UNITS.map((unit) => (
                    <WeightField
                        key={unit.key}
                        label={unit.label}
                        value={grams / unit.perGram}
                        onChange={(value) => setGrams((Number.isFinite(value) ? value : 0) * unit.perGram)}
                    />
                ))}
            </div>
        </div>
    )
}

function WeightField({
    label,
    value,
    onChange,
}: {
    label: string
    value: number
    onChange: (value: number) => void
}) {
    return (
        <div className="flex flex-col gap-1">
            <Label className="text-xs">{label}</Label>
            <Input
                type="number"
                step="any"
                value={Number.isFinite(value) ? Number(value.toFixed(6)) : 0}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-8 text-sm"
            />
        </div>
    )
}

export type { WeightUnitKey }
