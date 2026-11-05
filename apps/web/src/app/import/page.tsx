import { useState } from "react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { CountTabs } from "@/components/ui/count-tabs"
import TradesheetsPage from "@/app/tradesheets/page"

type Tab = "tradesheet"

/**
 * Where files go in. The monthly tradesheet is the existing import. The other file types (BC report, stock sheet,
 * customer safe sheet, assembled workbook) are added here as their import services arrive.
 */
export default function ImportHubPage() {
    const [tab, setTab] = useState<Tab>("tradesheet")
    return (
        <BaseLayout title="Import hub" description="Drop a file: Goldilocks shows what will change before anything is saved">
            <div className="space-y-4 px-4 lg:px-6">
                <CountTabs aria-label="Import views" value={tab} onValueChange={(v) => setTab(v as Tab)} items={[{ value: "tradesheet", label: "Tradesheet" }]} />
                {tab === "tradesheet" && <TradesheetsPage embedded />}
            </div>
        </BaseLayout>
    )
}
