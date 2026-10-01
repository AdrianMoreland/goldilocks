"use client"

import * as React from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { MetalType, Product } from "@/lib/types"
import { useProductTable } from "@/hooks/use-product-table"
import { ProductFilterBar } from "./product-filter-bar"
import { ProductTableBody } from "./product-table-body"
import { METAL_TABS } from "./metal-tabs"
import { usePricingTools } from "../../context/pricing-tools-context"

interface DataTableProps {
    data: Product[]
    activeMetal?: MetalType | null
    /**
     * Fires whenever the table's own metal tab changes, so the page can
     * mirror it into the cards' `selectedMetal` (and the chart's).
     */
    onActiveMetalChange?: (metal: MetalType) => void
    isLoading?: boolean
    hasError?: boolean
}

export function DataTable({ data, activeMetal, onActiveMetalChange, isLoading, hasError }: DataTableProps) {
    const { setActiveMetal, rowSelection, setRowSelection, tableCopySource } = usePricingTools()
    // rowSelection is owned by pricing-tools-context (not local state) so the
    // Trade tab can also write to it — removing a cart item there unchecks
    // the matching row here. See use-trade-tools.hook.ts / trade-tab.tsx.
    const { table, selectedTab, setSelectedTab, selectedProducts, search, setSearch, isFiltered, resetFilters } =
        useProductTable(data, rowSelection, setRowSelection)

    // The Trade tab's Easy Copy button copies whatever is ticked here, in the
    // columns currently shown. A ref, not state: it is only read on click, and
    // publishing it as state would re-render the whole page on every keystroke.
    React.useEffect(() => {
        tableCopySource.current = {
            selectedProducts,
            visibleColumnIds: table.getVisibleLeafColumns().map((c) => c.id),
        }
    })

    // Clicking a spot-price card selects that metal — mirror the selection
    // into the product table's own tab so the cards drive what's displayed.
    React.useEffect(() => {
        if (!activeMetal) return
        const tab = METAL_TABS.find((t) => t.metalType === activeMetal)?.value
        if (tab) setSelectedTab(tab)
    }, [activeMetal, setSelectedTab])

    // Whatever metal tab the product table is currently showing is also the
    // metal mode the pricing tools drawer/floating button should open in —
    // and (via onActiveMetalChange) what the cards/chart consider selected,
    // so switching metals via the small buttons while cards are hidden
    // doesn't leave the cards/chart pointed at a stale metal underneath.
    React.useEffect(() => {
        const metalType = METAL_TABS.find((t) => t.value === selectedTab)?.metalType
        if (!metalType) return
        setActiveMetal(metalType)
        onActiveMetalChange?.(metalType)
    }, [selectedTab, setActiveMetal, onActiveMetalChange])

    return (
        <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}
            className="flex h-full min-h-0 w-full flex-1 flex-col justify-start gap-3"
        >
            <TabsContent
                value={selectedTab}
                className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4 lg:px-6"
            >
                <ProductFilterBar
                    table={table}
                    search={search}
                    onSearchChange={setSearch}
                    isFiltered={isFiltered}
                    onResetFilters={resetFilters}
                />

                <ProductTableBody
                    table={table}
                    columnCount={table.getVisibleLeafColumns().length}
                    isLoading={isLoading && data.length === 0}
                    hasError={hasError && data.length === 0}
                    isFiltered={isFiltered}
                    onResetFilters={resetFilters}
                />

                <div className="flex shrink-0 items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} selected
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}