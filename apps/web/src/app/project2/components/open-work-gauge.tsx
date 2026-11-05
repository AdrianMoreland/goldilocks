import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { countTasks, type RoadmapSection } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { overviewTotals, priorityMix, type MixSlice } from "../roadmap-state"

/** Segment ink: one ink at falling strength, so the order of urgency reads without a rainbow. */
const SEGMENT: Record<MixSlice["key"], string> = {
    P0: "bg-foreground",
    P1: "bg-foreground/70",
    P2: "bg-foreground/45",
    P3: "bg-foreground/25",
    none: "bg-foreground/12",
}

/** Per-section bars: the sections that still have open tasks, in file order. */
function openBySection(sections: RoadmapSection[]) {
    return sections
        .map((section) => ({ section, ...countTasks(section.tasks) }))
        .filter((x) => x.total - x.done > 0)
        .map((x) => ({ section: x.section, open: x.total - x.done }))
}

/**
 * Open work as a gauge card: the open count large with "/ total tasks", the share done beside it, a segmented meter by
 * priority with a legend that dims the other segments when you hover or focus a row, a bar per open section you can
 * step through with the arrow keys, and a footer that says what is in Now and offers the board.
 */
export function OpenWorkGauge({ sections, onGoBoard }: { sections: RoadmapSection[]; onGoBoard: () => void }) {
    const totals = overviewTotals(sections)
    const total = totals.tasksOpen + totals.tasksDone
    const percent = total ? Math.round((totals.tasksDone / total) * 100) : 0
    const mix = priorityMix(sections)
    const bars = openBySection(sections)
    const tallest = Math.max(1, ...bars.map((b) => b.open))

    const [focus, setFocus] = useState<MixSlice["key"] | null>(null)
    const [day, setDay] = useState<number | null>(null)
    const shown = day === null ? null : bars[day]

    const stepBars = (event: React.KeyboardEvent) => {
        const last = bars.length - 1
        const at = day ?? last
        if (event.key === "ArrowLeft") setDay(Math.max(0, at - 1))
        else if (event.key === "ArrowRight") setDay(Math.min(last, at + 1))
        else if (event.key === "Home") setDay(0)
        else if (event.key === "End") setDay(last)
        else if (event.key === "Escape") setDay(null)
        else return
        event.preventDefault()
    }

    return (
        <section aria-label="Open work" className="bg-card flex flex-col gap-4 rounded-2xl border p-4 shadow-xs/5">
            <header className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Sparkles className="size-3.5" aria-hidden /> Open work
                    </p>
                    <p className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-3xl font-semibold tracking-tight tabular-nums">{totals.tasksOpen}</span>
                        <span className="text-muted-foreground text-sm tabular-nums">/ {total} tasks</span>
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex h-5 items-center rounded-full border px-2 text-xs">{totals.sectionsOpen} sections open</span>
                    <span className={cn("font-mono text-sm tabular-nums", percent === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>{percent}% done</span>
                </div>
            </header>

            <div>
                <div role="meter" aria-label="Open tasks by priority" aria-valuemin={0} aria-valuemax={totals.tasksOpen} aria-valuenow={totals.tasksOpen} className="bg-muted flex h-2 gap-px overflow-hidden rounded-full">
                    {mix
                        .filter((slice) => slice.open > 0)
                        .map((slice) => (
                            <span
                                key={slice.key}
                                className={cn("transition-opacity duration-200 motion-reduce:transition-none", SEGMENT[slice.key], focus && focus !== slice.key && "opacity-25")}
                                style={{ width: `${(slice.open / Math.max(1, totals.tasksOpen)) * 100}%` }}
                            />
                        ))}
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-1">
                    {mix.map((slice) => (
                        <li key={slice.key}>
                            <button
                                type="button"
                                onMouseEnter={() => setFocus(slice.key)}
                                onMouseLeave={() => setFocus(null)}
                                onFocus={() => setFocus(slice.key)}
                                onBlur={() => setFocus(null)}
                                className="hover:bg-muted focus-visible:ring-ring flex w-full cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-left focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <span aria-hidden className={cn("size-2 shrink-0 rounded-[3px]", SEGMENT[slice.key])} />
                                <span className="min-w-0 flex-1 truncate text-xs">{slice.label}</span>
                                <span className="font-mono text-xs tabular-nums">{slice.open}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {bars.length > 0 && (
                <div className="bg-muted/60 rounded-xl p-3">
                    <div className="flex items-baseline justify-between gap-3 text-xs" aria-live="polite">
                        <span className="min-w-0 truncate font-medium">{shown ? shown.section.title : "Open tasks by section"}</span>
                        <span className="font-mono tabular-nums">{shown ? `${shown.open} open` : `${bars.length} sections`}</span>
                    </div>
                    <div
                        role="group"
                        tabIndex={0}
                        aria-label="Open tasks per section. Use the arrow keys to move between sections."
                        onKeyDown={stepBars}
                        onBlur={() => setDay(null)}
                        className="focus-visible:ring-ring mt-2 flex h-16 items-end gap-[3px] rounded-md focus-visible:ring-2 focus-visible:outline-none"
                    >
                        {bars.map((bar, i) => (
                            <span
                                key={bar.section.key}
                                onMouseEnter={() => setDay(i)}
                                onMouseLeave={() => setDay(null)}
                                className={cn(
                                    "min-w-[3px] flex-1 rounded-[2px] transition-colors",
                                    day === i ? "bg-foreground" : day === null ? "bg-foreground/45" : "bg-foreground/20",
                                    bar.section.priority === "P0" && day !== i && day === null && "bg-foreground/80",
                                )}
                                style={{ height: `${Math.max(6, (bar.open / tallest) * 100)}%` }}
                            />
                        ))}
                    </div>
                    <div className="text-muted-foreground mt-1.5 flex justify-between font-mono text-[10px]">
                        <span>{bars[0].section.id}</span>
                        <span>{bars[bars.length - 1].section.id}</span>
                    </div>
                </div>
            )}

            <footer className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs" role="status">
                    {totals.nowOpen > 0 ? (
                        <>
                            <span className="text-foreground font-mono tabular-nums">{totals.nowOpen}</span> tasks open in Now.
                        </>
                    ) : (
                        "Nothing open in Now."
                    )}
                </p>
                <Button size="sm" variant={totals.nowOpen > 0 ? "default" : "outline"} className="cursor-pointer active:scale-[0.97]" onClick={onGoBoard}>
                    {totals.nowOpen > 0 ? "Review Now work" : "Open the board"} <ArrowRight />
                </Button>
            </footer>
        </section>
    )
}
