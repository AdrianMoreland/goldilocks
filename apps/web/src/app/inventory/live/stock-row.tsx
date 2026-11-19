import { useState } from "react"
import { ArrowRightLeft, ChevronDown, History, Minus, Plus } from "lucide-react"
import type { LiveStockLine } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { levelOf, titleCase } from "./live-stock-model"

export interface RowActions {
    canEdit: boolean
    onStep: (line: LiveStockLine, delta: number) => void
    onEdit: (line: LiveStockLine) => void
    onHistory: (line: LiveStockLine) => void
    onTransfer: (line: LiveStockLine) => void
    onAddSerial: (line: LiveStockLine, serial: string) => void
    onBarStatus: (barId: number, status: "SOLD" | "REMOVED") => void
}

const LEVEL_NUMBER = {
    zero: "text-muted-foreground",
    low: "text-amber-700 dark:text-amber-300",
    ok: "text-foreground",
} as const

const LEVEL_EDGE = {
    zero: "border-l-border",
    low: "border-l-amber-500",
    ok: "border-l-emerald-600",
} as const

/**
 * One countable line: a name, a big count with - and + (44px, for a finger at the counter), and the small actions.
 * Tapping the number types a count. A bar line can open its serials. The colour on the left edge and the number
 * means the same thing everywhere: green in stock, amber at or under its low mark, grey at zero.
 */
export function StockRow({ line, label, sub, actions }: { line: LiveStockLine; label: string; sub?: string; actions: RowActions }) {
    const level = levelOf(line)
    const [open, setOpen] = useState(false)
    const isBar = line.kind === "BAR"
    return (
        <div className={cn("border-l-4 py-2 pr-1 pl-3", LEVEL_EDGE[level])}>
            <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-medium">{label}</div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
                        {sub && <span>{sub}</span>}
                        {line.details && <span className="italic">{line.details}</span>}
                        {level === "low" && <span className="font-medium text-amber-700 dark:text-amber-300">Low</span>}
                        {line.unassigned > 0 && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">{line.unassigned} sold, which ones?</span>
                        )}
                    </div>
                </div>
                {isBar && line.bars.length > 0 && (
                    <Button variant="ghost" size="sm" className="h-9 gap-1 px-2" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
                        {line.bars.length} serial{line.bars.length === 1 ? "" : "s"}
                        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="size-9" aria-label={`History for ${label}`} onClick={() => actions.onHistory(line)}>
                    <History className="size-4" />
                </Button>
                {actions.canEdit && (
                    <Button variant="ghost" size="icon" className="size-9" aria-label={`Move ${label} to another branch`} disabled={line.qty < 1} onClick={() => actions.onTransfer(line)}>
                        <ArrowRightLeft className="size-4" />
                    </Button>
                )}
                <div className="flex items-center gap-1">
                    {actions.canEdit && (
                        <Button variant="outline" size="icon" className="size-11" aria-label={`Remove one ${label}`} disabled={line.qty < 1} onClick={() => actions.onStep(line, -1)}>
                            <Minus className="size-5" />
                        </Button>
                    )}
                    <button
                        type="button"
                        disabled={!actions.canEdit}
                        aria-label={`${label} count ${line.qty}${actions.canEdit ? ", tap to type a count" : ""}`}
                        onClick={() => actions.onEdit(line)}
                        className={cn("h-11 min-w-14 rounded-md px-2 text-center text-2xl font-semibold tabular-nums", LEVEL_NUMBER[level], actions.canEdit && "hover:bg-muted")}
                    >
                        {line.qty}
                    </button>
                    {actions.canEdit && (
                        <Button variant="outline" size="icon" className="size-11" aria-label={`Add one ${label}`} onClick={() => actions.onStep(line, 1)}>
                            <Plus className="size-5" />
                        </Button>
                    )}
                </div>
            </div>
            {isBar && open && <SerialPanel line={line} actions={actions} />}
        </div>
    )
}

function SerialPanel({ line, actions }: { line: LiveStockLine; actions: RowActions }) {
    const [serial, setSerial] = useState("")
    const unserialled = line.qty - line.bars.length
    return (
        <div className="bg-muted/40 mt-2 space-y-1 rounded-md p-2">
            {line.bars.map((b) => (
                <div key={b.id} className="flex min-h-10 items-center gap-2 text-sm">
                    <span className="flex-1 font-mono">{b.serial}</span>
                    {b.details && <span className="text-muted-foreground max-w-48 truncate text-xs">{b.details}</span>}
                    {actions.canEdit && (
                        <>
                            <Button size="sm" variant="outline" className="h-9" onClick={() => actions.onBarStatus(b.id, "SOLD")}>
                                Sold
                            </Button>
                            <Button size="sm" variant="ghost" className="h-9" onClick={() => actions.onBarStatus(b.id, "REMOVED")}>
                                Remove
                            </Button>
                        </>
                    )}
                </div>
            ))}
            {unserialled > 0 && <div className="text-muted-foreground text-xs">{unserialled} more with no serial recorded</div>}
            {actions.canEdit && (
                <form
                    className="flex gap-2 pt-1"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (serial.trim().length < 2) return
                        actions.onAddSerial(line, serial.trim())
                        setSerial("")
                    }}
                >
                    <Input aria-label={`Add a serial to ${titleCase(line.refinery)} ${line.variant}`} className="h-10 font-mono" placeholder="Add a serial" value={serial} onChange={(e) => setSerial(e.target.value)} />
                    <Button type="submit" variant="outline" className="h-10" disabled={serial.trim().length < 2}>
                        Add
                    </Button>
                </form>
            )}
        </div>
    )
}
