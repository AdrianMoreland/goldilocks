import { GRAMS_PER_TROY_OUNCE } from "@goldilocks/shared-types"
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatEuro, formatPercent } from "../../utils/formatters"
import { PercentageCalculator } from "./percentage-calculator"
import { tabThemeStyle } from "./tab-theme"
import { ResultHighlight, SectionLabel, SubtabRow } from "./tab-widgets"
import { NumberInput } from "@/components/number-input"

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

// Grams-per-unit — the shared base every field converts through. Bullion
// trade only ever uses these three; "oz" here is the troy ounce (31.1035g),
// the unit the whole app already uses everywhere else (product weights,
// spot prices), not the 28.35g avoirdupois ounce.
const WEIGHT_UNITS = [
    { key: "g", label: "Gram (g)", perGram: 1 },
    { key: "oz", label: "Ounce (oz t)", perGram: GRAMS_PER_TROY_OUNCE },
    { key: "kg", label: "Kilogram (kg)", perGram: 1000 },
] as const

type WeightUnitKey = (typeof WEIGHT_UNITS)[number]["key"]

function WeightConverter() {
    // Grams is the single source of truth — every field below is derived
    // from it, and typing into any field converts back into grams first.
    const [grams, setGrams] = React.useState(GRAMS_PER_TROY_OUNCE) // defaults to 1 troy oz

    return (
        <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">
                Type a value into any unit - every other field updates to match.
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
            <NumberInput step="any" value={value} onValueChange={onChange} className="h-8 text-sm" />
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
                Capital Gains Tax on a bullion sale - standard rate 33%, with the annual €1,270 personal exemption.
            </p>

            <div className="grid grid-cols-2 gap-3">
                <TaxNumberField label="Sale proceeds (€)" value={proceeds} onChange={setProceeds} step="0.01" />
                <TaxNumberField label="Cost basis (€)" value={costBasis} onChange={setCostBasis} step="0.01" />
                <TaxNumberField label="Allowable expenses (€)" value={expenses} onChange={setExpenses} step="0.01" />
                <TaxNumberField label="Exemption remaining (€)" value={exemption} onChange={setExemption} step="1" />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs">CGT rate (%)</Label>
                <NumberInput step="0.1" value={rate} onValueChange={setRate} />
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
                Quick VAT-inclusive / VAT-exclusive converter - gold is VAT-exempt as investment metal, silver/
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
            <NumberInput step={step} value={value} onValueChange={onChange} />
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
