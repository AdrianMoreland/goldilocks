import { useState } from "react"
import type { RoadmapSection } from "@goldilocks/shared-types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { overviewTotals, priorityMix, type MixSlice } from "../roadmap-state"
import { PhaseStrip } from "./phase-strip"
import { PriorityGlyph } from "./priority-glyph"
import { UpNext } from "./up-next"

function Tile({ value, label, glyph }: { value: number; label: string; glyph?: React.ReactNode }) {
    return (
        <Card className="gap-1 py-4">
            <CardContent className="px-4">
                <p className="font-mono text-2xl font-medium tracking-tight tabular-nums">{value}</p>
                <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                    {glyph}
                    {label}
                </p>
            </CardContent>
        </Card>
    )
}

/** Segment ink for the open-work meter: the same ink at falling strength, so the order reads without a rainbow (DESIGN.md "Earned Colour Rule"). */
const SEGMENT: Record<MixSlice["key"], string> = {
    P0: "bg-foreground",
    P1: "bg-foreground/70",
    P2: "bg-foreground/45",
    P3: "bg-foreground/25",
    none: "bg-foreground/12",
}

/** Where the open work sits, as one segmented bar with a legend: hovering or focusing a legend row dims the other segments. */
function OpenWorkMeter({ sections }: { sections: RoadmapSection[] }) {
    const mix = priorityMix(sections)
    const total = mix.reduce((sum, slice) => sum + slice.open, 0)
    const [focus, setFocus] = useState<MixSlice["key"] | null>(null)

    return (
        <Card className="gap-3 py-4">
            <CardContent className="flex flex-col gap-3 px-4">
                <div className="flex items-baseline justify-between">
                    <h2 className="text-sm font-medium">Open work by priority</h2>
                    <span className="text-muted-foreground font-mono text-xs tabular-nums">{total} open</span>
                </div>
                <div role="meter" aria-label="Open tasks by priority" aria-valuemin={0} aria-valuemax={total} aria-valuenow={total} className="bg-muted flex h-2 gap-px overflow-hidden rounded-full">
                    {mix
                        .filter((slice) => slice.open > 0)
                        .map((slice) => (
                            <span
                                key={slice.key}
                                className={cn("transition-opacity duration-200 motion-reduce:transition-none", SEGMENT[slice.key], focus && focus !== slice.key && "opacity-30")}
                                style={{ width: `${(slice.open / total) * 100}%` }}
                            />
                        ))}
                </div>
                <ul className="grid grid-cols-2 gap-1 sm:grid-cols-5">
                    {mix.map((slice) => (
                        <li key={slice.key}>
                            <button
                                type="button"
                                onMouseEnter={() => setFocus(slice.key)}
                                onMouseLeave={() => setFocus(null)}
                                onFocus={() => setFocus(slice.key)}
                                onBlur={() => setFocus(null)}
                                className="hover:bg-muted focus-visible:ring-ring flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-left focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <span aria-hidden className={cn("size-2 shrink-0 rounded-[3px]", SEGMENT[slice.key])} />
                                <span className="min-w-0 flex-1 truncate text-xs">{slice.label}</span>
                                <span className="font-mono text-xs tabular-nums">{slice.open}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

/** The overview: the four numbers, the phase rings, where the open work sits and what to look at first. */
export function OverviewTab({ sections, onOpen }: { sections: RoadmapSection[]; onOpen: (key: string) => void }) {
    const totals = overviewTotals(sections)

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tile value={totals.tasksOpen} label="tasks open" />
                <Tile value={totals.tasksDone} label="tasks done" />
                <Tile value={totals.sectionsOpen} label="sections open" />
                <Tile value={totals.nowOpen} label="open in Now" glyph={<PriorityGlyph priority="P0" />} />
            </div>
            <PhaseStrip sections={sections} />
            <div className="grid items-start gap-4 lg:grid-cols-[1fr_1fr]">
                <OpenWorkMeter sections={sections} />
                <UpNext sections={sections} onSelect={onOpen} />
            </div>
        </div>
    )
}
