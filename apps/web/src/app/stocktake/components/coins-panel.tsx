import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { parseCoinsPaste, STOCK_METALS, type StockMetal, type StocktakeCoin, type StocktakeDetail } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/** Coins are counted by product and quantity. The previous count is a reference only; the count stays blank until entered. */
export function CoinsPanel({ stocktake, locked }: { stocktake: StocktakeDetail; locked: boolean }) {
    const api = useStocktakeApi()
    const qc = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: queryKeys.stocktake.register(stocktake.id), queryFn: () => api.register(stocktake.id) })
    const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.stocktake.register(stocktake.id) })
    const fail = (e: Error) => toast.error(e.message)

    const [metal, setMetal] = useState<StockMetal>("GOLD")
    const [paste, setPaste] = useState("")
    const [item, setItem] = useState("")
    const [location, setLocation] = useState("")

    const update = useMutation({
        mutationFn: ({ id, body }: { id: number; body: Parameters<typeof api.updateCoin>[2] }) => api.updateCoin(stocktake.id, id, body),
        onSuccess: refresh,
        onError: fail,
    })
    const importCoins = useMutation({
        mutationFn: () => api.importCoins(stocktake.id, metal, paste),
        onSuccess: (r) => {
            toast.success(`${r.added} coin lines added, ${r.skipped} already there`)
            setPaste("")
            refresh()
        },
        onError: fail,
    })
    const add = useMutation({
        mutationFn: () => api.addCoin(stocktake.id, { metal, item: item.trim(), locationCode: location.trim() }),
        onSuccess: () => {
            setItem("")
            refresh()
        },
        onError: fail,
    })

    const rows = useMemo(() => (data?.coins ?? []).filter((c) => c.metal === metal), [data, metal])
    const preview = paste.trim() ? parseCoinsPaste(paste) : null
    const open = rows.filter((c) => c.countedQty === null).length

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
                    {rows.length} coin lines · {open} not counted yet
                </span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead className="text-right">Last count</TableHead>
                            <TableHead className="text-right">Counted now</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((c) => (
                            <CoinRow key={c.id} coin={c} locked={locked} onSave={(body) => update.mutate({ id: c.id, body })} />
                        ))}
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-muted-foreground text-center text-sm">
                                    No coin lines yet. Carry forward from the Bars tab, paste last month's quantities, or add a line below.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {!locked && (
                <>
                    <form
                        className="flex flex-wrap gap-2 rounded-lg border p-3"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (item.trim()) add.mutate()
                        }}
                    >
                        <Input className="max-w-xs" placeholder="Item, e.g. 1oz Krugerrand" value={item} onChange={(e) => setItem(e.target.value)} />
                        <Input className="w-28" placeholder="Branch (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <Button type="submit" disabled={!item.trim() || add.isPending} className="cursor-pointer">
                            Add coin line
                        </Button>
                    </form>
                    <div className="space-y-2 rounded-lg border p-3">
                        <p className="text-sm font-medium">Paste last month's quantities</p>
                        <p className="text-muted-foreground text-xs">Columns: Item and Quantity, plus Branch if counts are per branch. These become the "Last count" reference. Pasting again adds nothing new.</p>
                        <Textarea rows={4} className="font-mono text-xs" value={paste} onChange={(e) => setPaste(e.target.value)} />
                        {preview && (
                            <p className="text-sm">
                                {preview.rows.length} lines ready{preview.issues.length > 0 && <span className="text-destructive"> · {preview.issues.length} rejected: {preview.issues[0]?.message}</span>}
                            </p>
                        )}
                        <Button size="sm" className="cursor-pointer" disabled={!preview || preview.rows.length === 0 || importCoins.isPending} onClick={() => importCoins.mutate()}>
                            Import {preview?.rows.length ?? 0} lines
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

function CoinRow({ coin, locked, onSave }: { coin: StocktakeCoin; locked: boolean; onSave: (body: { countedQty?: number | null; details?: string | null }) => void }) {
    const change = coin.countedQty !== null && coin.previousQty !== null ? coin.countedQty - coin.previousQty : null
    return (
        <TableRow>
            <TableCell>{coin.item}</TableCell>
            <TableCell>{coin.locationCode}</TableCell>
            <TableCell className="text-right tabular-nums">{coin.previousQty ?? "—"}</TableCell>
            <TableCell>
                <Input
                    key={`q-${coin.id}-${coin.countedQty ?? "x"}`}
                    type="number"
                    min={0}
                    className="ml-auto h-8 w-24 text-right"
                    defaultValue={coin.countedQty ?? ""}
                    disabled={locked}
                    onBlur={(e) => {
                        const t = e.target.value.trim()
                        const next = t === "" ? null : Number(t)
                        if (next !== null && (!Number.isInteger(next) || next < 0)) return
                        if (next !== coin.countedQty) onSave({ countedQty: next })
                    }}
                />
            </TableCell>
            <TableCell className={cn("text-right tabular-nums", change !== null && change !== 0 && "font-medium text-amber-700 dark:text-amber-400")}>{change === null ? "—" : change > 0 ? `+${change}` : change}</TableCell>
            <TableCell>
                <Input key={`d-${coin.id}-${coin.details ?? ""}`} className="h-8 w-48" defaultValue={coin.details ?? ""} disabled={locked} onBlur={(e) => e.target.value !== (coin.details ?? "") && onSave({ details: e.target.value || null })} />
            </TableCell>
        </TableRow>
    )
}
