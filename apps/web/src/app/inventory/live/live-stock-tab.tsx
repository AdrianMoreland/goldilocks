import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, FileSpreadsheet, Plus, Search, Upload } from "lucide-react"
import { LIVE_BRANCH_NAMES, sortBranchCodes, type LiveMetal, type LiveStockLine } from "@goldilocks/shared-types"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CountTabs } from "@/components/ui/count-tabs"
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

const branchName = (code: string, fallback: string) => LIVE_BRANCH_NAMES[code] ?? fallback

/**
 * Live branch stock: what each branch holds now, editable at the counter. A branch is chosen from the tabs; inside it
 * the metal (gold or silver) is a separate control. Bars show one total per weight and open to their refineries and
 * serials; coins list every weight with its own count (a family total would add unlike things together).
 */
export function LiveStockTab() {
    const { isAdmin } = useAuth()
    const branches = useBranches()
    const [picked, setPicked] = useState<string | null>(null)
    const [metal, setMetal] = useState<LiveMetal>("GOLD")
    const [query, setQuery] = useState("")
    const [showAll, setShowAll] = useState(false)
    const [open, setOpen] = useState<Set<string>>(new Set())
    const [dialog, setDialog] = useState<Dialog>(null)

    const list = useMemo(() => sortBranchCodes(branches.data?.branches ?? []), [branches.data])
    // Your own branch when it is linked, otherwise Dublin (the main branch), otherwise the first.
    const branch = picked ?? branches.data?.mine ?? (list.find((b) => b.code === "DU") ?? list[0])?.code
    const current = list.find((b) => b.code === branch)
    const board = useBoard(branch, metal)
    const m = useBoardMutations(branch ?? "", metal)
    const canEdit = Boolean(current?.canEdit)

    const lines = useMemo(() => board.data?.lines ?? [], [board.data])
    const searching = query.trim() !== ""
    const coins = useMemo(() => groupCoins(lines, { showAll, query }), [lines, showAll, query])
    const bars = useMemo(() => groupBars(lines, { showAll, query }), [lines, showAll, query])
    const coinTotal = coins.reduce((n, f) => n + f.total, 0)
    const barTotal = bars.reduce((n, w) => n + w.total, 0)
    const allOpen = bars.length > 0 && bars.every((w) => open.has(w.variant))

    const toggle = (variant: string) =>
        setOpen((cur) => {
            const next = new Set(cur)
            if (next.has(variant)) next.delete(variant)
            else next.add(variant)
            return next
        })

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
            <CountTabs
                aria-label="Branch"
                value={branch ?? ""}
                onValueChange={(v) => {
                    setPicked(v)
                    setOpen(new Set())
                }}
                items={list.map((b) => ({ value: b.code, label: branchName(b.code, b.name) }))}
                className="[&_button]:text-base"
            />

            <div className="bg-card space-y-4 rounded-xl border p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Metal</span>
                        <div role="group" aria-label="Metal" className="bg-muted inline-flex rounded-lg p-1">
                            {METALS.map((x) => (
                                <button
                                    key={x.value}
                                    type="button"
                                    aria-pressed={x.value === metal}
                                    onClick={() => setMetal(x.value)}
                                    className={cn(
                                        "h-10 min-w-24 rounded-md px-4 text-sm font-medium transition-colors",
                                        x.value === metal ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {x.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative min-w-48 flex-1 sm:max-w-xs">
                        <Search className="text-muted-foreground absolute top-3 left-3 size-5" />
                        <Input aria-label="Search stock" className="h-11 pl-10" placeholder="Search coin, weight, refinery, serial" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <label className="flex min-h-11 items-center gap-2 text-sm">
                        <input type="checkbox" className="size-5" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
                        Show empty
                    </label>
                    <div className="ml-auto flex flex-wrap gap-2">
                        {isAdmin && (
                            <>
                                <Button asChild variant="outline" className="h-11 gap-2">
                                    <Link to="/import">
                                        <FileSpreadsheet className="size-4" />
                                        Tradesheet
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-11 gap-2" onClick={() => setDialog({ kind: "baseline" })}>
                                    <Upload className="size-4" />
                                    Load stock sheet
                                </Button>
                            </>
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
                    {!canEdit && current && <span className="bg-muted rounded px-2 py-0.5 text-xs">View only. Ask an admin to link your branch to edit {branchName(current.code, current.name)}.</span>}
                </div>
            </div>

            {board.isLoading ? (
                <Skeleton className="h-64 w-full" />
            ) : coins.length === 0 && bars.length === 0 ? (
                <Empty name={current ? branchName(current.code, current.name) : ""} metal={metal} searching={searching} showAll={showAll} isAdmin={isAdmin} onLoad={() => setDialog({ kind: "baseline" })} />
            ) : (
                <div className="space-y-6">
                    {bars.length > 0 && (
                        <section aria-label="Bars" className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold tracking-wide uppercase">Bars</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9"
                                    onClick={() => setOpen(allOpen ? new Set() : new Set(bars.map((w) => w.variant)))}
                                >
                                    {allOpen ? "Collapse all" : "Show refineries"}
                                </Button>
                            </div>
                            <div className="grid items-start gap-3 lg:grid-cols-2">
                                {bars.map((w) => {
                                    const isOpen = searching || open.has(w.variant)
                                    return (
                                        <Card key={w.variant} className="gap-0 py-0">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                onClick={() => toggle(w.variant)}
                                                className="hover:bg-muted/50 flex min-h-16 w-full items-center justify-between rounded-xl px-4 py-3 text-left"
                                            >
                                                <span className="text-xl font-semibold">{w.variant}</span>
                                                <span className="flex items-center gap-3">
                                                    <span className="text-muted-foreground text-xs">{w.lines.length} refiner{w.lines.length === 1 ? "y" : "ies"}</span>
                                                    <span className="text-2xl font-semibold tabular-nums">{w.total}</span>
                                                    <ChevronDown className={cn("text-muted-foreground size-5 transition-transform", isOpen && "rotate-180")} />
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <CardContent className="divide-y border-t px-1 py-1">
                                                    {w.lines.map((l) => (
                                                        <StockRow key={l.id} line={l} label={l.refinery ? titleCase(l.refinery) : "No refinery noted"} actions={actions} />
                                                    ))}
                                                </CardContent>
                                            )}
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                    {coins.length > 0 && (
                        <section aria-label="Coins" className="space-y-2">
                            <h3 className="text-sm font-semibold tracking-wide uppercase">Coins</h3>
                            <div className="grid items-start gap-3 lg:grid-cols-2">
                                {coins.map((f) => (
                                    <Card key={f.family} className="gap-0 py-0">
                                        <CardHeader className="border-b px-4 py-3">
                                            <CardTitle className="text-xl">{f.family}</CardTitle>
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
                <TransferDialog
                    line={dialog.line}
                    branches={list.map((b) => ({ ...b, name: branchName(b.code, b.name) }))}
                    onClose={() => setDialog(null)}
                    onSave={(body) => m.transfer.mutate({ lineId: dialog.line.id, body: { ...body, note: body.note || undefined } })}
                />
            )}
            {dialog?.kind === "add" && branch && (
                <AddLineDialog
                    branch={branchName(branch, branch)}
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

function Empty({ name, metal, searching, showAll, isAdmin, onLoad }: { name: string; metal: string; searching: boolean; showAll: boolean; isAdmin: boolean; onLoad: () => void }) {
    return (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            {searching ? (
                <>Nothing matches that search.</>
            ) : (
                <>
                    <p>
                        No {metal.toLowerCase()} stock recorded for {name}
                        {showAll ? "" : " (empty lines are hidden)"}.
                    </p>
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
