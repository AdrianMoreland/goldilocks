import { ChevronDown } from "lucide-react"
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
        <div className={cn("bg-muted/60 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5", className)}>
            <ProgressRing value={done} total={total} label="Tasks done" size="sm" />
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

/** A pill with the phase a section belongs to, in the hairline style the labels use elsewhere. */
function PhaseChip({ group }: { group: string }) {
    return <span className="text-muted-foreground inline-flex h-5 items-center rounded-full border px-2 text-xs whitespace-nowrap">{phaseName(group)}</span>
}

/** A section as a task card for the board: priority and ID on top, title, checklist strip, then what it depends on. Opens the section's drawer. */
export function SectionTile({ section, onOpen }: { section: RoadmapSection; onOpen: () => void }) {
    const { done, total } = countTasks(section.tasks)
    return (
        <button
            type="button"
            onClick={onOpen}
            className="bg-card hover:border-foreground/30 focus-visible:ring-ring flex w-full cursor-pointer flex-col gap-2.5 rounded-xl border p-3.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
            <span className="flex items-center gap-2">
                {section.priority && <PriorityGlyph priority={section.priority} />}
                {section.id && <span className="text-muted-foreground font-mono text-xs tabular-nums">{section.id}</span>}
                <span className="ml-auto">
                    <PhaseChip group={section.group} />
                </span>
            </span>
            <span className="text-sm leading-snug font-medium text-balance">{section.title}</span>
            <ChecklistStrip section={section} />
            {(section.depends || total - done > 0) && (
                <span className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                    <span className="min-w-0 truncate">{section.depends ? `After ${section.depends}` : ""}</span>
                    <span className="shrink-0 font-mono tabular-nums">{total - done} open</span>
                </span>
            )}
        </button>
    )
}

/** A section as a row card for the roadmap list: the same facts on one line, with a chevron that opens its tasks underneath. */
export function SectionRow({ section, open, onToggle, children }: { section: RoadmapSection; open: boolean; onToggle: () => void; children: React.ReactNode }) {
    return (
        <li className="bg-card overflow-hidden rounded-xl border">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="hover:bg-muted/40 focus-visible:ring-ring flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none"
            >
                {section.priority ? <PriorityGlyph priority={section.priority} /> : <span className="w-3.5" aria-hidden />}
                <span className="text-muted-foreground w-9 shrink-0 font-mono text-xs tabular-nums">{section.id}</span>
                <span className="min-w-0 flex-1 basis-48 text-sm font-medium">{section.title}</span>
                <ChecklistStrip section={section} className="w-44" />
                <ChevronDown className={cn("text-muted-foreground size-4 shrink-0 transition-transform motion-reduce:transition-none", open && "rotate-180")} aria-hidden />
            </button>
            {open && <div className="flex flex-col gap-3 border-t px-4 py-4">{children}</div>}
        </li>
    )
}
