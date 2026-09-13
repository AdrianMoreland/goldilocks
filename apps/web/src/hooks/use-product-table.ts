import * as React from "react"
import {
    type ColumnFiltersState, type SortingState, type VisibilityState,
    getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues,
    getFilteredRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table"
import type { Product } from "@/lib/types"
import { METAL_TABS, MetalTabValue } from "@/app/dashboard/components/table/metal-tabs"
import { buildDisplayProducts, type DisplayProduct } from "@/app/dashboard/components/table/product-grouping"
import {productColumns} from "@/app/dashboard/components/table/product-columns.tsx";

function filterByMetalTab(data: DisplayProduct[], tab: MetalTabValue): DisplayProduct[] {
    const metalType = METAL_TABS.find((t) => t.value === tab)?.metalType
    return metalType ? data.filter((p) => p.metalType === metalType) : data
}

export function useProductTable(
    initialData: Product[],
    rowSelection: Record<string, boolean>,
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
) {
    const [data, setData] = React.useState<Product[]>(initialData)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        metalType: false,
    })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [selectedTab, setSelectedTab] = React.useState<MetalTabValue>("gold")

    React.useEffect(() => {
        if (initialData?.length) setData(initialData)
    }, [initialData])

    // Bars (by weight) then coins (reverse weight), with small fractional
    // coins collapsed to one generic row per weight — see product-grouping.ts.
    const displayProducts = React.useMemo(() => buildDisplayProducts(data), [data])

    const filteredData = React.useMemo(
        () => filterByMetalTab(displayProducts, selectedTab),
        [displayProducts, selectedTab],
    )

    const table = useReactTable({
        data: filteredData,
        columns: productColumns,
        state: { sorting, columnVisibility, rowSelection, columnFilters },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    // The rows currently checked via the per-row toggle, in table order —
    // exposed separately (rather than making callers dig through TanStack's
    // row model) so the Trade tab can build its cart from them.
    const selectedProducts = React.useMemo(
        () => filteredData.filter((row) => rowSelection[row.id.toString()]),
        [filteredData, rowSelection],
    )

    return { table, selectedTab, setSelectedTab, selectedProducts }
}
