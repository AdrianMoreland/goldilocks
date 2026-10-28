import { useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { computeVariance, type StocktakeDetail, type StocktakeLine } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Props {
    stocktake: StocktakeDetail
    locked: boolean
    onChanged: () => void
}

/** Blank means "not entered", never zero: the server treats null and 0 differently until the line is counted. */
const toCount = (raw: string): number | null => {
    const t = raw.trim()
    if (t === "") return null
    const n = Number(t)
    return Number.isInteger(n) && n >= 0 ? n : null
}

export function CountPanel({ stocktake, locked, onChanged }: Props) {
    const [location, setLocation] = useState("all")
    const [onlyOpen, setOnlyOpen] = useState(false)
    const [q, setQ] = useState("")

    const locations = useMemo(() => [...new Set(stocktake.lines.map((l) => l.locationCode))].sort(), [stocktake.lines])
    const rows = useMemo(() => {
        const needle = q.trim().toLowerCase()
        return stocktake.lines.filter(
            (l) =>
                (location === "all" || l.locationCode === location) &&
                (!onlyOpen || !l.counted) &&
                (!needle || l.itemNo.toLowerCase().includes(needle) || l.description.toLowerCase().includes(needle)),
        )
    }, [stocktake.lines, location, onlyOpen, q])

    if (stocktake.lines.length === 0) {
        return <p className="text-muted-foreground py-6 text-sm">No lines yet. Paste the Physical Inventory Journal on the Import tab.</p>
    }

    return (
        <div className="space-y-3 pt-3">
            <div className="flex flex-wrap items-center gap-3">
                <Input placeholder="Search item or description" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                    aria-label="Location"
                >
                    <option value="all">All locations</option>
                    {locations.map((l) => (
                        <option key={l} value={l}>
                            {l}
                        </option>
                    ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={onlyOpen} onCheckedChange={(v) => setOnlyOpen(v === true)} /> Not counted yet
                </label>
                <span className="text-muted-foreground ml-auto text-xs">Variance = Calculated − (normal + customer). Negative means more was found than BC expects.</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Loc.</TableHead>
                            <TableHead className="text-right">BC qty</TableHead>
                            <TableHead className="text-right">Normal safe</TableHead>
                            <TableHead className="text-right">Customer safe</TableHead>
                            <TableHead className="text-center">Counted</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Serials checked</TableHead>
                            <TableHead>Serial note</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((line) => (
                            <CountRow key={line.id} stocktakeId={stocktake.id} line={line} locked={locked} onChanged={onChanged} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function CountRow({ stocktakeId, line, locked, onChanged }: { stocktakeId: number; line: StocktakeLine; locked: boolean; onChanged: () => void }) {
    const api = useStocktakeApi()
    const save = useMutation({
        mutationFn: (body: Parameters<typeof api.updateLine>[2]) => api.updateLine(stocktakeId, line.id, body),
        onSuccess: onChanged,
        onError: (e: Error) => toast.error(`${line.itemNo}: ${e.message}`),
    })
    // Rows are remounted by key when the server copy changes, so defaultValue always shows what was saved.
    const variance = computeVariance(line.qtyCalculated, line.countedNormal, line.countedCustomer, line.counted)
    const field = (key: "countedNormal" | "countedCustomer", current: number | null) => (
        <Input
            key={`${key}-${current ?? "x"}`}
            type="number"
            min={0}
            inputMode="numeric"
            className="ml-auto h-8 w-20 text-right"
            defaultValue={current ?? ""}
            disabled={locked}
            onBlur={(e) => {
                const next = toCount(e.target.value)
                if (next !== current) save.mutate({ [key]: next })
            }}
        />
    )

    return (
        <TableRow className={cn(variance !== null && variance !== 0 && "bg-amber-500/10")}>
            <TableCell className="font-mono text-xs">{line.itemNo}</TableCell>
            <TableCell className="max-w-64 truncate" title={line.description}>
                {line.description}
            </TableCell>
            <TableCell>{line.locationCode}</TableCell>
            <TableCell className="text-right tabular-nums">{line.qtyCalculated}</TableCell>
            <TableCell>{field("countedNormal", line.countedNormal)}</TableCell>
            <TableCell>{field("countedCustomer", line.countedCustomer)}</TableCell>
            <TableCell className="text-center">
                <Checkbox
                    checked={line.counted}
                    disabled={locked}
                    onCheckedChange={(v) => save.mutate({ counted: v === true })}
                    aria-label={`Mark ${line.itemNo} counted`}
                />
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">{variance ?? "—"}</TableCell>
            <TableCell>
                <Input
                    key={`reason-${line.reason ?? ""}`}
                    className="h-8 w-40"
                    defaultValue={line.reason ?? ""}
                    disabled={locked}
                    onBlur={(e) => e.target.value !== (line.reason ?? "") && save.mutate({ reason: e.target.value || null })}
                />
            </TableCell>
            <TableCell>
                <select
                    value={line.serialsChecked ?? ""}
                    disabled={locked}
                    onChange={(e) => save.mutate({ serialsChecked: (e.target.value || null) as StocktakeLine["serialsChecked"] })}
                    className="border-input bg-background h-8 rounded-md border px-1 text-sm"
                    aria-label={`Serials checked for ${line.itemNo}`}
                >
                    <option value="">—</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="NA">N/A</option>
                </select>
            </TableCell>
            <TableCell>
                <Input
                    key={`note-${line.serialNote ?? ""}`}
                    className="h-8 w-48"
                    defaultValue={line.serialNote ?? ""}
                    disabled={locked}
                    onBlur={(e) => e.target.value !== (line.serialNote ?? "") && save.mutate({ serialNote: e.target.value || null })}
                />
            </TableCell>
        </TableRow>
    )
}
