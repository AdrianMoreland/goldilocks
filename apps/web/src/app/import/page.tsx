import { useState } from "react"
import type { RedactionMapRow } from "@goldilocks/shared-types"
import { BaseLayout } from "@/components/layouts/base-layout"
import { CountTabs } from "@/components/ui/count-tabs"
import TradesheetsPage from "@/app/tradesheets/page"
import { BatchHistory } from "./batch-history"
import { BcReportTab } from "./bc-report-tab"
import { MapStep } from "./map-step"
import { WorkbookTab } from "./workbook-tab"

type Tab = "tradesheet" | "workbook" | "bc"

/**
 * Where files go in. The monthly tradesheet is the existing import. The assembled workbook and the Business Central
 * report need the owner's redaction map first, which lives in this page's state and nowhere else.
 */
export default function ImportHubPage() {
    const [tab, setTab] = useState<Tab>("tradesheet")
    const [map, setMap] = useState<RedactionMapRow[] | null>(null)
    return (
        <BaseLayout title="Import hub" description="Drop a file: Goldilocks shows what will change before anything is saved">
            <div className="space-y-4 px-4 lg:px-6">
                <CountTabs
                    aria-label="Import views"
                    value={tab}
                    onValueChange={(v) => setTab(v as Tab)}
                    items={[
                        { value: "tradesheet", label: "Tradesheet" },
                        { value: "workbook", label: "Assembled workbook" },
                        { value: "bc", label: "BC awaiting collection" },
                    ]}
                />
                {tab === "tradesheet" && <TradesheetsPage embedded />}
                {tab !== "tradesheet" && (
                    <div className="mx-auto w-full max-w-6xl space-y-4">
                        <MapStep map={map} onChange={setMap} />
                        {tab === "workbook" && <WorkbookTab map={map} />}
                        {tab === "bc" && <BcReportTab map={map} />}
                        <BatchHistory />
                    </div>
                )}
            </div>
        </BaseLayout>
    )
}
