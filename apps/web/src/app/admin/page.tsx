import { Link, useSearchParams } from "react-router-dom"
import { Activity, Database, ScrollText, SquareTerminal, Table2 } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./components/overview/overview-tab"
import { LogsTab } from "./components/logs/logs-tab"
import { ApiTesterTab } from "./components/api-tester/api-tester-tab"
import { DatabaseTab } from "./components/database/database-tab"

const TABS = [
    { value: "overview", label: "Overview", icon: Activity },
    { value: "logs", label: "Logs", icon: ScrollText },
    { value: "api", label: "API tester", icon: SquareTerminal },
    { value: "database", label: "Database", icon: Database },
] as const

type TabValue = (typeof TABS)[number]["value"]

const isTab = (value: string | null): value is TabValue => TABS.some((t) => t.value === value)

/**
 * The admin console: system health, logs, an endpoint tester and a database
 * browser. The route is wrapped in RequireAdmin, and every call the tabs make
 * is admin-guarded again on the server. The open tab lives in the URL
 * (?tab=logs) so a refresh or a shared link lands in the same place.
 */
export default function AdminPage() {
    const [params, setParams] = useSearchParams()
    const requested = params.get("tab")
    const tab: TabValue = isTab(requested) ? requested : "overview"

    return (
        <BaseLayout
            title="Admin Console"
            showLogo
            headerActions={() => (
                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                    <Link to="/dashboard">
                        <Table2 /> Pricing workbook
                    </Link>
                </Button>
            )}
        >
            <div className="px-4 lg:px-6">
                <Tabs value={tab} onValueChange={(value) => setParams(value === "overview" ? {} : { tab: value }, { replace: true })} className="gap-4">
                    <TabsList className="h-10 w-full justify-start overflow-x-auto sm:w-fit">
                        {TABS.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger key={value} value={value} className="cursor-pointer px-3.5">
                                <Icon /> {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="overview">
                        <OverviewTab onOpenLogs={() => setParams({ tab: "logs" }, { replace: true })} />
                    </TabsContent>
                    <TabsContent value="logs">
                        <LogsTab />
                    </TabsContent>
                    <TabsContent value="api">
                        <ApiTesterTab />
                    </TabsContent>
                    <TabsContent value="database">
                        <DatabaseTab />
                    </TabsContent>
                </Tabs>
            </div>
        </BaseLayout>
    )
}
