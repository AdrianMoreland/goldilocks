import type { ReactNode } from "react"
import { ArrowRight, Package } from "lucide-react"
import { usePricingTools } from "../../context/pricing-tools-context"
import { useMarketData } from "@/hooks/use-market-data.hook"
import { formatEuro, formatPercent, formatPrice, formatSpot } from "../../utils/formatters"
import { tabThemeStyle } from "./tab-theme"
import { SectionLabel } from "./tab-widgets"

function formatDate(value: string | undefined) {
    if (!value) return "—"
    return new Intl.DateTimeFormat("en-IE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export function ProductTab() {
    const { selectedProduct, activeMetal, openInTrade } = usePricingTools()
    const { products } = useMarketData()

    const metalProducts = products.filter((p) => p.metalType === activeMetal)
    const product = selectedProduct ?? metalProducts[0] ?? null

    if (!product) {
        return (
            <div className="text-muted-foreground px-4 text-sm">
                No {activeMetal.toLowerCase()} products available.
            </div>
        )
    }

    const pricePerGramSell = product.weight > 0 ? product.priceSell / product.weight : 0
    const pricePerGramBuy = product.weight > 0 ? product.priceBuy / product.weight : 0
    const marginEuro = product.priceSell - product.priceBuy
    const marginPercent = product.priceBuy !== 0 ? (marginEuro / product.priceBuy) * 100 : 0
    const vatAmount = product.priceSell - product.priceSellVatExcl

    // Where the raw market value sits between Buyback and Price — drives the
    // little spread bar below the hero prices.
    const spreadSpan = product.priceSell - product.priceBuy || 1
    const marketPct = Math.max(0, Math.min(100, ((product.marketValue - product.priceBuy) / spreadSpan) * 100))

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={tabThemeStyle("invest")}>
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-lg leading-tight font-bold">{product.name}</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">{product.sku} · {product.weight.toFixed(2)}g</div>
                </div>
                <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--tab-accent-text)] uppercase"
                    style={{ background: "var(--tab-accent-soft)" }}
                >
                    {product.metalType}
                </span>
            </div>

            {/* ── Hero: Price / Buyback — each in its own direction colour,
                matching the table's Price and Buyback columns. ──────────── */}
            <div className="grid grid-cols-2 gap-2.5">
                <HeroPrice
                    tone="price"
                    label="Price"
                    value={formatPrice(product.priceSell)}
                    note={`${formatPercent(product.spreadSell * 100)} premium`}
                />
                <HeroPrice
                    tone="buyback"
                    label="Buyback"
                    value={formatPrice(product.priceBuy)}
                    note={`${formatPercent(product.spreadBuy * 100)} discount`}
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
                    <span>Buyback {formatPrice(product.priceBuy)}</span>
                    <span>Market {formatPrice(product.marketValue)}</span>
                    <span>Price {formatPrice(product.priceSell)}</span>
                </div>
            </div>

            {/* ── Quick stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2.5">
                <StatChip label="Spot price" value={formatSpot(product.metalType, product.spotPrice)} />
                <StatChip label="Stock" value={String(product.stock)} icon={<Package className="size-3.5" />} />
            </div>

            {/* ── Margin & VAT ────────────────────────────────────────────── */}
            <div className="bg-card flex flex-col gap-2.5 rounded-2xl border p-3.5">
                <SectionLabel>MARGIN &amp; VAT</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <MiniStat label="€/gram (price)" value={formatEuro(pricePerGramSell)} />
                    <MiniStat label="€/gram (buyback)" value={formatEuro(pricePerGramBuy)} />
                    <MiniStat label="Spread (price − buyback)" value={formatPrice(marginEuro)} />
                    <MiniStat label="Spread %" value={formatPercent(marginPercent)} />
                    <MiniStat label="VAT rate" value={formatPercent(product.vatRate * 100)} />
                    <MiniStat label="VAT amount" value={formatPrice(vatAmount)} />
                </div>
            </div>

            {product.description && (
                <p className="text-muted-foreground bg-muted/40 rounded-xl px-3 py-2 text-xs italic">{product.description}</p>
            )}

            <div className="text-muted-foreground text-[11px]">Last updated {formatDate(product.updatedAt)}</div>

            <button
                type="button"
                onClick={() => openInTrade(product)}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold text-[var(--tab-accent-on)] transition-opacity hover:opacity-90"
                style={{ background: "var(--tab-accent)" }}
            >
                Open in Trade <ArrowRight className="size-4" />
            </button>
        </div>
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

function StatChip({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
    return (
        <div className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2.5">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className="flex items-center gap-1 text-sm font-semibold tabular-nums">
                {icon}
                {value}
            </span>
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
