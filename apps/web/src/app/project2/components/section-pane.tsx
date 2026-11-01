import { countTasks, type RoadmapEdit, type RoadmapSection } from "@goldilocks/shared-types"
import { RoadmapMarkdown } from "../../project/components/roadmap-markdown"
import { PriorityGlyph } from "./priority-glyph"
import { TaskGrid } from "./task-grid"

/** The heading of a section: priority, mono ID, title, and its note and dependencies. */
export function SectionHeading({ section }: { section: RoadmapSection }) {
    return (
        <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                {section.priority && <PriorityGlyph priority={section.priority} showLabel />}
                {section.id && <span className="text-muted-foreground font-mono text-sm tabular-nums">{section.id}</span>}
            </div>
            <h2 className="mt-1 text-lg leading-tight font-semibold">{section.title}</h2>
            {section.note && <p className="text-muted-foreground mt-1 text-sm">{section.note}</p>}
            {section.depends && <p className="text-muted-foreground mt-1 text-xs">Depends on: {section.depends}</p>}
        </div>
    )
}

/** What sits under a section's heading: the prose, then its tasks as cards. */
export function SectionBody({ section, hideDone, busy, onEdit }: { section: RoadmapSection; hideDone: boolean; busy: boolean; onEdit: (edit: RoadmapEdit) => void }) {
    const { total } = countTasks(section.tasks)
    // Prose-only sections (ground rules, architecture, icebox) have nothing to tick, so no task cards either;
    // a numbered section always gets the grid so its first task can be added.
    const hasTasks = total > 0 || section.id !== null

    return (
        <div className="flex min-w-0 flex-col gap-4">
            {section.body && <RoadmapMarkdown>{section.body}</RoadmapMarkdown>}
            {hasTasks && (
                <TaskGrid
                    tasks={section.tasks}
                    sectionId={section.id}
                    sectionPriority={section.priority}
                    sectionLine={section.headingLine}
                    hideDone={hideDone}
                    busy={busy}
                    onEdit={onEdit}
                />
            )}
        </div>
    )
}
