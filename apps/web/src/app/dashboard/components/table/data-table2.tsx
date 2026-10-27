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

// Start on the tab the page already has selected. Starting on Gold while a remembered
// metal is, say, Silver makes the two sync effects below overwrite each other forever.
function initialTabFor(metal?: MetalType | null) {
    return METAL_TABS.find((t) => t.metalType === metal)?.value ?? "gold"
}

export function DataTable({ data, activeMetal, onActiveMetalChange, isLoading, hasError }: DataTableProps) {
    const { setActiveMetal, rowSelection, setRowSelection, tableCopySource } = usePricingTools()
    // rowSelection is owned by pricing-tools-context (not local state) so the
    // Trade tab can also write to it — removing a cart item there unchecks
    // the matching row here. See use-trade-tools.hook.ts / trade-tab.tsx.
    const { table, selectedTab, setSelectedTab, selectedProducts, search, setSearch, isFiltered, resetFilters } =
        useProductTable(data, rowSelection, setRowSelection, initialTabFor(activeMetal))

    // The Trade tab's Easy Copy button copies whatever is ticked here, in the
    // columns currently shown. A ref, not state: it is only read on click, and
    // publishing it as state would re-render the whole page on every keystroke.
    React.useEffect(() => {
        tableCopySource.current = {
            selectedProducts,
            visibleColumnIds: table.getVisibleLeafColumns().map((c) => c.id),
        }
    })

    // `activeMetal` (the page's saved/selected metal) is the single source of truth:
    // it flows one way into the table's tab and the pricing tools' metal mode. A card
    // click or a restored preference lands here; tab clicks go through handleTabChange.
    // Syncing the other way in an effect made the two overwrite each other forever.
    React.useEffect(() => {
        if (!activeMetal) return
        const tab = METAL_TABS.find((t) => t.metalType === activeMetal)?.value
        if (tab) setSelectedTab(tab)
        setActiveMetal(activeMetal)
    }, [activeMetal, setSelectedTab, setActiveMetal])

    // A tab click also moves the pricing tools' metal mode and the cards/chart's
    // selected metal, so the small tab buttons never leave them on a stale metal.
    const handleTabChange = (value: string) => {
        setSelectedTab(value as typeof selectedTab)
        const metalType = METAL_TABS.find((t) => t.value === value)?.metalType
        if (!metalType) return
        setActiveMetal(metalType)
        onActiveMetalChange?.(metalType)
    }

    return (
        <Tabs
            value={selectedTab}
            onValueChange={handleTabChange}
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