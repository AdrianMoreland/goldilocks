"use client"

import * as React from "react"
import {
    type ColumnDef, type Row, flexRender,
} from "@tanstack/react-table"
import { EllipsisVertical, Eye, EyeOff, Pencil, Trash2 } from "lucide-react"
import type { Product } from "@goldilocks/shared-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import {TableCellViewer} from "@/app/dashboard/components/table-cell-viewer.tsx";
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { DataTableColumnHeader } from "./data-table-column-header"
import type { DisplayProduct, ProductGroup } from "./product-grouping"
import { formatPercent, formatPrice } from "../../utils/formatters"

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
            className={isFocused ? "outline outline-2 -outline-offset-2 outline-primary-text" : undefined}
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
 * The Price pair (Price + Premium) and Buyback pair (Buyback + Discount) are
 * colored from the theme's dedicated --price-text/--buyback-text tokens —
 * the readable text tone of each direction colour (a darker shade than the
 * fill in light mode), not primary/secondary.
 */
const PRICE_TONE_COLOR = {
    price: "var(--price-text)",
    buyback: "var(--buyback-text)",
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
                className={`font-semibold tabular-nums ${className ?? ""}`}
                style={tone ? { color: PRICE_TONE_COLOR[tone] } : undefined}
            >
                {formatPrice(value)}
            </div>
        </div>
    )
}

function NameCell({ item }: { item: DisplayProduct }) {
    return (
        <div className="flex w-full justify-start pl-2">
            <TableCellViewer item={item} />
        </div>
    )
}

/**
 * Premium (sell-side markup) and Discount (buy-side markdown) badges — no
 * icon (a prior version showed a spinning Loader on every non-7% value,
 * which read as "still loading" for a perfectly static number). Each tone
 * mirrors the color of its matching price column so the Price pair (Price +
 * Premium) and Buyback pair (Buyback + Discount) are visually grouped by
 * transaction direction at a glance.
 *
 * `value` here is a raw fraction (spreadSell/spreadBuy, e.g. 0.34) —
 * formatPercent expects an already-scaled percentage, so it's multiplied by
 * 100 at this one call site rather than inside the shared formatter.
 */
function SpreadBadge({ value, tone }: { value: number; tone: keyof typeof PRICE_TONE_COLOR }) {
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
    // Which real product a dialog is open for — on a merged coin row that's
    // one of its mints, picked from the submenu.
    const [editing, setEditing] = React.useState<Product | null>(null)
    const [deleting, setDeleting] = React.useState<Product | null>(null)

    if (!isAdmin) return null

    const toggleActive = async (target: Product) => {
        try {
            await api.updateProduct(target.id, { isActive: !target.isActive })
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            toast.success(`${target.name} marked ${target.isActive ? "inactive" : "active"}`)
        } catch {
            // useApi already shows an error toast on failure
        }
    }

    const actionsFor = (target: Product) => (
        <>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setEditing(target)}>
                <Pencil /> Edit product
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => toggleActive(target)}>
                {target.isActive ? <EyeOff /> : <Eye />}
                {target.isActive ? "Mark inactive" : "Mark active"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setDeleting(target)}>
                <Trash2 /> Delete…
            </DropdownMenuItem>
        </>
    )

    // A merged "{fraction} Coin" row averages several mints; its own id is
    // just the first mint's. Acting on it would silently hit one arbitrary
    // product, so it offers one submenu per real mint instead.
    const members = product.members && product.members.length > 1 ? product.members : null

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
                        <span className="sr-only">Product actions for {product.name}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    {members ? (
                        <>
                            <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                                Average of {members.length} mints
                            </DropdownMenuLabel>
                            {members.map((member) => (
                                <DropdownMenuSub key={member.id}>
                                    <DropdownMenuSubTrigger className="cursor-pointer">{member.name}</DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-44">{actionsFor(member)}</DropdownMenuSubContent>
                                </DropdownMenuSub>
                            ))}
                        </>
                    ) : (
                        actionsFor(product)
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {editing && (
                <EditProductDialog product={editing} open onOpenChange={(open) => !open && setEditing(null)} />
            )}
            {deleting && (
                <DeleteProductDialog product={deleting} open onOpenChange={(open) => !open && setDeleting(null)} />
            )}
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
    marketValue: "Market Value",
    priceSell: "Price",
    priceSellVatExcl: "Price ex. VAT",
    spreadSell: "Premium",
    metalType: "Metal",
    weight: "Weight",
}

/** Section order in the table — matches buildDisplayProducts' own output order. */
export const PRODUCT_GROUP_ORDER: Record<ProductGroup, number> = { bar: 0, coin: 1, bonded: 2 }

/** Filter-only dimension for the "Type" faceted filter — bar vs coin vs bonded. */
export const PRODUCT_TYPE_OPTIONS: { label: string; value: ProductGroup }[] = [
    { label: "Bar", value: "bar" },
    { label: "Coin", value: "coin" },
    { label: "Bonded", value: "bonded" },
]

export type PriceBucket = "budget" | "mid" | "high" | "premium"

/** Filter-only dimension for the "Price" faceted filter — bucketed off Price (priceSell), what the customer actually pays. */
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
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <Checkbox
                                checked={
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() && "indeterminate")
                                }
                                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                aria-label="Select all"
                            />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Select every row shown — they all go into the Trade cart and can be copied as a table</TooltipContent>
                </Tooltip>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select row"
                            />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Add to the Trade tab to quote it. Selected rows can also be copied as a table with the Copy button.
                    </TooltipContent>
                </Tooltip>
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.marketValue} />,
        cell: ({ row }) => <PriceCell value={row.original.marketValue} className="text-muted-foreground" />,
    },
    {
        accessorKey: "priceSell",
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.priceSell} />,
        cell: ({ row }) => <PriceCell value={row.original.priceSell} tone="price" />,
    },
    {
        accessorKey: "spreadSell",
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.spreadSell} />,
        cell: ({ row }) => (
            <div className="w-24">
                <SpreadBadge value={row.original.spreadSell} tone="price" />
            </div>
        ),
    },
    {
        accessorKey: "priceBuy",
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.priceBuy} />,
        cell: ({ row }) => <PriceCell value={row.original.priceBuy} tone="buyback" />,
    },
    {
        accessorKey: "spreadBuy",
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.spreadBuy} />,
        cell: ({ row }) => <SpreadBadge value={row.original.spreadBuy} tone="buyback" />,
    },
    {
        id: "priceSellVatExcl",
        accessorKey: "priceSellVatExcl",
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.priceSellVatExcl} />,
        cell: ({ row }) => <PriceCell value={row.original.priceSellVatExcl} className="text-muted-foreground" />,
    },
    {
        accessorKey: "weight",
        header: ({ column }) => <DataTableColumnHeader column={column} title={productColumnLabels.weight} />,
        cell: ({ row }) => (
            <div className="w-16 font-medium tabular-nums text-foreground">{row.original.weight.toFixed(2)}g</div>
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
        // Always applied as the first sort key (see use-product-table.ts) so
        // any user sort orders rows *within* Bars / Coins / Bonded instead of
        // interleaving the sections.
        sortingFn: (a, b) =>
            PRODUCT_GROUP_ORDER[a.original.productType] - PRODUCT_GROUP_ORDER[b.original.productType],
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
