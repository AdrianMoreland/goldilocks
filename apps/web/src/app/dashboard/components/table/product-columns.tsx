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
import { useAuth } from "@/contexts/auth-context"
import { usePricingTools } from "../../context/pricing-tools-context"
import { EditProductDialog } from "./edit-product-dialog"
import type { DisplayProduct } from "./product-grouping"

const formatEuro = (value: number) =>
    new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
    }).format(value)

const formatPercent = (value: number) =>
    `${(value * 100).toFixed(2)}%`

export function ProductRow({ row }: { row: Row<DisplayProduct> }) {
    return (
        <TableRow data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

function PriceCell({ value, className }: { value: number; className: string }) {
    return (
        <div className="w-16">
            <div className={`text-sm font-semibold tabular-nums ${className}`}>
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
 */
function SpreadBadge({ value, tone }: { value: number; tone: "sell" | "buy" }) {
    const toneClass =
        tone === "sell"
            ? "border-emerald-600/25 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-400"
            : "border-slate-600/25 bg-slate-600/10 text-slate-600 dark:border-slate-400/25 dark:bg-slate-400/10 dark:text-slate-400"

    return (
        <Badge variant="outline" className={`px-2 py-0 text-xs font-semibold tabular-nums ${toneClass}`}>
            {formatPercent(value)}
        </Badge>
    )
}

/**
 * Per-row "…" menu — only rendered for admins with admin mode switched on
 * (see the header's shield-icon button). Everyone else gets no menu at all,
 * not just a disabled one, so pricing edits aren't discoverable by non-admins.
 */
function RowActionsMenu({ product }: { product: DisplayProduct }) {
    const { isAdmin } = useAuth()
    const { adminMode } = usePricingTools()
    const [editOpen, setEditOpen] = React.useState(false)

    if (!isAdmin || !adminMode) return null

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
    spreadBuy: "Discount",
    priceBuy: "Buyback",
    marketValue: "Market Price",
    priceSell: "MG Price",
    priceSellVatExcl: "VAT Excl.",
    spreadSell: "Premium",
    metalType: "Metal",
    weight: "Weight",
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
        header: () => <div className="w-full text-left">Product</div>,
        cell: ({ row }) => <NameCell item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "marketValue",
        header: "Market Price",
        cell: ({ row }) => <PriceCell value={row.original.marketValue} className="text-muted-foreground" />,
    },
    {
        accessorKey: "priceSell",
        header: "MG Price",
        cell: ({ row }) => <PriceCell value={row.original.priceSell} className="text-emerald-600 dark:text-emerald-400" />,
    },
    {
        accessorKey: "spreadSell",
        header: "Premium",
        cell: ({ row }) => (
            <div className="w-24">
                <SpreadBadge value={row.original.spreadSell} tone="sell" />
            </div>
        ),
    },
    {
        accessorKey: "priceBuy",
        header: "Buyback",
        cell: ({ row }) => <PriceCell value={row.original.priceBuy} className="text-slate-600 dark:text-slate-400" />,
    },
    {
        accessorKey: "spreadBuy",
        header: "Discount",
        cell: ({ row }) => <SpreadBadge value={row.original.spreadBuy} tone="buy" />,
    },
    {
        accessorKey: "priceSellVatExcl",
        header: "VAT Excl.",
        cell: ({ row }) => <PriceCell value={row.original.priceSellVatExcl} className="text-muted-foreground" />,
    },
    {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => (
            <div className="w-16 text-sm font-medium text-foreground">{row.original.weight.toFixed(2)}g</div>
        ),
    },
    { accessorKey: "metalType", header: "Metal", cell: ({ row }) => row.original.metalType },
    { id: "actions", cell: ({ row }) => <RowActionsMenu product={row.original} /> },
]
