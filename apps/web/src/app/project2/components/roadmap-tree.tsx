import { useState } from "react"
import { ChevronRight, ListTree } from "lucide-react"
import { countTasks, type RoadmapEdit, type RoadmapSection } from "@goldilocks/shared-types"
import { StatusDot, type StatusTone } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { groupSections, phaseName, phaseSubtitle, progressOf, type Progress, type RoadmapFilter } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"
import { RoadmapToolbar } from "./roadmap-toolbar"
import { SectionBody, SectionHeading } from "./section-pane"

/** Finished work is green, started work is blue, work not begun is quiet: the same dots the agent tree uses for done, running and queued. */
const toneOf = ({ done, total }: Progress): StatusTone => (total === 0 ? "muted" : done === total ? "ok" : done > 0 ? "info" : "muted")

const STATE_LABEL: Record<StatusTone, string> = { ok: "Done", info: "In progress", muted: "Not started", warn: "", stale: "", bad: "", active: "" }

/** Fold chevron: a 20px button that turns 90 degrees when its branch is open, with a larger hit area than it looks. */
function Fold({ open, label, onClick }: { open: boolean; label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
            aria-expanded={open}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md after:absolute after:-inset-1.5 focus-visible:ring-2 focus-visible:outline-none"
        >
            <ChevronRight className={cn("size-3.5 transition-transform motion-reduce:transition-none", open && "rotate-90")} aria-hidden />
        </button>
    )
}

/** A child node hangs off its parent's vertical line with a short stub; the last one stops the line partway down. */
const CHILD = "relative pt-1.5 pl-5 before:bg-border before:absolute before:top-0 before:bottom-0 before:left-2 before:w-px last:before:bottom-auto last:before:h-[1.65rem] after:bg-border after:absolute after:top-[1.65rem] after:left-2 after:h-px after:w-3"

function SectionNode({
    section,
    open,
    hideDone,
    busy,
    onToggle,
    onEdit,
}: {
    section: RoadmapSection
    open: boolean
    hideDone: boolean
    busy: boolean
    onToggle: () => void
    onEdit: (edit: RoadmapEdit) => void
}) {
    const progress = countTasks(section.tasks)
    const tone = toneOf(progress)

    return (
        <li role="treeitem" aria-expanded={open} className={CHILD}>
            <div className={cn("bg-background rounded-lg border px-3 py-2 transition-colors", tone === "info" && "border-sky-500/30")}>
                <div className="flex items-center gap-2">
                    <Fold open={open} label={section.title} onClick={onToggle} />
                    <StatusDot tone={tone} className="size-2" />
                    <span className="sr-only">{STATE_LABEL[tone]}</span>
                    {section.priority && <PriorityGlyph priority={section.priority} />}
                    <span className="text-muted-foreground w-9 shrink-0 font-mono text-xs tabular-nums">{section.id}</span>
                    <button type="button" onClick={onToggle} className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm font-medium">
                        {section.title}
                    </button>
                    {progress.total > 0 && (
                        <>
                            <span className="text-muted-foreground font-mono text-xs tabular-nums">
                                {progress.done}/{progress.total}
                            </span>
                            <span className="w-16 text-right font-mono text-xs whitespace-nowrap tabular-nums">{progress.total - progress.done} open</span>
                        </>
                    )}
                </div>
                {section.note && <p className="text-muted-foreground mt-1 truncate pl-7 text-xs">{section.note}</p>}
            </div>
            {open && (
                <div className="flex flex-col gap-3 pt-3 pl-1">
                    <SectionHeading section={section} />
                    <SectionBody section={section} hideDone={hideDone} busy={busy} onEdit={onEdit} />
                </div>
            )}
        </li>
    )
}

function PhaseNode({
    name,
    sections,
    folded,
    openKey,
    hideDone,
    busy,
    onFold,
    onToggle,
    onEdit,
}: {
    name: string
    sections: RoadmapSection[]
    folded: boolean
    openKey: string | undefined
    hideDone: boolean
    busy: boolean
    onFold: () => void
    onToggle: (key: string) => void
    onEdit: (edit: RoadmapEdit) => void
}) {
    const progress = progressOf(sections)
    const tone = toneOf(progress)
    const subtitle = phaseSubtitle(name)
    const openSections = sections.filter((s) => {
        const { done, total } = countTasks(s.tasks)
        return done < total
    }).length

    return (
        <li role="treeitem" aria-expanded={!folded} className="pt-1.5 first:pt-0">
            <div className={cn("bg-background rounded-lg border px-3 py-2.5", tone === "info" && "border-sky-500/30")}>
                <div className="flex items-center gap-2">
                    <Fold open={!folded} label={phaseName(name)} onClick={onFold} />
                    <StatusDot tone={tone} className="size-2" />
                    <span className="sr-only">{STATE_LABEL[tone]}</span>
                    <span className="min-w-0 truncate text-sm font-medium">{phaseName(name)}</span>
                    <span className="bg-muted rounded-full px-2 py-0.5 font-mono text-[10px]">
                        {sections.length} section{sections.length === 1 ? "" : "s"}
                    </span>
                    {progress.total > 0 && (
                        <span className="ml-auto flex items-center gap-3 font-mono text-xs tabular-nums">
                            <span className="text-muted-foreground">
                                {progress.done}/{progress.total}
                            </span>
                            <span className="w-10 text-right">{Math.round((progress.done / progress.total) * 100)}%</span>
                        </span>
                    )}
                </div>
                {subtitle && <p className="text-muted-foreground mt-1 truncate pl-7 text-xs">{subtitle}</p>}
                {progress.total > 0 && (
                    <div className="text-muted-foreground mt-2 flex items-center justify-between border-t border-dashed pt-2 pl-7 text-xs">
                        <span>
                            <span className={cn("tabular-nums", openSections > 0 ? "text-sky-700 dark:text-sky-300" : "")}>{openSections}</span> section{openSections === 1 ? "" : "s"} still open
                        </span>
                        <span>
                            branch <span className="text-foreground font-mono tabular-nums">{progress.total - progress.done}</span> open
                        </span>
                    </div>
                )}
            </div>
            {!folded && (
                <ul role="group" className="pt-0.5">
                    {sections.map((section) => (
                        <SectionNode
                            key={section.key}
                            section={section}
                            open={section.key === openKey}
                            hideDone={hideDone}
                            busy={busy}
                            onToggle={() => onToggle(section.key)}
                            onEdit={onEdit}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}

/**
 * The roadmap as a tree: each phase is a node card with its dot, count and a dashed branch footer, its sections hang
 * off it on connector lines, and opening a section shows its tasks as cards. One section is open at a time and it is
 * the one in the URL, so a refresh keeps your place. The search and filters above act on the sections.
 */
export function RoadmapTree({
    sections,
    totalSections,
    filter,
    openKey,
    busy,
    onFilter,
    onToggle,
    onEdit,
}: {
    sections: RoadmapSection[]
    totalSections: number
    filter: RoadmapFilter
    openKey: string | undefined
    busy: boolean
    onFilter: (filter: RoadmapFilter) => void
    onToggle: (key: string) => void
    onEdit: (edit: RoadmapEdit) => void
}) {
    const groups = groupSections(sections)
    const [folded, setFolded] = useState<Set<string>>(new Set())
    const toggleFold = (name: string) =>
        setFolded((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    const allFolded = groups.length > 0 && groups.every((g) => folded.has(g.name))
    const overall = progressOf(sections)

    return (
        <section aria-label="Roadmap" className="bg-card rounded-2xl border shadow-xs/5">
            <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
                <ListTree className="text-muted-foreground size-4" aria-hidden />
                <div>
                    <h2 className="text-sm font-medium">Roadmap</h2>
                    <p className="text-muted-foreground font-mono text-xs tabular-nums">
                        {groups.length} phases · {overall.done}/{overall.total} done · <span className="text-foreground">{overall.total - overall.done}</span> open
                    </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto h-7 cursor-pointer px-2.5 text-xs" onClick={() => setFolded(allFolded ? new Set() : new Set(groups.map((g) => g.name)))}>
                    {allFolded ? "Expand all" : "Collapse all"}
                </Button>
            </div>
            <div className="border-b px-4 py-3">
                <RoadmapToolbar filter={filter} shown={sections.length} total={totalSections} onFilter={onFilter} />
            </div>
            {groups.length === 0 ? (
                <p className="text-muted-foreground px-4 py-10 text-center text-sm">No section matches.</p>
            ) : (
                <ul role="tree" aria-label="Phases and sections" className="p-2">
                    {groups.map((group) => (
                        <PhaseNode
                            key={group.name}
                            name={group.name}
                            sections={group.sections}
                            folded={folded.has(group.name)}
                            openKey={openKey}
                            hideDone={filter.hideDone}
                            busy={busy}
                            onFold={() => toggleFold(group.name)}
                            onToggle={onToggle}
                            onEdit={onEdit}
                        />
                    ))}
                </ul>
            )}
        </section>
    )
}
