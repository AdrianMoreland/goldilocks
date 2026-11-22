import { useState } from "react"
import { skipToken, useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { queryKeys } from "@/lib/query-keys"
import type { AnalyticsPreset, PermissionKey } from "@goldilocks/shared-types"
import { useMyPermissions } from "@/api/permissions.api"
import { BaseLayout } from "@/components/layouts/base-layout"
import { CountTabs } from "@/components/ui/count-tabs"
import { Empty, PeriodPicker, TabSkeleton } from "./components/kit"
import { ChatbotTab } from "./tabs/chatbot-tab"
import { CustomersTab } from "./tabs/customers-tab"
import { InventoryTab } from "./tabs/inventory-tab"
import { OpsTab } from "./tabs/ops-tab"
import { OrdersTab } from "./tabs/orders-tab"
import { PricingTab } from "./tabs/pricing-tab"
import { SalesTab } from "./tabs/sales-tab"

const TABS: { id: string; label: string; permission: PermissionKey; Body: (p: { preset: AnalyticsPreset }) => React.ReactNode }[] = [
    { id: "pricing", label: "Pricing", permission: "analytics.pricing", Body: PricingTab },
    { id: "sales", label: "Sales & margin", permission: "analytics.sales", Body: SalesTab },
    { id: "orders", label: "Orders", permission: "analytics.orders", Body: OrdersTab },
    { id: "inventory", label: "Inventory", permission: "analytics.inventory", Body: InventoryTab },
    { id: "customers", label: "Customers & invoices", permission: "analytics.customers", Body: CustomersTab },
    { id: "chatbot", label: "Chatbot", permission: "analytics.chatbot", Body: ChatbotTab },
    { id: "ops", label: "Ops", permission: "analytics.ops", Body: OpsTab },
]

const TAB_KEY = "analytics-tab"
const timeFmt = new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit" })
const readTab = () => {
    try {
        return localStorage.getItem(TAB_KEY)
    } catch {
        return null
    }
}

/** Analytics: one tab per question area, each shown only to people who hold its permission (the API enforces the same). */
export default function AnalyticsPage() {
    const permissions = useMyPermissions()
    const { user } = useAuth()
    const [chosen, setChosen] = useState<string | null>(readTab)
    const [preset, setPreset] = useState<AnalyticsPreset>("90d")
    const visible = TABS.filter((t) => permissions.can(t.permission))
    const active = visible.find((t) => t.id === chosen) ?? visible[0]
    // Reads the active tab's cached query (no fetch of its own) to say how fresh the figures are.
    const shown = useQuery({ queryKey: queryKeys.analytics(user?.id ?? "", active?.id ?? "none", preset), queryFn: skipToken })
    const updated = shown.dataUpdatedAt ? timeFmt.format(new Date(shown.dataUpdatedAt)) : null
    const choose = (id: string) => {
        setChosen(id)
        try {
            localStorage.setItem(TAB_KEY, id)
        } catch {
            // A private window may refuse storage; the tab just isn't remembered.
        }
    }

    return (
        <BaseLayout title="Analytics" description="How prices, sales, orders, stock and the assistant are doing">
            <div className="space-y-4 px-4 lg:px-6">
                {permissions.isPending ? (
                    <TabSkeleton />
                ) : !active ? (
                    <Empty>You don&apos;t have access to any Analytics tab. Ask an admin if you need one.</Empty>
                ) : (
                    <>
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            {/* On a phone the tabs scroll sideways; the fading edge shows there is more. */}
                            <div className="min-w-0 max-w-full overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:[mask-image:none]">
                                <CountTabs aria-label="Analytics sections" value={active.id} onValueChange={choose} items={visible.map((t) => ({ value: t.id, label: t.label }))} />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {updated && <span className="text-muted-foreground text-xs">Updated {updated}</span>}
                                <PeriodPicker value={preset} onChange={setPreset} />
                            </div>
                        </div>
                        {visible.length < TABS.length && (
                            <p className="text-muted-foreground text-xs">
                                {TABS.length - visible.length} tab{TABS.length - visible.length === 1 ? " is" : "s are"} hidden by your permissions.
                            </p>
                        )}
                        <active.Body preset={preset} />
                    </>
                )}
            </div>
        </BaseLayout>
    )
}
