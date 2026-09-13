import { Flame, Snowflake, X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePricingTools } from "../../context/pricing-tools-context"
import { MELT_CATEGORY_OPTIONS, useTradeTools } from "@/hooks/use-trade-tools.hook"
import { formatEuro, formatGrams } from "./formatters"
import { tabThemeStyle } from "./tab-theme"
import { FieldLabel, SectionLabel, ErrorBanner, ResultHighlight } from "./tab-widgets"
import { cn } from "@/lib/utils"

export function TradeTab() {
    const { activeMetal, selectedProductIds, deselectProductId, pendingTradeProductId, clearPendingTradeProduct } = usePricingTools()
    const trade = useTradeTools(activeMetal, selectedProductIds, pendingTradeProductId, clearPendingTradeProduct)

    const showMeltButton = trade.transactionType === "selling"
    const showingMelt = trade.subTab === "melt" && showMeltButton
    // Re-themes green/pink by trade direction — mirrors the Apps Script
    // tool's per-section accents (the melt calculator stays inside whichever
    // direction's color is active; only its own toggle pill goes dark/active).
    const theme = trade.transactionType === "buying" ? "buy" : "sell"

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle(theme)}>
            {/* ── Mode row: single Buy/Sell toggle pill, Melt switch, Freeze ─── */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-pressed={trade.transactionType === "selling"}
                    onClick={() => trade.setTransactionType(trade.transactionType === "buying" ? "selling" : "buying")}
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-full px-3.5 py-2.5 text-white transition-colors"
                    style={{ background: "var(--tab-accent)" }}
                >
                    <span className="text-[15px] leading-tight font-extrabold">
                        {trade.transactionType === "buying" ? "Buy" : "Sell"}
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold opacity-85">
                        {trade.transactionType === "buying" ? "Sell" : "Buy"}
                    </span>
                </button>

                {showMeltButton && (
                    <button
                        type="button"
                        title="Melt / scrap calculator"
                        aria-label="Melt / scrap calculator"
                        aria-pressed={trade.subTab === "melt"}
                        onClick={() => trade.setSubTab(trade.subTab === "melt" ? "products" : "melt")}
                        className={cn(
                            "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-bold transition-colors",
                            trade.subTab === "melt"
                                ? "border-foreground bg-foreground text-background"
                                : "border-border bg-card text-foreground",
                        )}
                    >
                        <Flame className="size-4" /> Melt
                    </button>
                )}

                <button
                    type="button"
                    title="Freeze spot price (won't follow live updates)"
                    aria-label="Freeze spot price"
                    aria-pressed={trade.freeze}
                    onClick={trade.toggleFreeze}
                    className={cn(
                        "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
                        trade.freeze
                            ? "border-[var(--tab-accent)] text-[var(--tab-accent-text)]"
                            : "border-border bg-card text-muted-foreground",
                    )}
                    style={trade.freeze ? { background: "var(--tab-accent-soft)" } : undefined}
                >
                    <Snowflake className="size-4.5" />
                </button>
            </div>

            {showingMelt ? (
                <MeltPanel trade={trade} />
            ) : trade.bootstrapLoading ? (
                <div className="text-muted-foreground text-sm">Loading {activeMetal.toLowerCase()} trade data…</div>
            ) : trade.bootstrapError || !trade.bootstrap ? (
                <div className="text-destructive text-sm">
                    Unable to load trade data for {activeMetal.toLowerCase()}.
                </div>
            ) : (
                <TradePanel trade={trade} deselectProductId={deselectProductId} />
            )}
        </div>
    )
}

type TradeTools = ReturnType<typeof useTradeTools>

function TradePanel({ trade, deselectProductId }: { trade: TradeTools; deselectProductId: (id: number) => void }) {
    const percentLabel = trade.transactionType === "buying" ? "Premium %" : "Discount %"

    return (
        <div className="flex flex-col gap-4">
            {/* ── Spot price card ─────────────────────────────────────────── */}
            <div className="bg-card flex flex-col gap-2.5 rounded-3xl border p-3.5">
                <FieldLabel>Spot price</FieldLabel>
                <div className="flex items-center gap-2">
                    <Input
                        id="trade-spot"
                        type="number"
                        step="0.01"
                        value={trade.spot !== null ? Math.floor(trade.spot * 100) / 100 : ""}
                        onChange={(e) => trade.setSpot(parseFloat(e.target.value) || 0)}
                        className="h-10 w-28 shrink-0 rounded-xl"
                    />
                    <Slider
                        value={trade.spot ?? trade.minSpot}
                        min={trade.minSpot}
                        max={trade.maxSpot}
                        step={0.01}
                        onValueChange={trade.setSpot}
                        className="flex-1 accent-[var(--tab-accent)]"
                        aria-label="Adjust spot price"
                    />
                    <button
                        type="button"
                        onClick={() => void trade.resetSpot()}
                        className="border-border bg-background hover:bg-muted shrink-0 cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* ── Items — one card per line: product / qty / %. ──────────── */}
            <div className="flex flex-col gap-2">
                <FieldLabel>Items</FieldLabel>

                <div className="flex flex-col gap-1.5">
                    {trade.items.map((item) => (
                        <div key={item.id} className="bg-muted/40 flex items-center gap-1.5 rounded-2xl p-1.5 pl-2.5">
                            <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ background: "var(--tab-accent)" }}
                                aria-hidden
                            />
                            <Select
                                value={item.productId ? String(item.productId) : undefined}
                                onValueChange={(value) => trade.updateItemProduct(item.id, Number(value))}
                            >
                                <SelectTrigger className="bg-background h-8 min-w-0 flex-1 cursor-pointer rounded-lg border-0 text-xs shadow-none" title={item.product?.name}>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {trade.products.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => trade.updateItemQuantity(item.id, Number(e.target.value))}
                                className="bg-background h-8 w-11 shrink-0 rounded-lg border-0 px-1 text-center text-xs shadow-none"
                                title="Quantity"
                            />
                            <Input
                                type="number"
                                step="0.01"
                                value={item.percent}
                                onChange={(e) => trade.updateItemPercent(item.id, Number(e.target.value))}
                                className="bg-background h-8 w-14 shrink-0 rounded-lg border-0 px-1 text-center text-xs shadow-none"
                                title={percentLabel}
                            />
                            <button
                                type="button"
                                aria-label="Remove item"
                                onClick={() => {
                                    trade.removeItem(item.id)
                                    // Keep the product table's checkbox in sync — otherwise
                                    // re-checking/unchecking that row would be the only way
                                    // to bring the item back, which is backwards from here.
                                    if (item.productId !== null) deselectProductId(item.productId)
                                }}
                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={trade.addItem}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed py-2.5 text-sm font-bold text-[var(--tab-accent-text)]"
                    style={{ borderColor: "var(--tab-accent)" }}
                >
                    <Plus className="size-4" /> Add item
                </button>
            </div>

            {trade.cartError && <ErrorBanner message={trade.cartError.message || "Unable to calculate order."} />}

            {/* ── Results ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>

                {trade.cartResult?.lines.map((line, index) => (
                    <div key={`${line.productId}-${index}`} className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">{line.quantity} × {line.product}</div>
                            <div className="text-muted-foreground text-xs">
                                {formatGrams(line.weight)} · {line.percent.toFixed(2)}%
                            </div>
                        </div>
                        <div className="font-semibold">{formatEuro(line.lineTotal)}</div>
                    </div>
                ))}

                <div className="flex items-center justify-between text-sm">
                    <span>Total weight</span>
                    <span className="font-medium">{formatGrams(trade.cartResult?.totalWeight)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Avg €/g</span>
                    <span className="font-medium">{formatEuro(trade.cartResult?.averagePerGram)}</span>
                </div>

                <ResultHighlight
                    label={trade.transactionType === "buying" ? "Total price to customer" : "Total offer to customer"}
                    value={formatEuro(trade.cartResult?.totalPrice)}
                />
            </div>
        </div>
    )
}

function MeltPanel({ trade }: { trade: TradeTools }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-card flex flex-col gap-2.5 rounded-3xl border p-3.5">
                <FieldLabel>Weight (g)</FieldLabel>
                <Input
                    id="melt-weight"
                    type="number"
                    step="0.1"
                    value={trade.meltWeight}
                    onChange={(e) => trade.setMeltWeight(Number(e.target.value))}
                    className="h-10 rounded-xl"
                />

                <FieldLabel>Category</FieldLabel>
                <Select value={trade.meltCategory} onValueChange={(v) => trade.setMeltCategory(v as typeof trade.meltCategory)}>
                    <SelectTrigger id="melt-category" className="h-10 w-full cursor-pointer rounded-xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MELT_CATEGORY_OPTIONS.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {trade.meltError && <ErrorBanner message={trade.meltError.message || "Unable to calculate melt value."} />}

            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <div className="flex items-center justify-between text-sm">
                    <span>Spot per gram</span>
                    <span className="font-medium">{formatEuro(trade.meltResult?.spotPerGram)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Market value</span>
                    <span className="font-medium">{formatEuro(trade.meltResult && trade.meltResult.spotPerGram * trade.meltResult.weight)}</span>
                </div>

                <ResultHighlight label="Estimated payout" value={formatEuro(trade.meltResult?.meltValue)} />
            </div>
        </div>
    )
}
