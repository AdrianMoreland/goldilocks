import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { LiveBaselinePreview, LiveBaselineRequest } from "@goldilocks/shared-types"
import { useLiveStockApi } from "@/api/live-stock.api"
import { queryKeys } from "@/lib/query-keys"
import { readSheets } from "@/lib/workbook-file"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { readStockSheet, type StockSheetRead } from "./stock-sheet"

const localIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/**
 * Admin: load the monthly "Stock <month>" workbook as the starting counts. The file is read in the browser; the server
 * plans it, shows what would change, and only writes when asked. The date below is the cut-over: tradesheet sales dated
 * on or before it are already in these numbers and will never be subtracted again.
 */
export function BaselineDialog({ onClose }: { onClose: () => void }) {
    const api = useLiveStockApi()
    const qc = useQueryClient()
    const [file, setFile] = useState<File | null>(null)
    const [read, setRead] = useState<StockSheetRead | null>(null)
    const [cutover, setCutover] = useState(localIso(new Date()))
    const [preview, setPreview] = useState<LiveBaselinePreview | null>(null)
    const [error, setError] = useState<string | null>(null)

    const request = (r: StockSheetRead, date: string): LiveBaselineRequest => ({
        bars: r.bars,
        coins: r.coins,
        cutoverDate: date,
        branchCodes: ["DU", "CO", "BL", "BC"],
    })

    const previewMut = useMutation({
        mutationFn: (v: { r: StockSheetRead; date: string }) => api.previewBaseline(request(v.r, v.date)),
        onSuccess: setPreview,
        onError: (e: Error) => setError(e.message),
    })
    const commit = useMutation({
        mutationFn: () => api.commitBaseline(request(read as StockSheetRead, cutover)),
        onSuccess: (r) => {
            toast.success(`Loaded ${r.units} items across ${r.lines} lines`)
            void qc.invalidateQueries({ queryKey: queryKeys.liveStock.all })
            onClose()
        },
        onError: (e: Error) => setError(e.message),
    })

    async function pick(f: File | undefined) {
        if (!f) return
        setError(null)
        setPreview(null)
        setFile(f)
        try {
            const r = readStockSheet(await readSheets(f))
            if (r.bars.length + r.coins.length === 0) {
                setError("No stock tabs found. Expected tabs like “GOLD - Bars Stock Serials” and “GOLD - Coins Stock”.")
                setRead(null)
                return
            }
            const date = localIso(new Date(f.lastModified))
            setRead(r)
            setCutover(date)
            previewMut.mutate({ r, date })
        } catch {
            setError("That file could not be read as a workbook.")
        }
    }

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Load the stock sheet</DialogTitle>
                    <DialogDescription>Sets each count to the sheet. Run it again later and only the differences change.</DialogDescription>
                </DialogHeader>
                <input type="file" accept=".xlsx" aria-label="Stock workbook" className="block w-full text-sm" onChange={(e) => void pick(e.target.files?.[0])} />
                {error && <p className="text-destructive text-sm">{error}</p>}
                {read && (
                    <div className="space-y-3 text-sm">
                        <div className="text-muted-foreground">
                            {file?.name}: {read.tabs.map((t) => `${t.name.replace(/ Stock.*/, "")} ${t.rows}`).join(", ")}
                            {read.skippedTabs.length > 0 && <> · not read yet: {read.skippedTabs.join(", ")}</>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="ls-cutover">Cut-over date (the day this sheet was last updated)</Label>
                            <input
                                id="ls-cutover"
                                type="date"
                                className="border-input bg-background h-11 rounded-md border px-3"
                                value={cutover}
                                onChange={(e) => {
                                    setCutover(e.target.value)
                                    if (e.target.value) previewMut.mutate({ r: read, date: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                )}
                {preview && <PreviewSummary p={preview} />}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={!preview || !cutover || commit.isPending || preview.lines === 0} onClick={() => commit.mutate()}>
                        {commit.isPending ? "Loading..." : "Load these counts"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function PreviewSummary({ p }: { p: LiveBaselinePreview }) {
    return (
        <div className="space-y-3 rounded-md border p-3 text-sm">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat label="Items" value={p.units} />
                <Stat label="New lines" value={p.linesToCreate} />
                <Stat label="Lines changing" value={p.linesToChange} />
                <Stat label="New serials" value={p.barsToCreate} />
            </div>
            <div className="text-muted-foreground">
                {Object.entries(p.byBranch)
                    .map(([b, n]) => `${b} ${n}`)
                    .join(" · ")}
                {p.skippedSold > 0 && <> · {p.skippedSold} sold bars left out</>}
                {p.fixes.length > 0 && <> · {p.fixes.length} spellings tidied</>}
            </div>
            {p.issues.length > 0 && (
                <Notice title={`${p.issues.length} rows not loaded`} items={p.issues.slice(0, 6).map((i) => `Row ${i.row}: ${i.message}`)} />
            )}
            {p.clashes.length > 0 && <Notice title="Serial on more than one bar (none loaded)" items={p.clashes.slice(0, 6).map((c) => `${c.serialKey}: rows ${c.rows.join(", ")}`)} />}
            {p.unlistedRefineries.length > 0 && <Notice title="Refineries not on the known list (loaded as written)" items={[p.unlistedRefineries.join(", ")]} />}
        </div>
    )
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <div className="text-2xl font-semibold tabular-nums">{value}</div>
            <div className="text-muted-foreground text-xs">{label}</div>
        </div>
    )
}

function Notice({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="rounded bg-amber-50 p-2 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <div className="font-medium">{title}</div>
            {items.map((t) => (
                <div key={t} className="text-xs">
                    {t}
                </div>
            ))}
        </div>
    )
}
