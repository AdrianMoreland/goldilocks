"use client"

import * as React from "react"
import {
    type ColumnDef, type Row, flexRender,
} from "@tanstack/react-table"
import { CircleCheckBig, EllipsisVertical, Loader } from "lucide-react"
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
        <div className="flex w-full justify-center">
            <TableCellViewer item={item} />
        </div>
    )
}

function SpreadBadge({ value, className = "" }: { value: number; className?: string }) {
    return (
        <Badge variant="outline" className={`px-1.5 py-0 text-xs ${className}`}>
            {value === 7 ? (
                <CircleCheckBig className="size-3 text-green-500 dark:text-green-400" />
            ) : (
                <Loader className="size-3" />
            )}
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
    priceBuy: "Buy Price",
    marketValue: "Market Price",
    priceSell: "Sell Price",
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
        header: () => <div className="w-full text-center">Product</div>,
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
        header: "Sell Price",
        cell: ({ row }) => <PriceCell value={row.original.priceSell} className="text-[var(--chart-1)]" />,
    },
    {
        accessorKey: "spreadSell",
        header: "Premium",
        cell: ({ row }) => (
            <div className="w-24">
                <SpreadBadge value={row.original.spreadSell} className="text-foreground font-bold px-3" />
            </div>
        ),
    },
    {
        accessorKey: "priceBuy",
        header: "Buy Price",
        cell: ({ row }) => <PriceCell value={row.original.priceBuy} className="text-[var(--chart-2)]" />,
    },
    {
        accessorKey: "spreadBuy",
        header: "Discount",
        cell: ({ row }) => <SpreadBadge value={row.original.spreadBuy} className="text-muted-foreground" />,
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
