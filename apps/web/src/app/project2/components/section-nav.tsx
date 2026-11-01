import { Search } from "lucide-react"
import { countTasks, type RoadmapSection } from "@goldilocks/shared-types"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { StatusDot } from "@/components/status-dot"
import { cn } from "@/lib/utils"
import { sectionIcon } from "../../project/components/section-icon"
import { PRIORITIES, PRIORITY_LABEL, groupSections, isFiltering, phaseName, type Priority, type RoadmapFilter, NO_FILTER } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"

/** Search, priority and "hide done" controls, then the sections under their phase. A section with nothing left to tick shows a done dot instead of a count. */
export function SectionNav({
    sections,
    selectedKey,
    filter,
    totalSections,
    onFilter,
    onSelect,
}: {
    sections: RoadmapSection[]
    selectedKey: string | undefined
    filter: RoadmapFilter
    totalSections: number
    onFilter: (filter: RoadmapFilter) => void
    onSelect: (key: string) => void
}) {
    const groups = groupSections(sections)
    const togglePriority = (p: Priority) =>
        onFilter({ ...filter, priorities: filter.priorities.includes(p) ? filter.priorities.filter((x) => x !== p) : [...filter.priorities, p] })

    return (
        <nav aria-label="Roadmap sections" className="bg-card flex max-h-96 flex-col overflow-hidden rounded-xl border lg:sticky lg:top-4 lg:max-h-[calc(100vh-9rem)]">
            <div className="flex flex-col gap-2 border-b p-2.5">
                <div className="relative">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden />
                    <Input
                        value={filter.query}
                        onChange={(e) => onFilter({ ...filter, query: e.target.value })}
                        placeholder="Search sections and tasks"
                        aria-label="Search the roadmap"
                        className="h-8 pl-8 text-sm"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by priority">
                    {PRIORITIES.map((p) => (
                        <button
                            key={p}
                            type="button"
                            aria-pressed={filter.priorities.includes(p)}
                            onClick={() => togglePriority(p)}
                            className={cn(
                                "text-muted-foreground flex h-7 cursor-pointer items-center gap-1.5 rounded-md border px-2 text-xs",
                                filter.priorities.includes(p) ? "border-foreground text-foreground" : "hover:bg-muted",
                            )}
                        >
                            <PriorityGlyph priority={p} /> {PRIORITY_LABEL[p]}
                        </button>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Switch id="hide-done-2" checked={filter.hideDone} onCheckedChange={(hideDone) => onFilter({ ...filter, hideDone })} className="cursor-pointer" />
                        <Label htmlFor="hide-done-2" className="cursor-pointer text-xs">
                            Hide done
                        </Label>
                    </div>
                    {isFiltering(filter) && (
                        <button type="button" onClick={() => onFilter(NO_FILTER)} className="text-muted-foreground cursor-pointer text-xs underline-offset-4 hover:underline">
                            Clear · {sections.length} of {totalSections}
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-y-auto p-2">
                {groups.length === 0 && <p className="text-muted-foreground px-2 py-6 text-center text-sm">No section matches.</p>}
                {groups.map((group) => (
                    <div key={group.name} className="mb-2 last:mb-0">
                        <p className="text-muted-foreground px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wide uppercase">{phaseName(group.name)}</p>
                        {group.sections.map((section) => {
                            const Icon = sectionIcon(section.title)
                            const { done, total } = countTasks(section.tasks)
                            const active = section.key === selectedKey
                            return (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => onSelect(section.key)}
                                    aria-current={active ? "true" : undefined}
                                    className={cn("hover:bg-muted flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm", active && "bg-muted font-medium")}
                                >
                                    <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
                                    {section.id && <span className="text-muted-foreground w-8 shrink-0 font-mono text-xs tabular-nums">{section.id}</span>}
                                    <span className="min-w-0 flex-1 truncate">{section.title}</span>
                                    {total > 0 &&
                                        (done === total ? (
                                            <span className="flex items-center gap-1.5 text-xs">
                                                <StatusDot tone="ok" />
                                                <span className="sr-only">All {total} done</span>
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground font-mono text-xs tabular-nums">
                                                {done}/{total}
                                            </span>
                                        ))}
                                    {section.priority && <PriorityGlyph priority={section.priority} />}
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </nav>
    )
}
