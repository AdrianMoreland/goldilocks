import type { ReactNode } from "react"
import { ArrowRightLeft, Check, Hash, History, Pencil } from "lucide-react"
import type { LiveStockLine } from "@goldilocks/shared-types"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { keepKeyboardClosedOnTouch } from "@/lib/dialog-focus"
import { cn } from "@/lib/utils"
import { lineName, type BoardSummary } from "./live-stock-model"
import { LOW_PILL } from "./level-style"
import { SerialPanel, type SerialActions } from "./stock-row"

/** A sheet from the bottom edge, where a thumb already is. Capped in width so it does not stretch on a desk screen. */
function BottomSheet({ title, sub, onClose, children, keepKeyboardClosed }: { title: string; sub?: string; onClose: () => void; children: ReactNode; keepKeyboardClosed?: boolean }) {
    return (
        <Sheet open onOpenChange={(o) => !o && onClose()}>
            <SheetContent
                side="bottom"
                onOpenAutoFocus={keepKeyboardClosed ? keepKeyboardClosedOnTouch : undefined}
                className="bg-card mx-auto max-h-[85vh] w-full max-w-[560px] gap-0 overflow-y-auto rounded-t-xl px-[16px] pt-[8px] pb-[calc(16px+env(safe-area-inset-bottom,0px))]"
            >
                <div aria-hidden className="bg-border mx-auto mt-[4px] mb-[10px] h-[4px] w-[40px] rounded-full" />
                <SheetHeader className="gap-[2px] p-0 pr-[32px] pb-[12px]">
                    <SheetTitle className="text-[17px]">{title}</SheetTitle>
                    {sub ? <SheetDescription className="text-[13px]">{sub}</SheetDescription> : <SheetDescription className="sr-only">{title}</SheetDescription>}
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )
}

const act = "flex min-h-[52px] w-full items-center gap-[12px] border-t px-[4px] text-left text-[15px] font-medium disabled:opacity-40 hover:bg-muted/50"

export function LineActionsSheet({
    line,
    branchName,
    canEdit,
    onClose,
    onEdit,
    onHistory,
    onTransfer,
    onSerials,
}: {
    line: LiveStockLine
    branchName: string
    canEdit: boolean
    onClose: () => void
    onEdit: () => void
    onHistory: () => void
    onTransfer: () => void
    onSerials: () => void
}) {
    const isBar = line.kind === "BAR"
    return (
        <BottomSheet title={lineName(line)} sub={`${branchName} · ${line.qty} in stock`} onClose={onClose}>
            {canEdit && (
                <button type="button" className={act} onClick={onEdit}>
                    <Pencil className="text-muted-foreground size-[18px]" />
                    Type a count
                    <span className="text-muted-foreground ml-auto tabular-nums">{line.qty}</span>
                </button>
            )}
            <button type="button" className={act} onClick={onHistory}>
                <History className="text-muted-foreground size-[18px]" />
                History
                <span className="text-muted-foreground ml-auto text-[13px] font-normal">why {line.qty}?</span>
            </button>
            {canEdit && (
                <button type="button" className={act} disabled={line.qty < 1} onClick={onTransfer}>
                    <ArrowRightLeft className="text-muted-foreground size-[18px]" />
                    Move to another branch
                </button>
            )}
            {isBar && (
                <button type="button" className={act} onClick={onSerials}>
                    <Hash className="text-muted-foreground size-[18px]" />
                    Serials
                    <span className="ml-auto flex items-center gap-[6px]">
                        {line.unassigned > 0 && <span className={LOW_PILL}>{line.unassigned} to pick</span>}
                        <span className="text-muted-foreground text-[13px] font-normal tabular-nums">{line.bars.length} recorded</span>
                    </span>
                </button>
            )}
        </BottomSheet>
    )
}

export interface BranchChoice {
    code: string
    name: string
    summary: BoardSummary | undefined
}

export function BranchSheet({ branches, current, onPick, onClose }: { branches: BranchChoice[]; current: string | undefined; onPick: (code: string) => void; onClose: () => void }) {
    return (
        <BottomSheet title="Branch" sub="Pick where to count" onClose={onClose}>
            {branches.map((b) => (
                <button
                    key={b.code}
                    type="button"
                    aria-current={b.code === current}
                    className={act}
                    onClick={() => {
                        onPick(b.code)
                        onClose()
                    }}
                >
                    <span className="w-[18px]">{b.code === current && <Check className="text-primary-text size-[18px]" />}</span>
                    {b.name}
                    <span className={cn("ml-auto text-[13px] tabular-nums", b.summary?.low ? LOW_PILL : "text-muted-foreground font-normal")}>
                        {b.summary ? `${b.summary.low} low` : "..."}
                    </span>
                </button>
            ))}
        </BottomSheet>
    )
}

export function SerialsSheet({ line, actions, onClose }: { line: LiveStockLine; actions: SerialActions; onClose: () => void }) {
    return (
        <BottomSheet title={`Serials · ${lineName(line)}`} sub={`${line.qty} in stock, ${line.bars.length} with a serial`} onClose={onClose} keepKeyboardClosed>
            <SerialPanel line={line} actions={actions} />
        </BottomSheet>
    )
}
