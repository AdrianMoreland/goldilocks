import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { RELINK_TABLES, type RelinkResult, type RelinkTable } from "@goldilocks/shared-types"
import { useReviewApi } from "@/api/review.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const TABLE_LABELS: Record<RelinkTable, string> = {
    trades: "Sales",
    purchase_lots: "Purchases",
    zoho_invoice_lines: "Zoho invoice lines",
    zoho_products: "Zoho products",
    quotes: "Quotes",
}

const n = (v: number) => v.toLocaleString()

/** Rows a correction would change, over every table. */
const correctable = (r: RelinkResult) => RELINK_TABLES.reduce((sum, t) => sum + r.tables[t].correct, 0)

/**
 * Relink rows: re-attach products on rows imported before their name was settled. Opens with a count (nothing is
 * written), then Apply writes. Allocation of sales to purchases is not touched.
 */
export function RelinkDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    // Mounted only while open, so each opening starts clean and counts afresh.
    return open ? <RelinkBody onClose={onClose} /> : null
}

function RelinkBody({ onClose }: { onClose: () => void }) {
    const api = useReviewApi()
    const queryClient = useQueryClient()
    const [correct, setCorrect] = useState(false)
    const [preview, setPreview] = useState<RelinkResult | null>(null)
    const [done, setDone] = useState<RelinkResult | null>(null)

    const count = useMutation({
        mutationFn: () => api.relinkRows({ dryRun: true, correct: false }),
        onSuccess: setPreview,
        onError: (e: Error) => toast.error(e.message),
    })
    const apply = useMutation({
        mutationFn: () => api.relinkRows({ dryRun: false, correct }),
        onSuccess: (r) => {
            setDone(r)
            const rows = RELINK_TABLES.reduce((sum, t) => sum + r.tables[t].written, 0)
            toast.success(`${n(rows)} rows updated`)
            void queryClient.invalidateQueries({ queryKey: queryKeys.review.all })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const { mutate: runCount } = count
    useEffect(() => {
        runCount()
    }, [runCount])

    const shown = done ?? preview
    const fillTotal = preview ? RELINK_TABLES.reduce((s, t) => s + preview.tables[t].fill, 0) : 0
    const couldCorrect = preview ? correctable(preview) : 0

    return (
        <Dialog open onOpenChange={(o) => !o && !apply.isPending && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Relink rows</DialogTitle>
                    <DialogDescription>
                        Gives rows imported before a name was settled their product. Rows that already have a product are kept unless you tick the box below. Nothing is cleared, and sales are not re-matched to purchases.
                    </DialogDescription>
                </DialogHeader>
                {!shown ? (
                    <p className="text-muted-foreground text-sm">{count.isError ? "Could not count the rows." : "Counting..."}</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Table</TableHead>
                                <TableHead className="text-right">Checked</TableHead>
                                {done ? <TableHead className="text-right">Updated</TableHead> : <TableHead className="text-right">Will fill</TableHead>}
                                {!done && <TableHead className="text-right">Could correct</TableHead>}
                                <TableHead className="text-right">Pricing only</TableHead>
                                <TableHead className="text-right">Unresolved</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {RELINK_TABLES.map((t) => {
                                const r = shown.tables[t]
                                return (
                                    <TableRow key={t}>
                                        <TableCell>{TABLE_LABELS[t]}</TableCell>
                                        <TableCell className="text-right tabular-nums">{n(r.rowsChecked)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{n(done ? r.written : r.fill)}</TableCell>
                                        {!done && <TableCell className="text-right tabular-nums">{n(r.correct)}</TableCell>}
                                        <TableCell className="text-right tabular-nums">{n(r.pricingOnlyNoColumn)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{n(r.unresolved)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
                {shown && (
                    <p className="text-muted-foreground text-xs">
                        Pricing only: the name gives a pricing product but the table has no column for it, so nothing is written. Unresolved: no name or rule gives a product.
                    </p>
                )}
                {done ? (
                    <p className="text-sm tabular-nums">
                        {n(RELINK_TABLES.reduce((s, t) => s + done.tables[t].written, 0))} rows updated.{done.correct ? "" : " Corrections were left off."}
                    </p>
                ) : (
                    preview && (
                        <div className="flex items-center gap-2">
                            <Checkbox id="relink-correct" checked={correct} onCheckedChange={(c) => setCorrect(c === true)} disabled={couldCorrect === 0} />
                            <Label htmlFor="relink-correct" className="text-sm">
                                Also correct rows that disagree with my decisions ({n(couldCorrect)})
                            </Label>
                        </div>
                    )
                )}
                <DialogFooter>
                    <Button variant="outline" disabled={apply.isPending} onClick={onClose}>
                        {done ? "Close" : "Cancel"}
                    </Button>
                    {!done && (
                        <Button disabled={!preview || apply.isPending || (fillTotal === 0 && !(correct && couldCorrect > 0))} onClick={() => apply.mutate()}>
                            {apply.isPending ? "Applying..." : "Apply"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
