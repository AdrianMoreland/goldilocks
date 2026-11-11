import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { FileSpreadsheet } from "lucide-react"
import {
    IMPORT_TABLE_NAMES,
    WORKBOOK_LOAD_ORDER,
    detectFileType,
    planUpload,
    readImportWorkbook,
    unredactTables,
    type ImportReadResult,
    type RedactionMapRow,
    type WorkbookChunkRequest,
    type WorkbookChunkResult,
    type WorkbookLoadTable,
} from "@goldilocks/shared-types"
import { useImportsApi } from "@/api/imports.api"
import { readSheets, headersOf } from "@/lib/workbook-file"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDrop } from "./file-drop"

type Totals = Omit<WorkbookChunkResult, "batchId" | "table">
const zero = (): Totals => ({ added: 0, changed: 0, unchanged: 0, unmatched: 0, quotes: 0, quotesInvoiced: 0, unresolved: {}, markedMissing: 0 })

const add = (a: Totals, b: Totals): Totals => ({
    added: a.added + b.added,
    changed: a.changed + b.changed,
    unchanged: a.unchanged + b.unchanged,
    unmatched: a.unmatched + b.unmatched,
    quotes: a.quotes + b.quotes,
    quotesInvoiced: a.quotesInvoiced + b.quotesInvoiced,
    markedMissing: a.markedMissing + b.markedMissing,
    unresolved: Object.fromEntries(
        [...new Set([...Object.keys(a.unresolved), ...Object.keys(b.unresolved)])].map((k) => [k, (a.unresolved[k] ?? 0) + (b.unresolved[k] ?? 0)]),
    ),
})

const LABELS: Record<string, string> = {
    customers: "Customers", vendors: "Vendors", supplier_invoices: "Supplier invoices", purchase_lots: "Purchase lots", trades: "Trades and quotes",
    invoices: "Zoho invoices", invoice_lines: "Invoice lines", line_serials: "Line serials", payments: "Payments", purchase_orders: "Purchase order lines",
    bc_sales_orders: "BC sales orders", bc_tracking_entries: "BC tracking entries", bc_items: "BC items", stock_bars: "Stock bars", stock_coins: "Stock coins",
    bc_journal_lines: "BC journal lines", product_aliases: "Product aliases", links: "Links", customer_safe_items: "Customer safe items", zoho_products: "Zoho products",
}
const NOT_IMPORTED = new Set<string>(IMPORT_TABLE_NAMES.filter((t) => !(WORKBOOK_LOAD_ORDER as readonly string[]).includes(t)))

type Tables = Partial<Record<WorkbookLoadTable, Record<string, unknown>[]>>

/**
 * The assembled workbook ("GL import.xlsx"): choose the map, then the workbook. Both are read and unredacted in this
 * browser; only the cleaned rows go to the server, one table at a time, after a preview and a Continue or Stop.
 */
export function WorkbookTab({ map }: { map: RedactionMapRow[] | null }) {
    const api = useImportsApi()
    const queryClient = useQueryClient()
    const [reading, setReading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [read, setRead] = useState<ImportReadResult | null>(null)
    const [tables, setTables] = useState<Tables | null>(null)
    const [unmapped, setUnmapped] = useState<string[]>([])
    const [preview, setPreview] = useState<Record<string, Totals> | null>(null)
    const [saved, setSaved] = useState<Record<string, Totals> | null>(null)
    const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
    const [failure, setFailure] = useState<{ message: string; nextIndex: number; mode: "preview" | "commit" } | null>(null)
    const [confirming, setConfirming] = useState(false)
    const batchId = useRef<number | undefined>(undefined)

    const warnings = read ? read.warnings.emailOrUrlCells + read.warnings.impossibleDates + unmapped.length : 0

    const reset = () => {
        setFileName("")
        setRead(null)
        setTables(null)
        setUnmapped([])
        setPreview(null)
        setSaved(null)
        setProgress(null)
        setFailure(null)
        batchId.current = undefined
    }

    const load = async (file: File) => {
        if (!map) return void toast.error("Load the redaction map first.")
        if (!/\.xlsx$/i.test(file.name)) return void toast.error("Choose an .xlsx file.")
        reset()
        setReading(true)
        try {
            const sheets = await readSheets(file)
            const kind = detectFileType(headersOf(sheets)).kind
            if (kind !== "import_workbook") {
                toast.error(`That is not the assembled workbook (it looks like: ${kind.replace(/_/g, " ")}). Use the matching tab.`)
                return
            }
            const result = readImportWorkbook(sheets)
            setFileName(file.name)
            setRead(result)
            if (result.ok) {
                const un = unredactTables(result.tables, map)
                setUnmapped(un.unmappedCodes)
                setTables(un.tables as unknown as Tables)
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not read that file.")
        } finally {
            setReading(false)
        }
    }

    /** Sends the chunks in order from `startAt`. A failure stops the run and keeps the batch id so it can resume. */
    const run = async (mode: "preview" | "commit", startAt = 0) => {
        if (!tables) return
        const plan = planUpload(tables, fileName)
        const totals: Record<string, Totals> = (mode === "preview" ? preview : saved) && startAt > 0 ? { ...((mode === "preview" ? preview : saved) as Record<string, Totals>) } : {}
        setFailure(null)
        setProgress({ done: startAt, total: plan.length })
        for (let i = startAt; i < plan.length; i++) {
            const chunk = plan[i]!
            const body: WorkbookChunkRequest = { ...chunk, batchId: mode === "commit" ? batchId.current : undefined }
            try {
                const res = mode === "preview" ? await api.previewChunk(body) : await api.commitChunk(body)
                if (mode === "commit") batchId.current = res.batchId
                totals[chunk.table] = add(totals[chunk.table] ?? zero(), res)
                if (mode === "preview") setPreview({ ...totals })
                else setSaved({ ...totals })
                setProgress({ done: i + 1, total: plan.length })
            } catch (e) {
                setFailure({ message: e instanceof Error ? e.message : "The server refused a chunk.", nextIndex: i, mode })
                return
            }
        }
        if (mode === "commit") {
            toast.success("Import saved")
            void queryClient.invalidateQueries({ queryKey: ["imports", "batches"] })
        }
    }

    const check = useMutation({ mutationFn: (startAt: number) => run("preview", startAt) })
    const save = useMutation({ mutationFn: (startAt: number) => run("commit", startAt) })
    const busy = check.isPending || save.isPending

    const rows = IMPORT_TABLE_NAMES.map((name) => ({
        name,
        inFile: read?.counts[name] ?? 0,
        imported: !NOT_IMPORTED.has(name),
        sent: preview?.[name] ?? saved?.[name],
    }))
    const shownTotals = saved ?? preview
    const changes = shownTotals ? Object.values(shownTotals).reduce((n, t) => n + t.added + t.changed, 0) : 0

    return (
        <div className="space-y-4">
            {!read && (
                <FileDrop
                    title={map ? "Drop the assembled workbook here, or click to choose" : "Load the redaction map above first"}
                    hint="GL import.xlsx, schema 1.1. It is read in this browser; names are restored from your map and only the cleaned rows are sent, table by table."
                    busy={reading}
                    onFile={(f) => void load(f)}
                />
            )}

            {read && (
                <Card>
                    <CardContent className="flex flex-wrap items-center gap-4 pt-6">
                        <FileSpreadsheet className="text-muted-foreground size-5" />
                        <span className="font-medium">{fileName}</span>
                        {read.ok ? <Badge variant="secondary">Schema {read.schemaVersion}</Badge> : <Badge variant="destructive">Cannot import</Badge>}
                        <div className="ml-auto flex gap-2">
                            <Button variant="outline" onClick={reset} disabled={busy}>
                                Choose another file
                            </Button>
                            {!saved && (
                                <>
                                    <Button variant="outline" onClick={() => check.mutate(0)} disabled={!read.ok || busy}>
                                        {check.isPending ? "Checking..." : preview ? "Check again" : "Check against Goldilocks"}
                                    </Button>
                                    <Button onClick={() => (warnings ? setConfirming(true) : save.mutate(0))} disabled={!read.ok || !preview || busy}>
                                        {save.isPending ? "Saving..." : changes === 0 && preview ? "Nothing to import" : `Import ${changes.toLocaleString()} change${changes === 1 ? "" : "s"}`}
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {read && read.schemaErrors.length > 0 && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle>This workbook cannot be imported</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        {read.schemaErrors.map((e) => (
                            <p key={e}>{e}</p>
                        ))}
                        <p className="text-muted-foreground pt-2">Re-run the import script (4b. Rebuild) and try again.</p>
                    </CardContent>
                </Card>
            )}

            {read?.ok && (
                <>
                    {(warnings > 0 || Object.keys(read.issueTotals).length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Needs a look</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                                {read.warnings.emailOrUrlCells > 0 && <p>{read.warnings.emailOrUrlCells} cells hold an email or web address.</p>}
                                {read.warnings.impossibleDates > 0 && <p>{read.warnings.impossibleDates} dates are impossible (for example year 0206) and will be left empty.</p>}
                                {unmapped.length > 0 && <p>{unmapped.length} redaction codes are not in your map: {unmapped.slice(0, 8).join(", ")}{unmapped.length > 8 ? "..." : ""}</p>}
                                {Object.entries(read.issueTotals).map(([k, n]) => (
                                    <p key={k} className="text-muted-foreground">
                                        {k.replace(".", ": ").replace(/_/g, " ").toLowerCase()} - {n} row{n === 1 ? "" : "s"}
                                    </p>
                                ))}
                                {Object.entries(read.droppedRows).map(([t, n]) => (
                                    <p key={t} className="text-muted-foreground">
                                        {LABELS[t] ?? t}: {n} row{n === 1 ? "" : "s"} left out (unknown type or confidence)
                                    </p>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>{saved ? "Saved" : preview ? "What importing would do" : "What is in the file"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Table</TableHead>
                                        <TableHead className="text-right">In file</TableHead>
                                        <TableHead className="text-right">Added</TableHead>
                                        <TableHead className="text-right">Changed</TableHead>
                                        <TableHead className="text-right">Unchanged</TableHead>
                                        <TableHead className="text-right">Not matched</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map((r) => (
                                        <TableRow key={r.name} className={r.inFile === 0 ? "text-muted-foreground" : undefined}>
                                            <TableCell>
                                                {LABELS[r.name] ?? r.name}
                                                {!r.imported && (
                                                    <span className="text-muted-foreground ml-2 text-xs">
                                                        {r.name === "customer_safe_items" ? "via Customer Orders > Paste from sheet" : "not imported yet"}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">{r.inFile.toLocaleString()}</TableCell>
                                            {(["added", "changed", "unchanged", "unmatched"] as const).map((k) => (
                                                <TableCell key={k} className="text-right tabular-nums">
                                                    {r.sent ? r.sent[k].toLocaleString() : ""}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {shownTotals && (shownTotals.trades?.unmatched ?? 0) + (shownTotals.purchase_lots?.unmatched ?? 0) > 0 && (
                                <p className="text-muted-foreground mt-3 text-sm">
                                    "Not matched" trades and purchase lots are not created here: load the tradesheets first, then import this workbook again.
                                </p>
                            )}
                            {shownTotals?.trades && shownTotals.trades.quotes > 0 && (
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {shownTotals.trades.quotes} quotes recorded; {shownTotals.trades.quotesInvoiced} turned into invoiced sales.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {progress && (busy || failure) && (
                <Card>
                    <CardContent className="space-y-2 pt-6">
                        <Progress value={(progress.done / Math.max(progress.total, 1)) * 100} />
                        <p className="text-muted-foreground text-sm">
                            {progress.done} of {progress.total} parts sent
                        </p>
                        {failure && (
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-destructive text-sm">{failure.message}</p>
                                <Button
                                    size="sm"
                                    onClick={() => (failure.mode === "preview" ? check.mutate(failure.nextIndex) : save.mutate(failure.nextIndex))}
                                    disabled={busy}
                                >
                                    Resume from part {failure.nextIndex + 1}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {saved && (
                <Button
                    onClick={() => {
                        reset()
                    }}
                >
                    Import another file
                </Button>
            )}

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Continue or stop?</DialogTitle>
                        <DialogDescription>The file has things you should know about before anything is saved.</DialogDescription>
                    </DialogHeader>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                        {read && read.warnings.emailOrUrlCells > 0 && <li>{read.warnings.emailOrUrlCells} cells hold an email or web address. They are saved as they are.</li>}
                        {read && read.warnings.impossibleDates > 0 && <li>{read.warnings.impossibleDates} impossible dates are saved as empty.</li>}
                        {unmapped.length > 0 && <li>{unmapped.length} redaction codes are not in your map; those rows keep the code as their name.</li>}
                    </ul>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirming(false)}>
                            Stop
                        </Button>
                        <Button
                            onClick={() => {
                                setConfirming(false)
                                save.mutate(0)
                            }}
                        >
                            Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
