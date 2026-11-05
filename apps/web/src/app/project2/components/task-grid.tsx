import { useState } from "react"
import type { RoadmapTask } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { taskDone, type Priority } from "../roadmap-state"
import { taskId } from "../task-meta"
import { TaskCard, type EditHandler } from "./task-card"
import { TextEntry } from "./text-entry"

type Show = "all" | "open" | "done"

const SHOW: { key: Show; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "done", label: "Done" },
]

/**
 * A section's tasks as a grid of task cards, under a small filter bar (All, Open, Done, each with its count) in the
 * style of the run list's tabs, and a dashed card at the end that adds a task. "Hide done" from the toolbar starts the filter on Open.
 */
export function TaskGrid({
    tasks,
    sectionId,
    sectionPriority,
    sectionLine,
    hideDone,
    busy,
    onEdit,
}: {
    tasks: RoadmapTask[]
    sectionId: string | null
    sectionPriority: Priority | null
    sectionLine: number
    hideDone: boolean
    busy: boolean
    onEdit: EditHandler
}) {
    const [chosen, setChosen] = useState<Show | null>(null)
    const show: Show = chosen ?? (hideDone ? "open" : "all")

    const doneCount = tasks.filter(taskDone).length
    const counts: Record<Show, number> = { all: tasks.length, open: tasks.length - doneCount, done: doneCount }
    const shown = tasks
        .map((task, ordinal) => ({ task, ordinal }))
        .filter(({ task }) => (show === "all" ? true : show === "done" ? taskDone(task) : !taskDone(task)))

    return (
        <div className="flex flex-col gap-3">
            {tasks.length > 0 && (
                <div role="tablist" aria-label="Show tasks" className="bg-muted flex w-fit gap-0.5 rounded-lg p-0.5">
                    {SHOW.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={show === key}
                            onClick={() => setChosen(key)}
                            className={cn(
                                "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                                show === key ? "bg-background text-foreground shadow-xs/5" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {label}
                            <span className="font-mono tabular-nums opacity-70">{counts[key]}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
                {shown.map(({ task, ordinal }) => (
                    <TaskCard key={task.line} task={task} id={taskId(sectionId, ordinal)} sectionPriority={sectionPriority} sectionLine={sectionLine} busy={busy} onEdit={onEdit} />
                ))}
                {shown.length === 0 && tasks.length > 0 && (
                    <p className="text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-center text-sm col-span-full">
                        {show === "open" ? "Everything here is done." : "Nothing is done here yet."}
                    </p>
                )}
                <div className="flex flex-col justify-center gap-2 rounded-2xl border border-dashed p-3.5">
                    <p className="text-muted-foreground text-xs">{tasks.length === 0 ? "No tasks yet." : "Add another task."}</p>
                    <TextEntry placeholder="Add a task…" onSubmit={(text) => onEdit({ type: "add", sectionLine, text })} />
                </div>
            </div>
        </div>
    )
}
