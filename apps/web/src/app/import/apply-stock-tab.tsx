import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ResolveSheetApplicationRequest, SheetApplyItem } from "@goldilocks/shared-types"
import { useLiveStockApi } from "@/api/live-stock.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SKIP_TEXT: Record<string, string> = {
    CUTOVER: "dated on or before the cut-over (already in the baseline)",
    NO_BRANCH: "for a branch with no baseline yet",
    NO_DATE: "with no date",
    NO_QTY: "with no quantity",
    DISMISSED: "set aside by a person",
    PENDING: "waiting for a decision",
    UNCHANGED: "already applied, nothing new",
}

const change = (n: number) => (n > 0 ? `+${n}` : String(n))

/**
 * Moves live stock by the committed tradesheet rows. Shows exactly what will change first; each row applies once, so
 * running it again (after every upload, or every few minutes) never subtracts a sale twice. Anything that cannot be
 * decided safely waits below for a person to settle.
 */
export function ApplyStockTab() {
    const api = useLiveStockApi()
    const qc = useQueryClient()
    const preview = useQuery({ queryKey: [...queryKeys.liveStock.all, "sheet"], queryFn: api.sheetPreview })
    const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.liveStock.all })

    const apply = useMutation({
        mutationFn: api.sheetApply,
        onSuccess: (r) => {
            toast.success(`Applied ${r.applied} rows (${r.units} items)${r.waiting ? `, ${r.waiting} waiting for you` : ""}`)
            if (r.failed.length) toast.error(`${r.failed.length} rows failed: ${r.failed[0]?.message}`)
        },
        onError: (e: Error) => toast.error(e.message),
        onSettled: refresh,
    })
    const resolve = useMutation({
        mutationFn: (v: { id: number; body: ResolveSheetApplicationRequest }) => api.sheetResolve(v.id, v.body),
        onSuccess: () => toast.success("Saved"),
        onError: (e: Error) => toast.error(e.message),
        onSettled: refresh,
    })

    if (preview.isLoading) return <Skeleton className="h-48 w-full" />
    if (preview.isError)
        return (
            <p className="text-destructive text-sm">
                {(preview.error as Error).message}
            </p>
        )
    const p = preview.data
    if (!p) return null
    const cutovers = Object.entries(p.cutovers)
        .map(([b, d]) => `${b} ${d ?? "no baseline"}`)
        .join(" · ")
    const skipped = Object.entries(p.skipped).filter(([, n]) => n > 0)
    const toApply = p.willApply.length
    const toAsk = p.needsDecision.length

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-muted-foreground text-sm">
                    Only P-line sales and purchases count. Cut-overs: {cutovers}.
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11" onClick={() => void preview.refetch()} disabled={preview.isFetching}>
                        Check again
                    </Button>
                    <Button className="h-11" disabled={apply.isPending || (toApply === 0 && toAsk === 0)} onClick={() => apply.mutate()}>
                        {apply.isPending ? "Applying..." : `Apply ${toApply} row${toApply === 1 ? "" : "s"} to stock`}
                    </Button>
                </div>
            </div>

            <Section title="Will change stock" count={toApply} empty="Nothing new to apply.">
                {p.willApply.map((i) => (
                    <Row key={i.key} item={i} />
                ))}
            </Section>

            {toAsk > 0 && (
                <Section title="Will need your decision after applying" count={toAsk} empty="">
                    {p.needsDecision.map((i) => (
                        <Row key={i.key} item={i} note />
                    ))}
                </Section>
            )}

            <Section title="Waiting for a decision" count={p.pending.length} empty="Nothing is waiting.">
                {p.pending.map((i) => (
                    <PendingRow key={i.key} item={i} busy={resolve.isPending} onResolve={(body) => i.applicationId !== null && resolve.mutate({ id: i.applicationId, body })} />
                ))}
            </Section>

            {skipped.length > 0 && (
                <p className="text-muted-foreground text-xs">
                    Left alone: {skipped.map(([k, n]) => `${n} ${SKIP_TEXT[k] ?? k.toLowerCase()}`).join("; ")}.
                </p>
            )}
        </div>
    )
}

function Section({ title, count, empty, children }: { title: string; count: number; empty: string; children: React.ReactNode }) {
    return (
        <Card className="gap-0 py-0">
            <CardHeader className="flex flex-row items-baseline justify-between border-b px-4 py-3">
                <CardTitle className="text-base">{title}</CardTitle>
                <span className="text-lg font-semibold tabular-nums">{count}</span>
            </CardHeader>
            <CardContent className="divide-y px-4 py-1">{count === 0 ? <p className="text-muted-foreground py-3 text-sm">{empty}</p> : children}</CardContent>
        </Card>
    )
}

function Row({ item, note }: { item: SheetApplyItem; note?: boolean }) {
    return (
        <div className="flex items-center gap-3 py-2 text-sm">
            <span className="w-8 text-center font-semibold tabular-nums">{item.branchCode}</span>
            <div className="min-w-0 flex-1">
                <div className="truncate">
                    <span className="font-mono">{item.reference}</span> · {item.productText} · {item.kind === "SALE" ? "sale" : "purchase"} {item.date}
                </div>
                <div className="text-muted-foreground truncate text-xs">{item.line ? `${item.line.label} (now ${item.line.qty})` : item.message}</div>
                {note && item.line && item.message && <div className="text-xs text-amber-700 dark:text-amber-300">{item.message}</div>}
            </div>
            <span className="w-12 text-right text-xl font-semibold tabular-nums">{change(item.delta)}</span>
        </div>
    )
}

function PendingRow({ item, busy, onResolve }: { item: SheetApplyItem; busy: boolean; onResolve: (b: ResolveSheetApplicationRequest) => void }) {
    const [lineId, setLineId] = useState<number | "">(item.line?.lineId ?? item.options[0]?.lineId ?? "")
    const choose = item.outcome === "PICK_LINE" || item.outcome === "UNMATCHED" || item.outcome === "NEGATIVE"
    return (
        <div className="space-y-2 py-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                    <span className="mr-2 font-semibold">{item.branchCode}</span>
                    <span className="font-mono">{item.reference}</span> · {item.productText} · {item.kind === "SALE" ? "sale" : "purchase"} {item.date}
                </div>
                <span className="text-xl font-semibold tabular-nums">{change(item.delta)}</span>
            </div>
            <div className="text-muted-foreground text-xs">{item.message}</div>
            <div className="flex flex-wrap items-center gap-2">
                {item.outcome === "ASK_COUNTED" && (
                    <>
                        <Button className="h-11" variant="outline" disabled={busy} onClick={() => onResolve({ choice: "COUNTED" })}>
                            Already in my edit
                        </Button>
                        <Button className="h-11" disabled={busy} onClick={() => onResolve({ choice: "APPLY" })}>
                            Subtract now
                        </Button>
                    </>
                )}
                {choose && (
                    <>
                        <select aria-label="Line" className="border-input bg-background h-11 min-w-48 rounded-md border px-3" value={lineId} onChange={(e) => setLineId(e.target.value === "" ? "" : Number(e.target.value))}>
                            <option value="">Choose a line</option>
                            {item.options.map((o) => (
                                <option key={o.lineId} value={o.lineId}>
                                    {o.label} (now {o.qty})
                                </option>
                            ))}
                        </select>
                        <Button className="h-11" disabled={busy || lineId === ""} onClick={() => lineId !== "" && onResolve({ choice: "LINE", lineId })}>
                            Apply to this line
                        </Button>
                    </>
                )}
                {item.outcome === "WITHDRAWN" && (
                    <>
                        <Button className="h-11" variant="outline" disabled={busy} onClick={() => onResolve({ choice: "REVERSE" })}>
                            Reverse it
                        </Button>
                        <Button className="h-11" disabled={busy} onClick={() => onResolve({ choice: "KEEP" })}>
                            Keep as it is
                        </Button>
                    </>
                )}
                {item.outcome !== "WITHDRAWN" && (
                    <Button className="h-11" variant="ghost" disabled={busy} onClick={() => onResolve({ choice: "DISMISS" })}>
                        Never apply
                    </Button>
                )}
            </div>
        </div>
    )
}
