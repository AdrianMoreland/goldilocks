"use client"

import * as React from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { MetalType, Product } from "@/lib/types"
import { useProductTable } from "@/hooks/use-product-table"
import { MetalTabsToolbar } from "./metal-tabs-toolbar"
import { ProductTableBody } from "./product-table-body"
import { productColumns } from "./product-columns"
import { METAL_TABS } from "./metal-tabs"
import { usePricingTools } from "../../context/pricing-tools-context"

export function DataTable({ data, activeMetal }: { data: Product[]; activeMetal?: MetalType | null }) {
    const { setActiveMetal, rowSelection, setRowSelection } = usePricingTools()
    // rowSelection is owned by pricing-tools-context (not local state) so the
    // Trade tab can also write to it — removing a cart item there unchecks
    // the matching row here. See use-trade-tools.hook.ts / trade-tab.tsx.
    const { table, selectedTab, setSelectedTab } = useProductTable(data, rowSelection, setRowSelection)

    // Clicking a spot-price card selects that metal — mirror the selection
    // into the product table's own tab so the cards drive what's displayed.
    React.useEffect(() => {
        if (!activeMetal) return
        const tab = METAL_TABS.find((t) => t.metalType === activeMetal)?.value
        if (tab) setSelectedTab(tab)
    }, [activeMetal, setSelectedTab])

    // Whatever metal tab the product table is currently showing is also the
    // metal mode the pricing tools drawer/floating button should open in.
    React.useEffect(() => {
        const metalType = METAL_TABS.find((t) => t.value === selectedTab)?.metalType
        if (metalType) setActiveMetal(metalType)
    }, [selectedTab, setActiveMetal])

    return (
        <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}
            className="flex h-full min-h-0 w-full flex-1 flex-col justify-start gap-3"
        >
            <div className="shrink-0">
                <MetalTabsToolbar table={table} selectedTab={selectedTab} onSelectedTabChange={setSelectedTab} />
            </div>

            <TabsContent
                value={selectedTab}
                className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4 lg:px-6"
            >
                <ProductTableBody
                    table={table}
                    columnCount={productColumns.length}
                />

                <div className="flex shrink-0 items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}