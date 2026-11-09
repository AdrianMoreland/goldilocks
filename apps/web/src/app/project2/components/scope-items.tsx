import { useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import type { RoadmapScopeItem, RoadmapScopeKey } from "@goldilocks/shared-types"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { StatusDot } from "@/components/status-dot"
import { TextEntry } from "./text-entry"
import { PriorityGlyph } from "./priority-glyph"
import { PRIORITIES, PRIORITY_LABEL, type Priority } from "../roadmap-state"
import { filterScopeItems, isScopeFiltering, NO_SCOPE_FILTER, noteForItem, SCOPE_LABEL, sortScopeItems, STATUS_TONE, taskCount, verifiedText, type ScopeFilter } from "../scope-state"
import { useQueueNote } from "./scope-queue"

const SCOPES = Object.keys(SCOPE_LABEL) as RoadmapScopeKey[]

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={pressed}
            onClick={onClick}
            className={cn("text-muted-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs", pressed ? "border-foreground text-foreground" : "hover:bg-muted")}
        >
            {children}
        </button>
    )
}

/** One open item: the line you scan (ID, title, priority, status, progress) and, opened, its subtasks, notes and a box that queues a note about it. */
function ScopeItemCard({ item }: { item: RoadmapScopeItem }) {
    const [open, setOpen] = useState(false)
    const note = useQueueNote()
    const { done, total } = taskCount(item)

    return (
        <li className="rounded-xl border">
            <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left">
                <PriorityGlyph priority={item.priority as Priority} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-muted-foreground font-mono text-xs tabular-nums">{item.id}</span>
                        <span className="text-sm font-medium break-words">{item.title}</span>
                    </span>
                    <span className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="flex items-center gap-1.5">
                            <StatusDot tone={STATUS_TONE[item.status]} /> {item.status}
                        </span>
                        <span>Effort {item.effort}</span>
                        {total > 0 && (
                            <span className="tabular-nums">
                                {done} of {total} tasks
                            </span>
                        )}
                        {item.flags.length > 0 && <span>{item.flags.join(" · ")}</span>}
                        {item.after.length > 0 && <span>after {item.after.join(", ")}</span>}
                    </span>
                </span>
                <ChevronDown className={cn("text-muted-foreground mt-1 size-4 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
            </button>

            {open && (
                <div className="flex flex-col gap-3 border-t px-4 py-3">
                    <p className="text-muted-foreground text-xs">
                        {SCOPE_LABEL[item.scope]} · {verifiedText(item)}
                        {item.was ? ` · old number ${item.was}` : ""}
                        {item.deadline ? ` · deadline ${item.deadline}` : ""}
                    </p>
                    {item.body && <p className="text-sm break-words whitespace-pre-wrap">{item.body}</p>}
                    {item.tasks.length > 0 && (
                        <ul className="flex flex-col gap-1.5">
                            {item.tasks.map((t, i) => (
                                <li key={i} style={{ paddingLeft: `${t.depth * 1.25}rem` }} className="flex items-start gap-2 text-sm">
                                    <span aria-hidden className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", t.checked ? "bg-status-ok" : "bg-muted-foreground/40")} />
                                    <span className={cn("break-words", t.checked && "text-muted-foreground line-through")}>
                                        <span className="sr-only">{t.checked ? "Done: " : "Open: "}</span>
                                        {t.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div>
                        <p className="text-muted-foreground mb-1 text-xs">Queue a note about {item.id}</p>
                        <TextEntry placeholder={`A change, or a tick, for ${item.id}`} onSubmit={(text) => note.mutate(noteForItem(item, text))} />
                    </div>
                </div>
            )}
        </li>
    )
}

/** The open items of the scope files, filtered by words, scope and priority. Read only; the note box on each item queues a note. */
export function ScopeItems({ items }: { items: RoadmapScopeItem[] }) {
    const [filter, setFilter] = useState<ScopeFilter>(NO_SCOPE_FILTER)
    const shown = useMemo(() => sortScopeItems(filterScopeItems(items, filter)), [items, filter])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="relative min-w-52 flex-1 basis-64">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden />
                    <Input value={filter.query} onChange={(e) => setFilter({ ...filter, query: e.target.value })} placeholder="Search items, subtasks and IDs" aria-label="Search the roadmap" className="h-8 pl-8 text-sm" />
                </div>
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by scope">
                    {SCOPES.map((s) => (
                        <Chip key={s} pressed={filter.scope === s} onClick={() => setFilter({ ...filter, scope: filter.scope === s ? "all" : s })}>
                            {SCOPE_LABEL[s]}
                        </Chip>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter by priority">
                    {PRIORITIES.map((p) => (
                        <Chip key={p} pressed={filter.priority === p} onClick={() => setFilter({ ...filter, priority: filter.priority === p ? "all" : p })}>
                            <PriorityGlyph priority={p} /> {PRIORITY_LABEL[p]}
                        </Chip>
                    ))}
                </div>
                {isScopeFiltering(filter) && (
                    <button type="button" onClick={() => setFilter(NO_SCOPE_FILTER)} className="text-muted-foreground cursor-pointer font-mono text-xs tabular-nums underline-offset-4 hover:underline">
                        Clear · {shown.length} of {items.length}
                    </button>
                )}
            </div>

            {shown.length === 0 ? (
                <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-8 text-center text-sm">{items.length === 0 ? "No open items in the scope files." : "Nothing matches."}</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {shown.map((item) => (
                        <ScopeItemCard key={item.id} item={item} />
                    ))}
                </ul>
            )}
        </div>
    )
}
