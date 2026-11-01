import { useState } from "react"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"
import { countTasks, type RoadmapEdit, type RoadmapTask } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { InlineMarkdown } from "../../project/components/roadmap-markdown"
import { taskDone } from "../roadmap-state"

export type EditHandler = (edit: RoadmapEdit) => void

/** A one-line text box that submits on Enter and cancels on Escape. */
function TextEntry({ initial = "", placeholder, onSubmit, onCancel }: { initial?: string; placeholder: string; onSubmit: (text: string) => void; onCancel?: () => void }) {
    const [text, setText] = useState(initial)
    const submit = () => {
        const trimmed = text.trim()
        if (trimmed) onSubmit(trimmed)
    }
    return (
        <div className="flex items-center gap-1.5">
            <Input
                autoFocus={!!onCancel}
                value={text}
                placeholder={placeholder}
                aria-label={placeholder}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") submit()
                    if (e.key === "Escape") onCancel?.()
                }}
                className="h-8 text-sm"
            />
            <Button size="icon" variant="ghost" className="size-8 shrink-0 cursor-pointer" onClick={submit} disabled={!text.trim()} aria-label="Save">
                <Check />
            </Button>
            {onCancel && (
                <Button size="icon" variant="ghost" className="size-8 shrink-0 cursor-pointer" onClick={onCancel} aria-label="Cancel">
                    <X />
                </Button>
            )}
        </div>
    )
}

/** A branch's own progress: a thin bar and "2/4", shown on tasks that have subtasks. */
function BranchProgress({ task }: { task: RoadmapTask }) {
    const { done, total } = countTasks(task.children)
    return (
        <span className="text-muted-foreground flex shrink-0 items-center gap-2 font-mono text-xs tabular-nums" aria-label={`${done} of ${total} subtasks done`}>
            <span aria-hidden className="bg-foreground/10 h-1 w-10 overflow-hidden rounded-full">
                <span className="bg-foreground/70 block h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
            </span>
            {done}/{total}
        </span>
    )
}

function TaskRow({
    task,
    sectionLine,
    hideDone,
    busy,
    onEdit,
    nested = false,
}: {
    task: RoadmapTask
    sectionLine: number
    hideDone: boolean
    busy: boolean
    onEdit: EditHandler
    /** A subtask hangs off its parent's vertical line with a short horizontal stub. */
    nested?: boolean
}) {
    const [mode, setMode] = useState<"view" | "edit" | "add" | "delete">("view")
    const done = task.children.length ? taskDone(task) : task.checked

    if (hideDone && taskDone(task)) return null

    return (
        <li className={cn("relative", nested && "before:bg-border before:absolute before:top-4 before:-left-4 before:h-px before:w-3.5 before:content-['']")}>
            <div className="group hover:bg-muted/50 flex items-start gap-2.5 rounded-md px-2 py-1.5">
                <Checkbox
                    checked={task.checked}
                    disabled={busy}
                    onCheckedChange={(value) => onEdit({ type: "toggle", line: task.line, text: task.text, checked: value === true })}
                    className="mt-0.5 cursor-pointer"
                    aria-label={task.checked ? "Mark not done" : "Mark done"}
                />
                <div className="min-w-0 flex-1">
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
                        <div className={cn("text-sm leading-6", done && "text-muted-foreground line-through decoration-1")}>
                            <InlineMarkdown>{task.text}</InlineMarkdown>
                        </div>
                    )}
                    {task.notes.map((note, i) => (
                        <p key={i} className="text-muted-foreground mt-0.5 text-xs leading-5">
                            <InlineMarkdown>{note}</InlineMarkdown>
                        </p>
                    ))}
                </div>

                {task.children.length > 0 && mode !== "delete" && <BranchProgress task={task} />}

                {mode === "delete" ? (
                    <div className="flex shrink-0 items-center gap-1 text-xs">
                        <span className="text-muted-foreground">{task.children.length ? "Delete with subtasks?" : "Delete?"}</span>
                        <Button size="sm" variant="destructive" className="h-7 cursor-pointer px-2" onClick={() => onEdit({ type: "delete", line: task.line, text: task.text })}>
                            Delete
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 cursor-pointer px-2" onClick={() => setMode("view")}>
                            Keep
                        </Button>
                    </div>
                ) : (
                    mode === "view" && (
                        <div className="flex shrink-0 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                            <Button size="icon" variant="ghost" className="size-7 cursor-pointer" onClick={() => setMode("add")} aria-label="Add subtask">
                                <Plus />
                            </Button>
                            <Button size="icon" variant="ghost" className="size-7 cursor-pointer" onClick={() => setMode("edit")} aria-label="Edit task">
                                <Pencil />
                            </Button>
                            <Button size="icon" variant="ghost" className="size-7 cursor-pointer" onClick={() => setMode("delete")} aria-label="Delete task">
                                <Trash2 />
                            </Button>
                        </div>
                    )
                )}
            </div>

            {(task.children.length > 0 || mode === "add") && (
                <ul className="border-border ml-[1.1rem] border-l pl-4">
                    {task.children.map((child) => (
                        <TaskRow key={child.line} task={child} sectionLine={sectionLine} hideDone={hideDone} busy={busy} onEdit={onEdit} nested />
                    ))}
                    {mode === "add" && (
                        <li className="before:bg-border relative py-1 pl-2 before:absolute before:top-5 before:-left-4 before:h-px before:w-3.5 before:content-['']">
                            <TextEntry
                                placeholder="New subtask"
                                onCancel={() => setMode("view")}
                                onSubmit={(text) => {
                                    setMode("view")
                                    onEdit({ type: "add", sectionLine, parentLine: task.line, text })
                                }}
                            />
                        </li>
                    )}
                </ul>
            )}
        </li>
    )
}

/** A section's task tree with subtasks hung off connector lines, plus the box that adds a top-level task. */
export function TaskTree({ tasks, sectionLine, hideDone, busy, onEdit }: { tasks: RoadmapTask[]; sectionLine: number; hideDone: boolean; busy: boolean; onEdit: EditHandler }) {
    return (
        <div className="flex flex-col gap-3">
            {tasks.length > 0 && (
                <ul className="flex flex-col">
                    {tasks.map((task) => (
                        <TaskRow key={task.line} task={task} sectionLine={sectionLine} hideDone={hideDone} busy={busy} onEdit={onEdit} />
                    ))}
                </ul>
            )}
            <TextEntry placeholder="Add a task…" onSubmit={(text) => onEdit({ type: "add", sectionLine, text })} />
        </div>
    )
}
