import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductRow } from "./product-columns"
import type { DisplayProduct } from "./product-grouping"

interface ProductTableBodyProps {
    table: TanstackTable<DisplayProduct>
    columnCount: number
}

const GROUP_LABELS = { bar: "Bars", coin: "Coins", bonded: "Bonded" } as const

export function ProductTableBody({ table, columnCount }: ProductTableBodyProps) {
    const rows = table.getRowModel().rows
    let lastGroup: DisplayProduct["productType"] | null = null

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border">
            <div className="min-h-0 flex-1 overflow-y-auto">
                <Table>
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
                                        className="bg-muted sticky top-0 z-10 px-3 py-1.5"
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
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        <ProductRow row={row} />
                                    </React.Fragment>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
