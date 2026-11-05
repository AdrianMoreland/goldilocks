import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ChevronRight, Plus } from "lucide-react"
import { features } from "@/config/features"
import { useStocktakeApi } from "@/api/stocktake.api"
import { queryKeys } from "@/lib/query-keys"
import { BaseLayout } from "@/components/layouts/base-layout"
import { StatusDot } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { sortByUrgency, statusLabel, statusTone } from "./components/status"

/** Date inputs want YYYY-MM-DD in local time; toISOString would shift a late-evening date back a day. */
const localIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/** Last day of the current month: the usual cutoff the count is reconciled to. */
const monthEnd = () => localIso(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))

/** The page frame, or nothing when the page sits inside Inventory. */
function Shell({ embedded, children }: { embedded?: boolean; children: React.ReactNode }) {
    return embedded ? <>{children}</> : <BaseLayout title="Stocktake" description="Month-end count against the Business Central Physical Inventory Journal">{children}</BaseLayout>
}

export default function StocktakeListPage({ embedded = false }: { embedded?: boolean }) {
    const api = useStocktakeApi()
    const qc = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: queryKeys.stocktake.list, queryFn: api.list })

    const [name, setName] = useState("")
    const [countDate, setCountDate] = useState(localIso(new Date()))
    const [cutoffDate, setCutoffDate] = useState(monthEnd())

    const create = useMutation({
        mutationFn: () => api.create({ name: name.trim(), countDate, cutoffDate }),
        onSuccess: () => {
            toast.success("Stocktake started")
            setName("")
            qc.invalidateQueries({ queryKey: queryKeys.stocktake.list })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) create.mutate()
    }

    // The prototype's two cards: a form to start a stocktake, and the list of them.
    if (features.redesign) {
        return (
            <Shell embedded={embedded}>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-4 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <form className="bg-card space-y-3 rounded-xl border p-4" onSubmit={submit}>
                        <div>
                            <h2 className="text-base font-semibold">New stocktake</h2>
                            <p className="text-muted-foreground text-xs">One per month, counted against the journal.</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="st-name">Name</Label>
                            <Input id="st-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="October 2026" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="st-count">Count date</Label>
                            <Input id="st-count" type="date" value={countDate} onChange={(e) => setCountDate(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="st-cutoff">Month-end cutoff</Label>
                            <Input id="st-cutoff" type="date" value={cutoffDate} onChange={(e) => setCutoffDate(e.target.value)} />
                        </div>
                        <Button type="submit" disabled={!name.trim() || create.isPending} className="cursor-pointer">
                            Create stocktake
                        </Button>
                    </form>

                    <section className="bg-card rounded-xl border" aria-label="Stocktakes">
                        <h2 className="px-4 pt-4 pb-2 text-base font-semibold">Stocktakes</h2>
                        {isLoading ? (
                            <Skeleton className="m-4 h-24" />
                        ) : !data?.length ? (
                            <p className="text-muted-foreground px-4 pb-4 text-sm">No stocktakes yet. Start one on the left, then paste the Business Central journal into it.</p>
                        ) : (
                            <ul className="divide-y">
                                {sortByUrgency(data).map((s) => (
                                    <li key={s.id}>
                                        <Link to={`/stocktake/${s.id}`} className="hover:bg-muted flex items-center justify-between gap-3 px-4 py-3">
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">{s.name}</p>
                                                <p className="text-muted-foreground font-mono text-xs tabular-nums">
                                                    Counted {s.countDate} · cutoff {s.cutoffDate}
                                                </p>
                                            </div>
                                            <span className="flex shrink-0 items-center gap-2 text-sm">
                                                <StatusDot tone={statusTone[s.status]} />
                                                {statusLabel[s.status]}
                                                <ChevronRight className="text-muted-foreground size-4" aria-hidden />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </Shell>
        )
    }

    return (
        <BaseLayout title="Stocktake" description="Month-end count against the Business Central Physical Inventory Journal">
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <form
                    className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (name.trim()) create.mutate()
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="st-name">Name</Label>
                        <Input id="st-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="October 2026" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="st-count">Count date</Label>
                        <Input id="st-count" type="date" value={countDate} onChange={(e) => setCountDate(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="st-cutoff">Month-end cutoff</Label>
                        <Input id="st-cutoff" type="date" value={cutoffDate} onChange={(e) => setCutoffDate(e.target.value)} />
                    </div>
                    <Button type="submit" disabled={!name.trim() || create.isPending} className="cursor-pointer">
                        <Plus /> Start
                    </Button>
                </form>

                {isLoading ? (
                    <Skeleton className="h-24 w-full" />
                ) : !data?.length ? (
                    <p className="text-muted-foreground text-sm">No stocktakes yet. Start one above, then paste the Business Central journal into it.</p>
                ) : (
                    <ul className="divide-y rounded-lg border">
                        {sortByUrgency(data).map((s) => (
                            <li key={s.id}>
                                <Link to={`/stocktake/${s.id}`} className="hover:bg-muted/50 flex items-center justify-between gap-3 p-4">
                                    <div>
                                        <p className="font-medium">{s.name}</p>
                                        <p className="text-muted-foreground font-mono text-xs tabular-nums">
                                            Counted {s.countDate} · cutoff {s.cutoffDate}
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-2 text-sm">
                                        <StatusDot tone={statusTone[s.status]} />
                                        {statusLabel[s.status]}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </BaseLayout>
    )
}
