import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AlertTriangle, Trash2 } from "lucide-react"
import { parseBarsPaste, STOCK_METALS, summarizeBars, type BarStatus, type StockMetal, type StocktakeBar, type StocktakeDetail } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { queryKeys } from "@/lib/query-keys"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const statusText: Record<BarStatus, string> = {
    UNCONFIRMED: "Not seen yet",
    CONFIRMED: "Confirmed",
    NEW: "Found (new)",
    GONE: "Gone",
}

/**
 * Individual bars, one row each. A bar carried from last month starts as "Not seen yet": it counts as present
 * only after someone ticks it. A bar with no serial is still a bar. Bars no longer here are marked Gone, not deleted.
 */
export function BarsPanel({ stocktake, locked }: { stocktake: StocktakeDetail; locked: boolean }) {
    const api = useStocktakeApi()
    const qc = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: queryKeys.stocktake.register(stocktake.id), queryFn: () => api.register(stocktake.id) })
    const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.stocktake.register(stocktake.id) })
    const fail = (e: Error) => toast.error(e.message)

    const [metal, setMetal] = useState<StockMetal>("GOLD")
    const [hideGone, setHideGone] = useState(true)
    const [paste, setPaste] = useState("")
    const [form, setForm] = useState({ locationCode: "", weightLabel: "", refinery: "", serial: "", details: "" })

    const carry = useMutation({
        mutationFn: () => api.carryForward(stocktake.id),
        onSuccess: (r) => {
            toast.success(`From ${r.fromName}: ${r.barsCarried} bars and ${r.coinsCarried} coin lines carried forward, ${r.barsAlreadyThere + r.coinsAlreadyThere} already there`)
            refresh()
        },
        onError: fail,
    })
    const importBars = useMutation({
        mutationFn: () => api.importBars(stocktake.id, metal, paste),
        onSuccess: (r) => {
            toast.success(`${r.added} bars added, ${r.skipped} already there${r.issues.length ? `, ${r.issues.length} rows rejected` : ""}`)
            if (r.added > 0 || r.issues.length === 0) setPaste("")
            refresh()
        },
        onError: fail,
    })
    const update = useMutation({
        mutationFn: ({ id, body }: { id: number; body: Parameters<typeof api.updateBar>[2] }) => api.updateBar(stocktake.id, id, body),
        onSuccess: refresh,
        onError: fail,
    })
    const remove = useMutation({ mutationFn: (id: number) => api.deleteBar(stocktake.id, id), onSuccess: refresh, onError: fail })
    const add = useMutation({
        mutationFn: () =>
            api.addBar(stocktake.id, {
                metal,
                locationCode: form.locationCode.trim(),
                weightLabel: form.weightLabel.trim(),
                refinery: form.refinery.trim() || null,
                serial: form.serial.trim() || null,
                details: form.details.trim() || null,
            }),
        onSuccess: () => {
            setForm({ ...form, weightLabel: "", refinery: "", serial: "", details: "" })
            refresh()
        },
        onError: fail,
    })

    const bars = useMemo(() => data?.bars ?? [], [data])
    const rows = useMemo(() => bars.filter((b) => b.metal === metal && (!hideGone || b.status !== "GONE")), [bars, metal, hideGone])
    const summary = summarizeBars(bars.filter((b) => b.metal === metal))
    const preview = paste.trim() ? parseBarsPaste(paste) : null
    const duplicates = bars.filter((b) => b.duplicateSerial).length

    if (isLoading) return <Skeleton className="mt-3 h-40" />

    return (
        <div className="space-y-4 pt-3">
            <div className="flex flex-wrap items-center gap-3">
                <select value={metal} onChange={(e) => setMetal(e.target.value as StockMetal)} className="border-input bg-background h-9 rounded-md border px-2 text-sm" aria-label="Metal">
                    {STOCK_METALS.map((m) => (
                        <option key={m} value={m}>
                            {m === "PGM" ? "Platinum / palladium" : m[0] + m.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <span className="text-muted-foreground text-sm">
                    {summary.total} bars · {summary.confirmed} confirmed · {summary.added} found new · {summary.unconfirmed} not seen yet · {summary.gone} gone · {summary.withoutSerial} without a serial
                </span>
                {!locked && (
                    <Button variant="outline" size="sm" className="ml-auto cursor-pointer" disabled={carry.isPending} onClick={() => carry.mutate()}>
                        Carry forward from the last finalised stocktake
                    </Button>
                )}
            </div>
            {duplicates > 0 && (
                <p className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="size-4" /> {duplicates} bars share a serial with another live bar. A serial should identify one bar: check these.
                </p>
            )}
            {summary.unconfirmed > 0 && <p className="text-muted-foreground text-xs">Bars marked "Not seen yet" are not assumed present. Confirm each one you can see, or mark it Gone.</p>}

            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Branch</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Refinery</TableHead>
                            <TableHead>Serial</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((b) => (
                            <BarRow key={b.id} bar={b} locked={locked} onStatus={(status) => update.mutate({ id: b.id, body: { status } })} onDetails={(details) => update.mutate({ id: b.id, body: { details } })} onSerial={(serial) => update.mutate({ id: b.id, body: { serial } })} onDelete={() => window.confirm("Delete this bar?") && remove.mutate(b.id)} />
                        ))}
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-muted-foreground text-center text-sm">
                                    No bars here yet. Carry forward, paste last month's list, or add one below.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={hideGone} onChange={(e) => setHideGone(e.target.checked)} /> Hide bars marked gone
            </label>

            {!locked && (
                <>
                    <form
                        className="grid gap-2 rounded-lg border p-3 md:grid-cols-6"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (form.locationCode.trim() && form.weightLabel.trim()) add.mutate()
                        }}
                    >
                        <p className="text-sm font-medium md:col-span-6">Add a bar found on the shelf (serial optional)</p>
                        <Input placeholder="Branch" value={form.locationCode} onChange={(e) => setForm({ ...form, locationCode: e.target.value })} />
                        <Input placeholder="Weight, e.g. 100g Bar" value={form.weightLabel} onChange={(e) => setForm({ ...form, weightLabel: e.target.value })} />
                        <Input placeholder="Refinery" value={form.refinery} onChange={(e) => setForm({ ...form, refinery: e.target.value })} />
                        <Input placeholder="Serial" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} />
                        <Input placeholder="Details" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
                        <Button type="submit" disabled={add.isPending || !form.locationCode.trim() || !form.weightLabel.trim()} className="cursor-pointer">
                            Add
                        </Button>
                    </form>
                    <div className="space-y-2 rounded-lg border p-3">
                        <p className="text-sm font-medium">Paste last month's bar list ({metal === "PGM" ? "platinum / palladium" : metal.toLowerCase()})</p>
                        <p className="text-muted-foreground text-xs">Copy the table from the stock workbook sheet including its header row (Branch, Weight, Refinery, Serial, Gram, Details). Bars are added as "Not seen yet". Pasting the same list again adds nothing.</p>
                        <Textarea rows={5} className="font-mono text-xs" value={paste} onChange={(e) => setPaste(e.target.value)} />
                        {preview && (
                            <p className="text-sm">
                                {preview.rows.length} bars ready{preview.issues.length > 0 && <span className="text-destructive"> · {preview.issues.length} rows rejected: {preview.issues[0]?.message}</span>}
                            </p>
                        )}
                        <Button size="sm" className="cursor-pointer" disabled={!preview || preview.rows.length === 0 || importBars.isPending} onClick={() => importBars.mutate()}>
                            Import {preview?.rows.length ?? 0} bars
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

function BarRow({ bar, locked, onStatus, onDetails, onSerial, onDelete }: { bar: StocktakeBar; locked: boolean; onStatus: (s: BarStatus) => void; onDetails: (d: string | null) => void; onSerial: (s: string | null) => void; onDelete: () => void }) {
    const canDelete = bar.status === "NEW" && bar.carriedFromId === null
    return (
        <TableRow className={cn(bar.status === "GONE" && "opacity-50", bar.duplicateSerial && "bg-amber-500/10")}>
            <TableCell>{bar.locationCode}</TableCell>
            <TableCell>{bar.weightLabel}</TableCell>
            <TableCell>{bar.refinery}</TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <Input
                        key={`serial-${bar.id}-${bar.serial ?? ""}`}
                        className="h-8 w-32 font-mono text-xs"
                        defaultValue={bar.serial ?? ""}
                        placeholder="no serial"
                        disabled={locked}
                        onBlur={(e) => e.target.value.trim() !== (bar.serial ?? "") && onSerial(e.target.value.trim() || null)}
                    />
                    {bar.duplicateSerial && <AlertTriangle className="size-4 text-amber-600" aria-label="Duplicate serial" />}
                </div>
            </TableCell>
            <TableCell>
                <Input key={`details-${bar.id}-${bar.details ?? ""}`} className="h-8 w-44" defaultValue={bar.details ?? ""} disabled={locked} onBlur={(e) => e.target.value !== (bar.details ?? "") && onDetails(e.target.value || null)} />
            </TableCell>
            <TableCell>
                <Badge variant={bar.status === "CONFIRMED" || bar.status === "NEW" ? "secondary" : "outline"}>{statusText[bar.status]}</Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap">
                {!locked && (
                    <>
                        {bar.status !== "CONFIRMED" && bar.status !== "NEW" && (
                            <Button size="sm" variant="outline" className="mr-1 cursor-pointer" onClick={() => onStatus(bar.carriedFromId === null && bar.status === "GONE" ? "NEW" : "CONFIRMED")}>
                                Confirm
                            </Button>
                        )}
                        {bar.status !== "GONE" && !canDelete && (
                            <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => onStatus("GONE")}>
                                Gone
                            </Button>
                        )}
                        {bar.status === "CONFIRMED" && (
                            <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => onStatus("UNCONFIRMED")}>
                                Undo
                            </Button>
                        )}
                        {canDelete && (
                            <Button size="icon" variant="ghost" className="cursor-pointer" aria-label="Delete bar" onClick={onDelete}>
                                <Trash2 />
                            </Button>
                        )}
                    </>
                )}
            </TableCell>
        </TableRow>
    )
}
