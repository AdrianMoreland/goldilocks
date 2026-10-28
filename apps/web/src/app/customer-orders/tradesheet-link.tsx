import { useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { linkOrdersToTradesheet, parseSheetDate, parseTradesheetPaste, type CustomerOrder, type LinkStatus, type OrderLink } from "@goldilocks/shared-types"
import { useCustomerOrdersApi } from "@/api/customer-orders.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const statusText: Record<LinkStatus, string> = {
    EXACT: "Matches",
    REVIEW: "Check name",
    AMBIGUOUS: "Several lines",
    NONE: "Not found",
}

/**
 * Checks open customer orders against a pasted tradesheet tab, by reference and then client name. Nothing is
 * changed by matching: where the sheet says an item was collected, a person can log that as evidence, and the
 * status is still set by hand. A name that differs, or a reference on several lines, is shown for review.
 */
export function TradesheetLink({ orders, onLogged }: { orders: CustomerOrder[]; onLogged: () => void }) {
    const api = useCustomerOrdersApi()
    const [text, setText] = useState("")
    const open = useMemo(() => orders.filter((o) => o.status !== "COLLECTED"), [orders])
    const parsed = useMemo(() => (text.trim() ? parseTradesheetPaste(text) : null), [text])
    const links = useMemo(() => (parsed ? linkOrdersToTradesheet(open, parsed.lines) : []), [parsed, open])
    const byId = new Map(open.map((o) => [o.id, o]))

    const alreadyLogged = (o: CustomerOrder, link: OrderLink) => o.evidence.some((e) => e.kind === "TRADESHEET_COLLECTED" && e.reference === link.line?.reference)
    const loggable = (link: OrderLink) => {
        const o = byId.get(link.orderId)
        return !!o && !!link.line && link.sheetSaysCollected && !alreadyLogged(o, link)
    }
    const log = useMutation({
        mutationFn: async (items: OrderLink[]) => {
            for (const link of items) {
                if (!link.line) continue
                await api.addEvidence(link.orderId, {
                    kind: "TRADESHEET_COLLECTED",
                    reference: link.line.reference,
                    note: `Tradesheet row ${link.line.row}, Collected: ${link.line.collected}${link.status === "REVIEW" ? " (client name checked by hand)" : ""}`,
                    observedOn: parseSheetDate(link.line.collected ?? undefined),
                })
            }
        },
        onSuccess: (_d, items) => {
            toast.success(`${items.length} evidence entries logged. Statuses are unchanged.`)
            onLogged()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const counts = links.reduce<Record<LinkStatus, number>>((c, l) => ({ ...c, [l.status]: c[l.status] + 1 }), { EXACT: 0, REVIEW: 0, AMBIGUOUS: 0, NONE: 0 })
    const bulk = links.filter((l) => l.status === "EXACT" && loggable(l))

    return (
        <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-medium">Check open orders against a tradesheet</summary>
            <div className="mt-3 space-y-3">
                <p className="text-muted-foreground text-xs">
                    Copy one tradesheet tab (IE - Gold, IE - Silver, ES - Gold ...) including its header row and paste it here. The sheet is not changed and not stored. Orders are matched on the reference first, then the client name; a name on its own never links.
                </p>
                <Textarea rows={5} className="font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} />
                {parsed?.issues.length ? <p className="text-destructive text-sm">{parsed.issues[0]?.message}</p> : null}
                {parsed && parsed.lines.length > 0 && (
                    <>
                        <p className="text-sm">
                            {parsed.lines.length} tradesheet lines read · {open.length} open orders: {counts.EXACT} match, {counts.REVIEW} to check, {counts.AMBIGUOUS} on several lines, {counts.NONE} not found
                        </p>
                        {bulk.length > 0 && (
                            <Button size="sm" className="cursor-pointer" disabled={log.isPending} onClick={() => log.mutate(bulk)}>
                                Log "collected" evidence for {bulk.length} exact matches
                            </Button>
                        )}
                        <div className="max-h-96 overflow-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Result</TableHead>
                                        <TableHead>Tradesheet says</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {links.map((l) => {
                                        const o = byId.get(l.orderId)
                                        if (!o) return null
                                        return (
                                            <TableRow key={l.orderId} className={cn(l.status === "NONE" && "opacity-60")}>
                                                <TableCell>{o.locationCode}</TableCell>
                                                <TableCell>{o.client}</TableCell>
                                                <TableCell className="text-right tabular-nums">{o.quantity}</TableCell>
                                                <TableCell>{o.product}</TableCell>
                                                <TableCell className="font-mono text-xs">{o.reference}</TableCell>
                                                <TableCell>
                                                    <Badge variant={l.status === "EXACT" ? "secondary" : "outline"}>{statusText[l.status]}</Badge>
                                                    {l.notes.map((n) => (
                                                        <p key={n} className="text-muted-foreground mt-1 text-xs">
                                                            {n}
                                                        </p>
                                                    ))}
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {l.line ? (
                                                        <>
                                                            {l.line.client} · {l.line.quantity ?? "?"} × {l.line.product ?? "?"}
                                                            <br />
                                                            {l.line.collected ? `Collected: ${parseSheetDate(l.line.collected) ?? l.line.collected}` : "Not marked collected"}
                                                        </>
                                                    ) : l.candidates.length > 0 ? (
                                                        l.candidates.map((c) => `${c.client} (row ${c.row})`).join("; ")
                                                    ) : null}
                                                </TableCell>
                                                <TableCell>
                                                    {loggable(l) && l.status !== "AMBIGUOUS" && (
                                                        <Button size="sm" variant="outline" className="cursor-pointer" disabled={log.isPending} onClick={() => log.mutate([l])}>
                                                            {l.status === "REVIEW" ? "Confirm and log" : "Log evidence"}
                                                        </Button>
                                                    )}
                                                    {l.line && l.sheetSaysCollected && alreadyLogged(o, l) && <span className="text-muted-foreground text-xs">logged</span>}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
        </details>
    )
}
