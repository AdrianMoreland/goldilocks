import type { ReactNode } from "react"
import { ArrowRight, Package, TrendingDown, TrendingUp } from "lucide-react"
import { usePricingTools } from "../../context/pricing-tools-context"
import { useMarketData } from "@/hooks/use-market-data.hook"
import { formatEuro, formatPercent } from "./formatters"
import { metalThemeStyle } from "./tab-theme"

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

    // Where Buy/Sell sit relative to the raw market value — drives the
    // little spread bar below the hero prices.
    const spreadSpan = product.priceSell - product.priceBuy || 1
    const marketPct = Math.max(0, Math.min(100, ((product.marketValue - product.priceBuy) / spreadSpan) * 100))

    return (
        <div className="flex flex-col gap-4 px-4 text-sm" style={metalThemeStyle(product.metalType)}>
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

            {/* ── Hero: Sell / Buy prices ─────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1 rounded-2xl border p-3.5" style={{ background: "var(--tab-accent-soft)" }}>
                    <div className="flex items-center gap-1.5 text-[var(--tab-accent-text-soft)]">
                        <TrendingUp className="size-3.5" />
                        <span className="text-xs font-semibold">Sell price</span>
                    </div>
                    <div className="text-xl font-extrabold text-[var(--tab-accent-text)]">{formatEuro(product.priceSell)}</div>
                    <span className="text-muted-foreground text-[11px]">{formatPercent(product.spreadSell * 100)} premium</span>
                </div>
                <div className="bg-card flex flex-col gap-1 rounded-2xl border p-3.5">
                    <div className="text-muted-foreground flex items-center gap-1.5">
                        <TrendingDown className="size-3.5" />
                        <span className="text-xs font-semibold">Buy price</span>
                    </div>
                    <div className="text-xl font-extrabold">{formatEuro(product.priceBuy)}</div>
                    <span className="text-muted-foreground text-[11px]">{formatPercent(product.spreadBuy * 100)} discount</span>
                </div>
            </div>

            {/* ── Spread visual: where the raw market value sits between Buy/Sell ── */}
            <div className="flex flex-col gap-1.5">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-muted via-[var(--tab-accent-soft)] to-[var(--tab-accent)]">
                    <div
                        className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-background shadow"
                        style={{ left: `${marketPct}%`, background: "var(--tab-accent)", transform: "translate(-50%, -50%)" }}
                        title="Raw market value"
                    />
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-[11px]">
                    <span>Buy {formatEuro(product.priceBuy)}</span>
                    <span>Market {formatEuro(product.marketValue)}</span>
                    <span>Sell {formatEuro(product.priceSell)}</span>
                </div>
            </div>

            {/* ── Quick stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2.5">
                <StatChip label="Spot price" value={formatEuro(product.spotPrice)} />
                <StatChip label="Stock" value={String(product.stock)} icon={<Package className="size-3.5" />} />
            </div>

            {/* ── Margin & VAT ────────────────────────────────────────────── */}
            <div className="bg-card flex flex-col gap-2.5 rounded-2xl border p-3.5">
                <div className="text-[11px] font-bold tracking-wide text-[var(--tab-accent-text-soft)]">MARGIN &amp; VAT</div>
                <div className="grid grid-cols-2 gap-3">
                    <MiniStat label="€/gram (sell)" value={formatEuro(pricePerGramSell)} />
                    <MiniStat label="€/gram (buy)" value={formatEuro(pricePerGramBuy)} />
                    <MiniStat label="Spread (sell − buy)" value={formatEuro(marginEuro)} />
                    <MiniStat label="Spread %" value={formatPercent(marginPercent)} />
                    <MiniStat label="VAT rate" value={formatPercent(product.vatRate * 100)} />
                    <MiniStat label="VAT amount" value={formatEuro(vatAmount)} />
                </div>
            </div>

            {product.description && (
                <p className="text-muted-foreground bg-muted/40 rounded-xl px-3 py-2 text-xs italic">{product.description}</p>
            )}

            <div className="text-muted-foreground text-[11px]">Last updated {formatDate(product.updatedAt)}</div>

            <button
                type="button"
                onClick={() => openInTrade(product)}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--tab-accent)" }}
            >
                Open in Trade <ArrowRight className="size-4" />
            </button>
        </div>
    )
}

function StatChip({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
    return (
        <div className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2.5">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className="flex items-center gap-1 text-sm font-semibold">
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
            <div className="text-sm font-medium">{value}</div>
        </div>
    )
}
