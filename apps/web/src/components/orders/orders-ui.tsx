import { useState } from "react"
import { toast } from "sonner"
import { Check, Copy } from "lucide-react"
import {
    ORDER_LIFECYCLE,
    ORDER_LIFECYCLE_LABELS,
    type OrderLifecycle,
    type OrderQueue,
    type OrderRow,
    type OrderSource,
    type OrderStep,
    type RecordStepRequest,
    type SheetTask,
} from "@goldilocks/shared-types"
import { StatusDot, type StatusTone } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const QUEUES: { id: OrderQueue | "all"; label: string; hot?: boolean }[] = [
    { id: "all", label: "All open" },
    { id: "order", label: "Needs ordering", hot: true },
    { id: "arrive", label: "Ordered, awaiting arrival" },
    { id: "alloc", label: "Needs allocating", hot: true },
    { id: "pline", label: "Hedged, no P-line" },
    { id: "nopost", label: "Collected, not posted in BC", hot: true },
    { id: "tsmark", label: "Tradesheet not marked collected" },
    { id: "bcanom", label: "BC anomalies", hot: true },
    { id: "over", label: "P-line over-allocated", hot: true },
    { id: "defer", label: "Deferred" },
    { id: "quote", label: "Quotes" },
]

export const STEP_LABELS: Record<OrderStep, string> = {
    ORDERED: "Order the whole order",
    ARRIVED: "Mark arrived",
    ALLOCATED: "Allocate",
    MATCHED: "Write the P-line",
    COLLECTED: "Mark collected",
    POSTED: "Mark posted in BC",
}

export const lifecycleTone = (l: OrderLifecycle): StatusTone => (l === "ALLOCATED" || l === "MATCHED" ? "ok" : l === "QUOTE" || l === "POSTED" ? "muted" : "warn")

/** Queue filters with counts. The ones that need action show their count in the warning colour. */
export function QueueChips({ value, counts, onChange }: { value: string; counts: Record<string, number>; onChange: (q: OrderQueue | "all") => void }) {
    return (
        <div role="group" aria-label="Action queues" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {QUEUES.map((q) => {
                const n = counts[q.id] ?? 0
                const on = value === q.id
                return (
                    <button
                        key={q.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onChange(q.id)}
                        className={cn(
                            "focus-visible:ring-ring inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2",
                            on ? "bg-foreground text-background border-foreground" : "bg-card hover:bg-muted",
                        )}
                    >
                        {q.label}
                        <span className={cn("tabular-nums", on ? "opacity-75" : q.hot && n ? "text-status-warn font-bold" : "text-muted-foreground")}>{n}</span>
                    </button>
                )
            })}
        </div>
    )
}

/** The eight stages as chips. A stage that does not apply (a supplier order has no P-line) is struck through. */
export function LifecycleChips({ lifecycle, source }: { lifecycle: OrderLifecycle; source: OrderSource }) {
    const at = ORDER_LIFECYCLE.indexOf(lifecycle)
    return (
        <ol aria-label="Lifecycle" className="flex flex-wrap gap-1.5">
            {ORDER_LIFECYCLE.map((l, i) => {
                const skipped = (source === "STOCK" && (l === "ORDERED" || l === "ARRIVED")) || (source === "SUPPLIER" && l === "MATCHED")
                return (
                    <li
                        key={l}
                        aria-current={i === at ? "step" : undefined}
                        className={cn(
                            "rounded-full border px-2.5 py-0.5 text-xs",
                            skipped && "text-muted-foreground line-through opacity-50",
                            !skipped && i < at && "bg-primary/15 border-transparent",
                            i === at && "bg-primary text-primary-foreground border-primary font-semibold",
                            !skipped && i > at && "text-muted-foreground",
                        )}
                    >
                        {ORDER_LIFECYCLE_LABELS[l]}
                    </li>
                )
            })}
        </ol>
    )
}

/** Seven small segments for a table row. */
export function MiniProgress({ row }: { row: OrderRow }) {
    const at = ORDER_LIFECYCLE.indexOf(row.lifecycle)
    return (
        <span className="inline-flex items-center gap-0.5" aria-hidden>
            {ORDER_LIFECYCLE.slice(1).map((l, i) => {
                const idx = i + 1
                const skipped = (row.source === "STOCK" && (l === "ORDERED" || l === "ARRIVED")) || (row.source === "SUPPLIER" && l === "MATCHED")
                return <i key={l} className={cn("h-1.5 w-2.5 rounded-sm", skipped ? "border border-dashed" : idx < at ? "bg-primary" : idx === at ? "bg-primary ring-primary/35 ring-2" : "bg-muted-foreground/25")} />
            })}
        </span>
    )
}

export function LifecycleLabel({ row }: { row: OrderRow }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs">
            <StatusDot tone={lifecycleTone(row.lifecycle)} />
            {ORDER_LIFECYCLE_LABELS[row.lifecycle]}
        </span>
    )
}

export async function copyText(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        toast.success("Copied")
    } catch {
        toast.error("Select the text and copy it")
    }
}

/** A value to paste into a sheet, with a Copy button. */
export function CopyBlock({ value }: { value: string }) {
    return (
        <div className="bg-muted flex items-start gap-2 rounded-lg py-1.5 pr-1.5 pl-2.5 font-mono text-xs">
            <code className="min-w-0 flex-1 break-words whitespace-pre-wrap">{value}</code>
            <Button type="button" size="sm" variant="outline" className="h-6 shrink-0 px-2 text-xs" onClick={() => copyText(value)}>
                <Copy className="size-3" /> Copy
            </Button>
        </div>
    )
}

export function TaskRow({ task, showOrder, onDone, busy }: { task: SheetTask; showOrder?: boolean; onDone?: (id: number) => void; busy?: boolean }) {
    const done = task.status === "DONE"
    return (
        <div className={cn("flex gap-3 border-b py-3 last:border-b-0", done && "opacity-70")}>
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border", done ? "bg-status-ok border-status-ok text-white" : "border-muted-foreground")} aria-hidden>
                {done && <Check className="size-3.5" />}
            </span>
            <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-sm font-medium">
                    {task.sheet}: {task.what}
                    {showOrder && (
                        <span className="text-muted-foreground ml-2 text-xs font-normal">
                            {task.client} · <span className="font-mono">{task.reference}</span>
                        </span>
                    )}
                </p>
                <CopyBlock value={task.value} />
                <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                    {done ? (task.closedVia === "IMPORT" ? "Closed by an import that shows it" : `Marked done by ${task.closedBy}`) : "Open. Closes itself when an import shows the change."}
                    {!done && onDone && (
                        <Button type="button" size="sm" variant="outline" className="h-6 px-2 text-xs" disabled={busy} onClick={() => onDone(task.id)}>
                            Done in the sheet
                        </Button>
                    )}
                </p>
            </div>
        </div>
    )
}

/** The few details a step needs. Allocating and writing a P-line both ask for what goes in the sheets. */
export function StepDialog({ step, row, open, onClose, onConfirm, busy }: { step: OrderStep | null; row: OrderRow | null; open: boolean; onClose: () => void; onConfirm: (step: OrderStep, body: RecordStepRequest) => void; busy: boolean }) {
    const [f, setF] = useState({ supplierInvoice: "", serials: "", stockChange: "", pline: "", soldComment: "", note: "" })
    if (!step || !row) return null
    const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))
    const submit = () => {
        const body: RecordStepRequest = {}
        if (f.supplierInvoice.trim()) body.supplierInvoice = f.supplierInvoice.trim()
        if (f.serials.trim()) body.serials = f.serials.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
        if (f.stockChange.trim()) body.stockChange = f.stockChange.trim()
        if (f.pline.trim()) body.pline = f.pline.trim()
        if (f.soldComment.trim()) body.soldComment = f.soldComment.trim()
        if (f.note.trim()) body.note = f.note.trim()
        onConfirm(step, body)
    }
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{STEP_LABELS[step]}</DialogTitle>
                    <DialogDescription>
                        {row.client} · {row.qty ?? ""} × {row.product} · <span className="font-mono">{row.reference}</span>. Goldilocks writes nothing to your sheets: this records the step and leaves the sheet changes as tasks.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                    {step === "ORDERED" && <Input placeholder="Supplier invoice number, for example StoneX #511411" value={f.supplierInvoice} onChange={set("supplierInvoice")} aria-label="Supplier invoice" />}
                    {step === "ALLOCATED" && (
                        <>
                            <Textarea placeholder="Serial numbers (bars), separated by commas" value={f.serials} onChange={set("serials")} aria-label="Serial numbers" rows={2} />
                            <Input placeholder="Stock sheet change, for example Coins: 1oz Krugerrand 42 -> 37" value={f.stockChange} onChange={set("stockChange")} aria-label="Stock sheet change" />
                        </>
                    )}
                    {step === "MATCHED" && (
                        <>
                            <Input placeholder="P-line, for example DU-GP20261028" value={f.pline} onChange={set("pline")} aria-label="P-line" />
                            <Input placeholder='Running "N sold" for its Comments, for example 7 sold' value={f.soldComment} onChange={set("soldComment")} aria-label="Sold comment" />
                        </>
                    )}
                    <Input placeholder="Note (optional)" value={f.note} onChange={set("note")} aria-label="Note" />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={submit} disabled={busy}>
                        {STEP_LABELS[step]}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
