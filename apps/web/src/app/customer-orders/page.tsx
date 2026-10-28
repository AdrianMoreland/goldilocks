import { Fragment, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ChevronDown, ChevronRight } from "lucide-react"
import {
    CUSTOMER_ORDER_STATUSES,
    CUSTOMER_ORDER_STATUS_LABELS,
    EVIDENCE_KINDS,
    EVIDENCE_KIND_LABELS,
    parseCustomerOrdersPaste,
    STOCK_METALS,
    type CustomerOrder,
    type CustomerOrderStatus,
    type EvidenceKind,
    type StockMetal,
} from "@goldilocks/shared-types"
import { useCustomerOrdersApi } from "@/api/customer-orders.api"
import { queryKeys } from "@/lib/query-keys"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const select = "border-input bg-background h-9 rounded-md border px-2 text-sm"

/**
 * Goods held for customers: where each item is, from ordered to collected. Business Central stays the record of
 * the sale; this tracks custody. Collection is a status plus a log of where each claim came from (tradesheet,
 * Zoho or signed invoice, BC). Nothing here decides the paid-but-not-collected policy.
 */
export default function CustomerOrdersPage() {
    const api = useCustomerOrdersApi()
    const qc = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: queryKeys.customerOrders.list, queryFn: api.list })
    const refresh = () => {
        qc.invalidateQueries({ queryKey: queryKeys.customerOrders.list })
        qc.invalidateQueries({ queryKey: queryKeys.customerOrders.expected })
    }
    const fail = (e: Error) => toast.error(e.message)

    const [status, setStatus] = useState<CustomerOrderStatus | "ALL" | "OPEN">("OPEN")
    const [branch, setBranch] = useState("all")
    const [q, setQ] = useState("")
    const [openId, setOpenId] = useState<number | null>(null)

    const update = useMutation({
        mutationFn: ({ id, body }: { id: number; body: Parameters<typeof api.update>[1] }) => api.update(id, body),
        onSuccess: refresh,
        onError: fail,
    })

    const branches = useMemo(() => [...new Set((data ?? []).map((o) => o.locationCode))].sort(), [data])
    const rows = useMemo(() => {
        const needle = q.trim().toLowerCase()
        return (data ?? []).filter(
            (o) =>
                (status === "ALL" || (status === "OPEN" ? o.status !== "COLLECTED" : o.status === status)) &&
                (branch === "all" || o.locationCode === branch) &&
                (!needle || [o.client, o.product, o.reference, o.bcOrderNo].some((v) => v?.toLowerCase().includes(needle))),
        )
    }, [data, status, branch, q])

    return (
        <BaseLayout title="Customer orders" description="Goods held for customers, from ordered to collected">
            <div className="mx-auto w-full max-w-7xl space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <Input className="max-w-xs" placeholder="Search client, product, reference" value={q} onChange={(e) => setQ(e.target.value)} />
                    <select className={select} value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Status">
                        <option value="OPEN">Not collected</option>
                        <option value="ALL">All</option>
                        {CUSTOMER_ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {CUSTOMER_ORDER_STATUS_LABELS[s]}
                            </option>
                        ))}
                    </select>
                    <select className={select} value={branch} onChange={(e) => setBranch(e.target.value)} aria-label="Branch">
                        <option value="all">All branches</option>
                        {branches.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                    <span className="text-muted-foreground text-sm">{rows.length} items</span>
                </div>

                {isLoading ? (
                    <Skeleton className="h-40" />
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead />
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((o) => (
                                    <Fragment key={o.id}>
                                        <TableRow className={cn(o.missing && "bg-red-500/10")}>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Details and evidence" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                                                    {openId === o.id ? <ChevronDown /> : <ChevronRight />}
                                                </Button>
                                            </TableCell>
                                            <TableCell>{o.locationCode}</TableCell>
                                            <TableCell>{o.client}</TableCell>
                                            <TableCell className="text-right tabular-nums">{o.quantity}</TableCell>
                                            <TableCell>{o.product}</TableCell>
                                            <TableCell className="font-mono text-xs">{o.reference}</TableCell>
                                            <TableCell>
                                                <select
                                                    className={cn(select, "h-8")}
                                                    value={o.status}
                                                    onChange={(e) => update.mutate({ id: o.id, body: { status: e.target.value as CustomerOrderStatus } })}
                                                    aria-label={`Status of ${o.client} ${o.product}`}
                                                >
                                                    {CUSTOMER_ORDER_STATUSES.map((s) => (
                                                        <option key={s} value={s}>
                                                            {CUSTOMER_ORDER_STATUS_LABELS[s]}
                                                        </option>
                                                    ))}
                                                </select>
                                                {o.status === "COLLECTED" && o.evidence.length === 0 && <Badge variant="outline" className="ml-2">no evidence logged</Badge>}
                                            </TableCell>
                                            <TableCell className="max-w-64 truncate" title={o.notes ?? ""}>
                                                {o.notes}
                                            </TableCell>
                                        </TableRow>
                                        {openId === o.id && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="bg-muted/30">
                                                    <Details order={o} onSaved={refresh} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))}
                                {rows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-muted-foreground text-center text-sm">
                                            Nothing here. Add an item or paste the existing sheet below.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <AddForm onAdded={refresh} />
                <ImportBox onImported={refresh} />
            </div>
        </BaseLayout>
    )
}

function Details({ order, onSaved }: { order: CustomerOrder; onSaved: () => void }) {
    const api = useCustomerOrdersApi()
    const fail = (e: Error) => toast.error(e.message)
    const [kind, setKind] = useState<EvidenceKind>("SIGNED_INVOICE")
    const [ref, setRef] = useState("")
    const [note, setNote] = useState("")

    const save = useMutation({ mutationFn: (body: Parameters<typeof api.update>[1]) => api.update(order.id, body), onSuccess: onSaved, onError: fail })
    const evidence = useMutation({
        mutationFn: () => api.addEvidence(order.id, { kind, reference: ref.trim() || null, note: note.trim() || null }),
        onSuccess: () => {
            setRef("")
            setNote("")
            onSaved()
        },
        onError: fail,
    })
    const field = (label: string, key: "bcOrderNo" | "supplierRef" | "bcItemNo" | "refinery" | "serials" | "notes", wide = false) => (
        <label className={cn("space-y-1 text-xs", wide && "md:col-span-2")}>
            <span className="text-muted-foreground">{label}</span>
            <Input
                key={`${key}-${order[key] ?? ""}`}
                className="h-8"
                defaultValue={order[key] ?? ""}
                onBlur={(e) => e.target.value !== (order[key] ?? "") && save.mutate({ [key]: e.target.value || null })}
            />
        </label>
    )

    return (
        <div className="space-y-3 py-2">
            <div className="grid gap-2 md:grid-cols-4">
                {field("Business Central order", "bcOrderNo")}
                {field("Supplier order", "supplierRef")}
                {field("BC item no.", "bcItemNo")}
                {field("Refinery", "refinery")}
                {field("Serials", "serials", true)}
                {field("Notes", "notes", true)}
                <label className="flex items-center gap-2 text-sm md:col-span-4">
                    <input type="checkbox" checked={order.missing} onChange={(e) => save.mutate({ missing: e.target.checked })} /> Flagged as missing
                </label>
            </div>
            <div>
                <p className="text-sm font-medium">Where the collection claim comes from (cannot be edited, only added to)</p>
                {order.evidence.length === 0 ? (
                    <p className="text-muted-foreground text-xs">Nothing logged.</p>
                ) : (
                    <ul className="text-sm">
                        {order.evidence.map((e) => (
                            <li key={e.id}>
                                {EVIDENCE_KIND_LABELS[e.kind]}
                                {e.reference && ` · ${e.reference}`}
                                {e.note && ` · ${e.note}`} <span className="text-muted-foreground text-xs">({e.recordedBy}, {e.createdAt.slice(0, 10)})</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                    <select className={cn(select, "h-8")} value={kind} onChange={(e) => setKind(e.target.value as EvidenceKind)} aria-label="Evidence type">
                        {EVIDENCE_KINDS.map((k) => (
                            <option key={k} value={k}>
                                {EVIDENCE_KIND_LABELS[k]}
                            </option>
                        ))}
                    </select>
                    <Input className="h-8 w-44" placeholder="Reference, e.g. INV-009181" value={ref} onChange={(e) => setRef(e.target.value)} />
                    <Input className="h-8 w-64" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
                    <Button size="sm" variant="outline" className="cursor-pointer" disabled={evidence.isPending} onClick={() => evidence.mutate()}>
                        Log evidence
                    </Button>
                </div>
            </div>
        </div>
    )
}

function AddForm({ onAdded }: { onAdded: () => void }) {
    const api = useCustomerOrdersApi()
    const [f, setF] = useState({ locationCode: "", client: "", product: "", quantity: "1", reference: "", status: "ORDERED" as CustomerOrderStatus, metal: "GOLD" as StockMetal })
    const add = useMutation({
        mutationFn: () =>
            api.create({
                locationCode: f.locationCode.trim(),
                client: f.client.trim(),
                product: f.product.trim(),
                quantity: Number(f.quantity),
                reference: f.reference.trim() || null,
                status: f.status,
                metal: f.metal,
            }),
        onSuccess: () => {
            setF({ ...f, client: "", product: "", quantity: "1", reference: "" })
            onAdded()
        },
        onError: (e: Error) => toast.error(e.message),
    })
    const ok = f.locationCode.trim() && f.client.trim() && f.product.trim() && Number.isInteger(Number(f.quantity)) && Number(f.quantity) >= 1
    return (
        <form
            className="grid gap-2 rounded-lg border p-3 md:grid-cols-7"
            onSubmit={(e) => {
                e.preventDefault()
                if (ok) add.mutate()
            }}
        >
            <p className="text-sm font-medium md:col-span-7">Add an item</p>
            <Input placeholder="Branch" value={f.locationCode} onChange={(e) => setF({ ...f, locationCode: e.target.value })} />
            <Input placeholder="Client" value={f.client} onChange={(e) => setF({ ...f, client: e.target.value })} />
            <Input placeholder="Product" value={f.product} onChange={(e) => setF({ ...f, product: e.target.value })} />
            <Input type="number" min={1} placeholder="Qty" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} />
            <Input placeholder="Tradesheet reference" value={f.reference} onChange={(e) => setF({ ...f, reference: e.target.value })} />
            <select className={select} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as CustomerOrderStatus })} aria-label="Status">
                {CUSTOMER_ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                        {CUSTOMER_ORDER_STATUS_LABELS[s]}
                    </option>
                ))}
            </select>
            <Button type="submit" disabled={!ok || add.isPending} className="cursor-pointer">
                Add
            </Button>
        </form>
    )
}

function ImportBox({ onImported }: { onImported: () => void }) {
    const api = useCustomerOrdersApi()
    const [metal, setMetal] = useState<StockMetal>("GOLD")
    const [fallback, setFallback] = useState<CustomerOrderStatus | "">("")
    const [text, setText] = useState("")
    const preview = text.trim() ? parseCustomerOrdersPaste(text, fallback || null) : null
    const run = useMutation({
        mutationFn: () => api.importSheet({ metal, fallbackStatus: fallback || null, text }),
        onSuccess: (r) => {
            toast.success(`${r.added} added, ${r.skipped} already there${r.issues.length ? `, ${r.issues.length} rows rejected` : ""}`)
            if (r.issues.length === 0) setText("")
            onImported()
        },
        onError: (e: Error) => toast.error(e.message),
    })
    return (
        <div className="space-y-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Paste rows from the existing Customer Orders sheet</p>
            <p className="text-muted-foreground text-xs">
                Copy a sheet's table including its header row. One sheet at a time: pick its metal. If the sheet has no status column (such as Not bagged), pick the status for its rows. A row whose status is not recognised is rejected, not guessed. Pasting the same rows again adds nothing.
            </p>
            <div className="flex flex-wrap gap-2">
                <select className={select} value={metal} onChange={(e) => setMetal(e.target.value as StockMetal)} aria-label="Metal">
                    {STOCK_METALS.map((m) => (
                        <option key={m} value={m}>
                            {m === "PGM" ? "Platinum / palladium" : m[0] + m.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <select className={select} value={fallback} onChange={(e) => setFallback(e.target.value as CustomerOrderStatus | "")} aria-label="Status for rows without one">
                    <option value="">Status comes from the sheet</option>
                    {CUSTOMER_ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            All rows: {CUSTOMER_ORDER_STATUS_LABELS[s]}
                        </option>
                    ))}
                </select>
            </div>
            <Textarea rows={5} className="font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} />
            {preview && (
                <div className="text-sm">
                    {preview.rows.length} rows ready{preview.issues.length > 0 && <span className="text-destructive"> · {preview.issues.length} rejected</span>}
                    {preview.issues.length > 0 && (
                        <ul className="max-h-32 list-disc overflow-y-auto pl-5 text-xs">
                            {preview.issues.slice(0, 20).map((i, n) => (
                                <li key={n}>
                                    Row {i.row}: {i.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <Button size="sm" className="cursor-pointer" disabled={!preview || preview.rows.length === 0 || run.isPending} onClick={() => run.mutate()}>
                Import {preview?.rows.length ?? 0} rows
            </Button>
        </div>
    )
}
