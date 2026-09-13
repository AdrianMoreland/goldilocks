import * as React from "react"
import { ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MetalType } from "@/lib/types"
import type { PortfolioProductTypeFilter, PriorityStrength, PortfolioStrategyResultDto } from "@goldilocks/shared-types"
import { usePricingTools } from "../../context/pricing-tools-context"
import { usePortfolioPL, usePortfolioScenario, usePortfolioBuilder } from "@/hooks/use-portfolio-tools.hook"
import { formatEuro, formatGrams, formatPercent } from "./formatters"
import { tabThemeStyle } from "./tab-theme"
import { SectionLabel, ResultHighlight, ErrorBanner, SubtabRow } from "./tab-widgets"

type PortfolioSubTab = "pl" | "scenario" | "builder"

const PORTFOLIO_SUBTABS: { value: PortfolioSubTab; label: string }[] = [
    { value: "pl", label: "P/L" },
    { value: "scenario", label: "Scenario" },
    { value: "builder", label: "Builder" },
]

export function PortfolioTab() {
    const { activeMetal } = usePricingTools()
    const [subTab, setSubTab] = React.useState<PortfolioSubTab>("pl")

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("invest")}>
            <SubtabRow options={PORTFOLIO_SUBTABS} value={subTab} onChange={setSubTab} />

            {subTab === "pl" && <ProfitLossPanel metal={activeMetal} />}
            {subTab === "scenario" && <ScenarioPanel />}
            {subTab === "builder" && <BuilderPanel metal={activeMetal} />}
        </div>
    )
}

function ProfitLossPanel({ metal }: { metal: MetalType }) {
    const pl = usePortfolioPL(metal)

    if (pl.bootstrapLoading) {
        return <div className="text-muted-foreground text-sm">Loading {metal.toLowerCase()} products…</div>
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label className="mb-1.5">Product</Label>
                <Select
                    value={pl.productId ? String(pl.productId) : undefined}
                    onValueChange={(value) => pl.selectProduct(Number(value))}
                >
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                        {pl.products.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <SectionLabel>AT PURCHASE</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Spot</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={pl.purchaseSpot ?? ""}
                        onChange={(e) => pl.setPurchaseSpot(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">{pl.purchMode === "premium" ? "Premium (%)" : "Purchase price (€)"}</Label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-5 cursor-pointer"
                            title="Switch between entering premium % or purchase price"
                            onClick={pl.togglePurchMode}
                        >
                            <ArrowLeftRight className="size-3" />
                        </Button>
                    </div>
                    {pl.purchMode === "premium" ? (
                        <Input
                            type="number"
                            step="0.01"
                            value={pl.purchasePremium}
                            onChange={(e) => pl.setPurchasePremium(Number(e.target.value))}
                        />
                    ) : (
                        <Input
                            type="number"
                            step="0.01"
                            value={pl.purchasePrice}
                            onChange={(e) => pl.setPurchasePrice(Number(e.target.value))}
                        />
                    )}
                </div>
            </div>

            <SectionLabel>TODAY</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Spot</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={pl.currentSpot ?? ""}
                        onChange={(e) => pl.setCurrentSpot(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Buyback (%)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={pl.currentDiscount}
                        onChange={(e) => pl.setCurrentDiscount(Number(e.target.value))}
                    />
                </div>
            </div>

            {pl.error && <ErrorBanner message={pl.error.message || "Unable to calculate profit."} />}

            <Separator />

            <SectionLabel>RESULTS</SectionLabel>

            <div
                className={
                    "rounded-2xl p-3.5 " +
                    ((pl.result?.profit ?? 0) >= 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")
                }
            >
                <div className="text-xs opacity-80">Profit if sold back today</div>
                <div className="text-lg font-bold">
                    {pl.result
                        ? `${pl.result.profit >= 0 ? "+" : "-"}${formatEuro(Math.abs(pl.result.profit))} (${pl.result.profitPercent >= 0 ? "+" : ""}${pl.result.profitPercent.toFixed(1)}%)`
                        : "—"}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs">Target profit (€)</Label>
                <Input
                    type="number"
                    step="1"
                    value={pl.targetProfit}
                    onChange={(e) => pl.setTargetProfit(Number(e.target.value))}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <span>Spot needed</span>
                <span className="font-medium">{formatEuro(pl.result?.requiredSpot)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span>Move required</span>
                <span className="font-medium">
                    {pl.moveRequired !== null ? `${pl.moveRequired >= 0 ? "+" : ""}${pl.moveRequired.toFixed(2)}% from current` : "—"}
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span>Target return</span>
                <span className="font-medium">{formatPercent(pl.result?.targetReturn)}</span>
            </div>
        </div>
    )
}

const SCENARIO_PRESETS = [-20, -10, 0, 10, 20]

function ScenarioPanel() {
    const sc = usePortfolioScenario()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label className="text-xs">Portfolio value</Label>
                <Input type="number" step="100" value={sc.value} onChange={(e) => sc.setValue(Number(e.target.value) || 0)} />
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-xs">Quick scenarios</Label>
                <div className="grid grid-cols-5 gap-2">
                    {SCENARIO_PRESETS.map((preset) => (
                        <Button
                            key={preset}
                            type="button"
                            variant={sc.pct === preset ? "default" : "outline"}
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => sc.setPct(preset)}
                        >
                            {preset > 0 ? `+${preset}%` : preset === 0 ? "Now" : `${preset}%`}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs">Custom % change</Label>
                <Input type="number" step="1" value={sc.pct} onChange={(e) => sc.setPct(Number(e.target.value) || 0)} />
            </div>

            <Separator />

            <ResultHighlight
                label={`Portfolio at ${sc.pct >= 0 ? "+" : ""}${sc.pct}% gold`}
                value={formatEuro(sc.newValue)}
            />

            <div className="flex items-center justify-between text-sm">
                <span>Change in value</span>
                <span className={"font-medium " + (sc.change >= 0 ? "text-green-600" : "text-red-600")}>
                    {sc.change >= 0 ? "+" : "-"}
                    {formatEuro(Math.abs(sc.change))}
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span>1% gold move ≈</span>
                <span className="font-medium">{formatEuro(sc.onePercent)}</span>
            </div>
        </div>
    )
}

const PRODUCT_TYPE_OPTIONS: { value: PortfolioProductTypeFilter; label: string }[] = [
    { value: "either", label: "Either" },
    { value: "bar", label: "Bars" },
    { value: "coin", label: "Coins" },
]

const PRIORITY_STRENGTH_OPTIONS: { value: PriorityStrength; label: string }[] = [
    { value: "none", label: "None" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
]

function BuilderPanel({ metal }: { metal: MetalType }) {
    const builder = usePortfolioBuilder(metal)

    if (builder.bootstrapLoading) {
        return <div className="text-muted-foreground text-sm">Loading {metal.toLowerCase()} products…</div>
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label className="text-xs">Budget (€)</Label>
                <Input
                    type="number"
                    step="100"
                    value={builder.budget}
                    onChange={(e) => builder.setBudget(Number(e.target.value) || 0)}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Product type</Label>
                <ToggleGroup
                    type="single"
                    variant="outline"
                    className="w-full"
                    value={builder.productType}
                    onValueChange={(value) => value && builder.setProductType(value as PortfolioProductTypeFilter)}
                >
                    {PRODUCT_TYPE_OPTIONS.map((opt) => (
                        <ToggleGroupItem key={opt.value} value={opt.value} className="flex-1 cursor-pointer">
                            {opt.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Priority product</Label>
                    <Select
                        value={builder.priorityProductId ? String(builder.priorityProductId) : "none"}
                        onValueChange={(value) => builder.setPriorityProductId(value === "none" ? null : Number(value))}
                    >
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {builder.products.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Priority strength</Label>
                    <Select
                        value={builder.priorityStrength}
                        onValueChange={(value) => builder.setPriorityStrength(value as PriorityStrength)}
                        disabled={!builder.priorityProductId}
                    >
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PRIORITY_STRENGTH_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button
                type="button"
                className="w-full cursor-pointer rounded-full border-0 text-white"
                style={{ background: "var(--tab-accent)" }}
                onClick={builder.build}
                disabled={builder.loading || builder.budget <= 0}
            >
                {builder.loading ? "Building…" : "Build portfolio options"}
            </Button>

            {builder.error && <ErrorBanner message={builder.error.message || "Unable to build a portfolio."} />}

            {builder.results && (
                <div className="flex flex-col gap-4">
                    <Separator />
                    {builder.results.map((result) => (
                        <StrategyCard key={result.strategy.id} result={result} />
                    ))}
                </div>
            )}
        </div>
    )
}

function StrategyCard({ result }: { result: PortfolioStrategyResultDto }) {
    const { strategy } = result

    return (
        <div className="rounded-2xl border p-3.5">
            <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{strategy.name}</span>
                <Badge
                    variant={strategy.id === "balanced" ? "default" : "secondary"}
                    className="text-[10px]"
                    style={strategy.id === "balanced" ? { background: "var(--tab-accent)", color: "white" } : undefined}
                >
                    {strategy.badge}
                </Badge>
            </div>
            <p className="text-muted-foreground mb-3 text-xs">{strategy.description}</p>

            <div className="grid grid-cols-3 gap-2 text-xs">
                <Stat label="Invested" value={formatEuro(result.totalInvested)} />
                <Stat label="Unspent" value={formatEuro(result.unspent)} />
                <Stat label="Weight" value={formatGrams(result.totalGrams)} />
                <Stat label="€/gram" value={formatEuro(result.averagePerGram)} />
                <Stat label="Avg premium" value={formatPercent(result.averagePremium)} />
                <Stat label="Pieces" value={String(result.pieces)} />
            </div>

            <div className="mt-3 flex items-center gap-2">
                <span className="text-muted-foreground w-24 shrink-0 text-xs">Flexibility</span>
                <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, result.flexibilityScore))}%`, background: "var(--tab-accent)" }}
                    />
                </div>
                <span className="text-xs font-medium">{result.flexibilityScore}</span>
            </div>

            <Separator className="my-3" />

            <div className="flex flex-col gap-2">
                {result.items.map((item) => (
                    <div key={item.product} className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                            <span className="font-medium">{item.quantity}×</span>
                            <span className="truncate">{item.product}</span>
                            {item.isPriority && (
                                <Badge variant="outline" className="h-4 px-1 text-[9px]">
                                    priority
                                </Badge>
                            )}
                        </div>
                        <div className="text-muted-foreground shrink-0 text-right">
                            <div>{formatEuro(item.totalValue)}</div>
                            <div>{formatGrams(item.totalWeight)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-muted rounded p-1.5">
            <div className="text-muted-foreground text-[10px]">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    )
}
