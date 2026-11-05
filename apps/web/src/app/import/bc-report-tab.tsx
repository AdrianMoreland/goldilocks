import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { FileSpreadsheet } from "lucide-react"
import {
    IMPORT_SCHEMA_VERSION,
    buildNameLookup,
    detectFileType,
    mapBcReport,
    type BcAwaitingRequest,
    type BcAwaitingResult,
    type BcReportResult,
    type RedactionMapRow,
} from "@goldilocks/shared-types"
import { useImportsApi } from "@/api/imports.api"
import { readSheets, headersOf } from "@/lib/workbook-file"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileDrop } from "./file-drop"

/**
 * The Business Central "Orders Awaiting Collection" report. Orders that were in the last report and are missing from
 * this one have been posted, so the whole report must be loaded: a partial file would post orders wrongly.
 */
export function BcReportTab({ map }: { map: RedactionMapRow[] | null }) {
    const api = useImportsApi()
    const queryClient = useQueryClient()
    const [reading, setReading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [mapped, setMapped] = useState<BcReportResult | null>(null)
    const [preview, setPreview] = useState<BcAwaitingResult | null>(null)
    const [saved, setSaved] = useState<BcAwaitingResult | null>(null)
    const [confirming, setConfirming] = useState(false)

    const reset = () => {
        setFileName("")
        setMapped(null)
        setPreview(null)
        setSaved(null)
    }

    const request = (): BcAwaitingRequest => ({ fileName, schemaVersion: IMPORT_SCHEMA_VERSION, rows: mapped!.rows })
    const check = useMutation({ mutationFn: () => api.previewBc(request()), onSuccess: setPreview, onError: (e: Error) => toast.error(e.message) })
    const save = useMutation({
        mutationFn: () => api.commitBc(request()),
        onSuccess: (r) => {
            setSaved(r)
            toast.success("Report saved")
            void queryClient.invalidateQueries({ queryKey: ["imports", "batches"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const load = async (file: File) => {
        if (!map) return void toast.error("Load the redaction map first.")
        if (!/\.xlsx$/i.test(file.name)) return void toast.error("Choose an .xlsx file.")
        reset()
        setReading(true)
        try {
            const sheets = await readSheets(file)
            const detected = detectFileType(headersOf(sheets))
            const tab = detected.tabs.find((t) => t.type === "bc_orders")
            if (!tab) {
                toast.error("That is not the Business Central awaiting-collection report.")
                return
            }
            const result = mapBcReport(sheets[tab.name] ?? [], file.name, buildNameLookup(map))
            if (!result.headerFound || result.rows.length === 0) {
                toast.error("The report has no orders in it, so nothing was loaded.")
                return
            }
            setFileName(file.name)
            setMapped(result)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not read that file.")
        } finally {
            setReading(false)
        }
    }

    const start = () => (preview && preview.posted > 0 ? setConfirming(true) : save.mutate())
    const shown = saved ?? preview

    return (
        <div className="space-y-4">
            {!mapped && (
                <FileDrop
                    title={map ? "Drop the Orders Awaiting Collection report here" : "Load the redaction map above first"}
                    hint="The whole report from Business Central as .xlsx. Orders missing from it, compared with the last report, are marked posted."
                    busy={reading}
                    onFile={(f) => void load(f)}
                />
            )}
            {mapped && (
                <Card>
                    <CardContent className="flex flex-wrap items-center gap-4 pt-6">
                        <FileSpreadsheet className="text-muted-foreground size-5" />
                        <span className="font-medium">{fileName}</span>
                        <span className="text-muted-foreground text-sm">{mapped.rows.length.toLocaleString()} orders</span>
                        <div className="ml-auto flex gap-2">
                            <Button variant="outline" onClick={reset} disabled={check.isPending || save.isPending}>
                                Choose another file
                            </Button>
                            {!saved && (
                                <>
                                    <Button variant="outline" onClick={() => check.mutate()} disabled={check.isPending || save.isPending}>
                                        {check.isPending ? "Checking..." : preview ? "Check again" : "Check against Goldilocks"}
                                    </Button>
                                    <Button onClick={start} disabled={!preview || save.isPending}>
                                        {save.isPending ? "Saving..." : "Save the report"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
            {mapped && mapped.unmappedCustomers > 0 && (
                <p className="text-muted-foreground text-sm">
                    {mapped.unmappedCustomers} customer names are not in your map. Those orders are saved without a customer.
                </p>
            )}
            {shown && (
                <Card>
                    <CardHeader>
                        <CardTitle>{saved ? "Saved" : "What saving would do"}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        {(
                            [
                                ["Added", shown.added],
                                ["Changed", shown.changed],
                                ["Unchanged", shown.unchanged],
                                ["No longer in the report", shown.gone],
                                ["Trades posted", shown.posted],
                                ["Already posted", shown.alreadyPosted],
                                ["No trade found", shown.noTrade],
                            ] as const
                        ).map(([label, n]) => (
                            <div key={label}>
                                <div className="text-muted-foreground">{label}</div>
                                <div className="text-lg font-semibold tabular-nums">{n.toLocaleString()}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            {saved && <Button onClick={reset}>Import another report</Button>}

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Continue or stop?</DialogTitle>
                        <DialogDescription>
                            {preview?.posted} trade{preview?.posted === 1 ? "" : "s"} will be marked posted because the order is no longer in this report. If the file is
                            not the complete report, stop.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirming(false)}>
                            Stop
                        </Button>
                        <Button
                            onClick={() => {
                                setConfirming(false)
                                save.mutate()
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
