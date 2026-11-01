import { Check, Circle } from "lucide-react"
import { countTasks, type RoadmapSection } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { cn } from "@/lib/utils"
import { phaseName } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"

/** The checklist strip of a task card: a small ring, a thin bar and "3/5", turning green once everything is ticked. */
export function ChecklistStrip({ section, className }: { section: RoadmapSection; className?: string }) {
    const { done, total } = countTasks(section.tasks)
    if (total === 0) return null
    return (
        <div className={cn("bg-muted/60 flex items-center gap-2.5 rounded-xl px-2.5 py-2", className)}>
            <ProgressRing value={done} total={total} label="Tasks done" size="sm" />
            <span className="text-xs font-medium">Tasks</span>
            <span aria-hidden className="bg-foreground/10 h-1 flex-1 overflow-hidden rounded-full">
                <span
                    className={cn("block h-full transition-[width] duration-300 motion-reduce:transition-none", done === total ? "bg-emerald-500" : "bg-foreground/70")}
                    style={{ width: `${(done / total) * 100}%` }}
                />
            </span>
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {done}/{total}
            </span>
        </div>
    )
}

/** A label chip with a dot, as on a task card. */
function Label({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-xs">
            <span aria-hidden className="bg-sky-500 size-1.5 rounded-full" />
            {children}
        </span>
    )
}

/**
 * A section as a task card for the board: priority glyph and ID on top, the title, a label for its phase, the
 * checklist strip, and a footer pill that says Done or how many are open. Clicking it opens the section's drawer.
 */
export function SectionTile({ section, onOpen }: { section: RoadmapSection; onOpen: () => void }) {
    const { done, total } = countTasks(section.tasks)
    const complete = total > 0 && done === total

    return (
        <button
            type="button"
            onClick={onOpen}
            className="bg-card hover:border-foreground/25 focus-visible:ring-ring flex w-full cursor-pointer flex-col gap-2.5 rounded-2xl border p-3.5 text-left shadow-xs/5 transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99] motion-reduce:active:scale-100"
        >
            <span className="flex items-center gap-2">
                {section.priority && <PriorityGlyph priority={section.priority} />}
                {section.id && <span className="text-muted-foreground font-mono text-xs tabular-nums">{section.id}</span>}
            </span>
            <span className="text-sm leading-snug font-medium text-balance">{section.title}</span>
            <span className="flex flex-wrap gap-1.5">
                <Label>{phaseName(section.group)}</Label>
            </span>
            <ChecklistStrip section={section} />
            <span className="flex items-center gap-2">
                <span
                    className={cn(
                        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
                        complete ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground",
                    )}
                >
                    {complete ? <Check className="size-3" strokeWidth={3} /> : <Circle className="size-3" />}
                    {complete ? "Done" : `${total - done} open`}
                </span>
                {section.depends && <span className="text-muted-foreground ml-auto min-w-0 truncate text-xs">after {section.depends}</span>}
            </span>
        </button>
    )
}
