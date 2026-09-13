import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatEuro, formatPercent } from "./formatters"
import { tabThemeStyle } from "./tab-theme"
import { SectionLabel, ResultHighlight, SubtabRow } from "./tab-widgets"

type TaxSubTab = "cgt" | "cat" | "vat"

const TAX_SUBTABS: { value: TaxSubTab; label: string }[] = [
    { value: "cgt", label: "CGT" },
    { value: "cat", label: "CAT" },
    { value: "vat", label: "VAT" },
]

/**
 * Tax tab — CGT / CAT / VAT reference calculators for Irish bullion sales.
 *
 * The original Apps Script tool's exact Tax panel wasn't available to port
 * from directly, so this uses Ireland's standard CGT/CAT rates and
 * thresholds as defaults — every rate/threshold here is an editable input,
 * since these figures move with each Budget. Treat this as a quick
 * reference, not a filed-return calculation (CAT in particular has
 * aggregation/relief rules beyond what a single field can capture).
 */
export function TaxTab() {
    const [subTab, setSubTab] = React.useState<TaxSubTab>("cgt")

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("tax")}>
            <SubtabRow options={TAX_SUBTABS} value={subTab} onChange={setSubTab} />

            {subTab === "cgt" && <CgtPanel />}
            {subTab === "cat" && <CatPanel />}
            {subTab === "vat" && <VatPanel />}
        </div>
    )
}

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
                <NumberField label="Sale proceeds (€)" value={proceeds} onChange={setProceeds} step="0.01" />
                <NumberField label="Cost basis (€)" value={costBasis} onChange={setCostBasis} step="0.01" />
                <NumberField label="Allowable expenses (€)" value={expenses} onChange={setExpenses} step="0.01" />
                <NumberField label="Exemption remaining (€)" value={exemption} onChange={setExemption} step="1" />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs">CGT rate (%)</Label>
                <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
            </div>

            <Separator />
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <ResultRow label="Gain before exemption" value={formatEuro(gain)} />
                <ResultRow label="Taxable gain" value={formatEuro(taxableGain)} />
                <ResultHighlight label="CGT due" value={formatEuro(taxDue)} />
                <ResultRow label="Net proceeds after CGT" value={formatEuro(netProceeds)} />
            </div>
        </div>
    )
}

const CAT_GROUPS = {
    A: { label: "Group A — child from parent", threshold: 400000 },
    B: { label: "Group B — sibling / relative", threshold: 40000 },
    C: { label: "Group C — other", threshold: 20000 },
} as const

type CatGroupKey = keyof typeof CAT_GROUPS

function CatPanel() {
    const [group, setGroup] = React.useState<CatGroupKey>("A")
    const [value, setValue] = React.useState(0)
    const [priorBenefits, setPriorBenefits] = React.useState(0)
    const [threshold, setThreshold] = React.useState<number>(CAT_GROUPS.A.threshold)
    const [rate, setRate] = React.useState(33)

    const handleGroupChange = (key: CatGroupKey) => {
        setGroup(key)
        setThreshold(CAT_GROUPS[key].threshold)
    }

    const taxableValue = Math.max(0, value + priorBenefits - threshold)
    const taxDue = taxableValue * (rate / 100)

    return (
        <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">
                Capital Acquisitions Tax on a gifted or inherited bullion holding — group thresholds are lifetime
                aggregates, not per-gift, so include prior benefits received from within the same group.
            </p>

            <div>
                <Label className="mb-1.5 text-xs">Relationship group</Label>
                <Select value={group} onValueChange={(v) => handleGroupChange(v as CatGroupKey)}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {(Object.keys(CAT_GROUPS) as CatGroupKey[]).map((key) => (
                            <SelectItem key={key} value={key}>
                                {CAT_GROUPS[key].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <NumberField label="Value of gift/inheritance (€)" value={value} onChange={setValue} step="0.01" />
                <NumberField label="Prior benefits, same group (€)" value={priorBenefits} onChange={setPriorBenefits} step="0.01" />
                <NumberField label="Group threshold (€)" value={threshold} onChange={setThreshold} step="1" />
                <NumberField label="CAT rate (%)" value={rate} onChange={setRate} step="0.1" />
            </div>

            <Separator />
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <ResultRow label="Taxable value" value={formatEuro(taxableValue)} />
                <ResultHighlight label="CAT due" value={formatEuro(taxDue)} />
            </div>
        </div>
    )
}

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
                <NumberField label="Amount (€)" value={amount} onChange={setAmount} step="0.01" />
                <NumberField label="VAT rate (%)" value={rate} onChange={setRate} step="0.5" />
            </div>

            <Separator />
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <ResultRow label="VAT-exclusive" value={formatEuro(excl)} />
                <ResultRow label="VAT amount" value={formatEuro(vatAmount)} />
                <ResultHighlight label="VAT-inclusive" value={formatEuro(incl)} />
                <ResultRow label="Effective rate" value={formatPercent(rate)} />
            </div>
        </div>
    )
}

function NumberField({
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

function ResultRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}
