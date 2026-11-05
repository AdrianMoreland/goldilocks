import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ORDER_LIFECYCLE_LABELS, type OrderLifecycle, type OrderQueue, type OrderRow, type OrderStep, type RecordStepRequest } from "@goldilocks/shared-types"
import { useOrdersApi } from "@/api/orders.api"
import { queryKeys } from "@/lib/query-keys"
import { useMediaQuery } from "@/hooks/use-media-query.hook"
import { BaseLayout } from "@/components/layouts/base-layout"
import { CloseDayDialog } from "@/components/orders/close-day-dialog"
import { OrderPanel } from "@/components/orders/order-panel"
import { LifecycleLabel, MiniProgress, QueueChips, StepDialog, TaskRow } from "@/components/orders/orders-ui"
import { Button } from "@/components/ui/button"
import { CountTabs } from "@/components/ui/count-tabs"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Tab = "orders" | "board" | "tasks" | "suppliers"
const BOARD: OrderLifecycle[] = ["PAID", "ORDERED", "ARRIVED", "ALLOCATED", "MATCHED", "COLLECTED"]
const eur = (n: number | null) => (n === null ? "" : `€${Math.round(n).toLocaleString("en-IE")}`)

/**
 * Every order from quote to collection, and what needs doing next. The tradesheet stays the source of truth: steps
 * recorded here never change it, and each one that affects a sheet leaves a task with the exact value to paste.
 */
export default function OrdersPage() {
    const api = useOrdersApi()
    const qc = useQueryClient()
    const wide = useMediaQuery("(min-width: 1100px)")
    const [tab, setTab] = useState<Tab>("orders")
    const [queue, setQueue] = useState<OrderQueue | "all">("all")
    const [q, setQ] = useState("")
    const dq = useDeferredValue(q)
    const [sel, setSel] = useState<number | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [step, setStep] = useState<OrderStep | null>(null)
    const [closeOpen, setCloseOpen] = useState(false)
    const search = useRef<HTMLInputElement>(null)

    const list = useQuery({ queryKey: queryKeys.orders.list(queue, dq), queryFn: () => api.list({ queue, q: dq }), refetchInterval: 60_000 })
    const tasks = useQuery({ queryKey: queryKeys.orders.tasks("OPEN"), queryFn: () => api.tasks("OPEN"), enabled: tab === "tasks" || closeOpen })
    const handover = useQuery({ queryKey: queryKeys.orders.handover, queryFn: api.handover })
    const all = useQuery({ queryKey: queryKeys.orders.list("all", ""), queryFn: () => api.list({ queue: "all" }), enabled: tab === "board" || tab === "suppliers" })

    const rows = useMemo(() => list.data?.rows ?? [], [list.data])
    const counts = list.data?.counts ?? {}
    const openTasks = list.data?.openTasks ?? 0
    const selected = sel ?? (wide && tab === "orders" ? (rows[0]?.id ?? null) : null)
    const selectedRow = rows.find((r) => r.id === selected) ?? all.data?.rows.find((r) => r.id === selected) ?? null

    const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.orders.all })
    const fail = (e: Error) => toast.error(e.message)
    const record = useMutation({
        mutationFn: ({ id, s, body }: { id: number; s: OrderStep; body: RecordStepRequest }) => api.recordStep(id, s, body),
        onSuccess: (d) => {
            toast.success(d.openTasks ? `Recorded. ${d.openTasks} sheet task${d.openTasks > 1 ? "s" : ""} open for this order.` : "Recorded.")
            setStep(null)
            refresh()
        },
        onError: fail,
    })
    const done = useMutation({ mutationFn: (id: number) => api.completeTask(id), onSuccess: refresh, onError: fail })
    const reconcile = useMutation({
        mutationFn: api.reconcile,
        onSuccess: (r) => {
            toast.success(r.closed ? `${r.closed} of ${r.checked} sheet tasks closed: the imported trades show them done.` : `Checked ${r.checked} open tasks: none show as done yet.`)
            refresh()
        },
        onError: fail,
    })
    const saveHandover = useMutation({
        mutationFn: (note: string) => api.saveHandover(note),
        onSuccess: () => {
            toast.success("Handover saved. The day is closed.")
            setCloseOpen(false)
            qc.invalidateQueries({ queryKey: queryKeys.orders.handover })
        },
        onError: fail,
    })

    const openRow = (r: OrderRow) => {
        setSel(r.id)
        setSheetOpen(true)
    }
    const askStep = (s: OrderStep) => setStep(s)

    // Keyboard first: j / k move, Enter opens, a does the next action, / searches.
    useEffect(() => {
        if (tab !== "orders") return
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement
            if (e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || step || closeOpen) return
            const i = rows.findIndex((r) => r.id === selected)
            if (e.key === "j" || e.key === "ArrowDown") {
                e.preventDefault()
                const n = rows[Math.min(rows.length - 1, i + 1)]
                if (n) setSel(n.id)
            } else if (e.key === "k" || e.key === "ArrowUp") {
                e.preventDefault()
                const n = rows[Math.max(0, i - 1)]
                if (n) setSel(n.id)
            } else if (e.key === "Enter" && i >= 0) setSheetOpen(true)
            else if (e.key === "a" && i >= 0 && rows[i].nextAction.step) {
                e.preventDefault()
                setStep(rows[i].nextAction.step)
            }
            else if (e.key === "/") {
                e.preventDefault()
                search.current?.focus()
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [tab, rows, selected, step, closeOpen])

    const closeItems = [
        { label: "Sheet updates still open", count: openTasks, open: () => setTab("tasks") },
        { label: "Paid orders not yet allocated or ordered", count: (counts.alloc ?? 0) + (counts.order ?? 0), open: () => { setTab("orders"); setQueue("alloc") } },
        { label: "Collected, not posted in BC", count: counts.nopost ?? 0, open: () => { setTab("orders"); setQueue("nopost") } },
        { label: "Tradesheet not marked collected", count: counts.tsmark ?? 0, open: () => { setTab("orders"); setQueue("tsmark") } },
    ]
    const note = handover.data?.handover

    return (
        <BaseLayout title="Orders" description="Every order from quote to collection, and what needs doing next">
            <div className="space-y-3 px-4 lg:px-6">
                <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm">
                    <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground text-xs">{note ? `Handover from ${note.by} · ${new Date(note.createdAt).toLocaleString("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : "No handover note yet"}</p>
                        {note && <p className="line-clamp-2">{note.note}</p>}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setCloseOpen(true)}>
                        Close the day
                    </Button>
                </div>

                <CountTabs
                    aria-label="Orders views"
                    value={tab}
                    onValueChange={(v) => setTab(v as Tab)}
                    items={[
                        { value: "orders", label: "Orders" },
                        { value: "board", label: "Board" },
                        { value: "tasks", label: "Sheet updates", count: openTasks },
                        { value: "suppliers", label: "Supplier orders" },
                    ]}
                />

                {list.isError ? (
                    <div className="bg-card rounded-xl border p-6 text-center text-sm">
                        <b className="block">The orders service is not available on this API yet</b>
                        <span className="text-muted-foreground">It arrives with the next API update. Nothing else is affected.</span>
                    </div>
                ) : (
                    <>
                        {tab === "orders" && (
                            <>
                                <QueueChips value={queue} counts={counts} onChange={setQueue} />
                                <div className="flex flex-wrap items-center gap-3">
                                    <Input ref={search} className="max-w-sm min-w-56 flex-1" type="search" placeholder="Search customer, product, reference  ( / )" aria-label="Search orders" value={q} onChange={(e) => setQ(e.target.value)} />
                                    <span className="text-muted-foreground text-xs tabular-nums">{rows.length} shown · {counts.all ?? 0} open</span>
                                    <span className="text-muted-foreground hidden text-xs md:inline">j / k move · a next action · / search</span>
                                </div>
                                <div className={cn(wide && selected !== null ? "grid grid-cols-[minmax(0,1fr)_28rem] items-start gap-4" : "")}>
                                    <OrdersTable rows={rows} loading={list.isLoading} selected={selected} wide={wide && selected !== null} onOpen={openRow} />
                                    {wide && selected !== null && (
                                        <aside aria-label="Order" className="bg-card sticky top-0 max-h-[calc(100svh-12rem)] overflow-auto rounded-xl border">
                                            <OrderPanel id={selected} onStep={askStep} onTaskDone={(id) => done.mutate(id)} busy={record.isPending || done.isPending} />
                                        </aside>
                                    )}
                                </div>
                            </>
                        )}
                        {tab === "board" && <Board rows={all.data?.rows ?? []} onOpen={(r, target) => {
                            if (r.nextAction.step && target === nextLifecycle(r)) {
                                setSel(r.id)
                                setSheetOpen(true)
                                setStep(r.nextAction.step)
                            } else toast.message(`This order goes to ${nextLifecycle(r) ? ORDER_LIFECYCLE_LABELS[nextLifecycle(r)!] : "no further stage"} next. It cannot jump to ${ORDER_LIFECYCLE_LABELS[target]}.`)
                        }} onView={openRow} />}
                        {tab === "tasks" && (
                            <section className="bg-card rounded-xl border px-4 py-2">
                                <div className="flex flex-wrap items-center justify-between gap-2 py-2">
                                    <p className="text-muted-foreground max-w-2xl text-xs">Goldilocks never edits your sheets. Every change that affects one creates a task here with the exact value. A task closes itself when an import shows the change, and until then it is handed over at the end of the day.</p>
                                    <Button size="sm" variant="outline" disabled={reconcile.isPending} onClick={() => reconcile.mutate()}>
                                        Check imports now
                                    </Button>
                                </div>
                                {tasks.isLoading ? <Skeleton className="h-24 w-full" /> : tasks.data?.length ? tasks.data.map((t) => <TaskRow key={t.id} task={t} showOrder onDone={(id) => done.mutate(id)} busy={done.isPending} />) : <p className="py-6 text-center text-sm"><b className="block">Every sheet is up to date</b><span className="text-muted-foreground text-xs">Nothing to paste.</span></p>}
                            </section>
                        )}
                        {tab === "suppliers" && <Suppliers rows={all.data?.rows ?? []} busy={record.isPending} onArrived={async (ids) => {
                            await Promise.all(ids.map((id) => api.recordStep(id, "ARRIVED", {}).catch(fail)))
                            toast.success(`Marked arrived: ${ids.length} order${ids.length > 1 ? "s" : ""} can now be allocated.`)
                            refresh()
                        }} />}
                    </>
                )}
            </div>

            {!wide && (
                <Sheet open={sheetOpen && selected !== null} onOpenChange={setSheetOpen}>
                    <SheetContent side="bottom" className="h-[85svh] overflow-auto p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Order</SheetTitle>
                        </SheetHeader>
                        {selected !== null && <OrderPanel id={selected} onStep={askStep} onTaskDone={(id) => done.mutate(id)} busy={record.isPending || done.isPending} />}
                    </SheetContent>
                </Sheet>
            )}
            <StepDialog key={`${selected}-${step}`} step={step} row={selectedRow} open={step !== null} onClose={() => setStep(null)} busy={record.isPending} onConfirm={(s, body) => selected !== null && record.mutate({ id: selected, s, body })} />
            <CloseDayDialog items={closeItems} open={closeOpen} onClose={() => setCloseOpen(false)} busy={saveHandover.isPending} onSave={(n) => saveHandover.mutate(n)} />
        </BaseLayout>
    )
}

const NEXT: Partial<Record<OrderStep, OrderLifecycle>> = { ORDERED: "ORDERED", ARRIVED: "ARRIVED", ALLOCATED: "ALLOCATED", MATCHED: "MATCHED", COLLECTED: "COLLECTED", POSTED: "POSTED" }
const nextLifecycle = (r: OrderRow): OrderLifecycle | null => (r.nextAction.step ? (NEXT[r.nextAction.step] ?? null) : null)

function OrdersTable({ rows, loading, selected, wide, onOpen }: { rows: OrderRow[]; loading: boolean; selected: number | null; wide: boolean; onOpen: (r: OrderRow) => void }) {
    if (loading) return <Skeleton className="h-64 w-full" />
    return (
        <div className="bg-card overflow-auto rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        {!wide && <TableHead className="hidden md:table-cell">Order</TableHead>}
                        {!wide && <TableHead className="hidden md:table-cell">Progress</TableHead>}
                        <TableHead>Next action</TableHead>
                        {!wide && <TableHead className="hidden xl:table-cell">CPTY</TableHead>}
                        {!wide && <TableHead className="hidden text-right xl:table-cell">Amount</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.id} data-state={r.id === selected ? "selected" : undefined} className="cursor-pointer" onClick={() => onOpen(r)}>
                            <TableCell className="font-medium">
                                {r.client}
                                <span className="text-muted-foreground block font-mono text-xs font-normal">{r.reference}</span>
                                <span className={cn("text-muted-foreground block text-xs font-normal", !wide && "md:hidden")}>{r.qty ?? ""} × {r.product}</span>
                            </TableCell>
                            {!wide && <TableCell className="hidden md:table-cell">{r.qty ?? ""} × {r.product}</TableCell>}
                            {!wide && (
                                <TableCell className="hidden md:table-cell">
                                    <MiniProgress row={r} />
                                    <span className="block"><LifecycleLabel row={r} /></span>
                                </TableCell>
                            )}
                            <TableCell className="whitespace-normal">
                                {r.nextAction.label}
                                <span className={cn("block", !wide && "md:hidden")}><LifecycleLabel row={r} /></span>
                                {r.nextAction.who && <span className="bg-muted text-muted-foreground mt-0.5 inline-block rounded px-1.5 text-[11px]">{r.nextAction.who === "broker" ? "Broker" : "Manager"}</span>}
                            </TableCell>
                            {!wide && <TableCell className="text-muted-foreground hidden font-mono text-xs xl:table-cell">{r.cpty ?? "empty"}</TableCell>}
                            {!wide && <TableCell className="hidden text-right tabular-nums xl:table-cell">{eur(r.amount)}</TableCell>}
                        </TableRow>
                    ))}
                    {!rows.length && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-muted-foreground py-10 text-center">
                                <b className="text-foreground block">Nothing in this queue</b>
                                <span className="text-xs">Pick another queue or clear the search.</span>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

function Board({ rows, onOpen, onView }: { rows: OrderRow[]; onOpen: (r: OrderRow, target: OrderLifecycle) => void; onView: (r: OrderRow) => void }) {
    const [over, setOver] = useState<OrderLifecycle | null>(null)
    return (
        <>
            <p className="text-muted-foreground text-xs">Drag a card to its next column to open that step. Nothing moves on its own: the step is completed in a dialog, and any sheet changes become tasks.</p>
            <div className="grid auto-cols-[minmax(14rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2">
                {BOARD.map((c) => {
                    const li = rows.filter((r) => r.lifecycle === c)
                    return (
                        <div
                            key={c}
                            className={cn("bg-muted min-h-36 rounded-xl p-2.5", over === c && "outline-primary outline-2 -outline-offset-2 outline-dashed")}
                            onDragOver={(e) => { e.preventDefault(); setOver(c) }}
                            onDragLeave={() => setOver(null)}
                            onDrop={(e) => {
                                e.preventDefault()
                                setOver(null)
                                const r = rows.find((x) => x.id === Number(e.dataTransfer.getData("text/plain")))
                                if (r && r.lifecycle !== c) onOpen(r, c)
                            }}
                        >
                            <h4 className="text-muted-foreground mb-1.5 flex justify-between text-xs font-semibold tracking-wide uppercase">
                                {ORDER_LIFECYCLE_LABELS[c]}
                                <span className="tabular-nums">{li.length}</span>
                            </h4>
                            {li.map((r) => (
                                <button key={r.id} type="button" draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(r.id)); e.dataTransfer.effectAllowed = "move" }} onClick={() => onView(r)} className="bg-card hover:border-muted-foreground/40 mt-2 block w-full cursor-grab rounded-xl border p-2.5 text-left">
                                    <b className="text-sm font-semibold">{r.client}</b>
                                    <span className="text-muted-foreground block text-xs">{r.qty ?? ""} × {r.product}</span>
                                    <span className="mt-1.5 block text-xs">{r.nextAction.label}</span>
                                </button>
                            ))}
                            {!li.length && <p className="text-muted-foreground py-2 text-xs">Nothing here</p>}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

/** Orders grouped by supplier invoice: one delivery often covers several customers, so mark it arrived once. */
function Suppliers({ rows, busy, onArrived }: { rows: OrderRow[]; busy: boolean; onArrived: (ids: number[]) => void }) {
    const groups = useMemo(() => {
        const m = new Map<string, OrderRow[]>()
        for (const r of rows) if (r.supplierInvoice) m.set(r.supplierInvoice, [...(m.get(r.supplierInvoice) ?? []), r])
        return [...m.entries()]
    }, [rows])
    return (
        <section className="bg-card rounded-xl border px-4 py-1">
            <p className="text-muted-foreground py-2 text-xs">One supplier invoice often covers several customers. Mark the delivery arrived once and every order on it moves to Arrived.</p>
            {groups.map(([inv, os]) => {
                const waiting = os.filter((o) => o.lifecycle === "ORDERED")
                return (
                    <div key={inv} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 text-sm">
                        <span className="min-w-56 flex-1">
                            <b className="font-medium">{inv}</b>
                            <span className="text-muted-foreground block text-xs">{os.map((o) => `${o.client} · ${o.qty ?? ""} × ${o.product}`).join("; ")}</span>
                        </span>
                        {waiting.length ? (
                            <Button size="sm" disabled={busy} onClick={() => onArrived(waiting.map((o) => o.id))}>
                                Mark arrived ({waiting.length} order{waiting.length > 1 ? "s" : ""})
                            </Button>
                        ) : (
                            <span className="text-muted-foreground text-xs">Arrived</span>
                        )}
                    </div>
                )
            })}
            {!groups.length && <p className="text-muted-foreground py-8 text-center text-sm">No supplier orders in the open set.</p>}
        </section>
    )
}
