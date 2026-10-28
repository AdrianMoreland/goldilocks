import { useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { compareSerials, onHandSerials, parseTrackingPaste, splitSerials, type StocktakeDetail } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Props {
    stocktake: StocktakeDetail
    locked: boolean
    onChanged: () => void
}

const List = ({ title, items }: { title: string; items: string[] }) =>
    items.length === 0 ? null : (
        <div>
            <p className="text-sm font-medium">
                {title} ({items.length})
            </p>
            <p className="text-muted-foreground font-mono text-xs break-words">{items.join(", ")}</p>
        </div>
    )

/**
 * Serial check for one item and location. The Item Tracking Entries paste stays in the browser: it is only
 * used to compare against what was found on the shelf. A bar with no serial is still a counted bar, so a
 * serial gap here never changes the quantity count.
 */
export function SerialsPanel({ stocktake, locked, onChanged }: Props) {
    const api = useStocktakeApi()
    const [trackingText, setTrackingText] = useState("")
    const [lineKey, setLineKey] = useState("")
    const [foundText, setFoundText] = useState("")

    const tracking = useMemo(() => (trackingText.trim() ? parseTrackingPaste(trackingText) : null), [trackingText])
    const line = stocktake.lines.find((l) => `${l.itemNo}|${l.locationCode}` === lineKey)

    const result = useMemo(() => {
        if (!tracking || !line) return null
        const expected = onHandSerials(tracking.entries, line.itemNo, line.locationCode)
        const cmp = compareSerials(expected, splitSerials(foundText))
        // Serials BC does not hold: the count of units BC expects less the serials it lists.
        const untracked = Math.max(0, line.qtyCalculated - expected.length)
        return { expected, cmp, untracked }
    }, [tracking, line, foundText])

    const add = useMutation({
        mutationFn: () => {
            if (!line || !result) throw new Error("Pick a line first")
            const { cmp } = result
            return api.addDiscrepancy(stocktake.id, {
                itemNo: line.itemNo,
                description: line.description,
                issueType: "SERIAL",
                bcShows: `${result.expected.length} serials on hand${cmp.missing.length ? `; not found: ${cmp.missing.join(", ")}` : ""}`,
                physicalFound: `${cmp.matched.length + cmp.unexpected.length} serials read${cmp.unexpected.length ? `; not in BC: ${cmp.unexpected.join(", ")}` : ""}`,
                serialNo: [...cmp.missing, ...cmp.unexpected].join(", ") || null,
                action: "",
            })
        },
        onSuccess: () => {
            toast.success("Added to the register")
            onChanged()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const clean = result && result.cmp.missing.length === 0 && result.cmp.unexpected.length === 0 && result.cmp.duplicatesFound.length === 0

    return (
        <div className="grid gap-4 pt-3 lg:grid-cols-2">
            <div className="space-y-2">
                <p className="text-sm font-medium">1. Paste Item Tracking Entries</p>
                <Textarea
                    rows={7}
                    className="font-mono text-xs"
                    value={trackingText}
                    onChange={(e) => setTrackingText(e.target.value)}
                    placeholder="Positive	Document No.	Item No.	Location Code	Quantity	Serial No.	Remaining Quantity	Entry No."
                />
                {tracking && (
                    <p className="text-sm">
                        {tracking.entries.length} entries read
                        {tracking.issues.length > 0 && <span className="text-destructive"> · {tracking.issues[0]?.message}</span>}
                    </p>
                )}
                <p className="text-muted-foreground text-xs">Only entries with Remaining Quantity above zero count as on hand. Serial data in BC is incomplete, so a missing serial here is a flag, not proof.</p>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium">2. Pick the line and paste the serials found</p>
                <select
                    value={lineKey}
                    onChange={(e) => setLineKey(e.target.value)}
                    className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                    aria-label="Line"
                >
                    <option value="">Choose item and location…</option>
                    {stocktake.lines.map((l) => (
                        <option key={l.id} value={`${l.itemNo}|${l.locationCode}`}>
                            {l.itemNo} · {l.description} · {l.locationCode}
                        </option>
                    ))}
                </select>
                <Textarea
                    rows={5}
                    className="font-mono text-xs"
                    value={foundText}
                    onChange={(e) => setFoundText(e.target.value)}
                    placeholder="One serial per line, or separated by commas. Leave out bars with no serial."
                />
            </div>
            {result && line && (
                <div className="space-y-2 rounded-lg border p-3 lg:col-span-2">
                    <p className="text-sm">
                        BC lists <strong>{result.expected.length}</strong> serials for {line.qtyCalculated} units
                        {result.untracked > 0 && ` (${result.untracked} units have no serial in BC)`}. You entered <strong>{splitSerials(foundText).length}</strong>.
                    </p>
                    <List title="Matched" items={result.cmp.matched} />
                    <List title="In BC but not found" items={result.cmp.missing} />
                    <List title="Found but not in BC" items={result.cmp.unexpected} />
                    <List title="Entered more than once" items={result.cmp.duplicatesFound} />
                    <List title="Listed more than once in BC" items={result.cmp.duplicatesExpected} />
                    {clean && <p className="text-sm">Every serial entered matches BC. A matching quantity does not prove locations, so check those separately.</p>}
                    <Button size="sm" variant="outline" className="cursor-pointer" disabled={locked || clean || add.isPending} onClick={() => add.mutate()}>
                        Add to register
                    </Button>
                </div>
            )}
        </div>
    )
}
