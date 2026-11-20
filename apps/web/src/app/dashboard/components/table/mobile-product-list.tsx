import * as React from "react"
import type { Table as TanstackTable } from "@tanstack/react-table"
import { Check, ChevronDown, Copy, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import { cn } from "@/lib/utils"
import { formatGrams, formatPercent, formatPrice } from "../../utils/formatters"
import type { DisplayProduct } from "./product-grouping"

type Side = "price" | "buyback"

const GROUP_LABELS = { bar: "Bars", coin: "Coins", bonded: "Bonded" } as const

interface MobileProductListProps {
    table: TanstackTable<DisplayProduct>
    isLoading?: boolean
    hasError?: boolean
    isFiltered?: boolean
    onResetFilters?: () => void
    onRetry?: () => void
    /** The metal on screen is held at a typed price: the list gets the same warm border as the table. */
    held?: boolean
}

/**
 * The product table on a phone. A wide table there pans in every direction, so each row shows only the product and
 * one price (Price or Buyback, from the switch above the list); tapping a row opens the rest under it. It reads the
 * same rows as the table, so search, filters, sorting, groups and the ticked rows (the quote) are shared.
 */
export function MobileProductList({ table, isLoading, hasError, isFiltered, onResetFilters, onRetry, held }: MobileProductListProps) {
    const [side, setSide] = useUserPreference<Side>("phone-price-side", "price")
    const [openId, setOpenId] = React.useState<string | null>(null)
    const rows = table.getRowModel().rows

    return (
        <div data-product-list className={cn("flex flex-col", held && "border-status-warn rounded-lg border-2")}>
            {/* Pinned while the page scrolls, so the choice of price is always in view. Pixel heights: the group headings pin
                right under it (top 56px) and the theme's spacing unit is compact. */}
            <div role="group" aria-label="Which price to show" className="bg-background sticky top-0 z-20 grid h-[56px] grid-cols-2 items-center gap-1">
                <SideButton active={side === "price"} tone="price" onClick={() => setSide("price")}>Price</SideButton>
                <SideButton active={side === "buyback"} tone="buyback" onClick={() => setSide("buyback")}>Buyback</SideButton>
            </div>

            {rows.length === 0 ? (
                <EmptyList isLoading={isLoading} hasError={hasError} isFiltered={isFiltered} onResetFilters={onResetFilters} onRetry={onRetry} />
            ) : (
                <ul className="divide-border flex flex-col divide-y">
                    {rows.map((row, i) => {
                        const p = row.original
                        const group = p.productType
                        // A group heading starts each run of bars, coins or bonded (rows arrive grouped).
                        const header = i === 0 || rows[i - 1].original.productType !== group ? group : null
                        const open = openId === row.id
                        const selected = row.getIsSelected()
                        return (
                            <React.Fragment key={row.id}>
                                {header && (
                                    <li className="bg-background text-muted-foreground sticky top-[56px] z-10 flex justify-between px-1 pt-3 pb-1.5 text-xs font-semibold tracking-wide uppercase">
                                        <span>{GROUP_LABELS[header]}</span>
                                        <span className="tabular-nums">{rows.filter((r) => r.original.productType === header).length}</span>
                                    </li>
                                )}
                                <li className={cn(open && "bg-card rounded-lg")}>
                                    <button
                                        type="button"
                                        aria-expanded={open}
                                        onClick={() => setOpenId(open ? null : row.id)}
                                        className="flex min-h-[56px] w-full cursor-pointer items-center gap-3 px-1 py-2 text-left"
                                    >
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-base font-semibold">{p.name}</span>
                                            <span className="text-muted-foreground block text-xs tabular-nums">
                                                {formatGrams(p.weight)}
                                                {selected && " · in quote"}
                                            </span>
                                        </span>
                                        <span
                                            className={cn(
                                                "text-lg font-bold tabular-nums",
                                                side === "price" ? "text-price-text" : "text-buyback-text",
                                            )}
                                        >
                                            {formatPrice(side === "price" ? p.priceSell : p.priceBuy)}
                                        </span>
                                        <ChevronDown aria-hidden className={cn("text-muted-foreground size-[18px] shrink-0 transition-transform", open && "rotate-180")} />
                                    </button>
                                    {open && (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-1 pb-3 text-sm">
                                            <Detail label="Price" value={formatPrice(p.priceSell)} tone="price" />
                                            <Detail label="Buyback" value={formatPrice(p.priceBuy)} tone="buyback" />
                                            <Detail label="Premium" value={formatPercent(p.spreadSell * 100)} tone="price" />
                                            <Detail label="Discount" value={formatPercent(p.spreadBuy * 100)} tone="buyback" />
                                            {p.vatRate > 0 && <Detail label="Price ex. VAT" value={formatPrice(p.priceSellVatExcl)} />}
                                            <Detail label="Market value" value={formatPrice(p.marketValue)} />
                                            <div className="col-span-2 mt-2 grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    aria-pressed={selected}
                                                    className="h-[44px] cursor-pointer gap-1.5"
                                                    onClick={() => row.toggleSelected(!selected)}
                                                >
                                                    {selected ? <Check className="size-4" /> : <Plus className="size-4" />}
                                                    {selected ? "In quote" : "Add to quote"}
                                                </Button>
                                                <Button type="button" variant="outline" className="h-[44px] cursor-pointer gap-1.5" onClick={() => copyPrice(p, side)}>
                                                    <Copy className="size-4" />
                                                    Copy {side === "price" ? "Price" : "Buyback"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            </React.Fragment>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

function SideButton({ active, tone, onClick, children }: { active: boolean; tone: "price" | "buyback"; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                "h-[40px] cursor-pointer rounded-lg text-sm font-bold transition-colors",
                !active && "bg-muted text-muted-foreground",
                active && tone === "price" && "bg-price text-black",
                active && tone === "buyback" && "bg-buyback text-black",
            )}
        >
            {children}
        </button>
    )
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: "price" | "buyback" }) {
    return (
        <div className="flex items-baseline justify-between gap-2">
            <span className="text-muted-foreground">{label}</span>
            <span
                className={cn(
                    "font-semibold tabular-nums",
                    tone === "price" && "text-price-text",
                    tone === "buyback" && "text-buyback-text",
                )}
            >
                {value}
            </span>
        </div>
    )
}

async function copyPrice(p: DisplayProduct, side: Side) {
    const label = side === "price" ? "Price" : "Buyback"
    const text = `${p.name}: ${label} ${formatPrice(side === "price" ? p.priceSell : p.priceBuy)}`
    try {
        await navigator.clipboard.writeText(text)
        toast.success(`Copied ${text}`)
    } catch {
        toast.error("Couldn't copy - your browser blocked clipboard access")
    }
}

function EmptyList({ isLoading, hasError, isFiltered, onResetFilters, onRetry }: Omit<MobileProductListProps, "table" | "held">) {
    if (isLoading) {
        return (
            <div aria-hidden className="flex flex-col gap-3 py-3">
                {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        )
    }
    if (hasError) {
        return (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
                <b className="text-foreground">Could not load the products</b>
                <span>The price service did not answer. Prices on screen may be out of date.</span>
                {onRetry && <Button variant="outline" className="h-[44px] cursor-pointer" onClick={onRetry}>Try again</Button>}
            </div>
        )
    }
    if (isFiltered) {
        return (
            <p className="text-muted-foreground py-8 text-center text-sm">
                No products match these filters.{" "}
                {onResetFilters && (
                    <Button variant="link" className="h-auto cursor-pointer p-0" onClick={onResetFilters}>
                        Clear filters
                    </Button>
                )}
            </p>
        )
    }
    return <p className="text-muted-foreground py-8 text-center text-sm">No products for this metal yet.</p>
}
