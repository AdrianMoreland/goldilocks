import { useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, FileSpreadsheet, LayoutGrid, List, Pencil, Plus, Search, Upload } from "lucide-react"
import { LIVE_BRANCH_NAMES, sortBranchCodes, type LiveMetal, type LiveStockLine } from "@goldilocks/shared-types"
import { useAuth } from "@/contexts/auth-context"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AllBranchesGrid } from "./all-branches-grid"
import { BaselineDialog } from "./baseline-dialog"
import { AddLineDialog, EditCountDialog, HistoryDialog, TransferDialog } from "./dialogs"
import { applyFilter, branchGrid, draftChanges, groupBars, groupCoins, lineName, stepDraft, summarise, tileItems, withDraft, type BoardSummary, type CountDraft, type DraftChange, type StockFilter } from "./live-stock-model"
import { BranchSheet, LineActionsSheet, SerialsSheet, TileSheet, type BranchChoice } from "./sheets"
import { StockTiles } from "./stock-tiles"
import { LOW_PILL } from "./level-style"
import { BarWeightBlock, StockBlock, StockRow, type RowActions, type SerialActions } from "./stock-row"
import { useAllBoards, useBoard, useBoardMutations, useBranches } from "./use-live-stock"

// The metal family colours from the design system: the only fixed hex values allowed in component code.
const METALS: { value: LiveMetal; label: string; dot: string }[] = [
    { value: "GOLD", label: "Gold", dot: "bg-[#D4A017]" },
    { value: "SILVER", label: "Silver", dot: "bg-[#8B95A1]" },
]

type LineDialog = { kind: "edit" | "history" | "transfer" | "more" | "serials"; line: LiveStockLine }
type Dialog = LineDialog | { kind: "add" } | { kind: "baseline" } | { kind: "branch" } | { kind: "tile"; key: string } | null
type View = "branch" | "all"
/** How one branch is shown: tiles with a level bar each, or the list of blocks with every line. */
type Layout = "tiles" | "list"

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
 * screen, a button that opens a sheet on a phone. Every bar weight (its refineries) and coin family (its variants) is a
 * block, and the blocks flow into balanced columns. Reading is the default; "Edit counts" (admins and managers) turns
 * each count into a stepper that builds a draft, saved together from the bar at the bottom.
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
    const [dialog, setDialog] = useState<Dialog>(null)
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState<CountDraft>({})
    const [review, setReview] = useState(false)
    const [layout, setLayout] = useUserPreference<Layout>("inventory-layout", "tiles")

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

    const savedLines = useMemo(() => board.data?.lines ?? [], [board.data])
    // While editing, totals and groups show the drafted counts.
    const lines = useMemo(() => withDraft(savedLines, draft), [savedLines, draft])
    const changes = draftChanges(draft)
    const summary = useMemo(() => summarise(lines), [lines])
    const filtered = useMemo(() => applyFilter(lines, filter), [lines, filter])
    const searching = query.trim() !== ""
    const coins = useMemo(() => groupCoins(filtered, { showAll, query }), [filtered, showAll, query])
    const bars = useMemo(() => groupBars(filtered, { showAll, query }), [filtered, showAll, query])
    const tiles = useMemo(() => tileItems(filter === "coins" || filter === "proof" ? [] : bars, filter === "bars" ? [] : coins), [bars, coins, filter])

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
    const fresh = (l: LiveStockLine) => savedLines.find((x) => x.id === l.id) ?? l

    const pickBranch = (code: string) => {
        setPicked(code)
        setView("branch")
    }

    const actions: RowActions = {
        canEdit,
        editing,
        savedQty: (line) => draft[line.id]?.line.qty,
        // The draft is built from the saved line, so "back to the saved count" is recognised.
        onStep: (line, delta) => setDraft((cur) => stepDraft(cur, fresh(line), delta)),
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

    const showBars = filter !== "coins" && filter !== "proof"
    const showCoins = filter !== "bars"
    const saveDraft = () =>
        m.saveCounts.mutate(
            changes.map((c) => ({ lineId: c.lineId, qty: c.to })),
            {
                onSuccess: ({ saved }) => {
                    const done = new Set(saved.map((x) => x.lineId))
                    setDraft((cur) => Object.fromEntries(Object.entries(cur).filter(([id]) => !done.has(Number(id)))))
                    setReview(false)
                },
            },
        )
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
                    <Button
                        variant={editing ? "default" : "outline"}
                        aria-pressed={editing}
                        className="ml-auto h-[44px] gap-2 @min-[640px]/live:order-last @min-[640px]/live:ml-0"
                        onClick={() => setEditing((e) => !e)}
                    >
                        <Pencil className="size-4" />
                        {editing ? "Done editing" : "Edit counts"}
                    </Button>
                )}
                {canEdit && view === "branch" && (
                    <Button variant="outline" className="h-[44px] gap-2 @min-[640px]/live:order-last @min-[640px]/live:ml-0" onClick={() => setDialog({ kind: "add" })}>
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
                        {view === "branch" && (
                            <div role="group" aria-label="Layout" className={cn(segment, "col-span-2 justify-self-start @min-[900px]/live:col-span-1")}>
                                <button type="button" aria-pressed={layout === "tiles"} onClick={() => setLayout("tiles")} className={segmentButton(layout === "tiles")}>
                                    <LayoutGrid aria-hidden className="size-[16px]" />
                                    Tiles
                                </button>
                                <button type="button" aria-pressed={layout === "list"} onClick={() => setLayout("list")} className={segmentButton(layout === "list")}>
                                    <List aria-hidden className="size-[16px]" />
                                    List
                                </button>
                            </div>
                        )}
                    </div>

                    {view === "branch" && current && (current.cutoverDate || !canEdit) && (
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[13px]">
                            {current.cutoverDate && <span>Counts loaded from the stock sheet of {current.cutoverDate}</span>}
                            {!canEdit && <span className="bg-muted rounded-md px-[8px] py-[2px]">View only. Stock is changed by admins and managers.</span>}
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
                            <Summary
                                branch={current?.name ?? ""}
                                metal={metal}
                                summary={summary}
                                anyLowMark={lines.some((l) => l.lowThreshold !== null)}
                                filter={filter}
                                onFilter={(f) => setFilter((cur) => (cur === f ? null : f))}
                            />

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
                                <div role="group" aria-label="Show" className="flex flex-wrap gap-[6px]">
                                    <Chip on={!showAll} onClick={() => setShowAll(false)}>
                                        In stock
                                    </Chip>
                                    <Chip on={showAll} onClick={() => setShowAll(true)}>
                                        Include empty
                                    </Chip>
                                    {(["bars", "coins", "proof"] as const).map((f) => (
                                        <Chip key={f} on={filter === f} onClick={() => setFilter((cur) => (cur === f ? null : f))}>
                                            {f === "bars" ? "Bars" : f === "coins" ? "Coins" : "Proof"}
                                        </Chip>
                                    ))}
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
                            ) : layout === "tiles" ? (
                                <StockTiles items={tiles} onOpen={(item) => setDialog({ kind: "tile", key: item.key })} />
                            ) : (
                                <div className="columns-1 gap-[14px] @min-[640px]/main:columns-2 @min-[1000px]/main:columns-3">
                                    {showBars && bars.map((w) => <BarWeightBlock key={w.variant} weight={w} actions={actions} />)}
                                    {showCoins &&
                                        coins.map((f) => (
                                            <StockBlock key={f.family} kind="Coin" title={f.family} total={f.total}>
                                                {f.rows.map((l) => (
                                                    <StockRow key={l.id} line={l} label={l.variant} actions={actions} />
                                                ))}
                                            </StockBlock>
                                        ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {changes.length > 0 && (
                <DraftBar
                    changes={changes}
                    review={review}
                    saving={m.saveCounts.isPending}
                    onReview={() => setReview((r) => !r)}
                    onDiscard={() => {
                        setDraft({})
                        setReview(false)
                    }}
                    onSave={saveDraft}
                />
            )}

            {dialog?.kind === "tile" &&
                (() => {
                    // Rebuilt from the current tiles each render, so the sheet shows counts as they change.
                    const item = tiles.find((t) => t.key === dialog.key)
                    return item ? <TileSheet item={item} branchName={current?.name ?? ""} actions={actions} onClose={() => setDialog(null)} /> : null
                })()}
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

/**
 * The branch at a glance: its total, split into coins and bars, then the two counts that need someone. Running low and
 * serials to pick are filters (tap to see only those lines). Until any line has a low mark, the tile says how to set one.
 */
function Summary({
    branch,
    metal,
    summary,
    anyLowMark,
    filter,
    onFilter,
}: {
    branch: string
    metal: LiveMetal
    summary: BoardSummary
    anyLowMark: boolean
    filter: StockFilter | null
    onFilter: (f: StockFilter) => void
}) {
    const total = summary.coins + summary.bars
    const coinShare = total ? Math.round((summary.coins * 100) / total) : 0
    const tile = (on: boolean) =>
        cn("bg-card min-h-[72px] min-w-0 rounded-xl border px-[14px] py-[10px] text-left", on ? "border-primary ring-primary ring-1 ring-inset" : "hover:bg-muted/50")
    return (
        <div className="grid grid-cols-2 gap-[10px] @min-[720px]/main:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="bg-card col-span-2 min-w-0 rounded-xl border px-[14px] py-[12px] @min-[720px]/main:col-span-1">
                <div className="flex items-baseline justify-between gap-[8px]">
                    <span className="text-muted-foreground truncate text-[13px]">
                        {branch} · {metal === "GOLD" ? "gold" : "silver"}
                    </span>
                    <span className="text-[22px] font-extrabold tabular-nums">
                        {total} <span className="text-muted-foreground text-[13px] font-medium">items</span>
                    </span>
                </div>
                <div aria-hidden className="bg-muted mt-[8px] mb-[6px] flex h-[8px] overflow-hidden rounded-full">
                    <span className="bg-primary" style={{ width: `${coinShare}%` }} />
                    <span className="bg-primary/45 flex-1" />
                </div>
                <div className="text-muted-foreground flex justify-between text-[13px] tabular-nums">
                    <span>
                        <b className="text-foreground">{summary.coins}</b> coins
                    </span>
                    <span>
                        <b className="text-foreground">{summary.bars}</b> bars
                    </span>
                </div>
            </div>
            {anyLowMark ? (
                <button type="button" aria-pressed={filter === "low"} onClick={() => onFilter("low")} className={tile(filter === "low")}>
                    <b className={cn("block text-[22px] leading-[1.15] font-extrabold tabular-nums", summary.low > 0 && "text-amber-800 dark:text-amber-300")}>{summary.low}</b>
                    <span className="text-muted-foreground block text-[12px] leading-tight">running low</span>
                </button>
            ) : (
                <div className="bg-card min-h-[72px] min-w-0 rounded-xl border border-dashed px-[14px] py-[10px]">
                    <b className="block text-[14px] font-semibold">Running low</b>
                    <span className="text-primary block text-[12px] leading-tight">Set a low mark from a line's ⋯ menu to see this</span>
                </div>
            )}
            <button type="button" aria-pressed={filter === "pick"} onClick={() => onFilter("pick")} className={tile(filter === "pick")}>
                <b className={cn("block text-[22px] leading-[1.15] font-extrabold tabular-nums", summary.toPick > 0 && "text-amber-800 dark:text-amber-300")}>{summary.toPick}</b>
                <span className="text-muted-foreground block text-[12px] leading-tight">serials to pick</span>
            </button>
        </div>
    )
}

/** Unsaved counts from edit mode: how many, a list to check, and Discard or Save. Fixed to the bottom of the screen. */
function DraftBar({
    changes,
    review,
    saving,
    onReview,
    onDiscard,
    onSave,
}: {
    changes: DraftChange[]
    review: boolean
    saving: boolean
    onReview: () => void
    onDiscard: () => void
    onSave: () => void
}) {
    const n = changes.length
    return (
        <div
            role="region"
            aria-label="Unsaved count changes"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-[12px] pb-[calc(14px+env(safe-area-inset-bottom,0px))]"
        >
            <div className="bg-foreground text-background pointer-events-auto mx-auto max-w-[720px] rounded-xl px-[14px] py-[12px] shadow-2xl">
                {review && (
                    <ul className="mb-[8px] max-h-[180px] overflow-auto text-[14px]">
                        {changes.map((c) => (
                            <li key={c.lineId} className="border-background/15 flex justify-between gap-[12px] border-b py-[6px] tabular-nums">
                                <span className="truncate font-semibold">{c.label}</span>
                                <span className="flex-none">
                                    {c.from} → <b>{c.to}</b> ({c.to > c.from ? "+" : "−"}
                                    {Math.abs(c.to - c.from)})
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex flex-wrap items-center gap-[8px]">
                    <span aria-hidden className="bg-primary size-[8px] rounded-full" />
                    <span className="min-w-[120px] flex-1 font-semibold">
                        {n === 1 ? "1 change" : `${n} changes`} not saved
                    </span>
                    <button type="button" onClick={onReview} className="h-[40px] rounded-lg px-[12px] text-[14px] font-semibold hover:opacity-80">
                        {review ? "Hide" : "Review"}
                    </button>
                    <button type="button" onClick={onDiscard} disabled={saving} className="border-background/30 h-[40px] rounded-lg border px-[12px] text-[14px] font-semibold">
                        Discard
                    </button>
                    <button type="button" onClick={onSave} disabled={saving} className="bg-background text-foreground h-[40px] rounded-lg px-[16px] text-[14px] font-bold disabled:opacity-60">
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
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
