import * as React from "react"
import {
    type ColumnFiltersState, type SortingState, type VisibilityState,
    getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues,
    getFilteredRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table"
import type { Product } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { useLocalStorageState } from "@/hooks/use-local-storage-state.hook"
import { METAL_TABS, MetalTabValue } from "@/app/dashboard/components/table/metal-tabs"
import { buildDisplayProducts, type DisplayProduct } from "@/app/dashboard/components/table/product-grouping"
import {productColumns} from "@/app/dashboard/components/table/product-columns.tsx";

const SECTION_SORT = { id: "productType", desc: false } as const

function filterByMetalTab(data: DisplayProduct[], tab: MetalTabValue): DisplayProduct[] {
    const metalType = METAL_TABS.find((t) => t.value === tab)?.metalType
    return metalType ? data.filter((p) => p.metalType === metalType) : data
}

/** Global search — matches name or SKU, independent of which columns are currently visible. */
function filterBySearch(data: DisplayProduct[], search: string): DisplayProduct[] {
    const term = search.trim().toLowerCase()
    if (!term) return data
    return data.filter((p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term))
}

export function useProductTable(
    initialData: Product[],
    rowSelection: Record<string, boolean>,
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
) {
    const { user } = useAuth()
    // Sort/filter/search state is persisted per user, not per session — a
    // "budget only" filter or a "Premium" sort should still be there
    // tomorrow. Keyed by user id so switching accounts on the same browser
    // doesn't leak one user's filters into another's.
    const storagePrefix = `product-table:${user?.id ?? "anon"}`

    const [data, setData] = React.useState<Product[]>(initialData)
    // Market Value and Weight are reference columns, not quoting ones — hidden
    // by default, still available from "Customize Columns".
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        metalType: false,
        productType: false,
        priceBucket: false,
        marketValue: false,
        weight: false,
    })
    const [columnFilters, setColumnFilters] = useLocalStorageState<ColumnFiltersState>(`${storagePrefix}:filters`, [])
    const [sorting, setSorting] = useLocalStorageState<SortingState>(`${storagePrefix}:sorting`, [])

    // Bars / Coins / Bonded are sorted as independent sections: the section
    // is always the first sort key, so a Price sort gives every bar in price
    // order, then every coin in price order — never the two interleaved.
    // TanStack's sort is stable, so with no user sort the original
    // buildDisplayProducts order inside each section is kept. The section key
    // is added here and stripped on write, so it never reaches storage or
    // the column headers' own sort indicators.
    const tableSorting = React.useMemo<SortingState>(
        () => [SECTION_SORT, ...sorting.filter((s) => s.id !== SECTION_SORT.id)],
        [sorting],
    )
    const onSortingChange = React.useCallback<React.Dispatch<React.SetStateAction<SortingState>>>(
        (updater) => {
            setSorting((prev) => {
                const next = typeof updater === "function" ? updater([SECTION_SORT, ...prev]) : updater
                return next.filter((s) => s.id !== SECTION_SORT.id)
            })
        },
        [setSorting],
    )
    const [search, setSearch] = useLocalStorageState<string>(`${storagePrefix}:search`, "")
    const [selectedTab, setSelectedTab] = React.useState<MetalTabValue>("gold")

    React.useEffect(() => {
        if (initialData?.length) setData(initialData)
    }, [initialData])

    // Bars (by weight) then coins (reverse weight), with small fractional
    // coins collapsed to one generic row per weight — see product-grouping.ts.
    const displayProducts = React.useMemo(() => buildDisplayProducts(data), [data])

    const filteredData = React.useMemo(
        () => filterBySearch(filterByMetalTab(displayProducts, selectedTab), search),
        [displayProducts, selectedTab, search],
    )

    // Gold is VAT-exempt as investment metal (see the Calculators tab's VAT
    // panel), so "Price ex. VAT" would just repeat the Price for every gold
    // row — the column is dropped entirely for gold rather than merely
    // hidden, so it also can't be re-enabled via "Customize Columns".
    const columns = React.useMemo(
        () => (selectedTab === "gold" ? productColumns.filter((c) => c.id !== "priceSellVatExcl") : productColumns),
        [selectedTab],
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { sorting: tableSorting, columnVisibility, rowSelection, columnFilters },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    // The rows currently checked via the per-row toggle, in current sort/
    // filter order — exposed separately (rather than making callers dig
    // through TanStack's row model) so the Trade tab and the "Copy" button
    // can both use them directly.
    const selectedProducts = React.useMemo(
        () => table.getFilteredSelectedRowModel().rows.map((row) => row.original),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [table, rowSelection, sorting, columnFilters, filteredData],
    )

    const isFiltered = columnFilters.length > 0 || search.trim().length > 0
    const resetFilters = React.useCallback(() => {
        setColumnFilters([])
        setSearch("")
    }, [setColumnFilters, setSearch])

    return { table, selectedTab, setSelectedTab, selectedProducts, search, setSearch, isFiltered, resetFilters }
}
