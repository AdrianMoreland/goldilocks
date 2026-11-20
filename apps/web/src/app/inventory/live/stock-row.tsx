import { useState, type ReactNode } from "react"
import { Minus, MoreHorizontal, Plus } from "lucide-react"
import type { LiveStockLine } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LEVEL_NUMBER, LOW_PILL, PILL } from "./level-style"
import { levelOf, titleCase, type BarWeight, type StockLevel } from "./live-stock-model"

export interface RowActions {
    canEdit: boolean
    /** Edit counts is on: rows show a stepper that changes the draft, not the saved count. */
    editing: boolean
    /** The saved count of a line changed in the draft (shown as "was N"), or undefined when it is unchanged. */
    savedQty: (line: LiveStockLine) => number | undefined
    onStep: (line: LiveStockLine, delta: number) => void
    onEdit: (line: LiveStockLine) => void
    /** Opens the line's action sheet (type a count, history, move, serials, low mark). */
    onMore: (line: LiveStockLine) => void
    onSerials: (line: LiveStockLine) => void
}

export interface SerialActions {
    canEdit: boolean
    onAddSerial: (line: LiveStockLine, serial: string) => void
    onBarStatus: (barId: number, status: "SOLD" | "REMOVED") => void
}

export function LevelPill({ level }: { level: StockLevel }) {
    if (level === "low") return <span className={LOW_PILL}>Low</span>
    if (level === "zero") return <span className={cn(PILL, "bg-muted text-muted-foreground")}>None</span>
    return null
}

/**
 * One countable line. Reading is the default: the name, its state in words and the count, with "more" for the rarer
 * actions. In edit mode the count becomes a joined - n + that changes the draft; a changed line is tinted and says
 * what it was. Tapping the number in edit mode types a count (saved straight away, as before).
 */
export function StockRow({ line, label, actions }: { line: LiveStockLine; label: string; actions: RowActions }) {
    const level = levelOf(line)
    const isBar = line.kind === "BAR"
    const was = actions.savedQty(line)
    const editing = actions.editing && actions.canEdit
    return (
        <div className={cn("flex min-h-[48px] items-center gap-[10px] border-b py-[4px] pr-[8px] pl-[14px] last:border-b-0", was !== undefined && "bg-primary/10")}>
            <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold">{label}</div>
                {(was !== undefined || level !== "ok" || line.unassigned > 0 || line.lowThreshold !== null || line.details) && (
                    <div className="text-muted-foreground mt-[2px] flex flex-wrap items-center gap-[6px] text-[12px]">
                        {was !== undefined && <span className="text-primary font-semibold">was {was}</span>}
                        <LevelPill level={level} />
                        {line.unassigned > 0 &&
                            (isBar ? (
                                <button type="button" className={cn(LOW_PILL, "underline-offset-2 hover:underline")} onClick={() => actions.onSerials(line)}>
                                    {line.unassigned} sold, which ones?
                                </button>
                            ) : (
                                <span className={LOW_PILL}>{line.unassigned} sold, which ones?</span>
                            ))}
                        {line.lowThreshold !== null && <span>low at {line.lowThreshold}</span>}
                        {line.details && <span className="truncate italic">{line.details}</span>}
                    </div>
                )}
            </div>
            {editing ? (
                <div className="border-input flex flex-none items-center overflow-hidden rounded-lg border">
                    <button
                        type="button"
                        className="bg-muted hover:bg-accent grid size-[42px] place-items-center disabled:opacity-40"
                        aria-label={`Remove one ${label}`}
                        title={`Remove one ${label}`}
                        disabled={line.qty < 1}
                        onClick={() => actions.onStep(line, -1)}
                    >
                        <Minus className="size-[18px]" />
                    </button>
                    <button
                        type="button"
                        aria-label={`${label} count ${line.qty}, tap to type a count`}
                        onClick={() => actions.onEdit(line)}
                        className={cn("hover:bg-muted h-[42px] min-w-[48px] px-[4px] text-center text-[17px] font-extrabold tabular-nums", LEVEL_NUMBER[level])}
                    >
                        {line.qty}
                    </button>
                    <button
                        type="button"
                        className="bg-muted hover:bg-accent grid size-[42px] place-items-center"
                        aria-label={`Add one ${label}`}
                        title={`Add one ${label}`}
                        onClick={() => actions.onStep(line, 1)}
                    >
                        <Plus className="size-[18px]" />
                    </button>
                </div>
            ) : (
                <>
                    <span aria-label={`${label} count ${line.qty}`} className={cn("min-w-[44px] text-right text-[20px] font-extrabold tabular-nums", LEVEL_NUMBER[level])}>
                        {line.qty}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground h-[44px] w-[36px] flex-none rounded-lg"
                        aria-label={`More for ${label}`}
                        title={`More for ${label}`}
                        aria-haspopup="dialog"
                        onClick={() => actions.onMore(line)}
                    >
                        <MoreHorizontal className="size-[20px]" />
                    </Button>
                </>
            )}
        </div>
    )
}

/**
 * One block of the inventory: a bar weight (one line per refinery) or a coin family (one line per variant), with its
 * total in the header. Blocks flow into balanced columns, so they never leave half the screen empty.
 */
export function StockBlock({
    kind,
    title,
    total,
    note,
    children,
}: {
    kind: "Bar" | "Coin"
    title: string
    total: number
    note?: ReactNode
    children: ReactNode
}) {
    return (
        <section aria-label={title} className="bg-card mb-[14px] inline-block w-full break-inside-avoid overflow-hidden rounded-xl border">
            <div className="bg-muted flex items-center gap-[8px] border-b px-[14px] py-[10px]">
                <span className={cn("text-[11px] font-bold tracking-wider uppercase", kind === "Bar" ? "text-primary" : "text-muted-foreground")}>{kind}</span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-bold">{title}</span>
                {note}
                <span className={cn("text-[18px] font-extrabold tabular-nums", total === 0 && "text-muted-foreground")}>{total}</span>
            </div>
            {children}
        </section>
    )
}

/** A bar weight: its refineries as lines, with a pill when sold bars still need their serials picked. */
export function BarWeightBlock({ weight, actions }: { weight: BarWeight; actions: RowActions }) {
    return (
        <StockBlock
            kind="Bar"
            title={`${weight.variant} bar`}
            total={weight.total}
            note={weight.unassigned > 0 ? <span className={LOW_PILL}>{weight.unassigned} to pick</span> : undefined}
        >
            {weight.lines.map((l) => (
                <StockRow key={l.id} line={l} label={l.refinery ? titleCase(l.refinery) : "No refinery noted"} actions={actions} />
            ))}
        </StockBlock>
    )
}

/** The serialled bars on a line: mark one sold or removed, or add a serial that came in. */
export function SerialPanel({ line, actions }: { line: LiveStockLine; actions: SerialActions }) {
    const [serial, setSerial] = useState("")
    const unserialled = line.qty - line.bars.length
    return (
        <div className="space-y-[4px]">
            {line.unassigned > 0 && (
                <p className="bg-warning text-warning-text rounded-md px-[10px] py-[8px] text-sm">
                    {line.unassigned} sold on the sheet without a serial. Mark the {line.unassigned === 1 ? "bar that went" : "bars that went"} as Sold.
                </p>
            )}
            {line.bars.length === 0 && <p className="text-muted-foreground py-[8px] text-sm">No serials recorded on this line.</p>}
            <ul className="divide-y">
                {line.bars.map((b) => (
                    <li key={b.id} className="flex min-h-[52px] items-center gap-[8px] text-sm">
                        <span className="min-w-0 flex-1">
                            <span className="block truncate font-mono">{b.serial}</span>
                            {b.details && <span className="text-muted-foreground block truncate text-xs">{b.details}</span>}
                        </span>
                        {actions.canEdit && (
                            <>
                                <Button size="sm" variant="outline" className="h-[44px] px-[14px]" onClick={() => actions.onBarStatus(b.id, "SOLD")}>
                                    Sold
                                </Button>
                                <Button size="sm" variant="ghost" className="h-[44px] px-[12px]" onClick={() => actions.onBarStatus(b.id, "REMOVED")}>
                                    Removed
                                </Button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {unserialled > 0 && <div className="text-muted-foreground text-xs">{unserialled} more with no serial recorded</div>}
            {actions.canEdit && (
                <form
                    className="flex gap-[8px] pt-[8px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (serial.trim().length < 2) return
                        actions.onAddSerial(line, serial.trim())
                        setSerial("")
                    }}
                >
                    <Input
                        aria-label={`Add a serial to ${titleCase(line.refinery)} ${line.variant}`}
                        className="h-[44px] font-mono"
                        placeholder="Add a serial"
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                    />
                    <Button type="submit" variant="outline" className="h-[44px]" disabled={serial.trim().length < 2}>
                        Add
                    </Button>
                </form>
            )}
        </div>
    )
}
