import { useQuery } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { AdminActions } from "../admin-actions"
import { Panel } from "../panel"
import { HealthPanel } from "./health-panel"
import { RoutesPanel, SignInsPanel, StoragePanel, TrafficPanel } from "./traffic-panels"
import { ErrorsPanel, PriceFeedPanel } from "./feed-and-errors-panels"

export function OverviewTab({ onOpenLogs }: { onOpenLogs: () => void }) {
    const api = useAdminApi()
    const overview = useQuery({
        queryKey: queryKeys.admin.overview,
        queryFn: api.getOverview,
        refetchInterval: 30_000,
    })

    return (
        <div className="grid gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
                {overview.data ? (
                    <HealthPanel overview={overview.data} />
                ) : overview.isError ? (
                    <Panel title="System health">
                        <div className="flex items-center gap-3 text-sm">
                            <AlertTriangle className="text-destructive size-4 shrink-0" />
                            <span>Couldn&apos;t load the overview. The API may be down.</span>
                            <Button variant="outline" size="sm" className="ml-auto cursor-pointer" onClick={() => void overview.refetch()}>
                                Try again
                            </Button>
                        </div>
                    </Panel>
                ) : (
                    <Skeleton className="h-64 rounded-xl" />
                )}
            </div>

            <div className="xl:col-span-5">
                <Panel title="Quick actions">
                    <AdminActions />
                </Panel>
            </div>

            {overview.data ? (
                <>
                    <div className="xl:col-span-8">
                        <TrafficPanel overview={overview.data} />
                    </div>
                    <div className="xl:col-span-4">
                        <SignInsPanel overview={overview.data} />
                    </div>
                    <div className="xl:col-span-5">
                        <StoragePanel overview={overview.data} />
                    </div>
                    <div className="xl:col-span-7">
                        <RoutesPanel overview={overview.data} />
                    </div>
                    <div className="xl:col-span-5">
                        <PriceFeedPanel />
                    </div>
                    <div className="xl:col-span-7">
                        <ErrorsPanel overview={overview.data} onOpenLogs={onOpenLogs} />
                    </div>
                </>
            ) : (
                !overview.isError && (
                    <>
                        <Skeleton className="h-80 rounded-xl xl:col-span-8" />
                        <Skeleton className="h-80 rounded-xl xl:col-span-4" />
                        <Skeleton className="h-80 rounded-xl xl:col-span-5" />
                        <Skeleton className="h-80 rounded-xl xl:col-span-7" />
                    </>
                )
            )}
        </div>
    )
}
