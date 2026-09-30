import { useState, type ReactNode } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { usePricingTools } from "../../context/pricing-tools-context"
import { useMarketData } from "@/hooks/use-market-data.hook"
import { findDefaultProduct } from "@/lib/default-product"
import { formatEuro, formatPercent, formatPrice } from "../../utils/formatters"
import { tabThemeStyle } from "./tab-theme"

function formatDate(value: string | undefined) {
    if (!value) return "—"
    return new Intl.DateTimeFormat("en-IE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

/**
 * Product lookup: pick a product from the dropdown (or click its row in the
 * table), read Price and Buyback at a glance, and open the rest only when
 * needed. The margin/VAT working and the product's notes sit behind
 * collapsibles so a quick "how much is this?" isn't buried under numbers
 * nobody asked for.
 */
export function ProductTab() {
    const { selectedProduct, activeMetal, openInTrade, openWithProduct } = usePricingTools()
    const { products } = useMarketData()

    const metalProducts = products.filter((p) => p.metalType === activeMetal)
    const product = selectedProduct?.metalType === activeMetal ? selectedProduct : findDefaultProduct(activeMetal, metalProducts)

    if (!product) {
        return (
            <div className="text-muted-foreground px-4 text-sm">
                No {activeMetal.toLowerCase()} products available.
            </div>
        )
    }

    // The table's copy of the product is the one re-priced on every spot
    // change; the selected one is a snapshot from when it was clicked.
    const live = products.find((p) => p.id === product.id) ?? product

    const pricePerGramSell = live.weight > 0 ? live.priceSell / live.weight : 0
    const pricePerGramBuy = live.weight > 0 ? live.priceBuy / live.weight : 0
    const marginEuro = live.priceSell - live.priceBuy
    const marginPercent = live.priceBuy !== 0 ? (marginEuro / live.priceBuy) * 100 : 0
    const vatAmount = live.priceSell - live.priceSellVatExcl

    // Where the raw market value sits between Buyback and Price — drives the
    // little spread bar below the hero prices.
    const spreadSpan = live.priceSell - live.priceBuy || 1
    const marketPct = Math.max(0, Math.min(100, ((live.marketValue - live.priceBuy) / spreadSpan) * 100))

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("invest")}>
            {/* ── Product picker ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
                <Select
                    value={String(live.id)}
                    onValueChange={(value) => {
                        const next = metalProducts.find((p) => p.id === Number(value))
                        if (next) openWithProduct(next)
                    }}
                >
                    <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl text-sm font-bold" aria-label="Choose a product">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {metalProducts.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs tabular-nums">
                    <span>{live.sku}</span>
                    <span aria-hidden>·</span>
                    <span>{live.weight.toFixed(2)} g</span>
                    <span aria-hidden>·</span>
                    <span>{live.stock} in stock</span>
                </div>
            </div>

            {/* ── Hero: Price / Buyback — each in its own direction colour,
                matching the table's Price and Buyback columns. ──────────── */}
            <div className="grid grid-cols-2 gap-2.5">
                <HeroPrice
                    tone="price"
                    label="Price"
                    value={formatPrice(live.priceSell)}
                    note={`${formatPercent(live.spreadSell * 100)} premium`}
                />
                <HeroPrice
                    tone="buyback"
                    label="Buyback"
                    value={formatPrice(live.priceBuy)}
                    note={`${formatPercent(live.spreadBuy * 100)} discount`}
                />
            </div>

            {/* ── Spread: where the raw market value sits between Buyback and Price ── */}
            <div className="flex flex-col gap-1.5">
                <div className="bg-muted relative h-1.5 w-full rounded-full">
                    <div
                        className="bg-foreground absolute top-1/2 size-2.5 rounded-full ring-2 ring-[var(--background)]"
                        style={{ left: `${marketPct}%`, transform: "translate(-50%, -50%)" }}
                        title="Market value"
                    />
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-[11px] tabular-nums">
                    <span>Buyback</span>
                    <span>Market {formatPrice(live.marketValue)}</span>
                    <span>Price</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => openInTrade(live)}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold text-[var(--tab-accent-on)] transition-opacity hover:opacity-90"
                style={{ background: "var(--tab-accent)" }}
            >
                Open in Trade <ArrowRight className="size-4" />
            </button>

            {/* ── Detail, on demand ───────────────────────────────────────── */}
            <div className="flex flex-col divide-y rounded-2xl border">
                <Disclosure title="Margin & VAT" summary={`Spread ${formatPercent(marginPercent)}`}>
                    <div className="grid grid-cols-2 gap-3">
                        <MiniStat label="Spread %" value={formatPercent(marginPercent)} />
                        <MiniStat label="Spread (price − buyback)" value={formatPrice(marginEuro)} />
                        <MiniStat label="€/gram (price)" value={formatEuro(pricePerGramSell)} />
                        <MiniStat label="€/gram (buyback)" value={formatEuro(pricePerGramBuy)} />
                        <MiniStat label="VAT rate" value={formatPercent(live.vatRate * 100)} />
                        <MiniStat label="VAT amount" value={formatPrice(vatAmount)} />
                    </div>
                </Disclosure>

                <Disclosure title="About this product" summary={`Updated ${formatDate(live.updatedAt)}`}>
                    {live.description ? (
                        <p className="text-muted-foreground text-xs">{live.description}</p>
                    ) : (
                        <p className="text-muted-foreground text-xs">No description on file.</p>
                    )}
                    <div className="text-muted-foreground mt-2 text-[11px]">Last updated {formatDate(live.updatedAt)}</div>
                </Disclosure>
            </div>
        </div>
    )
}

function Disclosure({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
    const [open, setOpen] = useState(false)

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-2 px-3.5 py-3 text-left">
                <span className="text-[13px] font-bold">{title}</span>
                <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] tabular-nums">
                    {!open && summary}
                    <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3.5 pb-3.5">{children}</CollapsibleContent>
        </Collapsible>
    )
}

function HeroPrice({ tone, label, value, note }: { tone: "price" | "buyback"; label: string; value: string; note: string }) {
    return (
        <div
            className="flex flex-col gap-1 rounded-2xl border p-3.5"
            style={{ ...tabThemeStyle(tone), background: "var(--tab-accent-soft)" }}
        >
            <span className="text-xs font-semibold text-[var(--tab-accent-text-soft)]">{label}</span>
            <div className="text-xl font-extrabold tabular-nums text-[var(--tab-accent-text)]">{value}</div>
            <span className="text-muted-foreground text-[11px] tabular-nums">{note}</span>
        </div>
    )
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-muted-foreground text-[11px]">{label}</div>
            <div className="text-sm font-medium tabular-nums">{value}</div>
        </div>
    )
}
