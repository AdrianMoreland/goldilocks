import { toast } from "sonner"
import { useMarketDataApi } from "@/api/market-data.api"
import { ArrowLeftRight, Flame, Table2, X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TRADE_FIRST_QTY_ID, usePricingTools } from "../../context/pricing-tools-context"
import { useSpotPrices } from "../../context/spot-prices-context"
import { MELT_CATEGORY_OPTIONS, useTradeTools } from "@/hooks/use-trade-tools.hook"
import { formatEuro, formatGrams, formatMetalName, formatPrice } from "../../utils/formatters"
import { describeApiError } from "../../utils/describe-error"
import { CustomerMessageButton } from "./customer-message-button"
import { copyRowsToClipboard } from "../table/copy-rows-button"
import { buildDisplayProducts } from "../table/product-grouping"
import { ToolSpotEditor } from "./tool-spot-editor"
import { tabThemeStyle } from "./tab-theme"
import { FieldLabel, SectionLabel, ErrorBanner, ResultHighlight } from "./tab-widgets"
import { cn } from "@/lib/utils"

export function TradeTab() {
    const { activeMetal, selectedProductIds, deselectProductId, pendingTradeProductId, clearPendingTradeProduct } = usePricingTools()
    const trade = useTradeTools(activeMetal, selectedProductIds, pendingTradeProductId, clearPendingTradeProduct)

    const showMeltButton = trade.transactionType === "selling"
    const showingMelt = trade.subTab === "melt" && showMeltButton
    // Re-themes by trade direction, using the same colours as the table's
    // columns: teal Price when the customer is buying from us, gold Buyback
    // when they're selling to us (the melt calculator stays inside whichever
    // direction's color is active; only its own toggle pill goes dark/active).
    const isPrice = trade.transactionType === "buying"
    const theme = isPrice ? "price" : "buyback"
    const loadError = trade.bootstrapError ? describeApiError(trade.bootstrapError, `load ${activeMetal.toLowerCase()} trade data`) : null

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle(theme)}>
            {/* ── Mode row: single Price/Buyback toggle pill and the Melt switch ─── */}
            <div className="flex items-center gap-2">
                <Tooltip><TooltipTrigger asChild><button
                    type="button"
                    aria-pressed={!isPrice}
                    aria-label={isPrice ? "Quoting Price — switch to Buyback" : "Quoting Buyback — switch to Price"}
                    title={isPrice ? "Switch to Buyback" : "Switch to Price"}
                    onClick={() => trade.setTransactionType(isPrice ? "selling" : "buying")}
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-full px-3.5 py-2.5 text-[var(--tab-accent-on)] transition-colors"
                    style={{ background: "var(--tab-accent)" }}
                >
                    <span className="text-base leading-tight font-extrabold">{isPrice ? "Price" : "Buyback"}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold opacity-85">
                        <ArrowLeftRight className="size-3" aria-hidden />
                        {isPrice ? "Buyback" : "Price"}
                    </span>
                </button></TooltipTrigger><TooltipContent side="bottom">Price = what the customer pays us. Buyback = what we pay the customer. Press P to flip.</TooltipContent></Tooltip>

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

            </div>

            {showingMelt ? (
                <MeltPanel trade={trade} />
            ) : trade.bootstrapLoading ? (
                <div className="text-muted-foreground text-sm">Loading {activeMetal.toLowerCase()} trade data…</div>
            ) : trade.bootstrapError || !trade.bootstrap ? (
                <ErrorBanner
                    message={loadError?.message ?? `Unable to load trade data for ${activeMetal.toLowerCase()}.`}
                    next={loadError?.next ?? "Press refresh in the top bar, then try again."}
                />
            ) : (
                <TradePanel trade={trade} deselectProductId={deselectProductId} />
            )}
        </div>
    )
}

type TradeTools = ReturnType<typeof useTradeTools>

function TradePanel({ trade, deselectProductId }: { trade: TradeTools; deselectProductId: (id: number) => void }) {
    const { activeMetal, tableCopySource, selectedProductIds } = usePricingTools()
    const { recalculate } = useMarketDataApi()
    const { displayPrices } = useSpotPrices()
    const percentLabel = trade.transactionType === "buying" ? "Premium %" : "Discount %"
    const cartError = trade.cartError ? describeApiError(trade.cartError, "calculate this order") : null
    const totalLabel = trade.transactionType === "buying" ? "Total price to customer" : "Total buyback to customer"

    return (
        <div className="flex flex-col gap-4">
            {/* ── Spot price card ─────────────────────────────────────────── */}
            <div className="bg-card rounded-3xl border p-3.5">
                <ToolSpotEditor tool="trade" metal={activeMetal} id="trade-spot" />
            </div>

            {/* ── Items — one card per line: product / qty / %. ──────────── */}
            <div className="flex flex-col gap-2">
                <FieldLabel>Items</FieldLabel>

                {trade.items.length > 0 && (
                    <div className="text-muted-foreground flex items-center gap-1.5 pr-1.5 pl-6 text-[11px] font-semibold">
                        <span className="flex-1">Product</span>
                        <span className="w-11 text-center">Qty</span>
                        <span className="w-14 text-center">{trade.transactionType === "buying" ? "Prem %" : "Disc %"}</span>
                        <span className="w-7" />
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    {trade.items.map((item, index) => (
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
                                id={index === 0 ? TRADE_FIRST_QTY_ID : undefined}
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => trade.updateItemQuantity(item.id, Number(e.target.value))}
                                className="bg-background h-8 w-11 shrink-0 rounded-lg border-0 px-1 text-center text-xs shadow-none"
                                title="Quantity"
                                aria-label={`Quantity of ${item.product?.name ?? "item"}`}
                            />
                            <Input
                                type="number"
                                step="0.01"
                                value={item.percent}
                                onChange={(e) => trade.updateItemPercent(item.id, Number(e.target.value))}
                                className="bg-background h-8 w-14 shrink-0 rounded-lg border-0 px-1 text-center text-xs shadow-none"
                                title={percentLabel}
                                aria-label={`${percentLabel} for ${item.product?.name ?? "item"}`}
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

            {cartError && <ErrorBanner message={cartError.message} next={cartError.next} />}

            {/* ── Results ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>

                {trade.cartResult?.lines.map((line, index) => (
                    <div key={`${line.productId}-${index}`} className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">{line.quantity} × {line.product}</div>
                            <div className="text-muted-foreground text-xs tabular-nums">
                                {formatGrams(line.weight)} · {line.percent.toFixed(2)}%
                            </div>
                        </div>
                        <div className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</div>
                    </div>
                ))}

                <div className="flex items-center justify-between text-sm">
                    <span>Total weight</span>
                    <span className="font-medium tabular-nums">{formatGrams(trade.cartResult?.totalWeight)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Avg €/g</span>
                    <span className="font-medium tabular-nums">{formatEuro(trade.cartResult?.averagePerGram)}</span>
                </div>

                <ResultHighlight label={totalLabel} value={formatPrice(trade.cartResult?.totalPrice)} />

                <Tooltip>
                    <TooltipTrigger asChild>
                        {/* A span carries the tooltip because a disabled button swallows hover events. */}
                        <span className="flex">
                            <button
                                type="button"
                                disabled={selectedProductIds.length === 0}
                                onClick={() => {
                                    const source = tableCopySource.current
                                    if (!source) return
                                    // The copy prices from the Trade tool spot. When it still follows the card, the table's own rows are already right.
                                    if (!trade.spotDetached || trade.spot === null) {
                                        void copyRowsToClipboard(source.selectedProducts, source.visibleColumnIds)
                                        return
                                    }
                                    const overrides = { ...displayPrices, [activeMetal]: trade.spot }
                                    void recalculate(overrides)
                                        .then((priced) => {
                                            const byId = new Map(buildDisplayProducts(priced).map((p) => [p.id, p]))
                                            const rows = source.selectedProducts.map((row) => byId.get(row.id) ?? row)
                                            return copyRowsToClipboard(rows, source.visibleColumnIds)
                                        })
                                        .catch(() => toast.error("Couldn't price the copy at your spot"))
                                }}
                                className="border-border bg-card hover:bg-muted flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Table2 className="size-4" /> Easy Copy
                            </button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        {selectedProductIds.length === 0
                            ? "Tick rows in the product table first, then copy them as a table to paste into Excel, email or chat"
                            : "Copy the ticked rows as a table, in the columns the product table shows"}
                    </TooltipContent>
                </Tooltip>

                <CustomerMessageButton cart={trade.cartResult} transactionType={trade.transactionType} fetchOtherSide={trade.quoteOppositeSide} />
            </div>
        </div>
    )
}

function MeltPanel({ trade }: { trade: TradeTools }) {
    const meltMetal = trade.meltMetal
    const meltError = trade.meltError ? describeApiError(trade.meltError, "calculate the melt value") : null

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

            <div className="bg-card rounded-3xl border p-3.5">
                <ToolSpotEditor tool="melt" metal={meltMetal} id="melt-spot" label={`${formatMetalName(meltMetal)} spot price`} />
            </div>

            {meltError && <ErrorBanner message={meltError.message} next={meltError.next} />}

            <div className="flex flex-col gap-2">
                <SectionLabel>RESULTS</SectionLabel>
                <div className="flex items-center justify-between text-sm">
                    <span>Spot per gram</span>
                    <span className="font-medium tabular-nums">{formatEuro(trade.meltResult?.spotPerGram)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Market value</span>
                    <span className="font-medium tabular-nums">{formatEuro(trade.meltResult && trade.meltResult.spotPerGram * trade.meltResult.weight)}</span>
                </div>

                <ResultHighlight label="Estimated payout" value={formatPrice(trade.meltResult?.meltValue)} />
            </div>
        </div>
    )
}
