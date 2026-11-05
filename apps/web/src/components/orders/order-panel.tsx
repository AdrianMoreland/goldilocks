import { useQuery } from "@tanstack/react-query"
import { ClipboardCheck } from "lucide-react"
import { sheetTasksForStep, type OrderDetail, type OrderStep } from "@goldilocks/shared-types"
import { useOrdersApi } from "@/api/orders.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LifecycleChips, STEP_LABELS, TaskRow } from "./orders-ui"

const eur = (n: number | null) => (n === null ? "" : `€${Math.round(n).toLocaleString("en-IE")}`)
const when = (iso: string) => new Date(iso).toLocaleString("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

/** One order: where it is, what to do next, the sheet changes it needs, and what has been done. */
export function OrderPanel({ id, onStep, onTaskDone, busy }: { id: number; onStep: (step: OrderStep) => void; onTaskDone: (taskId: number) => void; busy: boolean }) {
    const api = useOrdersApi()
    const { data: o, isLoading, isError } = useQuery({ queryKey: queryKeys.orders.detail(id), queryFn: () => api.get(id) })
    if (isLoading) return <Skeleton className="h-64 w-full" />
    if (isError || !o) return <p className="text-muted-foreground p-4 text-sm">This order could not be loaded.</p>
    return <PanelBody o={o} onStep={onStep} onTaskDone={onTaskDone} busy={busy} />
}

function PanelBody({ o, onStep, onTaskDone, busy }: { o: OrderDetail; onStep: (s: OrderStep) => void; onTaskDone: (id: number) => void; busy: boolean }) {
    const next = o.nextAction
    const preview = next.step ? sheetTasksForStep(next.step, { client: o.client, reference: o.reference, product: o.product, qty: o.qty }) : []
    const others = o.allowedSteps.filter((s) => s !== next.step)
    return (
        <div className="space-y-4 p-4">
            <div>
                <p className="text-base font-semibold">{o.client}</p>
                <p className="text-muted-foreground text-xs">
                    <span className="font-mono">{o.reference}</span> · {o.qty ?? ""} × {o.product} {o.amount !== null && <>· {eur(o.amount)}</>}
                </p>
            </div>
            <LifecycleChips lifecycle={o.lifecycle} source={o.source} />
            <p className="text-muted-foreground text-xs">
                {o.source === "STOCK" && "Filled from stock: Ordered and Arrived do not apply."}
                {o.source === "SUPPLIER" && "Filled from a supplier order: the supplier invoice number is the link, so no P-line. It reads Ordered until the delivery is marked arrived."}
                {o.source === "UNDECIDED" && "Not allocated and not ordered yet."}
                {o.source === "NEEDS_ORDER" && "Nothing here yet: the whole order is ordered."}
            </p>
            <div className="bg-card-raised rounded-xl border p-3">
                <p className="text-muted-foreground text-xs">Next action</p>
                <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2">
                    <b className="text-sm font-semibold">{next.label}</b>
                    {next.step && (
                        <Button size="sm" disabled={busy} onClick={() => onStep(next.step!)}>
                            {STEP_LABELS[next.step]}
                        </Button>
                    )}
                </div>
                {others.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {others.map((s) => (
                            <Button key={s} size="sm" variant="outline" disabled={busy} onClick={() => onStep(s)}>
                                {STEP_LABELS[s]}
                            </Button>
                        ))}
                    </div>
                )}
                {next.who && <p className="text-muted-foreground mt-2 text-xs">Done by a {next.who}.</p>}
                {preview.length > 0 && (
                    <p className="text-muted-foreground mt-2 flex items-start gap-1.5 text-xs">
                        <ClipboardCheck className="mt-0.5 size-3.5 shrink-0" />
                        Doing this creates {preview.length} sheet task{preview.length > 1 ? "s" : ""}: {preview.map((p) => p.sheet).join(", ")}.
                    </p>
                )}
            </div>
            <section>
                <h3 className="text-sm font-semibold">Sheet updates</h3>
                <p className="text-muted-foreground text-xs">Goldilocks never edits your sheets. Each change leaves a task with the exact value to paste.</p>
                {o.tasks.length ? o.tasks.map((t) => <TaskRow key={t.id} task={t} onDone={onTaskDone} busy={busy} />) : <p className="text-muted-foreground py-3 text-xs">No sheet changes yet for this order.</p>}
            </section>
            <section>
                <h3 className="text-sm font-semibold">What has been done</h3>
                {o.events.length ? (
                    <ul className="mt-1 divide-y">
                        {o.events.map((e) => (
                            <li key={e.id} className="flex justify-between gap-2 py-1.5 text-xs">
                                <span>
                                    <b className="font-medium">{STEP_LABELS[e.step]}</b> <span className="text-muted-foreground">by {e.by}</span>
                                    {e.note && <span className="text-muted-foreground"> · {e.note}</span>}
                                </span>
                                <span className="text-muted-foreground shrink-0">{when(e.at)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground py-1 text-xs">Nothing recorded in Goldilocks yet. The tradesheet decides the rest.</p>
                )}
            </section>
            {o.notes && <p className="text-muted-foreground text-xs">Tradesheet note: {o.notes}</p>}
        </div>
    )
}
