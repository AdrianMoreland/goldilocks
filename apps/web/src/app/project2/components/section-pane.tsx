import { countTasks, type RoadmapEdit, type RoadmapSection } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { RoadmapMarkdown } from "../../project/components/roadmap-markdown"
import { sectionIcon } from "../../project/components/section-icon"
import { PriorityGlyph } from "./priority-glyph"
import { TaskTree } from "./task-tree"

/** One section of the roadmap: its heading with priority and progress ring, the prose under it, then the editable task tree. */
export function SectionPane({ section, hideDone, busy, onEdit }: { section: RoadmapSection; hideDone: boolean; busy: boolean; onEdit: (edit: RoadmapEdit) => void }) {
    const Icon = sectionIcon(section.title)
    const { done, total } = countTasks(section.tasks)
    // Prose-only sections (ground rules, architecture, icebox) have nothing to tick, so no task box either;
    // a numbered section always gets one so its first task can be added.
    const hasTasks = total > 0 || section.id !== null

    return (
        <section aria-label={section.title} className="bg-card flex min-w-0 flex-col gap-4 rounded-xl border p-5">
            <header className="flex items-start gap-3">
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        {section.id && <span className="text-muted-foreground font-mono text-sm tabular-nums">{section.id}</span>}
                        <h2 className="text-lg leading-tight font-semibold">{section.title}</h2>
                        {section.priority && <PriorityGlyph priority={section.priority} showLabel />}
                    </div>
                    {section.note && <p className="text-muted-foreground mt-0.5 text-sm">{section.note}</p>}
                    {section.depends && <p className="text-muted-foreground mt-0.5 text-xs">Depends on: {section.depends}</p>}
                </div>
                {total > 0 && <ProgressRing value={done} total={total} label={`${section.title} tasks done`} />}
            </header>

            {total > 0 && (
                <p className="text-muted-foreground font-mono text-xs tabular-nums">
                    {done} of {total} done · {total - done} open
                </p>
            )}

            {section.body && <RoadmapMarkdown>{section.body}</RoadmapMarkdown>}

            {hasTasks && <TaskTree tasks={section.tasks} sectionLine={section.headingLine} hideDone={hideDone} busy={busy} onEdit={onEdit} />}
        </section>
    )
}
