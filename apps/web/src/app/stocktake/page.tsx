import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { useStocktakeApi } from "@/api/stocktake.api"
import { queryKeys } from "@/lib/query-keys"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { statusLabel } from "./components/status"

/** Date inputs want YYYY-MM-DD in local time; toISOString would shift a late-evening date back a day. */
const localIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/** Last day of the current month: the usual cutoff the count is reconciled to. */
const monthEnd = () => localIso(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))

export default function StocktakeListPage() {
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
                        {data.map((s) => (
                            <li key={s.id}>
                                <Link to={`/stocktake/${s.id}`} className="hover:bg-muted/50 flex items-center justify-between gap-3 p-4">
                                    <div>
                                        <p className="font-medium">{s.name}</p>
                                        <p className="text-muted-foreground text-xs">
                                            Counted {s.countDate} · cutoff {s.cutoffDate}
                                        </p>
                                    </div>
                                    <Badge variant={s.status === "FINALISED" ? "secondary" : "outline"}>{statusLabel[s.status]}</Badge>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </BaseLayout>
    )
}
