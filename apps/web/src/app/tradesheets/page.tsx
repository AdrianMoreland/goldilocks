import { useCallback, useRef, useState, type DragEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { FileSpreadsheet, Upload } from "lucide-react"
import {
    guessSheetMonth,
    type PlanRow,
    type PlanRowStatus,
    type TabPlan,
    type TradesheetImportPlan,
    type ImportSource,
    type TradesheetImportRequest,
    type TradesheetImportResult,
} from "@goldilocks/shared-types"
import { useTradesheetImportApi } from "@/api/tradesheet-import.api"
import { readTradesheetFile } from "@/lib/tradesheet-reader"
import { BaseLayout } from "@/components/layouts/base-layout"
import { useOrdersApi } from "@/api/orders.api"
import { features } from "@/config/features"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const KIND_LABELS: Record<NonNullable<TabPlan["kind"]>, string> = {
    IE_GOLD_SALES: "Irish gold sales",
    IE_SILVER_SALES: "Irish silver sales",
    IE_GOLD_PURCHASES: "Irish gold purchases",
    IE_SILVER_PURCHASES: "Irish silver purchases",
}

const STATUS_STYLE: Record<PlanRowStatus, string> = {
    ADDED: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
    CHANGED: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    RESTORED: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
    MISSING: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
    UNCHANGED: "bg-muted text-muted-foreground",
}

const STATE_LABELS: Record<string, string> = {
    QUOTE: "Quote",
    AWAITING_HEDGE: "Awaiting hedge",
    HEDGED: "Hedged",
    INVOICED: "Invoiced",
    DEFERRED: "Deferred",
    UNKNOWN: "Unknown",
}

const ROWS_SHOWN = 100

/**
 * Drop a monthly trade sheet (.xlsx exported from Google Sheets) and see what it would add, change or flag
 * before anything is saved. The sheets stay the source: reimporting a month updates its rows by reference.
 */
function Shell({ embedded, children }: { embedded?: boolean; children: React.ReactNode }) {
    return embedded ? <>{children}</> : <BaseLayout title="Trade sheets" description="Import a monthly trade sheet and see what changes before it is saved">{children}</BaseLayout>
}

export default function TradesheetsPage({ embedded = false }: { embedded?: boolean }) {
    const api = useTradesheetImportApi()
    const orders = useOrdersApi()
    const input = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const [reading, setReading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [backfill, setBackfill] = useState(false)
    const [request, setRequest] = useState<TradesheetImportRequest | null>(null)
    const [plan, setPlan] = useState<TradesheetImportPlan | null>(null)
    const [done, setDone] = useState<TradesheetImportResult | null>(null)

    const preview = useMutation({
        mutationFn: (body: TradesheetImportRequest) => api.preview(body),
        onSuccess: setPlan,
        onError: (e: Error) => toast.error(e.message),
    })
    const commit = useMutation({
        mutationFn: (body: TradesheetImportRequest) => api.commit(body),
        onSuccess: (result) => {
            setDone(result)
            toast.success("Import saved")
            // Sheet tasks the new trades show as done close themselves. Best effort: the import is already saved.
            if (features.redesign)
                orders
                    .reconcile()
                    .then((r) => r.closed && toast.success(`${r.closed} sheet task${r.closed > 1 ? "s" : ""} closed: this import shows them done.`))
                    .catch(() => undefined)
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const reset = () => {
        setFile(null)
        setRequest(null)
        setPlan(null)
        setDone(null)
        if (input.current) input.current.value = ""
    }

    const load = useCallback(
        async (chosen: File, month: string, source: ImportSource) => {
            if (!/\.xlsx$/i.test(chosen.name)) {
                toast.error("Choose an .xlsx file (File, Download, Microsoft Excel in Google Sheets).")
                return
            }
            setReading(true)
            setPlan(null)
            setDone(null)
            try {
                const body = await readTradesheetFile(chosen, month, source)
                setFile(chosen)
                setRequest(body)
                if (month) preview.mutate(body)
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Could not read that file.")
            } finally {
                setReading(false)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const choose = (chosen: File | undefined) => {
        if (!chosen) return
        // The backfill copy holds January to June in two tabs, so it is filed under June unless changed.
        if (backfill) void load(chosen, "2026-06", "BACKFILL")
        else void load(chosen, guessSheetMonth(chosen.name) ?? "", "TRADESHEET")
    }
    const onDrop = (e: DragEvent) => {
        e.preventDefault()
        setDragging(false)
        choose(e.dataTransfer.files[0])
    }
    const setMonth = (month: string) => {
        if (!request) return
        const next = { ...request, sheetMonth: month }
        setRequest(next)
        setPlan(null)
        if (/^\d{4}-\d{2}$/.test(month)) preview.mutate(next)
    }

    const changes = plan ? plan.totals.added + plan.totals.changed + plan.totals.restored + plan.totals.missing : 0

    return (
        <Shell embedded={embedded}>
            <div className="mx-auto w-full max-w-6xl space-y-4 p-4 md:p-6">
                {features.redesign && (
                    <ol className="flex flex-wrap gap-2 text-sm" aria-label="Steps">
                        {["Choose the file", "Check the preview", "Save"].map((label, index) => {
                            const current = done ? 2 : request ? 1 : 0
                            const state = index < current ? "done" : index === current ? "current" : "todo"
                            return (
                                <li
                                    key={label}
                                    aria-current={state === "current" ? "step" : undefined}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full border py-1 pr-3 pl-1",
                                        state === "current" ? "border-primary text-foreground" : "text-muted-foreground",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                                            state === "todo" ? "bg-muted" : "bg-primary text-primary-foreground",
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                    {label}
                                </li>
                            )
                        })}
                    </ol>
                )}
                {!request && (
                    <label className="flex items-start gap-2 text-sm">
                        <input type="checkbox" className="mt-1" checked={backfill} onChange={(e) => setBackfill(e.target.checked)} />
                        <span>
                            This is the July copy with January to June in its <code>RawG</code> and <code>RawGP</code> tabs (one-off history import)
                        </span>
                    </label>
                )}

                {!request && (
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => input.current?.click()}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setDragging(true)
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={cn(
                            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center transition-colors",
                            dragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                        )}
                    >
                        <Upload className="text-muted-foreground size-8" />
                        <div className="font-medium">{reading ? "Reading the file..." : "Drop a trade sheet here, or click to choose"}</div>
                        <p className="text-muted-foreground max-w-md text-sm">
                            An .xlsx exported from Google Sheets (File, Download, Microsoft Excel), one month at a time. You see what it
                            would add or change before anything is saved.
                            {backfill && " The history file is filed under June 2026; change the month if you want it elsewhere."}
                        </p>
                        <input ref={input} type="file" accept=".xlsx" className="hidden" onChange={(e) => choose(e.target.files?.[0])} />
                    </div>
                )}

                {request && !done && (
                    <Card>
                        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="text-muted-foreground size-5" />
                                <span className="font-medium">{file?.name}</span>
                            </div>
                            <label className="text-sm">
                                <span className="text-muted-foreground mb-1 block">Month this file covers</span>
                                <Input type="month" className="w-44" value={request.sheetMonth} onChange={(e) => setMonth(e.target.value)} />
                            </label>
                            <div className="ml-auto flex gap-2">
                                <Button variant="outline" onClick={reset} disabled={commit.isPending}>
                                    Choose another file
                                </Button>
                                <Button onClick={() => commit.mutate(request)} disabled={!plan || changes === 0 || commit.isPending || preview.isPending}>
                                    {commit.isPending ? "Saving..." : changes === 0 ? "Nothing to import" : `Import ${changes} change${changes === 1 ? "" : "s"}`}
                                </Button>
                            </div>
                            {!/^\d{4}-\d{2}$/.test(request.sheetMonth) && (
                                <p className="text-muted-foreground w-full text-sm">The file name does not say which month it covers. Pick it to see the preview.</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {preview.isPending && <p className="text-muted-foreground text-sm">Checking the file...</p>}

                {done && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Saved</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Totals plan={done.plan} />
                            <Allocation summary={done.allocation} />
                            <Button onClick={reset}>Import another file</Button>
                        </CardContent>
                    </Card>
                )}

                {plan && !done && (
                    <>
                        <Totals plan={plan} />
                        {plan.tabs.map((tab) => (
                            <TabCard key={tab.name} tab={tab} />
                        ))}
                    </>
                )}
            </div>
        </Shell>
    )
}

function Totals({ plan }: { plan: TradesheetImportPlan }) {
    const t = plan.totals
    const items: Array<[string, number, string]> = [
        ["Added", t.added, STATUS_STYLE.ADDED],
        ["Changed", t.changed, STATUS_STYLE.CHANGED],
        ["Restored", t.restored, STATUS_STYLE.RESTORED],
        ["Unchanged", t.unchanged, STATUS_STYLE.UNCHANGED],
        ["Missing from file", t.missing, STATUS_STYLE.MISSING],
        ["Need a look", t.flagged, "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200"],
    ]
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {items.map(([label, n, style]) => (
                <div key={label} className={cn("rounded-lg px-3 py-2", style)}>
                    <div className="text-2xl font-semibold tabular-nums">{n}</div>
                    <div className="text-xs">{label}</div>
                </div>
            ))}
        </div>
    )
}

/** What matching sales to purchase lots found. Only the lines that matter are shown. */
function Allocation({ summary: a }: { summary: TradesheetImportResult["allocation"] }) {
    const lines: string[] = []
    if (a.salesLinked > 0) lines.push(`${a.salesLinked} sale${a.salesLinked === 1 ? "" : "s"} linked to the purchase line their CPTY names, across ${a.lotsChecked} lot${a.lotsChecked === 1 ? "" : "s"}.`)
    if (a.lotNotImported > 0) lines.push(`${a.lotNotImported} sale${a.lotNotImported === 1 ? "" : "s"} name a purchase line that is not imported yet (an older month, or a typo).`)
    if (a.overAllocated > 0) lines.push(`${a.overAllocated} lot${a.overAllocated === 1 ? "" : "s"} where the sales took more than was bought.`)
    if (a.soldMismatches > 0) lines.push(`${a.soldMismatches} lot${a.soldMismatches === 1 ? "" : "s"} where the "N sold" comment disagrees with the sales.`)
    if (lines.length === 0) return null
    return (
        <ul className="list-disc space-y-1 pl-5 text-sm">
            {lines.map((l) => (
                <li key={l}>{l}</li>
            ))}
        </ul>
    )
}

function TabCard({ tab }: { tab: TabPlan }) {
    const [issuesOnly, setIssuesOnly] = useState(false)
    const [all, setAll] = useState(false)
    const skipped = tab.kind === null || tab.problems.length > 0
    const rows = tab.rows.filter((r) => !issuesOnly || r.issues.length > 0)
    const shown = all ? rows : rows.slice(0, ROWS_SHOWN)

    return (
        <Card className={cn(skipped && "opacity-70")}>
            <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0">
                <CardTitle className="text-base">{tab.name}</CardTitle>
                {tab.kind && <Badge variant="secondary">{KIND_LABELS[tab.kind]}</Badge>}
                {skipped ? (
                    <span className="text-muted-foreground text-sm">{tab.problems.join(" ") || "Not read."}</span>
                ) : (
                    <span className="text-muted-foreground text-sm tabular-nums">
                        {tab.counts.added} added, {tab.counts.changed + tab.counts.restored} changed, {tab.counts.unchanged} unchanged
                        {tab.counts.missing > 0 && `, ${tab.counts.missing} missing`}
                        {tab.counts.flagged > 0 && `, ${tab.counts.flagged} need a look`}
                    </span>
                )}
            </CardHeader>
            {!skipped && (
                <CardContent className="space-y-3">
                    {tab.unmatchedProducts.length > 0 && (
                        <div className="text-sm">
                            <div className="mb-1 font-medium">Products not recognised ({tab.unmatchedProducts.length})</div>
                            <div className="flex flex-wrap gap-1.5">
                                {tab.unmatchedProducts.map((p) => (
                                    <Badge key={p.text} variant="outline">
                                        {p.text} <span className="text-muted-foreground ml-1">x{p.rows}</span>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    {tab.rows.length > 0 && (
                        <>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={issuesOnly} onChange={(e) => setIssuesOnly(e.target.checked)} />
                                Only rows that need a look
                            </label>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Row</TableHead>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>What happens</TableHead>
                                            <TableHead>State</TableHead>
                                            <TableHead>Needs a look</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {shown.map((r) => (
                                            <PreviewRow key={`${r.reference}-${r.sourceRow}`} row={r} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {!all && rows.length > ROWS_SHOWN && (
                                <Button variant="outline" size="sm" onClick={() => setAll(true)}>
                                    Show all {rows.length} rows
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            )}
        </Card>
    )
}

function PreviewRow({ row }: { row: PlanRow }) {
    return (
        <TableRow>
            <TableCell className="text-muted-foreground tabular-nums">{row.sourceRow}</TableCell>
            <TableCell className="font-mono text-xs">{row.reference}</TableCell>
            <TableCell>
                <Badge className={cn("font-normal", STATUS_STYLE[row.status])}>{row.status.toLowerCase()}</Badge>
                {row.changedFields.length > 0 && <span className="text-muted-foreground ml-2 text-xs">{row.changedFields.join(", ")}</span>}
            </TableCell>
            <TableCell className="text-sm">
                {row.state ? STATE_LABELS[row.state] : ""}
                {row.fromColour && (
                    <span className="text-muted-foreground ml-1 text-xs" title="Read from the cell colour">
                        (colour)
                    </span>
                )}
            </TableCell>
            <TableCell className="text-sm">
                {row.issues.length > 0 ? (
                    <ul className="list-disc pl-4">
                        {row.issues.map((i) => (
                            <li key={i}>{i}</li>
                        ))}
                    </ul>
                ) : null}
            </TableCell>
        </TableRow>
    )
}
