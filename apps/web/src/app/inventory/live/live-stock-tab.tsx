import { useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, FileSpreadsheet, Plus, Search, Upload } from "lucide-react"
import { LIVE_BRANCH_NAMES, sortBranchCodes, type LiveMetal, type LiveStockLine } from "@goldilocks/shared-types"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AllBranchesGrid } from "./all-branches-grid"
import { BaselineDialog } from "./baseline-dialog"
import { AddLineDialog, EditCountDialog, HistoryDialog, TransferDialog } from "./dialogs"
import { applyFilter, branchGrid, groupBars, groupCoins, lineName, summarise, type BoardSummary, type StockFilter } from "./live-stock-model"
import { BranchSheet, LineActionsSheet, SerialsSheet, type BranchChoice } from "./sheets"
import { LOW_PILL } from "./level-style"
import { BarWeightGroup, StockRow, type RowActions, type SerialActions } from "./stock-row"
import { useAllBoards, useBoard, useBoardMutations, useBranches } from "./use-live-stock"

// The metal family colours from the design system: the only fixed hex values allowed in component code.
const METALS: { value: LiveMetal; label: string; dot: string }[] = [
    { value: "GOLD", label: "Gold", dot: "bg-[#D4A017]" },
    { value: "SILVER", label: "Silver", dot: "bg-[#8B95A1]" },
]

type LineDialog = { kind: "edit" | "history" | "transfer" | "more" | "serials"; line: LiveStockLine }
type Dialog = LineDialog | { kind: "add" } | { kind: "baseline" } | { kind: "branch" } | null
type View = "branch" | "all"

/** The shared name table wins over the stored name, so a renamed location shows correctly before data catches up. */
const branchName = (code: string, fallback: string) => LIVE_BRANCH_NAMES[code] ?? fallback

const segment = "bg-muted inline-grid grid-flow-col gap-[3px] rounded-lg p-[3px]"
const segmentButton = (on: boolean) =>
    cn(
        "flex h-[40px] items-center justify-center gap-[6px] rounded-md px-[14px] text-[14px] font-semibold transition-colors",
        on ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
    )

/**
 * Live branch stock: what each branch holds now, editable at the counter. One branch at a time ("This branch"), or
 * every branch side by side to compare ("All branches"). The branch is one control: a list on the left on a wide
 * screen, a button that opens a sheet on a phone. The four numbers on top are filters. Bars show one total per
 * weight and open to their refineries; coins are grouped by family, one line per variant.
 */
export function LiveStockTab() {
    const { isAdmin } = useAuth()
    const branches = useBranches()
    const [view, setView] = useState<View>("branch")
    const [picked, setPicked] = useState<string | null>(null)
    const [metal, setMetal] = useState<LiveMetal>("GOLD")
    const [query, setQuery] = useState("")
    const [showAll, setShowAll] = useState(false)
    const [filter, setFilter] = useState<StockFilter | null>(null)
    const [open, setOpen] = useState<Set<string>>(new Set())
    const [dialog, setDialog] = useState<Dialog>(null)

    const list = useMemo(
        () => sortBranchCodes(branches.data?.branches ?? []).map((b) => ({ ...b, name: branchName(b.code, b.name) })),
        [branches.data],
    )
    // Your own branch when it is linked, otherwise Dublin (the main branch), otherwise the first.
    const branch = picked ?? branches.data?.mine ?? (list.find((b) => b.code === "DU") ?? list[0])?.code
    const current = list.find((b) => b.code === branch)
    const board = useBoard(branch, metal)
    const boards = useAllBoards(
        list.map((b) => b.code),
        metal,
    )
    const m = useBoardMutations(branch ?? "", metal)
    const canEdit = Boolean(current?.canEdit)

    const lines = useMemo(() => board.data?.lines ?? [], [board.data])
    const summary = useMemo(() => summarise(lines), [lines])
    const filtered = useMemo(() => applyFilter(lines, filter), [lines, filter])
    const searching = query.trim() !== ""
    const coins = useMemo(() => groupCoins(filtered, { showAll, query }), [filtered, showAll, query])
    const bars = useMemo(() => groupBars(filtered, { showAll, query }), [filtered, showAll, query])
    // Searching, or asking for the low or unpicked lines, means wanting to see those lines: open every weight.
    const forceOpen = searching || filter === "low" || filter === "pick"

    // Cheap to rebuild (a few hundred lines at most), so no memo keyed on every board.
    const boardData = boards.map((q) => q.data)
    const choices: BranchChoice[] = list.map((b, i) => {
        const d = boardData[i]
        return { code: b.code, name: b.name, summary: d ? summarise(d.lines) : undefined }
    })
    const grid = branchGrid(list.flatMap((b, i) => {
        const d = boardData[i]
        return d ? [{ code: b.code, lines: d.lines }] : []
    }))

    // Dialogs keep the line they opened on; show its newest numbers after each change.
    const fresh = (l: LiveStockLine) => lines.find((x) => x.id === l.id) ?? l

    const toggle = (variant: string) =>
        setOpen((cur) => {
            const next = new Set(cur)
            if (next.has(variant)) next.delete(variant)
            else next.add(variant)
            return next
        })

    const pickBranch = (code: string) => {
        setPicked(code)
        setView("branch")
        setOpen(new Set())
    }

    const actions: RowActions = {
        canEdit,
        onStep: (line, delta) => m.adjust.mutate({ lineId: line.id, body: { delta, reason: "Quick change" }, label: lineName(line) }),
        onEdit: (line) => setDialog({ kind: "edit", line }),
        onMore: (line) => setDialog({ kind: "more", line }),
        onSerials: (line) => setDialog({ kind: "serials", line }),
    }
    const serialActions: SerialActions = {
        canEdit,
        onAddSerial: (line, serial) => m.addBar.mutate({ lineId: line.id, body: { serial, reason: "Serial added" } }),
        onBarStatus: (barId, status) => m.barStatus.mutate({ barId, body: { status, reason: status === "SOLD" ? "Sold" : "Removed" } }),
    }

    if (branches.isLoading) return <Skeleton className="h-64 w-full" />
    if (list.length === 0) return <p className="text-muted-foreground text-sm">No stock locations are set up yet.</p>

    const coinTotal = coins.reduce((n, f) => n + f.total, 0)
    const barTotal = bars.reduce((n, w) => n + w.total, 0)
    const showBars = filter !== "coins"
    const showCoins = filter !== "bars"
    const nothing = (!showBars || bars.length === 0) && (!showCoins || coins.length === 0)

    return (
        <div className="@container/live space-y-[12px]">
            <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <div role="group" aria-label="Live stock view" className={segment}>
                    <button type="button" aria-pressed={view === "branch"} className={segmentButton(view === "branch")} onClick={() => setView("branch")}>
                        This branch
                    </button>
                    <button type="button" aria-pressed={view === "all"} className={segmentButton(view === "all")} onClick={() => setView("all")}>
                        All branches
                    </button>
                </div>
                {/* On a phone Add line sits beside the view switch and the admin tools take their own row. */}
                {canEdit && view === "branch" && (
                    <Button className="ml-auto h-[44px] gap-2 @min-[640px]/live:order-last @min-[640px]/live:ml-0" onClick={() => setDialog({ kind: "add" })}>
                        <Plus className="size-4" />
                        Add line
                    </Button>
                )}
                {isAdmin && (
                    <div className="flex w-full flex-wrap gap-[8px] @min-[640px]/live:ml-auto @min-[640px]/live:w-auto">
                        <Button asChild variant="outline" className="h-[44px] gap-2">
                            <Link to="/import">
                                <FileSpreadsheet className="size-4" />
                                Tradesheet
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-[44px] gap-2" onClick={() => setDialog({ kind: "baseline" })}>
                            <Upload className="size-4" />
                            Load stock sheet
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-[16px] @min-[900px]/live:grid-cols-[240px_minmax(0,1fr)]">
                <nav aria-label="Branches" className="sticky top-[calc(var(--header-height)+16px)] hidden flex-col gap-[4px] self-start @min-[900px]/live:flex">
                    <h2 className="text-muted-foreground mb-[4px] ml-[10px] text-[11px] font-semibold tracking-wider uppercase">Branches</h2>
                    {choices.map((b) => {
                        const here = view === "branch" && b.code === branch
                        return (
                            <button
                                key={b.code}
                                type="button"
                                aria-current={here}
                                onClick={() => pickBranch(b.code)}
                                className={cn(
                                    "grid min-h-[56px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[8px] gap-y-[2px] rounded-lg border border-transparent px-[12px] py-[10px] text-left",
                                    here ? "bg-card border-border" : "hover:bg-muted",
                                )}
                            >
                                <span className="truncate font-semibold">{b.name}</span>
                                {b.summary && b.summary.low > 0 ? <span className={cn(LOW_PILL, "row-span-2 text-[12px]")}>{b.summary.low} low</span> : <span className="row-span-2" />}
                                <span className="text-muted-foreground text-[12px] tabular-nums">{b.summary ? `${b.summary.coins} coins · ${b.summary.bars} bars` : "..."}</span>
                            </button>
                        )
                    })}
                </nav>

                <div className="@container/main min-w-0 space-y-[12px]">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-[10px] @min-[900px]/live:grid-cols-[auto]">
                        {view === "branch" ? (
                            <button
                                type="button"
                                aria-haspopup="dialog"
                                onClick={() => setDialog({ kind: "branch" })}
                                className="bg-card flex h-[48px] min-w-0 items-center justify-between gap-[8px] rounded-lg border px-[14px] text-left @min-[900px]/live:hidden"
                            >
                                <span className="truncate text-[16px] font-semibold">{current?.name ?? "Branch"}</span>
                                <span className="text-muted-foreground flex flex-none items-center gap-[2px] text-[13px] font-medium">
                                    Change <ChevronDown className="size-[16px]" />
                                </span>
                            </button>
                        ) : null}
                        <div role="group" aria-label="Metal" className={cn(segment, "justify-self-start")}>
                            {METALS.map((x) => (
                                <button key={x.value} type="button" aria-pressed={x.value === metal} onClick={() => setMetal(x.value)} className={cn(segmentButton(x.value === metal), "h-[42px] min-w-[72px] font-bold")}>
                                    <span aria-hidden className={cn("size-[8px] rounded-full", x.dot)} />
                                    {x.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {view === "branch" && current && (current.cutoverDate || !canEdit) && (
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[13px]">
                            {current.cutoverDate && <span>Counts loaded from the stock sheet of {current.cutoverDate}</span>}
                            {!canEdit && <span className="bg-muted rounded-md px-[8px] py-[2px]">View only. Ask an admin to link your branch to edit {current.name}.</span>}
                        </div>
                    )}

                    {view === "all" ? (
                        boards.some((q) => q.isLoading) ? (
                            <Skeleton className="h-64 w-full" />
                        ) : grid.length === 0 ? (
                            <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">No {metal.toLowerCase()} stock recorded at any branch.</p>
                        ) : (
                            <AllBranchesGrid groups={grid} branches={list} onOpen={pickBranch} />
                        )
                    ) : (
                        <>
                            <Summary summary={summary} filter={filter} onFilter={(f) => setFilter((cur) => (cur === f ? null : f))} />

                            <div className="flex flex-wrap items-center gap-[8px]">
                                <label className="bg-card text-muted-foreground flex h-[44px] flex-[1_1_220px] items-center gap-[8px] rounded-lg border px-[12px]">
                                    <Search aria-hidden className="size-[16px] flex-none" />
                                    <input
                                        type="search"
                                        aria-label="Search stock"
                                        placeholder="Coin, weight, refinery or serial"
                                        className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </label>
                                <div role="group" aria-label="Show" className="flex gap-[6px]">
                                    <Chip on={!showAll} onClick={() => setShowAll(false)}>
                                        In stock
                                    </Chip>
                                    <Chip on={showAll} onClick={() => setShowAll(true)}>
                                        Include empty
                                    </Chip>
                                </div>
                            </div>

                            {board.isLoading ? (
                                <Skeleton className="h-64 w-full" />
                            ) : nothing ? (
                                <Empty
                                    name={current?.name ?? ""}
                                    metal={metal}
                                    searching={searching}
                                    filtered={filter !== null}
                                    showAll={showAll}
                                    isAdmin={isAdmin}
                                    onClearFilter={() => setFilter(null)}
                                    onLoad={() => setDialog({ kind: "baseline" })}
                                />
                            ) : (
                                <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[18px] @min-[780px]/main:grid-cols-2">
                                    {showBars && bars.length > 0 && (
                                        <Section label="Bars" total={barTotal}>
                                            {bars.map((w) => (
                                                <BarWeightGroup key={w.variant} weight={w} open={forceOpen || open.has(w.variant)} onToggle={() => toggle(w.variant)} actions={actions} />
                                            ))}
                                        </Section>
                                    )}
                                    {showCoins && coins.length > 0 && (
                                        <Section label="Coins" total={coinTotal}>
                                            {coins.map((f) => (
                                                <div key={f.family} className="border-b last:border-b-0">
                                                    <div className="bg-muted flex items-center justify-between border-b px-[14px] py-[10px] text-[14px] font-bold">
                                                        <span>{f.family}</span>
                                                        <span className="text-muted-foreground font-semibold tabular-nums">{f.total}</span>
                                                    </div>
                                                    {f.rows.map((l) => (
                                                        <StockRow key={l.id} line={l} label={l.variant} actions={actions} />
                                                    ))}
                                                </div>
                                            ))}
                                        </Section>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {dialog?.kind === "branch" && <BranchSheet branches={choices} current={branch} onPick={pickBranch} onClose={() => setDialog(null)} />}
            {dialog?.kind === "more" && (
                <LineActionsSheet
                    line={fresh(dialog.line)}
                    branchName={current?.name ?? dialog.line.branchCode}
                    canEdit={canEdit}
                    onClose={() => setDialog(null)}
                    onEdit={() => setDialog({ kind: "edit", line: dialog.line })}
                    onHistory={() => setDialog({ kind: "history", line: dialog.line })}
                    onTransfer={() => setDialog({ kind: "transfer", line: dialog.line })}
                    onSerials={() => setDialog({ kind: "serials", line: dialog.line })}
                />
            )}
            {dialog?.kind === "serials" && <SerialsSheet line={fresh(dialog.line)} actions={serialActions} onClose={() => setDialog(null)} />}
            {dialog?.kind === "edit" && (
                <EditCountDialog
                    line={fresh(dialog.line)}
                    onClose={() => setDialog(null)}
                    onSave={(qty, reason, note) => m.adjust.mutate({ lineId: dialog.line.id, body: { qty, reason, note: note || undefined }, label: lineName(dialog.line) })}
                />
            )}
            {dialog?.kind === "history" && <HistoryDialog line={fresh(dialog.line)} canEdit={canEdit} onClose={() => setDialog(null)} onUndo={(id) => m.undo.mutate(id)} />}
            {dialog?.kind === "transfer" && (
                <TransferDialog
                    line={fresh(dialog.line)}
                    branches={list}
                    onClose={() => setDialog(null)}
                    onSave={(body) => m.transfer.mutate({ lineId: dialog.line.id, body: { ...body, note: body.note || undefined } })}
                />
            )}
            {dialog?.kind === "add" && branch && (
                <AddLineDialog
                    branch={current?.name ?? branch}
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

const TILES: { filter: StockFilter; label: string; value: (s: BoardSummary) => number; warn?: boolean }[] = [
    { filter: "coins", label: "coins", value: (s) => s.coins },
    { filter: "bars", label: "bars", value: (s) => s.bars },
    { filter: "low", label: "running low", value: (s) => s.low, warn: true },
    { filter: "pick", label: "serials to pick", value: (s) => s.toPick, warn: true },
]

/** The four numbers are also filters: tap one to see only those lines, tap it again to see everything. */
function Summary({ summary, filter, onFilter }: { summary: BoardSummary; filter: StockFilter | null; onFilter: (f: StockFilter) => void }) {
    return (
        <div className="grid grid-cols-4 gap-[8px]">
            {TILES.map((t) => {
                const n = t.value(summary)
                const on = filter === t.filter
                return (
                    <button
                        key={t.filter}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onFilter(t.filter)}
                        className={cn(
                            "bg-card min-h-[64px] min-w-0 rounded-lg border px-[10px] py-[8px] text-left @min-[420px]/main:px-[12px] @min-[420px]/main:py-[10px]",
                            on ? "border-primary ring-primary ring-1 ring-inset" : "hover:bg-muted/50",
                        )}
                    >
                        <b className={cn("block text-[19px] leading-[1.15] font-bold tabular-nums @min-[420px]/main:text-[22px]", t.warn && n > 0 && "text-amber-800 dark:text-amber-300")}>{n}</b>
                        <span className="text-muted-foreground block text-[12px] leading-tight">{t.label}</span>
                    </button>
                )
            })}
        </div>
    )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={cn(
                "h-[40px] flex-none rounded-full border px-[12px] text-[13px] font-semibold",
                on ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground hover:text-foreground",
            )}
        >
            {children}
        </button>
    )
}

function Section({ label, total, children }: { label: string; total: number; children: ReactNode }) {
    return (
        <section aria-label={label} className="min-w-0">
            <h3 className="text-muted-foreground mb-[8px] flex items-baseline justify-between text-[12px] font-semibold tracking-wider uppercase">
                {label}
                <b className="text-foreground text-[14px] tracking-normal normal-case tabular-nums">{total}</b>
            </h3>
            <div className="bg-card overflow-hidden rounded-lg border">{children}</div>
        </section>
    )
}

function Empty({
    name,
    metal,
    searching,
    filtered,
    showAll,
    isAdmin,
    onClearFilter,
    onLoad,
}: {
    name: string
    metal: string
    searching: boolean
    filtered: boolean
    showAll: boolean
    isAdmin: boolean
    onClearFilter: () => void
    onLoad: () => void
}) {
    return (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            {searching ? (
                <>Nothing matches that search.</>
            ) : filtered ? (
                <>
                    <p>Nothing to show for that filter.</p>
                    <Button variant="outline" className="mt-3 h-[44px]" onClick={onClearFilter}>
                        Show everything
                    </Button>
                </>
            ) : (
                <>
                    <p>
                        No {metal.toLowerCase()} stock recorded for {name}
                        {showAll ? "" : " (empty lines are hidden)"}.
                    </p>
                    {isAdmin && (
                        <Button variant="outline" className="mt-3 h-[44px]" onClick={onLoad}>
                            Load the stock sheet
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}
