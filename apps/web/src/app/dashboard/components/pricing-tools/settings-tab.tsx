import { Fragment } from "react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePricingSettings, type MetalGroup, type GroupAdjustment, type MarketMode } from "../../context/pricing-settings-context"
import { tabThemeStyle } from "./tab-theme"
import { SectionLabel } from "./tab-widgets"

const MODE_INFO: { key: MarketMode; label: string; description: string }[] = [
    { key: "weekend", label: "Weekend", description: "Wider spread for closed markets" },
    { key: "volatile", label: "Volatile", description: "Tight adjustment for fast-moving prices" },
    { key: "shortage", label: "Metal Shortage", description: "Sell more / buy closer to spot" },
]

const GROUPS: MetalGroup[] = ["GOLD", "SILVER", "PGM"]

// Which GroupAdjustment fields each mode's Buy/Sell inputs read/write, plus
// the labels for that pair — shortage's are worded differently (a reduction/
// increase rather than a flat spread) since that's what the field means.
const MODE_FIELDS: Record<MarketMode, { buyKey: keyof GroupAdjustment; sellKey: keyof GroupAdjustment; buyLabel: string; sellLabel: string }> = {
    weekend: { buyKey: "wkdBuy", sellKey: "wkdSell", buyLabel: "Buy", sellLabel: "Sell" },
    volatile: { buyKey: "volBuy", sellKey: "volSell", buyLabel: "Buy", sellLabel: "Sell" },
    shortage: { buyKey: "shortageBuyReduction", sellKey: "shortageSellIncrease", buyLabel: "Buy discount reduction", sellLabel: "Sell premium increase" },
}

/**
 * Settings tab — ported from the pricing workbook's SETTINGS sheet ("Merrion
 * Gold — Pricing Control Centre"). Toggling a mode here adjusts the Trade
 * tab's default premium/discount by the configured percentage for the
 * product's metal group (GOLD / SILVER / PGM = platinum+palladium) — modes
 * stack additively, same as the sheet.
 */
export function SettingsTab() {
    const { modes, toggleMode, adjustments, updateAdjustment, resetAdjustments, activeStatusLabel } = usePricingSettings()

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("settings")}>
            <div>
                <SectionLabel>ACTIVE STATUS</SectionLabel>
                <Badge
                    variant={activeStatusLabel === "STANDARD" ? "secondary" : "default"}
                    className="mt-1.5"
                    style={activeStatusLabel !== "STANDARD" ? { background: "var(--tab-accent)", color: "white" } : undefined}
                >
                    ◆ {activeStatusLabel}
                </Badge>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
                <SectionLabel>ACTIVE MODES</SectionLabel>
                {MODE_INFO.map((mode) => (
                    <div
                        key={mode.key}
                        className="flex items-center justify-between gap-2 rounded-2xl border p-3"
                        style={modes[mode.key] ? { background: "var(--tab-accent-soft)", borderColor: "var(--tab-accent)" } : undefined}
                    >
                        <div>
                            <div className="font-medium">{mode.label}</div>
                            <div className="text-muted-foreground text-xs">{mode.description}</div>
                        </div>
                        <Switch
                            checked={modes[mode.key]}
                            onCheckedChange={() => toggleMode(mode.key)}
                            className="cursor-pointer data-[state=checked]:bg-[var(--tab-accent)]"
                            aria-label={`Toggle ${mode.label} mode`}
                        />
                    </div>
                ))}
                <p className="text-muted-foreground text-xs">
                    Modes stack — e.g. Weekend + Metal Shortage applies both adjustments together.
                </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <SectionLabel>ADJUSTMENT PARAMETERS</SectionLabel>
                    <Button type="button" variant="ghost" size="sm" className="h-6 cursor-pointer px-2 text-xs" onClick={resetAdjustments}>
                        Reset to defaults
                    </Button>
                </div>

                {MODE_INFO.map((mode) => {
                    const fields = MODE_FIELDS[mode.key]
                    return (
                        <div key={mode.key} className="flex flex-col gap-2.5 rounded-2xl border p-3.5">
                            <div className="font-medium">{mode.label}</div>

                            {/* One row per metal, Buy/Sell as shared column headers above all three rows. */}
                            <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] items-center gap-x-2 gap-y-2">
                                <div />
                                <div className="text-muted-foreground text-center text-[11px] font-semibold">{fields.buyLabel}</div>
                                <div className="text-muted-foreground text-center text-[11px] font-semibold">{fields.sellLabel}</div>

                                {GROUPS.map((group) => (
                                    <Fragment key={group}>
                                        <div className="text-sm font-medium">{group}</div>
                                        <PercentField
                                            value={adjustments[group][fields.buyKey]}
                                            onChange={(v) => updateAdjustment(group, fields.buyKey, v)}
                                        />
                                        <PercentField
                                            value={adjustments[group][fields.sellKey]}
                                            onChange={(v) => updateAdjustment(group, fields.sellKey, v)}
                                        />
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function PercentField({
    label,
    value,
    onChange,
}: {
    label?: string
    value: number
    onChange: (value: number) => void
}) {
    return (
        <div className="flex flex-col gap-1">
            {label && <span className="text-muted-foreground text-xs">{label}</span>}
            <div className="relative">
                <Input
                    type="number"
                    step="0.01"
                    value={Number((value * 100).toFixed(3))}
                    onChange={(e) => onChange((Number(e.target.value) || 0) / 100)}
                    className="h-8 pr-6 text-sm"
                />
                <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs">%</span>
            </div>
        </div>
    )
}

// Re-exported so callers of updateAdjustment get field-name autocomplete without importing the context module directly.
export type { GroupAdjustment }
