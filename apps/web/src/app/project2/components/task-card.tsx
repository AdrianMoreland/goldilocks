import { useState } from "react"
import { Check, ChevronDown, Circle, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react"
import { countTasks, type RoadmapEdit, type RoadmapTask } from "@goldilocks/shared-types"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { InlineMarkdown } from "../../project/components/roadmap-markdown"
import { taskDone, type Priority } from "../roadmap-state"
import { parseTaskMeta, type Effort } from "../task-meta"
import { PriorityGlyph } from "./priority-glyph"
import { TextEntry } from "./text-entry"

export type EditHandler = (edit: RoadmapEdit) => void

const EFFORT: Record<Effort, { label: string; dot: string }> = {
    S: { label: "Small", dot: "bg-emerald-500" },
    M: { label: "Medium", dot: "bg-sky-500" },
    L: { label: "Large", dot: "bg-amber-500" },
}

/** One checklist item (a subtask) with its own subtasks beneath: a checkbox, the text, and edit and delete on hover. */
function ChecklistItem({ task, sectionLine, busy, onEdit, depth }: { task: RoadmapTask; sectionLine: number; busy: boolean; onEdit: EditHandler; depth: number }) {
    const [mode, setMode] = useState<"view" | "edit" | "delete">("view")
    const done = task.children.length ? taskDone(task) : task.checked

    return (
        <li>
            <div className="group/item hover:bg-background/70 flex items-start gap-2 rounded-lg px-1.5 py-1" style={{ marginLeft: depth * 14 }}>
                <Checkbox
                    checked={task.checked}
                    disabled={busy}
                    onCheckedChange={(value) => onEdit({ type: "toggle", line: task.line, text: task.text, checked: value === true })}
                    className="mt-0.5 size-3.5 cursor-pointer"
                    aria-label={task.checked ? "Mark not done" : "Mark done"}
                />
                {mode === "edit" ? (
                    <TextEntry
                        className="flex-1"
                        initial={task.text}
                        placeholder="Checklist item"
                        onCancel={() => setMode("view")}
                        onSubmit={(newText) => {
                            setMode("view")
                            if (newText !== task.text) onEdit({ type: "edit", line: task.line, text: task.text, newText })
                        }}
                    />
                ) : (
                    <span className={cn("min-w-0 flex-1 text-xs leading-5 transition-colors", done && "text-muted-foreground line-through decoration-1")}>
                        <InlineMarkdown>{task.text}</InlineMarkdown>
                    </span>
                )}
                {mode === "delete" ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs">
                        <Button size="sm" variant="destructive" className="h-6 cursor-pointer px-1.5 text-xs" onClick={() => onEdit({ type: "delete", line: task.line, text: task.text })}>
                            Delete
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 cursor-pointer px-1.5 text-xs" onClick={() => setMode("view")}>
                            Keep
                        </Button>
                    </span>
                ) : (
                    mode === "view" && (
                        <span className="flex shrink-0 opacity-0 transition-opacity group-focus-within/item:opacity-100 group-hover/item:opacity-100 [@media(hover:none)]:opacity-100">
                            <Button size="icon" variant="ghost" className="size-6 cursor-pointer" onClick={() => setMode("edit")} aria-label="Edit item">
                                <Pencil className="size-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="size-6 cursor-pointer" onClick={() => setMode("delete")} aria-label="Delete item">
                                <Trash2 className="size-3" />
                            </Button>
                        </span>
                    )
                )}
            </div>
            {task.children.length > 0 && (
                <ul>
                    {task.children.map((child) => (
                        <ChecklistItem key={child.line} task={child} sectionLine={sectionLine} busy={busy} onEdit={onEdit} depth={depth + 1} />
                    ))}
                </ul>
            )}
        </li>
    )
}

/**
 * The checklist panel of a task card: a soft inset that opens like a disclosure, with a progress ring, a thin bar
 * and the done count, and the subtasks as checkboxes underneath. Ring and bar go green when all are ticked.
 */
function ChecklistPanel({
    task,
    sectionLine,
    busy,
    onEdit,
    expanded,
    onToggle,
}: {
    task: RoadmapTask
    sectionLine: number
    busy: boolean
    onEdit: EditHandler
    expanded: boolean
    onToggle: () => void
}) {
    const { done, total } = countTasks(task.children)

    return (
        <div className="bg-muted/60 rounded-xl">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="focus-visible:ring-ring flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left focus-visible:ring-2 focus-visible:outline-none"
            >
                <ProgressRing value={done} total={total} label="Checklist" size="sm" />
                <span className="text-xs font-medium">Checklist</span>
                <span aria-hidden className="bg-foreground/10 h-1 flex-1 overflow-hidden rounded-full">
                    <span className={cn("block h-full transition-[width] duration-300 motion-reduce:transition-none", total > 0 && done === total ? "bg-emerald-500" : "bg-foreground/70")} style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                </span>
                <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    {done}/{total}
                </span>
                <ChevronDown className={cn("text-muted-foreground size-3.5 transition-transform motion-reduce:transition-none", expanded && "rotate-180")} aria-hidden />
            </button>
            {expanded && (
                <div className="flex flex-col gap-1 px-1.5 pb-2">
                    <ul>
                        {task.children.map((child) => (
                            <ChecklistItem key={child.line} task={child} sectionLine={sectionLine} busy={busy} onEdit={onEdit} depth={0} />
                        ))}
                    </ul>
                    <TextEntry className="px-1" placeholder="Add a checklist item" onSubmit={(text) => onEdit({ type: "add", sectionLine, parentLine: task.line, text })} />
                </div>
            )}
        </div>
    )
}

/**
 * A roadmap task as a card: priority glyph and ID on top, the title, the size as a label chip, the note, a checklist
 * panel for its subtasks and a footer pill that ticks it. Hover or focus shows the quick actions at the top right
 * (add a checklist item, edit, delete); on touch screens they stay visible.
 */
export function TaskCard({
    task,
    id,
    sectionPriority,
    sectionLine,
    busy,
    onEdit,
}: {
    task: RoadmapTask
    id: string
    sectionPriority: Priority | null
    sectionLine: number
    busy: boolean
    onEdit: EditHandler
}) {
    const [mode, setMode] = useState<"view" | "edit" | "delete">("view")
    const [expanded, setExpanded] = useState(false)
    const meta = parseTaskMeta(task.text)
    const priority = meta.priority ?? sectionPriority
    const hasChecklist = task.children.length > 0
    const done = hasChecklist ? taskDone(task) : task.checked
    const notes = [meta.note, ...task.notes].filter((n): n is string => !!n)

    return (
        <article
            aria-label={meta.title}
            className={cn(
                "group relative flex flex-col gap-2.5 rounded-2xl border bg-card p-3.5 shadow-xs/5 transition-colors hover:border-foreground/25 focus-within:border-foreground/25",
                done && "bg-card/60",
            )}
        >
            <header className="flex items-center gap-2 pr-20">
                {priority && <PriorityGlyph priority={priority} />}
                <span className="text-muted-foreground font-mono text-xs whitespace-nowrap tabular-nums">{id}</span>
            </header>

            {mode === "view" && (
                <div className="bg-popover absolute top-2.5 right-2.5 flex rounded-lg border p-0.5 opacity-0 shadow-xs/5 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-6 cursor-pointer"
                        onClick={() => setExpanded(true)}
                        aria-label="Add a checklist item"
                        title="Add a checklist item"
                    >
                        <Plus className="size-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-6 cursor-pointer" onClick={() => setMode("edit")} aria-label="Edit task" title="Edit task">
                        <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-6 cursor-pointer" onClick={() => setMode("delete")} aria-label="Delete task" title="Delete task">
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            )}

            {mode === "edit" ? (
                <TextEntry
                    initial={task.text}
                    placeholder="Task text"
                    onCancel={() => setMode("view")}
                    onSubmit={(newText) => {
                        setMode("view")
                        if (newText !== task.text) onEdit({ type: "edit", line: task.line, text: task.text, newText })
                    }}
                />
            ) : (
                <p className={cn("text-sm leading-snug font-medium text-balance transition-colors", done && "text-muted-foreground line-through decoration-1")}>
                    <InlineMarkdown>{meta.title}</InlineMarkdown>
                </p>
            )}

            {meta.effort && (
                <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-xs">
                        <span aria-hidden className={cn("size-1.5 rounded-full", EFFORT[meta.effort].dot)} />
                        {EFFORT[meta.effort].label}
                    </span>
                </div>
            )}

            {notes.length > 0 && (
                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed" title={notes.join(" ")}>
                    <InlineMarkdown>{notes.join(" ")}</InlineMarkdown>
                </p>
            )}

            {(hasChecklist || expanded) && (
                <ChecklistPanel task={task} sectionLine={sectionLine} busy={busy} onEdit={onEdit} expanded={expanded} onToggle={() => setExpanded((open) => !open)} />
            )}

            <footer className="flex items-center gap-2">
                {mode === "delete" ? (
                    <div className="flex w-full items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground flex-1">{hasChecklist ? "Delete with its checklist?" : "Delete this task?"}</span>
                        <Button size="sm" variant="destructive" className="h-7 cursor-pointer px-2" onClick={() => onEdit({ type: "delete", line: task.line, text: task.text })}>
                            Delete
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 cursor-pointer px-2" onClick={() => setMode("view")}>
                            Keep
                        </Button>
                    </div>
                ) : (
                    <>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => onEdit({ type: "toggle", line: task.line, text: task.text, checked: !task.checked })}
                            aria-pressed={task.checked}
                            className={cn(
                                "focus-visible:ring-ring inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.97] disabled:cursor-default",
                                done ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {done ? <Check className="size-3" strokeWidth={3} /> : <Circle className="size-3" />}
                            {done ? "Done" : "Open"}
                        </button>
                        {notes.length > 0 && (
                            <span className="text-muted-foreground ml-auto inline-flex items-center gap-1 font-mono text-xs tabular-nums" title={`${notes.length} note${notes.length === 1 ? "" : "s"}`}>
                                <MessageSquare className="size-3" aria-hidden />
                                {notes.length}
                            </span>
                        )}
                    </>
                )}
            </footer>
        </article>
    )
}
