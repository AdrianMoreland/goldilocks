import { useState } from "react"
import { ChevronDown, Minus, MoreHorizontal, Plus } from "lucide-react"
import type { LiveStockLine } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LEVEL_NUMBER, LOW_PILL, PILL } from "./level-style"
import { levelOf, titleCase, type BarWeight, type StockLevel } from "./live-stock-model"

export interface RowActions {
    canEdit: boolean
    onStep: (line: LiveStockLine, delta: number) => void
    onEdit: (line: LiveStockLine) => void
    /** Opens the line's action sheet (type a count, history, move, serials). */
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
 * One countable line: name and its state in words, then - / count / + (44px each, for a finger at the counter) and a
 * "more" button for the rarer actions. Tapping the number types a count.
 */
export function StockRow({ line, label, actions, nested }: { line: LiveStockLine; label: string; actions: RowActions; nested?: boolean }) {
    const level = levelOf(line)
    const isBar = line.kind === "BAR"
    return (
        <div className={cn("grid min-h-[64px] grid-cols-[minmax(0,1fr)_auto] items-center gap-[10px] border-b py-[8px] pr-[8px] pl-[14px] last:border-b-0", nested && "min-h-[56px] pl-[24px]")}>
            <div className="min-w-0">
                <div className={cn("truncate font-semibold", nested ? "text-[15px]" : "text-[16px]")}>{label}</div>
                <div className="text-muted-foreground mt-[2px] flex flex-wrap items-center gap-[6px] text-[12px]">
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
            </div>
            <div className="flex items-center gap-[4px]">
                {actions.canEdit && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-background size-[44px] rounded-lg"
                        aria-label={`Remove one ${label}`}
                        title={`Remove one ${label}`}
                        disabled={line.qty < 1}
                        onClick={() => actions.onStep(line, -1)}
                    >
                        <Minus className="size-[20px]" />
                    </Button>
                )}
                {actions.canEdit ? (
                    <button
                        type="button"
                        aria-label={`${label} count ${line.qty}, tap to type a count`}
                        onClick={() => actions.onEdit(line)}
                        className={cn("hover:bg-muted h-[44px] min-w-[56px] rounded-lg px-[6px] text-center text-[24px] font-bold tabular-nums", LEVEL_NUMBER[level])}
                    >
                        {line.qty}
                    </button>
                ) : (
                    <span aria-label={`${label} count ${line.qty}`} className={cn("inline-grid h-[44px] min-w-[56px] place-items-center text-[24px] font-bold tabular-nums", LEVEL_NUMBER[level])}>
                        {line.qty}
                    </span>
                )}
                {actions.canEdit && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-background size-[44px] rounded-lg"
                        aria-label={`Add one ${label}`}
                        title={`Add one ${label}`}
                        onClick={() => actions.onStep(line, 1)}
                    >
                        <Plus className="size-[20px]" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground h-[44px] w-[40px] rounded-lg"
                    aria-label={`More for ${label}`}
                    title={`More for ${label}`}
                    aria-haspopup="dialog"
                    onClick={() => actions.onMore(line)}
                >
                    <MoreHorizontal className="size-[20px]" />
                </Button>
            </div>
        </div>
    )
}

/** A bar weight: the total of all its refineries, opening to one line per refinery. */
export function BarWeightGroup({ weight, open, onToggle, actions }: { weight: BarWeight; open: boolean; onToggle: () => void; actions: RowActions }) {
    const low = weight.lines.some((l) => levelOf(l) === "low")
    const n = weight.lines.length
    return (
        <div className="border-b last:border-b-0">
            <button
                type="button"
                aria-expanded={open}
                onClick={onToggle}
                className="hover:bg-muted/50 grid min-h-[64px] w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-[10px] px-[14px] py-[12px] text-left"
            >
                <span className="min-w-0">
                    <span className="block truncate text-[16px] font-semibold">{weight.variant} bar</span>
                    <span className="text-muted-foreground mt-[2px] flex flex-wrap items-center gap-[6px] text-[12px]">
                        <span>
                            {n} refiner{n === 1 ? "y" : "ies"}
                        </span>
                        {low && <span className={LOW_PILL}>Low</span>}
                        {weight.unassigned > 0 && <span className={LOW_PILL}>{weight.unassigned} serials to pick</span>}
                    </span>
                </span>
                <span className={cn("text-[24px] font-bold tabular-nums", weight.total === 0 && "text-muted-foreground")}>{weight.total}</span>
                <ChevronDown aria-hidden className={cn("text-muted-foreground size-[18px] transition-transform motion-reduce:transition-none", open && "rotate-180")} />
            </button>
            {open && (
                <div className="bg-background border-t">
                    {weight.lines.map((l) => (
                        <StockRow key={l.id} line={l} label={l.refinery ? titleCase(l.refinery) : "No refinery noted"} actions={actions} nested />
                    ))}
                </div>
            )}
        </div>
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
