import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { computeVariance, DISCREPANCY_ISSUE_TYPES, ISSUE_TYPE_LABELS, type DiscrepancyIssueType, type StocktakeDetail } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Props {
    stocktake: StocktakeDetail
    locked: boolean
    onChanged: () => void
}

/**
 * The discrepancy register from the month-end guide. Writing down what is being done never ticks Resolved:
 * that is its own box, so an explained difference stays visibly open until someone closes it.
 */
export function RegisterPanel({ stocktake, locked, onChanged }: Props) {
    const api = useStocktakeApi()
    const done = { onSuccess: onChanged, onError: (e: Error) => toast.error(e.message) }

    const [form, setForm] = useState({ itemNo: "", description: "", issueType: "QUANTITY" as DiscrepancyIssueType, bcShows: "", physicalFound: "", serialNo: "", action: "" })
    const add = useMutation({
        mutationFn: () =>
            api.addDiscrepancy(stocktake.id, {
                itemNo: form.itemNo.trim() || null,
                description: form.description.trim(),
                issueType: form.issueType,
                bcShows: form.bcShows,
                physicalFound: form.physicalFound,
                serialNo: form.serialNo.trim() || null,
                action: form.action,
            }),
        ...done,
        onSuccess: () => {
            setForm({ ...form, itemNo: "", description: "", bcShows: "", physicalFound: "", serialNo: "", action: "" })
            onChanged()
        },
    })
    const update = useMutation({
        mutationFn: ({ id, body }: { id: number; body: Parameters<typeof api.updateDiscrepancy>[2] }) => api.updateDiscrepancy(stocktake.id, id, body),
        ...done,
    })
    const remove = useMutation({ mutationFn: (id: number) => api.deleteDiscrepancy(stocktake.id, id), ...done })

    // Counted lines that differ from BC and have no register entry yet.
    const unlisted = stocktake.lines.filter((l) => {
        const v = computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted)
        return v !== null && v !== 0 && !stocktake.discrepancies.some((d) => d.itemNo === l.itemNo && d.issueType === "QUANTITY")
    })
    const addFromLine = useMutation({
        mutationFn: async () => {
            for (const l of unlisted) {
                const counted = (l.countedNormal ?? 0) + (l.countedCustomer ?? 0)
                await api.addDiscrepancy(stocktake.id, {
                    itemNo: l.itemNo,
                    description: `${l.description} (${l.locationCode})`,
                    issueType: "QUANTITY",
                    bcShows: String(l.qtyCalculated),
                    physicalFound: String(counted),
                    serialNo: null,
                    action: l.reason ?? "",
                })
            }
        },
        ...done,
    })

    return (
        <div className="space-y-4 pt-3">
            {!locked && unlisted.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm">
                    {unlisted.length} counted lines differ from BC and are not in the register.
                    <Button size="sm" variant="outline" className="cursor-pointer" disabled={addFromLine.isPending} onClick={() => addFromLine.mutate()}>
                        Add them
                    </Button>
                </div>
            )}
            {!locked && (
                <form
                    className="grid gap-2 rounded-lg border p-3 md:grid-cols-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (form.description.trim()) add.mutate()
                    }}
                >
                    <Input placeholder="Item No." value={form.itemNo} onChange={(e) => setForm({ ...form, itemNo: e.target.value })} />
                    <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
                    <select
                        value={form.issueType}
                        onChange={(e) => setForm({ ...form, issueType: e.target.value as DiscrepancyIssueType })}
                        className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                        aria-label="Issue type"
                    >
                        {DISCREPANCY_ISSUE_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {ISSUE_TYPE_LABELS[t]}
                            </option>
                        ))}
                    </select>
                    <Input placeholder="BC shows" value={form.bcShows} onChange={(e) => setForm({ ...form, bcShows: e.target.value })} />
                    <Input placeholder="Physical count / found" value={form.physicalFound} onChange={(e) => setForm({ ...form, physicalFound: e.target.value })} />
                    <Input placeholder="Serial No." value={form.serialNo} onChange={(e) => setForm({ ...form, serialNo: e.target.value })} />
                    <Input placeholder="Action / notes" value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} />
                    <Button type="submit" disabled={!form.description.trim() || add.isPending} className="cursor-pointer md:col-span-4 md:justify-self-start">
                        Add to register
                    </Button>
                </form>
            )}
            {stocktake.discrepancies.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nothing recorded. Record what BC shows and what was found; do not guess, escalate.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item No.</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Issue</TableHead>
                                <TableHead>BC shows</TableHead>
                                <TableHead>Found</TableHead>
                                <TableHead>Serial</TableHead>
                                <TableHead>Action / notes</TableHead>
                                <TableHead className="text-center">Resolved</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stocktake.discrepancies.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell className="font-mono text-xs">{d.itemNo}</TableCell>
                                    <TableCell className="max-w-56 truncate" title={d.description}>
                                        {d.description}
                                    </TableCell>
                                    <TableCell>{ISSUE_TYPE_LABELS[d.issueType]}</TableCell>
                                    <TableCell className="max-w-48 truncate" title={d.bcShows}>
                                        {d.bcShows}
                                    </TableCell>
                                    <TableCell className="max-w-48 truncate" title={d.physicalFound}>
                                        {d.physicalFound}
                                    </TableCell>
                                    <TableCell className="max-w-32 truncate font-mono text-xs" title={d.serialNo ?? ""}>
                                        {d.serialNo}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            key={`action-${d.id}-${d.action}`}
                                            className="h-8 w-56"
                                            defaultValue={d.action}
                                            disabled={locked}
                                            onBlur={(e) => e.target.value !== d.action && update.mutate({ id: d.id, body: { action: e.target.value } })}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={d.resolved}
                                            disabled={locked}
                                            onCheckedChange={(v) => update.mutate({ id: d.id, body: { resolved: v === true } })}
                                            aria-label={`Resolved: ${d.description}`}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {!locked && (
                                            <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Delete entry" onClick={() => window.confirm("Delete this entry?") && remove.mutate(d.id)}>
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
