import { useState } from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { LINK_TYPES, type MapAliasRequest, type PricingProductOption, type ReviewLinkRow, type SalesProduct } from "@goldilocks/shared-types"
import { useReviewApi } from "@/api/review.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountTabs } from "@/components/ui/count-tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

type AliasChoice = { label: string; body: MapAliasRequest }

/** Every typed word must appear somewhere in the item, in any order ("1oz bar" finds "1oz Gold Bar"). */
function matchesAllWords(value: string, search: string): number {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean)
    const hay = value.toLowerCase()
    return words.every((w) => hay.includes(w)) ? 1 : 0
}

/** Searchable picker: a pricing product, a specific sales product, or "not a product". */
function ProductPicker({
    name,
    pricing,
    specific,
    value,
    onChange,
}: {
    name: string
    pricing: PricingProductOption[]
    specific: SalesProduct[]
    value: AliasChoice | undefined
    onChange: (c: AliasChoice) => void
}) {
    const [open, setOpen] = useState(false)
    const pick = (c: AliasChoice) => {
        onChange(c)
        setOpen(false)
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} aria-label={`Product for ${name}`} className="h-8 w-full max-w-72 justify-between px-2 font-normal">
                    <span className={value ? "truncate" : "text-muted-foreground truncate"}>{value?.label ?? "Choose..."}</span>
                    <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
                <Command filter={matchesAllWords}>
                    <CommandInput placeholder="Type to search..." defaultValue="" />
                    <CommandList>
                        <CommandEmpty>No match.</CommandEmpty>
                        <CommandGroup heading="Pricing products">
                            {pricing.map((p) => (
                                <CommandItem key={`p${p.id}`} value={`pricing ${p.name} ${p.metalType}`} onSelect={() => pick({ label: p.name, body: { productId: p.id } })}>
                                    <span className="flex-1 truncate">{p.name}</span>
                                    <span className="text-muted-foreground text-xs">{p.metalType}</span>
                                    {value?.body.productId === p.id && <CheckIcon className="size-4" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Specific products">
                            {specific.map((p) => (
                                <CommandItem key={`s${p.id}`} value={`specific ${p.name}`} onSelect={() => pick({ label: p.name, body: { salesProductId: p.id } })}>
                                    <span className="flex-1 truncate">{p.name}</span>
                                    {value?.body.salesProductId === p.id && <CheckIcon className="size-4" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Other">
                            <CommandItem value="not a product fee shipment storage" onSelect={() => pick({ label: "Not a product", body: { noProduct: true } })}>
                                Not a product (fee, shipment, storage)
                                {value?.body.noProduct && <CheckIcon className="ml-auto size-4" />}
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function AliasesQueue() {
    const api = useReviewApi()
    const queryClient = useQueryClient()
    const [offset, setOffset] = useState(0)
    const [choice, setChoice] = useState<Record<number, AliasChoice>>({})
    const [creating, setCreating] = useState(false)
    const aliases = useQuery({ queryKey: ["review", "aliases", offset], queryFn: () => api.aliases(PAGE, offset) })
    const products = useQuery({ queryKey: ["review", "sales-products"], queryFn: () => api.salesProducts() })
    const pricing = useQuery({ queryKey: ["review", "pricing-products"], queryFn: () => api.pricingProducts() })

    const map = useMutation({
        mutationFn: (v: { id: number; body: MapAliasRequest }) => api.mapAlias(v.id, v.body),
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
                    Product names from invoices and sheets, with the refinery found, most used first. Tie each name to a pricing product (for example 1oz Gold
                    Bar), to a specific product (for example 1oz Valcambi bar), or mark it not a product (a fee, shipment or storage).
                </p>
                <Button className="ml-auto" variant="outline" onClick={() => setCreating(true)}>
                    New sales product
                </Button>
            </div>
            <FromBcPanel />
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
                                    <TableHead>Product</TableHead>
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
                                            <ProductPicker
                                                name={a.alias}
                                                pricing={pricing.data ?? []}
                                                specific={products.data ?? []}
                                                value={choice[a.id]}
                                                onChange={(c) => setChoice((prev) => ({ ...prev, [a.id]: c }))}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" disabled={!choice[a.id] || map.isPending} onClick={() => map.mutate({ id: a.id, body: choice[a.id].body })}>
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

/** Specific products made from the Business Central item list: preview what would be made, then make it. */
function FromBcPanel() {
    const api = useReviewApi()
    const queryClient = useQueryClient()
    const [shown, setShown] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const preview = useQuery({
        queryKey: ["review", "sales-products-from-bc"],
        queryFn: () => api.bcSalesProductsPreview(),
        enabled: shown,
        staleTime: 0,
    })
    const create = useMutation({
        mutationFn: () => api.bcSalesProductsApply({}),
        onSuccess: (r) => {
            toast.success(`${r.created} specific product${r.created === 1 ? "" : "s"} created, ${r.linked} linked to existing ones, ${r.skipped} skipped`)
            setConfirming(false)
            void queryClient.invalidateQueries({ queryKey: ["review"] })
            void queryClient.invalidateQueries({ queryKey: ["stocktake", "bc-items"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })
    const totals = preview.data?.totals

    return (
        <Card>
            <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="max-w-2xl">
                        <h3 className="text-sm font-medium">Specific products from BC</h3>
                        <p className="text-muted-foreground text-sm">
                            One specific product for each Business Central item that has a pricing product. Nothing is made until you confirm.
                        </p>
                    </div>
                    <Button className="ml-auto" variant="outline" disabled={preview.isFetching} onClick={() => (shown ? void preview.refetch() : setShown(true))}>
                        {preview.isFetching ? "Loading..." : "Preview"}
                    </Button>
                    <Button disabled={!totals?.create || create.isPending} onClick={() => setConfirming(true)}>
                        Create {totals?.create ?? 0} specific products
                    </Button>
                </div>
                {preview.error && <p className="text-destructive text-sm">{(preview.error as Error).message}</p>}
                {totals && (
                    <>
                        <p className="text-sm tabular-nums">
                            {totals.total} items: {totals.create} to create, {totals.linked} already linked, {totals.skip} skipped.
                        </p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Metal</TableHead>
                                    <TableHead>Refinery</TableHead>
                                    <TableHead>Pricing product</TableHead>
                                    <TableHead>Result</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preview.data?.rows.map((r) => (
                                    <TableRow key={r.itemNo}>
                                        <TableCell className="tabular-nums">{r.itemNo}</TableCell>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{r.metal ?? "-"}</TableCell>
                                        <TableCell>{r.refinery ?? "-"}</TableCell>
                                        <TableCell>{r.pricingProductName ?? "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant={r.action === "CREATE" ? "default" : "outline"}>{r.action === "CREATE" ? "Create" : r.action === "LINKED" ? "Linked" : "Skip"}</Badge>
                                            {r.reason && <span className="text-muted-foreground ml-2 text-xs">{r.reason}</span>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
                <Dialog open={confirming} onOpenChange={(o) => !o && setConfirming(false)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create {totals?.create ?? 0} specific products?</DialogTitle>
                            <DialogDescription>
                                Each one is tied to the pricing product of its Business Central item, and the item is linked to it. Items shown as skipped are left alone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirming(false)}>
                                Cancel
                            </Button>
                            <Button disabled={create.isPending} onClick={() => create.mutate()}>
                                {create.isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
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
