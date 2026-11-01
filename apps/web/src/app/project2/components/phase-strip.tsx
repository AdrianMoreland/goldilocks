import type { RoadmapSection } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { groupSections, phaseName, progressOf } from "../roadmap-state"

/** One ring per phase of the roadmap, then the whole: where the plan stands at a glance. Icebox and ground rules have no phase, so they are left out. */
export function PhaseStrip({ sections }: { sections: RoadmapSection[] }) {
    const phases = groupSections(sections).filter((g) => /^PHASE/i.test(g.name))
    const overall = progressOf(sections)

    return (
        <section aria-label="Progress by phase" className="bg-card flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border p-3">
            {phases.map((group) => {
                const { done, total } = progressOf(group.sections)
                return (
                    <div key={group.name} className="flex items-center gap-3">
                        <ProgressRing value={done} total={total} label={phaseName(group.name)} />
                        <div>
                            <p className="text-sm font-medium">{phaseName(group.name)}</p>
                            <p className="text-muted-foreground font-mono text-xs tabular-nums">
                                {done} of {total} done
                            </p>
                        </div>
                    </div>
                )
            })}
            <p className="text-muted-foreground ml-auto font-mono text-xs tabular-nums">
                {overall.done} of {overall.total} tasks done
            </p>
        </section>
    )
}
