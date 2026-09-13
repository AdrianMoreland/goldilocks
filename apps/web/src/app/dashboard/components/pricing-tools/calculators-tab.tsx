import * as React from "react"
import {
    ArrowLeftRight, ArrowRight, ChevronDown, CircleX, Divide, Percent as PercentIcon,
    TrendingDown, TrendingUp, type LucideIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatEuro, formatPercent } from "./formatters"
import { tabThemeStyle } from "./tab-theme"
import { ResultHighlight, SectionLabel, SubtabRow } from "./tab-widgets"
import { cn } from "@/lib/utils"

type CalcSubTab = "percentage" | "weight" | "cgt" | "vat"

const CALC_SUBTABS: { value: CalcSubTab; label: string }[] = [
    { value: "percentage", label: "Percentage" },
    { value: "weight", label: "Weight" },
    { value: "vat", label: "VAT" },
    { value: "cgt", label: "CGT" },
]

/**
 * Calculators tab — percentage calculator, bullion weight unit converter,
 * and the CGT/VAT tax reference calculators (moved in from the old Tax tab,
 * which only ever held these two plus CAT — since CAT was dropped entirely,
 * a whole separate tab for the remaining two no longer earned its keep).
 * The original Apps Script tool's exact version of this panel wasn't
 * available to port from directly (no source file for it in this repo, and
 * it wasn't shared here), so this is a best-effort rebuild covering the
 * same tools with the units/modes a bullion desk actually uses day-to-day.
 */
export function CalculatorsTab() {
    const [subTab, setSubTab] = React.useState<CalcSubTab>("percentage")

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("calc")}>
            <SubtabRow options={CALC_SUBTABS} value={subTab} onChange={setSubTab} />

            {subTab === "percentage" && <PercentageCalculator />}
            {subTab === "weight" && <WeightConverter />}
            {subTab === "cgt" && <CgtPanel />}
            {subTab === "vat" && <VatPanel />}
        </div>
    )
}

type PercentMode = "of" | "isWhatPercent" | "add" | "subtract" | "change"

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
// always shows a real, already-computed example — never a blank "0" result
// that gives a first-time (or non-technical) user nothing to anchor on.
const PERCENT_MODES: ModeInfo[] = [
    { value: "of", label: "% of a value", description: "Calculate a percentage of a value", icon: PercentIcon, xLabel: "Percent", yLabel: "Value", xIsPercent: true, yIsPercent: false, defaultX: 20, defaultY: 250 },
    { value: "isWhatPercent", label: "What % is X of Y", description: "Find what percent one value is of another", icon: Divide, xLabel: "Value", yLabel: "Out of", xIsPercent: false, yIsPercent: false, defaultX: 50, defaultY: 250 },
    { value: "add", label: "Increase by %", description: "Increase a value by a percentage", icon: TrendingUp, xLabel: "Increase by", yLabel: "Starting value", xIsPercent: true, yIsPercent: false, defaultX: 15, defaultY: 200 },
    { value: "subtract", label: "Decrease by %", description: "Decrease a value by a percentage", icon: TrendingDown, xLabel: "Decrease by", yLabel: "Starting value", xIsPercent: true, yIsPercent: false, defaultX: 10, defaultY: 200 },
    { value: "change", label: "% change", description: "Calculate the percentage change between two values", icon: ArrowLeftRight, xLabel: "Before", yLabel: "After", xIsPercent: false, yIsPercent: false, defaultX: 200, defaultY: 230 },
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

/**
 * Percentage calculator — UX modeled on a dedicated percentage-calculator
 * app the user specifically asked to mirror: a collapsed mode selector that
 * expands into a picklist (rather than a wall of always-visible mode
 * buttons), plain-language pill inputs with a clear button, and a distinct
 * centered result card, all reskinned in this tab's own accent instead of
 * that app's colors.
 */
function PercentageCalculator() {
    const [mode, setMode] = React.useState<PercentMode>("of")
    const [pickerOpen, setPickerOpen] = React.useState(false)
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
        setPickerOpen(false)
    }

    const result = calcResult(mode, x, y)
    const resultText = `${result.value.toLocaleString("en-IE", { maximumFractionDigits: 2 })}${result.suffix}`

    // Only "% change" carries a direction (gain vs loss) — every other mode
    // is a neutral lookup/calculation and stays in the tab's own accent.
    const resultTone: "up" | "down" | "neutral" = mode !== "change" ? "neutral" : result.value >= 0 ? "up" : "down"

    return (
        <div className="flex flex-col gap-3">
            <ModePickerRow info={info} open={pickerOpen} onToggle={() => setPickerOpen((o) => !o)} />

            {pickerOpen ? (
                <div className="divide-border flex flex-col divide-y overflow-hidden rounded-2xl border">
                    {PERCENT_MODES.map((m) => (
                        <ModeListItem key={m.value} info={m} active={m.value === mode} onClick={() => handleModeChange(m.value)} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="bg-card flex flex-col gap-3 rounded-2xl border p-3.5">
                        <PillField label={info.xLabel} value={x} onChange={setX} suffix={info.xIsPercent ? "%" : undefined} />
                        <PillField label={info.yLabel} value={y} onChange={setY} suffix={info.yIsPercent ? "%" : undefined} />
                    </div>

                    <PercentResultCard tone={resultTone} value={resultText} />

                    <div className="bg-card flex flex-col gap-2 rounded-2xl border p-3.5">
                        <SectionLabel>VISUAL</SectionLabel>
                        <PercentVisual mode={mode} x={x} y={y} result={result.value} />
                    </div>
                </>
            )}
        </div>
    )
}

/** Collapsed mode selector — tap to expand the full mode list below it. */
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
            <ChevronDown className={cn("text-muted-foreground size-4 shrink-0 transition-transform", open && "rotate-180")} />
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
            className={cn("flex cursor-pointer items-center gap-3 p-3 text-left transition-colors", active ? "bg-muted/70" : "bg-card hover:bg-muted/40")}
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
    return (
        <div className="flex items-center gap-3">
            <Label className="text-muted-foreground w-28 shrink-0 text-sm font-normal">{label}</Label>
            <div className="bg-muted flex min-w-0 flex-1 items-center gap-1.5 rounded-xl px-3 py-2">
                <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value) || 0)}
                    className="w-full min-w-0 bg-transparent text-right text-base font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                    type="button"
                    onClick={() => onChange(0)}
                    className="text-muted-foreground/60 hover:text-foreground shrink-0 cursor-pointer"
                    aria-label={`Clear ${label}`}
                >
                    <CircleX className="size-4" />
                </button>
            </div>
            {suffix && <span className="text-muted-foreground w-4 shrink-0 text-sm font-medium">{suffix}</span>}
        </div>
    )
}

/** Centered result card — neutral (tab accent) for a plain lookup, green/red for % change's gain/loss. */
function PercentResultCard({ tone, value }: { tone: "up" | "down" | "neutral"; value: string }) {
    if (tone === "neutral") {
        return (
            <div className="flex flex-col items-center gap-1 rounded-2xl p-4" style={{ background: "var(--tab-accent-soft)" }}>
                <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: "var(--tab-accent-text-soft)" }}>Result</span>
                <span className="text-2xl font-extrabold" style={{ color: "var(--tab-accent-text)" }}>{value}</span>
            </div>
        )
    }

    const up = tone === "up"
    return (
        <div className={cn("flex flex-col items-center gap-1 rounded-2xl p-4", up ? "bg-emerald-600/10" : "bg-destructive/10")}>
            <span className={cn("text-[11px] font-bold tracking-wide uppercase", up ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>Result</span>
            <span className={cn("text-2xl font-extrabold", up ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>{value}</span>
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

// Grams-per-unit — the shared base every field converts through. Bullion
// trade only ever uses these three; "oz" here is the troy ounce (31.1035g),
// the unit the whole app already uses everywhere else (product weights,
// spot prices), not the 28.35g avoirdupois ounce.
const WEIGHT_UNITS = [
    { key: "g", label: "Gram (g)", perGram: 1 },
    { key: "oz", label: "Ounce (oz t)", perGram: 31.1034768 },
    { key: "kg", label: "Kilogram (kg)", perGram: 1000 },
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

/**
 * CGT reference calculator — moved in from the old Tax tab. Ireland's
 * standard CGT rate/exemption are the defaults; every figure here is an
 * editable input since they move with each Budget. Treat this as a quick
 * reference, not a filed-return calculation.
 */
function CgtPanel() {
    const [proceeds, setProceeds] = React.useState(0)
    const [costBasis, setCostBasis] = React.useState(0)
    const [expenses, setExpenses] = React.useState(0)
    const [exemption, setExemption] = React.useState(1270)
    const [rate, setRate] = React.useState(33)

    const gain = proceeds - costBasis - expenses
    const taxableGain = Math.max(0, gain - exemption)
    const taxDue = taxableGain * (rate / 100)
    const netProceeds = proceeds - taxDue

    return (
        <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">
                Capital Gains Tax on a bullion sale — standard rate 33%, with the annual €1,270 personal exemption.
            </p>

            <div className="grid grid-cols-2 gap-3">
                <TaxNumberField label="Sale proceeds (€)" value={proceeds} onChange={setProceeds} step="0.01" />
                <TaxNumberField label="Cost basis (€)" value={costBasis} onChange={setCostBasis} step="0.01" />
                <TaxNumberField label="Allowable expenses (€)" value={expenses} onChange={setExpenses} step="0.01" />
                <TaxNumberField label="Exemption remaining (€)" value={exemption} onChange={setExemption} step="1" />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs">CGT rate (%)</Label>
                <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
            </div>

            <Separator />
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <TaxResultRow label="Gain before exemption" value={formatEuro(gain)} />
                <TaxResultRow label="Taxable gain" value={formatEuro(taxableGain)} />
                <ResultHighlight label="CGT due" value={formatEuro(taxDue)} />
                <TaxResultRow label="Net proceeds after CGT" value={formatEuro(netProceeds)} />
            </div>
        </div>
    )
}

/** VAT-inclusive / VAT-exclusive converter — moved in from the old Tax tab. */
function VatPanel() {
    const [amount, setAmount] = React.useState(0)
    const [rate, setRate] = React.useState(23)
    const [mode, setMode] = React.useState<"incl" | "excl">("excl")

    const excl = mode === "excl" ? amount : amount / (1 + rate / 100)
    const incl = mode === "incl" ? amount : amount * (1 + rate / 100)
    const vatAmount = incl - excl

    return (
        <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">
                Quick VAT-inclusive / VAT-exclusive converter — gold is VAT-exempt as investment metal, silver/
                platinum/palladium are standard-rated (23%).
            </p>

            <SubtabRow
                options={[
                    { value: "excl" as const, label: "Enter VAT-excl." },
                    { value: "incl" as const, label: "Enter VAT-incl." },
                ]}
                value={mode}
                onChange={setMode}
            />

            <div className="grid grid-cols-2 gap-3">
                <TaxNumberField label="Amount (€)" value={amount} onChange={setAmount} step="0.01" />
                <TaxNumberField label="VAT rate (%)" value={rate} onChange={setRate} step="0.5" />
            </div>

            <Separator />
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <TaxResultRow label="VAT-exclusive" value={formatEuro(excl)} />
                <TaxResultRow label="VAT amount" value={formatEuro(vatAmount)} />
                <ResultHighlight label="VAT-inclusive" value={formatEuro(incl)} />
                <TaxResultRow label="Effective rate" value={formatPercent(rate)} />
            </div>
        </div>
    )
}

function TaxNumberField({
    label,
    value,
    onChange,
    step,
}: {
    label: string
    value: number
    onChange: (value: number) => void
    step: string
}) {
    return (
        <div className="flex flex-col gap-1">
            <Label className="text-xs">{label}</Label>
            <Input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} />
        </div>
    )
}

function TaxResultRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export type { WeightUnitKey }
