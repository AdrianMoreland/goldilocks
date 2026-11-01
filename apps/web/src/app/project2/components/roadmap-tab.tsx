import type { RoadmapEdit, RoadmapSection } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { groupSections, phaseName, progressOf, type RoadmapFilter } from "../roadmap-state"
import { RoadmapToolbar } from "./roadmap-toolbar"
import { SectionRow } from "./section-card"
import { SectionBody, SectionHeading } from "./section-pane"

/**
 * The roadmap as phase cards: each phase has a header with its ring, and every section under it is a row that opens
 * its tasks in place. One section is open at a time and it is the one in the URL, so a refresh keeps your place.
 */
export function RoadmapTab({
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

    return (
        <div className="flex flex-col gap-4">
            <RoadmapToolbar filter={filter} shown={sections.length} total={totalSections} onFilter={onFilter} />

            {groups.length === 0 && <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">No section matches.</p>}

            {groups.map((group) => {
                const { done, total } = progressOf(group.sections)
                return (
                    <section key={group.name} aria-label={phaseName(group.name)} className="flex flex-col gap-2">
                        <header className="flex items-center gap-3 px-1">
                            {total > 0 && <ProgressRing value={done} total={total} label={phaseName(group.name)} size="sm" />}
                            <h2 className="text-sm font-medium">{group.name}</h2>
                            {total > 0 && (
                                <span className="text-muted-foreground ml-auto font-mono text-xs tabular-nums">
                                    {done}/{total}
                                </span>
                            )}
                        </header>
                        <ul className="flex flex-col gap-2">
                            {group.sections.map((section) => (
                                <SectionRow key={section.key} section={section} open={section.key === openKey} onToggle={() => onToggle(section.key)}>
                                    <SectionHeading section={section} />
                                    <SectionBody section={section} hideDone={filter.hideDone} busy={busy} onEdit={onEdit} />
                                </SectionRow>
                            ))}
                        </ul>
                    </section>
                )
            })}
        </div>
    )
}
