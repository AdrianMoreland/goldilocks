import { useState } from "react"
import { AlertCircle, ChevronRight, ListChecks } from "lucide-react"
import { countTasks, type RoadmapSection } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { StatusDot } from "@/components/status-dot"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { InlineMarkdown } from "../../project/components/roadmap-markdown"
import { PRIORITY_LABEL, phaseName, taskDone, upNext, type Priority } from "../roadmap-state"
import { parseTaskMeta } from "../task-meta"

type Tab = "all" | Priority

const TABS: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "P0", label: PRIORITY_LABEL.P0 },
    { key: "P1", label: PRIORITY_LABEL.P1 },
    { key: "P2", label: PRIORITY_LABEL.P2 },
]

const SHOWN = 6

function RunRow({ section, done, total, open, onToggle, onOpen }: { section: RoadmapSection; done: number; total: number; open: boolean; onToggle: () => void; onOpen: () => void }) {
    const started = done > 0
    // The next three tasks still to do, in file order: what working on this section starts with.
    const steps = section.tasks.filter((t) => !taskDone(t)).slice(0, 3)
    const now = section.priority === "P0"

    return (
        <li>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className={cn(
                    "hover:bg-muted/70 focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99] motion-reduce:active:scale-100",
                    open && "bg-muted/70",
                )}
            >
                <span className="flex size-6 shrink-0 items-center justify-center">
                    {now ? <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" aria-label="Now" /> : <ProgressRing value={done} total={total} label="Tasks done" size="sm" />}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{section.title}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                        {phaseName(section.group)} · <span className="font-mono">{section.id}</span>
                    </span>
                </span>
                <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
                    {done}/{total}
                </span>
                <span className="bg-muted text-muted-foreground hidden shrink-0 rounded-full px-2 py-0.5 text-xs sm:inline">{started ? "In progress" : "Not started"}</span>
                <ChevronRight className={cn("text-muted-foreground size-4 shrink-0 transition-transform motion-reduce:transition-none", open && "rotate-90")} aria-hidden />
            </button>
            {open && (
                <div className="flex flex-col gap-3 pt-1 pr-2 pb-3 pl-12">
                    <ol className="border-border ml-1 flex flex-col gap-1.5 border-l pl-4">
                        {steps.map((task, i) => (
                            <li key={task.line} className="relative text-xs leading-5">
                                <span aria-hidden className={cn("absolute top-2 -left-[1.28rem] size-1.5 rounded-full", i === 0 ? "bg-foreground" : "bg-foreground/30")} />
                                <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>
                                    <InlineMarkdown>{parseTaskMeta(task.text).title}</InlineMarkdown>
                                </span>
                            </li>
                        ))}
                    </ol>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 cursor-pointer px-2.5 text-xs" onClick={onOpen}>
                            Open tasks
                        </Button>
                    </div>
                </div>
            )}
        </li>
    )
}

/**
 * The sections to work on, as a run list: most urgent first, with a status line, filter tabs that show their counts,
 * and rows that open to show the next three tasks and an Open button. Opening one row closes any other, and
 * changing the filter closes the open row.
 */
export function RunList({ sections, onOpen }: { sections: RoadmapSection[]; onOpen: (key: string) => void }) {
    const [tab, setTab] = useState<Tab>("all")
    const [openKey, setOpenKey] = useState<string | null>(null)

    const all = upNext(sections, sections.length)
    const countOf = (key: Tab) => (key === "all" ? all.length : all.filter((i) => i.section.priority === key).length)
    const rows = (tab === "all" ? all : all.filter((i) => i.section.priority === tab)).slice(0, SHOWN)
    const nowCount = all.filter((i) => i.section.priority === "P0").length
    const hidden = countOf(tab) - rows.length

    return (
        <section aria-label="Up next" className="bg-card rounded-2xl border shadow-xs/5">
            <header className="flex items-center gap-3 px-4 pt-4">
                <ListChecks className="text-muted-foreground size-4" aria-hidden />
                <div>
                    <h2 className="text-sm font-medium">Up next</h2>
                    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <StatusDot tone={all.length > 0 ? "info" : "ok"} />
                        <span className="font-mono tabular-nums">{all.length}</span> open · <span className="font-mono tabular-nums">{nowCount}</span> in Now
                    </p>
                </div>
            </header>

            <div role="tablist" aria-label="Filter by priority" className="bg-muted mx-4 mt-3 flex gap-0.5 rounded-lg p-0.5">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={tab === key}
                        onClick={() => {
                            setTab(key)
                            setOpenKey(null)
                        }}
                        className={cn(
                            "flex h-7 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors",
                            tab === key ? "bg-background text-foreground shadow-xs/5" : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {label}
                        <span className="font-mono tabular-nums opacity-70">{countOf(key)}</span>
                    </button>
                ))}
            </div>

            {rows.length === 0 ? (
                <div className="px-4 py-10 text-center">
                    <p className="text-sm font-medium">Nothing here</p>
                    <p className="text-muted-foreground mt-1 text-xs">No open section has this priority.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-0.5 p-2">
                    {rows.map(({ section }) => {
                        const { done, total } = countTasks(section.tasks)
                        return (
                            <RunRow
                                key={section.key}
                                section={section}
                                done={done}
                                total={total}
                                open={openKey === section.key}
                                onToggle={() => setOpenKey(openKey === section.key ? null : section.key)}
                                onOpen={() => onOpen(section.key)}
                            />
                        )
                    })}
                </ul>
            )}
            {hidden > 0 && <p className="text-muted-foreground px-4 pb-3 text-xs">and {hidden} more on the board</p>}
        </section>
    )
}
