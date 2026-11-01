import type { RoadmapSection } from "@goldilocks/shared-types"
import { countTasks } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { groupSections, phaseName, progressOf } from "../roadmap-state"

/** The sections of a phase with the most left to do, for the tooltip. */
function biggestOpen(sections: RoadmapSection[], limit: number) {
    return sections
        .map((s) => ({ s, ...countTasks(s.tasks) }))
        .filter((x) => x.total - x.done > 0)
        .sort((a, b) => b.total - b.done - (a.total - a.done))
        .slice(0, limit)
}

/**
 * One ring per phase, each with its label and "done / total" beside it, in a row that wraps. Hover or focus a ring
 * for the sections with the most left, each with a thin bar relative to the largest. Icebox and ground rules have no phase and are left out.
 */
export function QuotaRings({ sections }: { sections: RoadmapSection[] }) {
    const phases = groupSections(sections).filter((g) => /^PHASE/i.test(g.name))

    return (
        <TooltipProvider delayDuration={350} skipDelayDuration={80}>
            <section aria-label="Progress by phase" className="bg-card flex flex-wrap gap-1 rounded-2xl border p-2 shadow-xs/5">
                {phases.map((group) => {
                    const { done, total } = progressOf(group.sections)
                    const rows = biggestOpen(group.sections, 5)
                    const most = rows[0] ? rows[0].total - rows[0].done : 1
                    return (
                        <Tooltip key={group.name}>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    aria-label={`${phaseName(group.name)}: ${done} of ${total} tasks done`}
                                    className="hover:bg-accent focus-visible:ring-ring flex min-w-48 flex-1 cursor-default items-center gap-2.5 rounded-xl p-2 pe-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] motion-reduce:active:scale-100"
                                >
                                    <ProgressRing value={done} total={total} label={phaseName(group.name)} />
                                    <span className="min-w-0">
                                        <span className="text-muted-foreground block truncate text-xs">{phaseName(group.name)}</span>
                                        <span className="block text-sm font-medium tabular-nums">
                                            {done}
                                            <span className="text-muted-foreground font-normal"> / {total} tasks</span>
                                        </span>
                                    </span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="w-64 flex-col items-stretch gap-2 p-3">
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="font-medium">{phaseName(group.name)}</span>
                                    <span className="font-mono tabular-nums">{total ? Math.round((done / total) * 100) : 0}%</span>
                                </div>
                                <p className="opacity-80">
                                    {done} of {total} done · {total - done} left
                                </p>
                                {rows.length > 0 && (
                                    <ul className="flex flex-col gap-1.5">
                                        {rows.map(({ s, done: d, total: t }) => (
                                            <li key={s.key}>
                                                <div className="flex justify-between gap-3 text-xs">
                                                    <span className="truncate">{s.title}</span>
                                                    <span className="font-mono tabular-nums">{t - d}</span>
                                                </div>
                                                <div className="bg-background/20 mt-0.5 h-1 rounded-full">
                                                    <div className="bg-background/70 h-full rounded-full" style={{ width: `${Math.min(100, ((t - d) / most) * 100)}%` }} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </section>
        </TooltipProvider>
    )
}
