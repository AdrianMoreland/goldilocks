import { useMemo, useState } from "react"
import { Plus, Search, Upload } from "lucide-react"
import type { LiveMetal, LiveStockLine } from "@goldilocks/shared-types"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { BaselineDialog } from "./baseline-dialog"
import { AddLineDialog, EditCountDialog, HistoryDialog, TransferDialog } from "./dialogs"
import { groupBars, groupCoins, lineName, titleCase } from "./live-stock-model"
import { StockRow, type RowActions } from "./stock-row"
import { useBoard, useBoardMutations, useBranches } from "./use-live-stock"

const METALS: { value: LiveMetal; label: string }[] = [
    { value: "GOLD", label: "Gold" },
    { value: "SILVER", label: "Silver" },
]

type Dialog = { kind: "edit" | "history" | "transfer"; line: LiveStockLine } | { kind: "add" } | { kind: "baseline" } | null

/**
 * Live branch stock: what each branch holds now, editable at the counter. Coins by family, bars by weight with their
 * refineries and serials. Every change keeps a reason and who made it, and can be undone from its toast or the line's
 * history. This replaces the monthly Google "Stock" sheet.
 */
export function LiveStockTab() {
    const { isAdmin } = useAuth()
    const branches = useBranches()
    const [picked, setPicked] = useState<string | null>(null)
    const [metal, setMetal] = useState<LiveMetal>("GOLD")
    const [query, setQuery] = useState("")
    const [showAll, setShowAll] = useState(false)
    const [dialog, setDialog] = useState<Dialog>(null)

    const list = branches.data?.branches ?? []
    const branch = picked ?? branches.data?.mine ?? list[0]?.code
    const current = list.find((b) => b.code === branch)
    const board = useBoard(branch, metal)
    const m = useBoardMutations(branch ?? "", metal)
    const canEdit = Boolean(current?.canEdit)

    const lines = useMemo(() => board.data?.lines ?? [], [board.data])
    const opts = { showAll, query }
    const coins = useMemo(() => groupCoins(lines, opts), [lines, showAll, query]) // eslint-disable-line react-hooks/exhaustive-deps
    const bars = useMemo(() => groupBars(lines, opts), [lines, showAll, query]) // eslint-disable-line react-hooks/exhaustive-deps
    const coinTotal = coins.reduce((n, f) => n + f.total, 0)
    const barTotal = bars.reduce((n, w) => n + w.total, 0)

    const actions: RowActions = {
        canEdit,
        onStep: (line, delta) => m.adjust.mutate({ lineId: line.id, body: { delta, reason: "Quick change" }, label: lineName(line) }),
        onEdit: (line) => setDialog({ kind: "edit", line }),
        onHistory: (line) => setDialog({ kind: "history", line }),
        onTransfer: (line) => setDialog({ kind: "transfer", line }),
        onAddSerial: (line, serial) => m.addBar.mutate({ lineId: line.id, body: { serial, reason: "Serial added" } }),
        onBarStatus: (barId, status) => m.barStatus.mutate({ barId, body: { status, reason: status === "SOLD" ? "Sold" : "Removed" } }),
    }

    if (branches.isLoading) return <Skeleton className="h-64 w-full" />
    if (list.length === 0) return <p className="text-muted-foreground text-sm">No stock locations are set up yet.</p>

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div role="group" aria-label="Branch" className="flex gap-1">
                    {list.map((b) => (
                        <Button key={b.code} variant={b.code === branch ? "default" : "outline"} className="h-11 min-w-14" aria-pressed={b.code === branch} onClick={() => setPicked(b.code)}>
                            {b.code}
                        </Button>
                    ))}
                </div>
                <div role="group" aria-label="Metal" className="flex gap-1">
                    {METALS.map((x) => (
                        <Button key={x.value} variant={x.value === metal ? "secondary" : "ghost"} className={cn("h-11", x.value === metal && "font-semibold")} aria-pressed={x.value === metal} onClick={() => setMetal(x.value)}>
                            {x.label}
                        </Button>
                    ))}
                </div>
                <div className="relative min-w-48 flex-1 sm:max-w-xs">
                    <Search className="text-muted-foreground absolute top-3 left-3 size-5" />
                    <Input aria-label="Search stock" className="h-11 pl-10" placeholder="Search coin, weight, refinery, serial" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" className="size-5" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
                    Show empty
                </label>
                <div className="ml-auto flex gap-2">
                    {isAdmin && (
                        <Button variant="outline" className="h-11 gap-2" onClick={() => setDialog({ kind: "baseline" })}>
                            <Upload className="size-4" />
                            Load stock sheet
                        </Button>
                    )}
                    {canEdit && (
                        <Button className="h-11 gap-2" onClick={() => setDialog({ kind: "add" })}>
                            <Plus className="size-4" />
                            Add line
                        </Button>
                    )}
                </div>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 text-sm">
                <span>
                    <span className="text-foreground text-lg font-semibold tabular-nums">{coinTotal}</span> coins
                </span>
                <span>
                    <span className="text-foreground text-lg font-semibold tabular-nums">{barTotal}</span> bars
                </span>
                {current?.cutoverDate && <span>Counts loaded from the stock sheet of {current.cutoverDate}</span>}
                {!canEdit && current && <span className="rounded bg-muted px-2 py-0.5 text-xs">View only. Ask an admin to link your branch to edit {current.code}.</span>}
            </div>

            {board.isLoading ? (
                <Skeleton className="h-64 w-full" />
            ) : coins.length === 0 && bars.length === 0 ? (
                <Empty branch={branch ?? ""} metal={metal} searching={query.trim() !== ""} showAll={showAll} isAdmin={isAdmin} onLoad={() => setDialog({ kind: "baseline" })} />
            ) : (
                <div className="space-y-6">
                    {bars.length > 0 && (
                        <section aria-label="Bars" className="space-y-2">
                            <h3 className="text-sm font-semibold tracking-wide uppercase">Bars</h3>
                            <div className="grid gap-3 lg:grid-cols-2">
                                {bars.map((w) => (
                                    <Card key={w.variant} className="gap-0 py-0">
                                        <CardHeader className="flex flex-row items-baseline justify-between border-b px-4 py-3">
                                            <CardTitle className="text-xl">{w.variant}</CardTitle>
                                            <span className="text-2xl font-semibold tabular-nums">{w.total}</span>
                                        </CardHeader>
                                        <CardContent className="divide-y px-1 py-1">
                                            {w.lines.map((l) => (
                                                <StockRow key={l.id} line={l} label={l.refinery ? titleCase(l.refinery) : "No refinery noted"} actions={actions} />
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                    {coins.length > 0 && (
                        <section aria-label="Coins" className="space-y-2">
                            <h3 className="text-sm font-semibold tracking-wide uppercase">Coins</h3>
                            <div className="grid gap-3 lg:grid-cols-2">
                                {coins.map((f) => (
                                    <Card key={f.family} className="gap-0 py-0">
                                        <CardHeader className="flex flex-row items-baseline justify-between border-b px-4 py-3">
                                            <CardTitle className="text-xl">{f.family}</CardTitle>
                                            <span className="text-2xl font-semibold tabular-nums">{f.total}</span>
                                        </CardHeader>
                                        <CardContent className="divide-y px-1 py-1">
                                            {f.rows.map((l) => (
                                                <StockRow key={l.id} line={l} label={l.variant} actions={actions} />
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {dialog?.kind === "edit" && (
                <EditCountDialog
                    line={dialog.line}
                    onClose={() => setDialog(null)}
                    onSave={(qty, reason, note) => m.adjust.mutate({ lineId: dialog.line.id, body: { qty, reason, note: note || undefined }, label: lineName(dialog.line) })}
                />
            )}
            {dialog?.kind === "history" && <HistoryDialog line={dialog.line} canEdit={canEdit} onClose={() => setDialog(null)} onUndo={(id) => m.undo.mutate(id)} />}
            {dialog?.kind === "transfer" && (
                <TransferDialog line={dialog.line} branches={list} onClose={() => setDialog(null)} onSave={(body) => m.transfer.mutate({ lineId: dialog.line.id, body: { ...body, note: body.note || undefined } })} />
            )}
            {dialog?.kind === "add" && branch && (
                <AddLineDialog
                    branch={branch}
                    metal={metal}
                    families={[...new Set(lines.map((l) => l.family))].sort()}
                    onClose={() => setDialog(null)}
                    onSave={(v) => m.createLine.mutate({ ...v, branchCode: branch, metal })}
                />
            )}
            {dialog?.kind === "baseline" && <BaselineDialog onClose={() => setDialog(null)} />}
        </div>
    )
}

function Empty({ branch, metal, searching, showAll, isAdmin, onLoad }: { branch: string; metal: string; searching: boolean; showAll: boolean; isAdmin: boolean; onLoad: () => void }) {
    return (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            {searching ? (
                <>Nothing matches that search.</>
            ) : (
                <>
                    <p>No {metal.toLowerCase()} stock recorded for {branch}{showAll ? "" : " (empty lines are hidden)"}.</p>
                    {isAdmin && (
                        <Button variant="outline" className="mt-3" onClick={onLoad}>
                            Load the stock sheet
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}
