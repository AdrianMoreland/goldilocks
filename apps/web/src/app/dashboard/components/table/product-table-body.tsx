import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRowNavigation } from "@/hooks/use-row-navigation.hook"
import { ProductRow } from "./product-columns"
import type { DisplayProduct } from "./product-grouping"
import { features } from "@/config/features"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ProductTableBodyProps {
    table: TanstackTable<DisplayProduct>
    columnCount: number
    isLoading?: boolean
    hasError?: boolean
    isFiltered?: boolean
    onResetFilters?: () => void
    /** The metal on screen is held at a typed price: the table gets a warm border so the quote cannot be mistaken for live. */
    held?: boolean
    onRetry?: () => void
}

const GROUP_LABELS = { bar: "Bars", coin: "Coins", bonded: "Bonded" } as const

export function ProductTableBody({
    table,
    columnCount,
    isLoading,
    hasError,
    isFiltered,
    onResetFilters,
    held,
    onRetry,
}: ProductTableBodyProps) {
    const rows = table.getRowModel().rows
    const { focusedRowId } = useRowNavigation(rows)
    let lastGroup: DisplayProduct["productType"] | null = null

    return (
        <div data-product-table className={cn("flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border", features.redesign && held && "border-status-warn border-2")}>
            {/* flex-1 (not h-full) — this sits below the new ProductFilterBar
                row now, so it needs to shrink to make room for that sibling
                rather than claiming 100% of TabsContent's height regardless.
                That's also what was silently breaking the header's
                position:sticky: with h-full, this div (and its inner
                overflow-y-auto child) never actually got a bounded height
                once a sibling existed above it, so nothing here truly
                scrolled - sticky had no real scroll container to lock to. */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                <Table className="type-table-item text-base">
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        // Sticky on each cell rather than on <thead> — sticky
                                        // positioning on a <thead> is unreliable across browsers'
                                        // table layout implementations; per-cell is the robust form.
                                        className="type-table-head bg-muted sticky top-0 z-10 px-3 py-1.5 text-base font-bold"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {rows.length ? (
                            rows.map((row) => {
                                const group = row.original.productType
                                const showGroupHeader = group !== lastGroup
                                lastGroup = group

                                return (
                                    <React.Fragment key={row.id}>
                                        {showGroupHeader && (
                                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                                <TableCell
                                                    colSpan={columnCount}
                                                    className="text-muted-foreground px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
                                                >
                                                    {GROUP_LABELS[group]}
                                                    {features.redesign && ` · ${rows.filter((r) => r.original.productType === group).length}`}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        <ProductRow row={row} isFocused={row.id === focusedRowId} />
                                    </React.Fragment>
                                )
                            })
                        ) : features.redesign && isLoading ? (
                            Array.from({ length: 7 }, (_, i) => (
                                <TableRow key={i} aria-hidden className="hover:bg-transparent">
                                    <TableCell colSpan={columnCount} className="px-3 py-3">
                                        <Skeleton className="h-3.5 w-3/5" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columnCount} className="text-muted-foreground h-24 text-center">
                                    <EmptyTableMessage
                                        isLoading={isLoading}
                                        hasError={hasError}
                                        isFiltered={isFiltered}
                                        onResetFilters={onResetFilters}
                                        onRetry={onRetry}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

/** One message per reason the table is empty — "No results." used to cover loading, a failed fetch, and a too-narrow filter alike. */
function EmptyTableMessage({
    isLoading,
    hasError,
    isFiltered,
    onResetFilters,
    onRetry,
}: Omit<ProductTableBodyProps, "table" | "columnCount">) {
    if (isLoading) return <>Loading products…</>
    if (features.redesign && hasError) {
        return (
            <div className="flex flex-col items-center gap-2 py-4">
                <b className="text-foreground">Could not load the products</b>
                <span className="text-xs">The price service did not answer. Prices on screen may be out of date.</span>
                {onRetry && <Button variant="outline" size="sm" className="cursor-pointer" onClick={onRetry}>Try again</Button>}
            </div>
        )
    }
    if (hasError) return <>Couldn&apos;t load products from the server. Check your connection and press refresh in the top bar; if it keeps failing, tell an admin.</>
    if (isFiltered) {
        return (
            <>
                No products match these filters.{" "}
                {onResetFilters && (
                    <Button variant="link" className="h-auto cursor-pointer p-0" onClick={onResetFilters}>
                        Clear filters
                    </Button>
                )}
            </>
        )
    }
    return <>No products for this metal yet.</>
}
