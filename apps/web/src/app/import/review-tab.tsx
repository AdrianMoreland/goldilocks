import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { LINK_TYPES, type ReviewLinkRow, type SalesProduct } from "@goldilocks/shared-types"
import { useReviewApi } from "@/api/review.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountTabs } from "@/components/ui/count-tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const PAGE = 50

const LINK_LABELS: Record<string, string> = {
    trade_lot: "Sale to purchase line",
    invoice_line_trade: "Invoice line to sale",
    line_serial_bc_tracking: "Serial to BC stock",
    trade_supplier_invoice: "Sale to supplier invoice",
    stock_bar_bc_tracking: "Stock bar to BC stock",
    safe_trade: "Safe item to sale",
    serial_customer_safe: "Serial to safe item",
    serial_stock_bar: "Serial to stock bar",
    lot_supplier_invoice: "Purchase line to supplier invoice",
    bc_trade: "BC order to sale",
}

type Queue = "links" | "overallocated" | "lots" | "duplicates" | "aliases"

function Pager({ total, offset, onOffset }: { total: number; offset: number; onOffset: (n: number) => void }) {
    if (total <= PAGE) return null
    return (
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
            <span className="tabular-nums">
                {offset + 1}-{Math.min(offset + PAGE, total)} of {total.toLocaleString()}
            </span>
            <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => onOffset(Math.max(0, offset - PAGE))}>
                Previous
            </Button>
            <Button variant="outline" size="sm" disabled={offset + PAGE >= total} onClick={() => onOffset(offset + PAGE)}>
                Next
            </Button>
        </div>
    )
}

function Empty({ text }: { text: string }) {
    return <p className="text-muted-foreground py-6 text-center text-sm">{text}</p>
}

/**
 * What the import could not settle by itself. A decision here is recorded on the link or alias; it never rewrites
 * a trade, purchase line or invoice, and only admins can make one.
 */
export function ReviewTab() {
    const api = useReviewApi()
    const [queue, setQueue] = useState<Queue>("links")
    const summary = useQuery({ queryKey: ["review", "summary"], queryFn: () => api.summary() })
    const pendingLinks = Object.values(summary.data?.links ?? {}).reduce((a, b) => a + b, 0)

    return (
        <div className="space-y-4">
            <CountTabs
                aria-label="Review queues"
                value={queue}
                onValueChange={(v) => setQueue(v as Queue)}
                items={[
                    { value: "links", label: "Pending links", count: summary.data ? pendingLinks : undefined },
                    { value: "overallocated", label: "Too many sales", count: summary.data?.overAllocated },
                    { value: "lots", label: "Missing purchase lines", count: summary.data?.unresolvedLots },
                    { value: "duplicates", label: "Repeated references", count: summary.data?.duplicates },
                    { value: "aliases", label: "Product names", count: summary.data?.aliases },
                ]}
            />
            {queue === "links" && <LinksQueue counts={summary.data?.links ?? {}} />}
            {queue === "overallocated" && <OverAllocatedQueue />}
            {queue === "lots" && <LotsQueue />}
            {queue === "duplicates" && <DuplicatesQueue />}
            {queue === "aliases" && <AliasesQueue />}
        </div>
    )
}

function LinksQueue({ counts }: { counts: Record<string, number> }) {
    const api = useReviewApi()
    const queryClient = useQueryClient()
    const [type, setType] = useState<string>("")
    const [offset, setOffset] = useState(0)
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const links = useQuery({ queryKey: ["review", "links", type, offset], queryFn: () => api.links(type || undefined, PAGE, offset) })

    const settle = useMutation({
        mutationFn: () => api.settle(),
        onSuccess: (r) => {
            toast.success(`${r.confirmed} confirmed by the rules (${r.quotesInvoiced} quotes now invoiced). ${r.asked} left to ask about, ${r.overAllocated} on over-sold purchase lines.`)
            void queryClient.invalidateQueries({ queryKey: ["review"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const decide = useMutation({
        mutationFn: (v: { ids: number[]; decision: "CONFIRMED" | "REJECTED" }) => api.decide(v),
        onSuccess: (r, v) => {
            toast.success(`${r.updated} link${r.updated === 1 ? "" : "s"} ${v.decision === "CONFIRMED" ? "confirmed" : "rejected"}`)
            setSelected(new Set())
            void queryClient.invalidateQueries({ queryKey: ["review"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const toggle = (id: number) =>
        setSelected((s) => {
            const next = new Set(s)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    const rows: ReviewLinkRow[] = links.data?.rows ?? []
    const allShown = rows.length > 0 && rows.every((r) => selected.has(r.id))

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <select
                    aria-label="Link type"
                    className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value)
                        setOffset(0)
                        setSelected(new Set())
                    }}
                >
                    <option value="">All types ({Object.values(counts).reduce((a, b) => a + b, 0)})</option>
                    {LINK_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {LINK_LABELS[t]} ({counts[t] ?? 0})
                        </option>
                    ))}
                </select>
                <div className="ml-auto flex flex-wrap gap-2">
                    <Button variant="secondary" disabled={settle.isPending} onClick={() => settle.mutate()}>
                        {settle.isPending ? "Settling..." : "Settle the obvious ones"}
                    </Button>
                    <Button variant="outline" disabled={selected.size === 0 || decide.isPending} onClick={() => decide.mutate({ ids: [...selected], decision: "REJECTED" })}>
                        Reject {selected.size || ""}
                    </Button>
                    <Button disabled={selected.size === 0 || decide.isPending} onClick={() => decide.mutate({ ids: [...selected], decision: "CONFIRMED" })}>
                        Confirm {selected.size || ""}
                    </Button>
                </div>
            </div>
            <p className="text-muted-foreground text-sm">
                A sale and a purchase line that share the CPTY reference and the product, and an invoice line that matches a sale on product and quantity,
                are confirmed by the rules without asking. What is left here does not add up; the reason is shown on each.
            </p>
            <Card>
                <CardContent className="pt-6">
                    {rows.length === 0 ? (
                        <Empty text={links.isLoading ? "Loading..." : "Nothing waiting."} />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-8">
                                        <input
                                            type="checkbox"
                                            aria-label="Select all shown"
                                            checked={allShown}
                                            onChange={() => setSelected(allShown ? new Set() : new Set(rows.map((r) => r.id)))}
                                        />
                                    </TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Why it needs you</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <input type="checkbox" aria-label={`Select link ${r.id}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                                        </TableCell>
                                        <TableCell className="text-sm">{LINK_LABELS[r.linkType] ?? r.linkType}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">{r.from.label}</div>
                                            {r.from.detail && <div className="text-muted-foreground text-xs">{r.from.detail}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{r.to.label}</div>
                                            {r.to.detail && <div className="text-muted-foreground text-xs">{r.to.detail}</div>}
                                        </TableCell>
                                        <TableCell className="text-sm">{r.why ?? <span className="text-muted-foreground text-xs">{r.method.replace(/_/g, " ").toLowerCase()}</span>}</TableCell>
                                        <TableCell className="space-x-1 text-right whitespace-nowrap">
                                            <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ ids: [r.id], decision: "REJECTED" })}>
                                                Reject
                                            </Button>
                                            <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ ids: [r.id], decision: "CONFIRMED" })}>
                                                Confirm
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Pager total={links.data?.total ?? 0} offset={offset} onOffset={setOffset} />
        </div>
    )
}

function OverAllocatedQueue() {
    const api = useReviewApi()
    const [offset, setOffset] = useState(0)
    const q = useQuery({ queryKey: ["review", "overallocated", offset], queryFn: () => api.overAllocated(PAGE, offset) })
    return (
        <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
                Purchase lines that more was sold from than was bought, worst first. Nothing is confirmed or changed for these: a sale may name the wrong
                purchase line, or the purchase quantity may be wrong in the sheet. Fix it in the sheet and import that month again.
            </p>
            {!q.data?.rows.length ? (
                <Card>
                    <CardContent className="pt-6">
                        <Empty text={q.isLoading ? "Loading..." : "Nothing waiting."} />
                    </CardContent>
                </Card>
            ) : (
                q.data.rows.map((l) => (
                    <Card key={l.lotId}>
                        <CardContent className="space-y-2 pt-6">
                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                <span className="font-medium">{l.reference}</span>
                                <span className="text-sm">{l.productText}</span>
                                <span className="text-muted-foreground text-xs tabular-nums">{l.received ?? ""}</span>
                                <Badge variant="outline" className="ml-auto tabular-nums">
                                    bought {l.bought}, sold {l.sold}
                                </Badge>
                            </div>
                            <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                {l.sales.map((s) => (
                                    <span key={s.tradeId} className="tabular-nums">
                                        {s.reference} {s.qty ?? ""} {s.date ? `(${s.date})` : ""}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
            <Pager total={q.data?.total ?? 0} offset={offset} onOffset={setOffset} />
        </div>
    )
}

function LotsQueue() {
    const api = useReviewApi()
    const [offset, setOffset] = useState(0)
    const q = useQuery({ queryKey: ["review", "lots", offset], queryFn: () => api.unresolvedLots(PAGE, offset) })
    return (
        <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
                Sales whose counterparty names a purchase line that is not loaded, usually because it is older than the months imported. Load that month&apos;s
                tradesheet and they resolve on their own; nothing is decided here.
            </p>
            <Card>
                <CardContent className="pt-6">
                    {!q.data?.rows.length ? (
                        <Empty text={q.isLoading ? "Loading..." : "Nothing waiting."} />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sale</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead>Names purchase line</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {q.data.rows.map((r) => (
                                    <TableRow key={r.tradeId}>
                                        <TableCell>{r.reference}</TableCell>
                                        <TableCell className="tabular-nums">{r.date ?? ""}</TableCell>
                                        <TableCell>{r.productText}</TableCell>
                                        <TableCell className="text-right tabular-nums">{r.qty ?? ""}</TableCell>
                                        <TableCell>{r.lotKey}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Pager total={q.data?.total ?? 0} offset={offset} onOffset={setOffset} />
        </div>
    )
}

function DuplicatesQueue() {
    const api = useReviewApi()
    const [offset, setOffset] = useState(0)
    const q = useQuery({ queryKey: ["review", "duplicates", offset], queryFn: () => api.duplicates(PAGE, offset) })
    return (
        <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
                Trades that reuse an earlier reference. They are history errors in the sheets: they are kept and flagged, never merged. Fix the reference in the
                sheet and import that month again.
            </p>
            <Card>
                <CardContent className="pt-6">
                    {!q.data?.rows.length ? (
                        <Empty text={q.isLoading ? "Loading..." : "Nothing waiting."} />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead className="text-right">Use</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {q.data.rows.map((r) => (
                                    <TableRow key={r.tradeId}>
                                        <TableCell>{r.reference}</TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            <Badge variant="outline">{r.occurrence}</Badge>
                                        </TableCell>
                                        <TableCell className="tabular-nums">{r.date ?? ""}</TableCell>
                                        <TableCell>{r.productText}</TableCell>
                                        <TableCell className="text-right tabular-nums">{r.qty ?? ""}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Pager total={q.data?.total ?? 0} offset={offset} onOffset={setOffset} />
        </div>
    )
}

function AliasesQueue() {
    const api = useReviewApi()
    const queryClient = useQueryClient()
    const [offset, setOffset] = useState(0)
    const [choice, setChoice] = useState<Record<number, string>>({})
    const [creating, setCreating] = useState(false)
    const aliases = useQuery({ queryKey: ["review", "aliases", offset], queryFn: () => api.aliases(PAGE, offset) })
    const products = useQuery({ queryKey: ["review", "sales-products"], queryFn: () => api.salesProducts() })

    const map = useMutation({
        mutationFn: (v: { id: number; salesProductId: number }) => api.mapAlias(v.id, { salesProductId: v.salesProductId }),
        onSuccess: () => {
            toast.success("Product name tied")
            void queryClient.invalidateQueries({ queryKey: ["review"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <p className="text-muted-foreground max-w-2xl text-sm">
                    Product names from invoices and sheets, with the refinery found, most used first. Tie each to a specific sales product (for example 1oz
                    Valcambi bar). Each sales product belongs to one pricing product.
                </p>
                <Button className="ml-auto" variant="outline" onClick={() => setCreating(true)}>
                    New sales product
                </Button>
            </div>
            <Card>
                <CardContent className="pt-6">
                    {!aliases.data?.rows.length ? (
                        <Empty text={aliases.isLoading ? "Loading..." : "Nothing waiting."} />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name in the data</TableHead>
                                    <TableHead className="text-right">Used</TableHead>
                                    <TableHead>Sales product</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {aliases.data.rows.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>
                                            {a.alias}
                                            {a.refinery && <span className="text-muted-foreground ml-2 text-xs">{a.refinery}</span>}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">{a.uses.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <select
                                                aria-label={`Sales product for ${a.alias}`}
                                                className="border-input bg-background h-9 w-full max-w-64 rounded-md border px-2 text-sm"
                                                value={choice[a.id] ?? ""}
                                                onChange={(e) => setChoice((c) => ({ ...c, [a.id]: e.target.value }))}
                                            >
                                                <option value="">Choose...</option>
                                                {(products.data ?? []).map((p: SalesProduct) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" disabled={!choice[a.id] || map.isPending} onClick={() => map.mutate({ id: a.id, salesProductId: Number(choice[a.id]) })}>
                                                Tie
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Pager total={aliases.data?.total ?? 0} offset={offset} onOffset={setOffset} />
            <NewSalesProduct open={creating} onClose={() => setCreating(false)} />
        </div>
    )
}

function NewSalesProduct({ open, onClose }: { open: boolean; onClose: () => void }) {
    const api = useReviewApi()
    const queryClient = useQueryClient()
    const pricing = useQuery({ queryKey: ["review", "pricing-products"], queryFn: () => api.pricingProducts(), enabled: open })
    const [name, setName] = useState("")
    const [metal, setMetal] = useState<"GOLD" | "SILVER" | "PGM">("GOLD")
    const [genericNorm, setGenericNorm] = useState("")
    const [refinery, setRefinery] = useState("")
    const [pricingId, setPricingId] = useState("")

    const create = useMutation({
        mutationFn: () =>
            api.createSalesProduct({ name, metal, genericNorm, refinery: refinery || null, pricingProductId: pricingId ? Number(pricingId) : null }),
        onSuccess: () => {
            toast.success("Sales product added")
            void queryClient.invalidateQueries({ queryKey: ["review", "sales-products"] })
            setName("")
            setGenericNorm("")
            setRefinery("")
            setPricingId("")
            onClose()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New sales product</DialogTitle>
                    <DialogDescription>A specific product, such as a bar from one refinery. It belongs to one pricing product.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                    <label className="block">
                        <span className="text-muted-foreground mb-1 block">Name</span>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="1oz Valcambi Suisse bar" />
                    </label>
                    <label className="block">
                        <span className="text-muted-foreground mb-1 block">Generic name as it appears in the data</span>
                        <Input value={genericNorm} onChange={(e) => setGenericNorm(e.target.value)} placeholder="1oz bar" />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <span className="text-muted-foreground mb-1 block">Metal</span>
                            <select className="border-input bg-background h-9 w-full rounded-md border px-2" value={metal} onChange={(e) => setMetal(e.target.value as typeof metal)}>
                                <option value="GOLD">Gold</option>
                                <option value="SILVER">Silver</option>
                                <option value="PGM">Platinum or palladium</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-muted-foreground mb-1 block">Refinery (leave empty for coins)</span>
                            <Input value={refinery} onChange={(e) => setRefinery(e.target.value)} />
                        </label>
                    </div>
                    <label className="block">
                        <span className="text-muted-foreground mb-1 block">Pricing product</span>
                        <select className="border-input bg-background h-9 w-full rounded-md border px-2" value={pricingId} onChange={(e) => setPricingId(e.target.value)}>
                            <option value="">None yet</option>
                            {(pricing.data ?? []).map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={!name.trim() || !genericNorm.trim() || create.isPending} onClick={() => create.mutate()}>
                        {create.isPending ? "Adding..." : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
