import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { CountTabs } from "@/components/ui/count-tabs"
import StocktakeListPage from "@/app/stocktake/page"

type Tab = "month-end"

/**
 * Stock in one place. Month-end is the existing stocktake. The stock position, bars by serial, coins and availability
 * need the stock position API (still to come), so they are not offered yet rather than shown empty.
 */
export default function InventoryPage() {
    const [tab, setTab] = useState<Tab>("month-end")
    return (
        <BaseLayout title="Inventory" description="Stock safe, customer safe and the month-end count in one place">
            <div className="space-y-4 px-4 lg:px-6">
                <CountTabs aria-label="Inventory views" value={tab} onValueChange={(v) => setTab(v as Tab)} items={[{ value: "month-end", label: "Month-end" }]} />
                {tab === "month-end" && <StocktakeListPage embedded />}
            </div>
        </BaseLayout>
    )
}
