import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { NO_FILTER, PRIORITIES, PRIORITY_LABEL, isFiltering, type Priority, type RoadmapFilter } from "../roadmap-state"
import { PriorityGlyph } from "./priority-glyph"

/** Search, priority chips and "hide done" in one row, with a running "n of m sections" once anything is filtered. */
export function RoadmapToolbar({ filter, shown, total, onFilter }: { filter: RoadmapFilter; shown: number; total: number; onFilter: (filter: RoadmapFilter) => void }) {
    const togglePriority = (p: Priority) =>
        onFilter({ ...filter, priorities: filter.priorities.includes(p) ? filter.priorities.filter((x) => x !== p) : [...filter.priorities, p] })

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="relative min-w-52 flex-1 basis-64">
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
                            "text-muted-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs",
                            filter.priorities.includes(p) ? "border-foreground text-foreground" : "hover:bg-muted",
                        )}
                    >
                        <PriorityGlyph priority={p} /> {PRIORITY_LABEL[p]}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Switch id="hide-done-2" checked={filter.hideDone} onCheckedChange={(hideDone) => onFilter({ ...filter, hideDone })} className="cursor-pointer" />
                <Label htmlFor="hide-done-2" className="cursor-pointer text-xs">
                    Hide done
                </Label>
            </div>
            {isFiltering(filter) && (
                <button type="button" onClick={() => onFilter(NO_FILTER)} className="text-muted-foreground cursor-pointer font-mono text-xs tabular-nums underline-offset-4 hover:underline">
                    Clear · {shown} of {total}
                </button>
            )}
        </div>
    )
}
