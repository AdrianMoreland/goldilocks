"use client"

import * as React from "react"
import {
    type ColumnDef, type Row, flexRender,
} from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import {TableCellViewer} from "@/app/dashboard/components/table-cell-viewer.tsx";
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import { EditProductDialog } from "./edit-product-dialog"
import { DataTableColumnHeader } from "./data-table-column-header"
import type { DisplayProduct, ProductGroup } from "./product-grouping"
import { formatEuro, formatPercent } from "../../utils/formatters"

/** `isFocused` reflects arrow-key row navigation (see use-row-navigation.hook.ts) — a keyboard-only affordance, distinct from `getIsSelected()`'s checkbox state. */
export function ProductRow({ row, isFocused }: { row: Row<DisplayProduct>; isFocused?: boolean }) {
    const rowRef = React.useRef<HTMLTableRowElement>(null)

    React.useEffect(() => {
        if (isFocused) rowRef.current?.scrollIntoView({ block: "nearest" })
    }, [isFocused])

    return (
        <TableRow
            ref={rowRef}
            data-state={row.getIsSelected() && "selected"}
            className={isFocused ? "outline outline-2 -outline-offset-2 outline-primary" : undefined}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

/**
 * The sell pair (MG Price + Premium) and buy pair (Buyback + Discount) are
 * colored by mixing the *actual* theme tokens — primary and secondary —
 * with the current foreground via color-mix(), rather than a fixed color
 * that would drift out of sync whenever the active theme changes. Both stay
 * close to the pure token (barely diluted) so they read as essentially the
 * same primary/secondary used elsewhere in the theme — the small foreground
 * mix is only there so each stays legible if a future theme's primary/
 * secondary were ever too dark for the background.
 */
const PRICE_TONE_COLOR = {
    sell: "color-mix(in srgb, var(--primary) 95%, var(--foreground) 5%)",
    buy: "color-mix(in srgb, var(--secondary) 90%, var(--foreground) 10%)",
} as const

function PriceCell({
    value,
    className,
    tone,
}: {
    value: number
    className?: string
    tone?: keyof typeof PRICE_TONE_COLOR
}) {
    return (
        <div className="w-16">
            <div
                className={`text-sm font-semibold tabular-nums ${className ?? ""}`}
                style={tone ? { color: PRICE_TONE_COLOR[tone] } : undefined}
            >
                {formatEuro(value)}
            </div>
        </div>
    )
}

function NameCell({ item }: { item: DisplayProduct }) {
    return (
        <div className="flex w-full justify-start">
            <TableCellViewer item={item} />
        </div>
    )
}

/**
 * Premium (sell-side markup) and Discount (buy-side markdown) badges — no
 * icon (a prior version showed a spinning Loader on every non-7% value,
 * which read as "still loading" for a perfectly static number). Each tone
 * mirrors the color of its matching price column so the sell pair (MG Price
 * + Premium) and buy pair (Buyback + Discount) are visually grouped by
 * transaction direction at a glance.
 *
 * `value` here is a raw fraction (spreadSell/spreadBuy, e.g. 0.34) —
 * formatPercent expects an already-scaled percentage, so it's multiplied by
 * 100 at this one call site rather than inside the shared formatter.
 */
function SpreadBadge({ value, tone }: { value: number; tone: "sell" | "buy" }) {
    const color = PRICE_TONE_COLOR[tone]

    return (
        <Badge
            variant="outline"
            className="px-2 py-0 text-xs font-semibold tabular-nums"
            style={{
                color,
                borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
            }}
        >
            {formatPercent(value * 100)}
        </Badge>
    )
}

/**
 * Per-row "…" menu — only rendered for admins (see CLAUDE.md §6: this is a
 * discoverability convenience, not the security boundary — the server-side
 * RolesGuard is). Everyone else gets no menu at all, not just a disabled
 * one, so pricing edits aren't discoverable by non-admins.
 */
function RowActionsMenu({ product }: { product: DisplayProduct }) {
    const { isAdmin } = useAuth()
    const api = useProductsApi()
    const queryClient = useQueryClient()
    const [editOpen, setEditOpen] = React.useState(false)

    if (!isAdmin) return null

    const toggleActive = async () => {
        try {
            await api.updateProduct(product.id, { isActive: !product.isActive })
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            toast.success(`${product.name} marked ${product.isActive ? "inactive" : "active"}`)
        } catch {
            // useApi already shows an error toast on failure
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-7 cursor-pointer"
                        size="icon"
                    >
                        <EllipsisVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit pricing</DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleActive}>
                        {product.isActive ? "Mark inactive" : "Mark active"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditProductDialog product={product} open={editOpen} onOpenChange={setEditOpen} />
        </>
    )
}

/**
 * Human labels for the "Customize Columns" toggle list — column ids are
 * camelCase accessor keys (e.g. "marketValue"), and CSS `capitalize` only
 * capitalizes the first letter of a run with no spaces, so rendering the raw
 * id gave "Marketvalue" instead of "Market Price". Keyed by column id.
 */
export const productColumnLabels: Record<string, string> = {
    name: "Product",
    spreadBuy: "Discount",
    priceBuy: "Buyback",
    marketValue: "Market Price",
    priceSell: "MG Price",
    priceSellVatExcl: "VAT Excl.",
    spreadSell: "Premium",
    metalType: "Metal",
    weight: "Weight",
}

/** Filter-only dimension for the "Type" faceted filter — bar vs coin vs bonded. */
export const PRODUCT_TYPE_OPTIONS: { label: string; value: ProductGroup }[] = [
    { label: "Bar", value: "bar" },
    { label: "Coin", value: "coin" },
    { label: "Bonded", value: "bonded" },
]

export type PriceBucket = "budget" | "mid" | "high" | "premium"

/** Filter-only dimension for the "Price" faceted filter — bucketed off MG Price (priceSell), the column shoppers actually pay. */
export const PRICE_BUCKET_OPTIONS: { label: string; value: PriceBucket }[] = [
    { label: "Under €500", value: "budget" },
    { label: "€500 – €2,000", value: "mid" },
    { label: "€2,000 – €10,000", value: "high" },
    { label: "Over €10,000", value: "premium" },
]

export function getPriceBucket(priceSell: number): PriceBucket {
    if (priceSell < 500) return "budget"
    if (priceSell < 2000) return "mid"
    if (priceSell < 10000) return "high"
    return "premium"
}

export const productColumns: ColumnDef<DisplayProduct>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
        cell: ({ row }) => <NameCell item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "marketValue",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Market Price" />,
        cell: ({ row }) => <PriceCell value={row.original.marketValue} className="text-muted-foreground" />,
    },
    {
        accessorKey: "priceSell",
        header: ({ column }) => <DataTableColumnHeader column={column} title="MG Price" />,
        cell: ({ row }) => <PriceCell value={row.original.priceSell} tone="sell" />,
    },
    {
        accessorKey: "spreadSell",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Premium" />,
        cell: ({ row }) => (
            <div className="w-24">
                <SpreadBadge value={row.original.spreadSell} tone="sell" />
            </div>
        ),
    },
    {
        accessorKey: "priceBuy",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Buyback" />,
        cell: ({ row }) => <PriceCell value={row.original.priceBuy} tone="buy" />,
    },
    {
        accessorKey: "spreadBuy",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Discount" />,
        cell: ({ row }) => <SpreadBadge value={row.original.spreadBuy} tone="buy" />,
    },
    {
        id: "priceSellVatExcl",
        accessorKey: "priceSellVatExcl",
        header: ({ column }) => <DataTableColumnHeader column={column} title="VAT Excl." />,
        cell: ({ row }) => <PriceCell value={row.original.priceSellVatExcl} className="text-muted-foreground" />,
    },
    {
        accessorKey: "weight",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Weight" />,
        cell: ({ row }) => (
            <div className="w-16 text-sm font-medium text-foreground">{row.original.weight.toFixed(2)}g</div>
        ),
    },
    { accessorKey: "metalType", header: "Metal", cell: ({ row }) => row.original.metalType },
    {
        // Filter-only — never rendered as a visible column (see initial
        // columnVisibility in use-product-table.ts) and excluded from the
        // "Customize Columns" list via enableHiding:false, so it exists
        // purely to give the "Type" faceted filter a real Column to attach
        // getFilterValue/getFacetedUniqueValues to.
        id: "productType",
        accessorFn: (row) => row.productType,
        header: "Type",
        enableHiding: false,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
        id: "priceBucket",
        accessorFn: (row) => getPriceBucket(row.priceSell),
        header: "Price",
        enableHiding: false,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    { id: "actions", cell: ({ row }) => <RowActionsMenu product={row.original} /> },
]
