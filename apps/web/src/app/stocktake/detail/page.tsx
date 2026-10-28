import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, Lock } from "lucide-react"
import { summarizeLines } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { queryKeys } from "@/lib/query-keys"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { nextStatus, statusLabel } from "../components/status"
import { CountPanel } from "../components/count-panel"
import { ImportPanel } from "../components/import-panel"
import { SerialsPanel } from "../components/serials-panel"
import { RegisterPanel } from "../components/register-panel"
import { BcItemsPanel } from "../components/bc-items-panel"
import { ReportPanel } from "../components/report-panel"

export default function StocktakeDetailPage() {
    const id = Number(useParams().id)
    const api = useStocktakeApi()
    const qc = useQueryClient()
    const { data, isLoading, isError } = useQuery({
        queryKey: queryKeys.stocktake.detail(id),
        queryFn: () => api.get(id),
        enabled: Number.isInteger(id),
    })
    const refresh = () => {
        qc.invalidateQueries({ queryKey: queryKeys.stocktake.detail(id) })
        qc.invalidateQueries({ queryKey: queryKeys.stocktake.list })
    }

    const update = useMutation({
        mutationFn: (body: Parameters<typeof api.update>[1]) => api.update(id, body),
        onSuccess: refresh,
        onError: (e: Error) => toast.error(e.message),
    })
    const finalise = useMutation({
        mutationFn: () => api.finalise(id),
        onSuccess: () => {
            toast.success("Stocktake finalised")
            refresh()
        },
        onError: (e: Error) => toast.error(e.message),
    })
    const [tab, setTab] = useState("count")

    const back = (
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
            <Link to="/stocktake">
                <ArrowLeft /> All stocktakes
            </Link>
        </Button>
    )

    if (isLoading) {
        return (
            <BaseLayout title="Stocktake" headerActions={() => back}>
                <Skeleton className="m-6 h-40" />
            </BaseLayout>
        )
    }
    if (isError || !data) {
        return (
            <BaseLayout title="Stocktake" headerActions={() => back}>
                <p className="text-muted-foreground p-6 text-sm">This stocktake could not be loaded.</p>
            </BaseLayout>
        )
    }

    const locked = data.status === "FINALISED"
    const summary = summarizeLines(data.lines)
    const unresolved = data.discrepancies.filter((d) => !d.resolved).length
    const step = nextStatus[data.status]

    return (
        <BaseLayout title={data.name} description={`Counted ${data.countDate} · reconciled to ${data.cutoffDate}`} headerActions={() => back}>
            <div className="mx-auto w-full max-w-7xl space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={locked ? "secondary" : "outline"}>{statusLabel[data.status]}</Badge>
                    <span className="text-muted-foreground text-sm">
                        {summary.counted}/{summary.lines} lines counted · {summary.withVariance} with a difference · {unresolved} open in the register
                    </span>
                    {!locked && (
                        <div className="ml-auto flex gap-2">
                            {step && (
                                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => update.mutate({ status: step.to })}>
                                    {step.label}
                                </Button>
                            )}
                            <Button
                                size="sm"
                                className="cursor-pointer"
                                disabled={finalise.isPending || summary.lines === 0}
                                onClick={() => {
                                    const warning = [
                                        summary.uncounted > 0 ? `${summary.uncounted} lines are not counted.` : "",
                                        unresolved > 0 ? `${unresolved} register entries are still open.` : "",
                                        "Finalising locks this count. It does not change Business Central.",
                                    ]
                                        .filter(Boolean)
                                        .join("\n")
                                    if (window.confirm(`${warning}\n\nFinalise this stocktake?`)) finalise.mutate()
                                }}
                            >
                                <Lock /> Finalise
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">Stocktake lead</span>
                        <Input
                            key={`lead-${data.stocktakeLead ?? ""}`}
                            defaultValue={data.stocktakeLead ?? ""}
                            disabled={locked}
                            onBlur={(e) => e.target.value !== (data.stocktakeLead ?? "") && update.mutate({ stocktakeLead: e.target.value || null })}
                        />
                    </label>
                    <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">Second checker</span>
                        <Input
                            key={`second-${data.secondChecker ?? ""}`}
                            defaultValue={data.secondChecker ?? ""}
                            disabled={locked}
                            onBlur={(e) => e.target.value !== (data.secondChecker ?? "") && update.mutate({ secondChecker: e.target.value || null })}
                        />
                    </label>
                </div>

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="count">Count</TabsTrigger>
                        <TabsTrigger value="import">Import</TabsTrigger>
                        <TabsTrigger value="serials">Serials</TabsTrigger>
                        <TabsTrigger value="register">Register ({data.discrepancies.length})</TabsTrigger>
                        <TabsTrigger value="items">BC items</TabsTrigger>
                        <TabsTrigger value="report">Report</TabsTrigger>
                    </TabsList>
                    <TabsContent value="count">
                        <CountPanel stocktake={data} locked={locked} onChanged={refresh} />
                    </TabsContent>
                    <TabsContent value="import">
                        <ImportPanel stocktake={data} locked={locked} onChanged={refresh} />
                    </TabsContent>
                    <TabsContent value="serials">
                        <SerialsPanel stocktake={data} locked={locked} onChanged={refresh} />
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterPanel stocktake={data} locked={locked} onChanged={refresh} />
                    </TabsContent>
                    <TabsContent value="items">
                        <BcItemsPanel />
                    </TabsContent>
                    <TabsContent value="report">
                        <ReportPanel stocktake={data} />
                    </TabsContent>
                </Tabs>
            </div>
        </BaseLayout>
    )
}
