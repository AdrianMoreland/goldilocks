import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    buildNameLookup,
    mapBcHistory,
    parsePastedTable,
    type BcHistoryKind,
    type BcHistoryMapped,
    type BcHistoryRequest,
    type BcHistoryResult,
    type ItemTraceEvent,
    type RedactionMapRow,
} from "@goldilocks/shared-types"
import { useImportsApi } from "@/api/imports.api"
import { queryKeys } from "@/lib/query-keys"
import { readSheets } from "@/lib/workbook-file"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileDrop } from "./file-drop"

const LISTS: Record<BcHistoryKind, string> = {
    shipments: "Posted Sales Shipments",
    shipment_lines: "Posted Sales Shipment Lines",
    receipts: "Posted Purchase Receipts",
    ledger: "Item Ledger Entries",
}

type Loaded = Partial<Record<BcHistoryKind, { source: string; mapped: BcHistoryMapped }>>

const rowsOf = (m: BcHistoryMapped) => m.shipments.length + m.shipmentLines.length + m.receipts.length + m.ledger.length

const EVENT_LABEL: Record<ItemTraceEvent["kind"], string> = {
    RECEIVED: "Bought (received)",
    OPENING_BALANCE: "In stock when BC went live",
    ADJUSTED_IN: "Added by adjustment",
    ADJUSTED_OUT: "Removed by adjustment",
    TRANSFERRED: "Transferred",
    COLLECTED: "Collected by the customer",
    RETURNED_BY_CUSTOMER: "Returned by the customer",
    RETURNED_TO_VENDOR: "Returned to the vendor",
}

/**
 * Business Central history: drop the exported lists or paste them (Ctrl+C in BC). Names become redaction codes here,
 * in the browser, before anything is sent. After saving, look up any serial to see where it came from and who
 * collected it.
 */
export function BcHistoryTab({ map }: { map: RedactionMapRow[] | null }) {
    const api = useImportsApi()
    const queryClient = useQueryClient()
    const [loaded, setLoaded] = useState<Loaded>({})
    const [paste, setPaste] = useState("")
    const [reading, setReading] = useState(false)
    const [preview, setPreview] = useState<BcHistoryResult | null>(null)
    const [saved, setSaved] = useState<BcHistoryResult | null>(null)

    const take = (sheet: unknown[][], source: string) => {
        if (!map) return void toast.error("Load the redaction map first.")
        const mapped = mapBcHistory(sheet, buildNameLookup(map))
        if (!mapped.kind || rowsOf(mapped) === 0) return void toast.error(`${source}: not one of the four BC lists, or empty.`)
        setLoaded((prev) => ({ ...prev, [mapped.kind!]: { source, mapped } }))
        setPreview(null)
        setSaved(null)
        toast.success(`${LISTS[mapped.kind]}: ${rowsOf(mapped).toLocaleString()} rows`)
    }

    const loadFile = async (file: File) => {
        if (!/\.xlsx$/i.test(file.name)) return void toast.error("Choose an .xlsx file, or paste the list instead.")
        setReading(true)
        try {
            const sheets = await readSheets(file)
            const first = Object.values(sheets)[0]
            if (first) take(first as unknown[][], file.name)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not read that file.")
        } finally {
            setReading(false)
        }
    }

    const addPaste = () => {
        if (!paste.trim()) return
        take(parsePastedTable(paste), "Pasted list")
        setPaste("")
    }

    const request = (): BcHistoryRequest => ({
        fileNames: Object.values(loaded).map((l) => l!.source),
        shipments: loaded.shipments?.mapped.shipments ?? [],
        shipmentLines: loaded.shipment_lines?.mapped.shipmentLines ?? [],
        receipts: loaded.receipts?.mapped.receipts ?? [],
        ledger: loaded.ledger?.mapped.ledger ?? [],
    })
    const check = useMutation({ mutationFn: () => api.previewBcHistory(request()), onSuccess: setPreview, onError: (e: Error) => toast.error(e.message) })
    const save = useMutation({
        mutationFn: () => api.commitBcHistory(request()),
        onSuccess: (r) => {
            setSaved(r)
            toast.success("BC history saved")
            void queryClient.invalidateQueries({ queryKey: ["imports", "batches"] })
            void queryClient.invalidateQueries({ queryKey: ["items"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })
    const reset = () => {
        setLoaded({})
        setPreview(null)
        setSaved(null)
    }

    const unmapped = Object.values(loaded).reduce((n, l) => n + (l?.mapped.unmappedNames ?? 0), 0)
    const shown = saved ?? preview
    const any = Object.keys(loaded).length > 0

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Business Central lists</CardTitle>
                    <CardDescription>
                        Posted Sales Shipments, Posted Sales Shipment Lines, Posted Purchase Receipts and Item Ledger Entries. Drop the exported .xlsx files or paste a list
                        copied from BC. Each list is recognised by its columns; loading one again replaces it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FileDrop
                        title={map ? "Drop a BC list here" : "Load the redaction map above first"}
                        hint="One .xlsx at a time. The serials come from the item tracking entries in the assembled workbook."
                        busy={reading}
                        onFile={(f) => void loadFile(f)}
                    />
                    <div className="space-y-2">
                        <label htmlFor="bc-history-paste" className="text-sm font-medium">
                            Or paste a list (select the rows in BC, Ctrl+C, paste here)
                        </label>
                        <Textarea id="bc-history-paste" rows={4} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="No.	Sell-to Customer No.	…" />
                        <Button variant="outline" onClick={addPaste} disabled={!paste.trim() || !map}>
                            Add pasted list
                        </Button>
                    </div>
                    <ul className="grid gap-2 text-sm sm:grid-cols-2">
                        {(Object.keys(LISTS) as BcHistoryKind[]).map((k) => (
                            <li key={k} className="flex justify-between gap-2 rounded-md border px-3 py-2">
                                <span>{LISTS[k]}</span>
                                <span className="text-muted-foreground tabular-nums">{loaded[k] ? `${rowsOf(loaded[k]!.mapped).toLocaleString()} rows` : "not loaded"}</span>
                            </li>
                        ))}
                    </ul>
                    {unmapped > 0 && <p className="text-muted-foreground text-sm">{unmapped} names are not in your map. Those rows are saved without a customer.</p>}
                    {any && !saved && (
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={reset} disabled={check.isPending || save.isPending}>
                                Clear
                            </Button>
                            <Button variant="outline" onClick={() => check.mutate()} disabled={check.isPending || save.isPending}>
                                {check.isPending ? "Checking..." : preview ? "Check again" : "Check against Goldilocks"}
                            </Button>
                            <Button onClick={() => save.mutate()} disabled={!preview || save.isPending}>
                                {save.isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                    {saved && <Button onClick={reset}>Import more lists</Button>}
                </CardContent>
            </Card>

            {shown && <ResultCard result={shown} saved={!!saved} />}
            <SerialTrace />
        </div>
    )
}

function ResultCard({ result, saved }: { result: BcHistoryResult; saved: boolean }) {
    const tables = [
        ["Shipments", result.shipments],
        ["Shipment lines", result.shipmentLines],
        ["Receipts", result.receipts],
        ["Ledger entries", result.ledger],
    ] as const
    const facts = [
        ["Shipments linked to a sale", result.shipmentsToTrades],
        ["Shipments linked to a Zoho invoice", result.shipmentsToZohoInvoices],
        ["Shipped but not collected in the tradesheet", result.shippedNotCollected],
        ["Customers given a BC number", result.customersLinked],
        ["BC number differs from the one saved", result.customerConflicts],
        ["Customer codes the app does not know", result.unknownCustomerCodes],
        ["New bars", result.itemsAdded],
        ["Bars whose status changes", result.itemsUpdated],
        ["New events", result.eventsAdded],
        ["Serials waiting for their ledger entry", result.trackingWithoutLedger],
    ] as const
    return (
        <Card>
            <CardHeader>
                <CardTitle>{saved ? "Saved" : "What saving would do"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full tabular-nums">
                        <thead className="text-muted-foreground text-left">
                            <tr>
                                <th className="py-1 font-medium">List</th>
                                <th className="py-1 text-right font-medium">Added</th>
                                <th className="py-1 text-right font-medium">Changed</th>
                                <th className="py-1 text-right font-medium">Unchanged</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map(([label, c]) => (
                                <tr key={label} className="border-t">
                                    <td className="py-1">{label}</td>
                                    <td className="py-1 text-right">{c.added.toLocaleString()}</td>
                                    <td className="py-1 text-right">{c.changed.toLocaleString()}</td>
                                    <td className="py-1 text-right">{c.unchanged.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {facts.map(([label, n]) => (
                        <div key={label}>
                            <div className="text-muted-foreground">{label}</div>
                            <div className="text-lg font-semibold tabular-nums">{n.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

/** Look up one serial: its product, where it is now, and every event from receipt to collection. */
function SerialTrace() {
    const api = useImportsApi()
    const [input, setInput] = useState("")
    const [serial, setSerial] = useState("")
    const trace = useQuery({
        queryKey: queryKeys.items.trace(serial),
        queryFn: () => api.traceItem(serial),
        enabled: serial.length >= 3,
        retry: false,
    })
    const submit = (e: FormEvent) => {
        e.preventDefault()
        setSerial(input.trim())
    }
    const item = trace.data
    return (
        <Card>
            <CardHeader>
                <CardTitle>Find a serial</CardTitle>
                <CardDescription>Where a bar came from and who collected it. Customers show by their code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={submit} className="flex flex-wrap gap-2">
                    <label htmlFor="serial-search" className="sr-only">
                        Serial number
                    </label>
                    <Input id="serial-search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 1334834" className="max-w-xs" />
                    <Button type="submit" disabled={input.trim().length < 3}>
                        Find
                    </Button>
                </form>
                {trace.isFetching && <p className="text-muted-foreground text-sm">Looking...</p>}
                {trace.isError && <p className="text-sm">No bar with that serial yet. It appears once its BC history is imported.</p>}
                {item && (
                    <div className="space-y-3 text-sm">
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                            <span className="font-medium">{item.serial}</span>
                            <span>{item.product ?? `BC item ${item.bcItemNo ?? "?"}`}</span>
                            <span className="text-muted-foreground">
                                {item.status.replace("_", " ").toLowerCase()}
                                {item.locationCode ? ` · ${item.locationCode}` : ""}
                            </span>
                        </div>
                        <ol className="space-y-2 border-l pl-4">
                            {item.events.map((e, i) => (
                                <li key={i}>
                                    <div className="font-medium">{EVENT_LABEL[e.kind]}</div>
                                    <div className="text-muted-foreground tabular-nums">
                                        {[e.date, e.sourceRef, e.partyNo, e.customerCode, e.tradeReference, e.locationCode].filter(Boolean).join(" · ")}
                                        {e.amount !== null ? ` · €${e.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
