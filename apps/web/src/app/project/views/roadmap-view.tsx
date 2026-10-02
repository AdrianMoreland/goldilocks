import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { EyeOff } from "lucide-react"
import { countTasks, parseRoadmap, type RoadmapEdit, type RoadmapSection } from "@goldilocks/shared-types"
import { useRoadmapApi } from "@/api/roadmap.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RoadmapMarkdown } from "../components/roadmap-markdown"
import { sectionIcon } from "../components/section-icon"
import { TaskList } from "../components/task-list"

const PRIORITY = {
    P0: { label: "P0 · now", dot: "bg-red-500", chip: "bg-red-500/10 text-red-700 dark:text-red-300" },
    P1: { label: "P1 · next", dot: "bg-orange-500", chip: "bg-orange-500/10 text-orange-700 dark:text-orange-300" },
    P2: { label: "P2 · planned", dot: "bg-yellow-500", chip: "bg-yellow-500/15 text-yellow-800 dark:text-yellow-300" },
    P3: { label: "P3 · idea", dot: "bg-slate-400", chip: "bg-slate-500/10 text-slate-700 dark:text-slate-300" },
} as const

const progressOf = (sections: RoadmapSection[]) =>
    sections.reduce(
        (sum, section) => {
            const { done, total } = countTasks(section.tasks)
            return { done: sum.done + done, total: sum.total + total }
        },
        { done: 0, total: 0 },
    )

/** Groups sections in file order: the `# ` heading they sit under. */
function groupSections(sections: RoadmapSection[]) {
    const groups: { name: string; sections: RoadmapSection[] }[] = []
    for (const section of sections) {
        const last = groups[groups.length - 1]
        if (last && last.name === section.group) last.sections.push(section)
        else groups.push({ name: section.group, sections: [section] })
    }
    return groups
}

/**
 * The roadmap (docs/ROADMAP.md, stored in the database) as something to browse and tick off. Every
 * change goes to the API as one small edit against the version on screen; the API applies it to the
 * Markdown, so the file stays the format and this page never invents its own. The route is wrapped
 * in RequireAdmin and the API checks admin again.
 */
export default function RoadmapView() {
    const api = useRoadmapApi()
    const queryClient = useQueryClient()
    const [params, setParams] = useSearchParams()
    const [hideDone, setHideDone] = useState(false)

    const roadmap = useQuery({ queryKey: queryKeys.roadmap, queryFn: api.getRoadmap })
    const markdown = roadmap.data?.markdown
    const sections = useMemo(() => (markdown ? parseRoadmap(markdown) : []), [markdown])
    const groups = useMemo(() => groupSections(sections), [sections])

    const requested = params.get("s")
    const selected =
        sections.find((s) => s.key === requested) ??
        sections.find((s) => countTasks(s.tasks).done < countTasks(s.tasks).total) ??
        sections[0]

    const edit = useMutation({
        mutationFn: (change: RoadmapEdit) => api.editRoadmap({ version: roadmap.data?.version ?? 0, edit: change }),
        onSuccess: (doc) => queryClient.setQueryData(queryKeys.roadmap, doc),
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Could not save the change")
            void roadmap.refetch()
        },
    })

    const overall = progressOf(sections)

    return (
        <div className="flex flex-col gap-4">
            {roadmap.isLoading && <Skeleton className="h-96 w-full rounded-xl" />}
            {roadmap.isError && <p className="text-destructive text-sm">Could not load the roadmap.</p>}

            {roadmap.data?.version === 0 && (
                <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-8 text-center text-sm">
                    The roadmap has not been imported yet. Run <code className="bg-muted rounded px-1 py-0.5">pnpm --filter api roadmap:import</code> once, then reload.
                </p>
            )}

            {selected && (
                <>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {groups
                            .filter((g) => /^PHASE/i.test(g.name))
                            .map((g) => {
                                const { done, total } = progressOf(g.sections)
                                return (
                                    <div key={g.name} className="min-w-40 flex-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-medium">{g.name.split("—")[0].trim()}</span>
                                            <span className="text-muted-foreground tabular-nums">
                                                {done}/{total}
                                            </span>
                                        </div>
                                        <Progress value={total ? (done / total) * 100 : 0} className="mt-1 h-1.5" />
                                    </div>
                                )
                            })}
                        <div className="flex items-center gap-2">
                            <Switch id="hide-done" checked={hideDone} onCheckedChange={setHideDone} className="cursor-pointer" />
                            <Label htmlFor="hide-done" className="cursor-pointer gap-1.5 text-xs">
                                <EyeOff className="size-3.5" /> Hide done
                            </Label>
                        </div>
                        <span className="text-muted-foreground text-xs tabular-nums">
                            {overall.done} of {overall.total} tasks done
                        </span>
                    </div>

                    <div className="grid items-start gap-4 lg:grid-cols-[19rem_1fr]">
                        <nav aria-label="Roadmap sections" className="bg-card max-h-72 overflow-y-auto rounded-xl border p-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-9rem)]">
                            {groups.map((group) => (
                                <div key={group.name} className="mb-2 last:mb-0">
                                    <p className="text-muted-foreground px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wide uppercase">{group.name.split("—")[0].trim()}</p>
                                    {group.sections.map((section) => {
                                        const Icon = sectionIcon(section.title)
                                        const { done, total } = countTasks(section.tasks)
                                        const active = section.key === selected.key
                                        return (
                                            <button
                                                key={section.key}
                                                type="button"
                                                onClick={() => setParams({ s: section.key }, { replace: true })}
                                                aria-current={active ? "true" : undefined}
                                                className={cn(
                                                    "hover:bg-muted flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm",
                                                    active && "bg-muted font-medium",
                                                )}
                                            >
                                                <Icon className="text-muted-foreground size-4 shrink-0" />
                                                {section.id && <span className="text-muted-foreground w-8 shrink-0 text-xs tabular-nums">{section.id}</span>}
                                                <span className="min-w-0 flex-1 truncate">{section.title}</span>
                                                {total > 0 && (
                                                    <span className={cn("text-xs tabular-nums", done === total ? "text-emerald-600" : "text-muted-foreground")}>
                                                        {done}/{total}
                                                    </span>
                                                )}
                                                {section.priority && <span className={cn("size-2 shrink-0 rounded-full", PRIORITY[section.priority].dot)} aria-label={PRIORITY[section.priority].label} />}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </nav>

                        <SectionPane section={selected} hideDone={hideDone} busy={edit.isPending} onEdit={(change) => edit.mutate(change)} />
                    </div>

                    {roadmap.data?.updatedAt && (
                        <p className="text-muted-foreground text-xs">
                            Version {roadmap.data.version}, last saved {new Date(roadmap.data.updatedAt).toLocaleString()}
                            {roadmap.data.updatedBy ? ` by ${roadmap.data.updatedBy}` : ""}. Edits are written to docs/ROADMAP.md when this runs from a local checkout.
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

function SectionPane({ section, hideDone, busy, onEdit }: { section: RoadmapSection; hideDone: boolean; busy: boolean; onEdit: (edit: RoadmapEdit) => void }) {
    const Icon = sectionIcon(section.title)
    const { done, total } = countTasks(section.tasks)
    const priority = section.priority ? PRIORITY[section.priority] : null
    // Prose-only sections (ground rules, architecture, icebox) have nothing to tick, so no task box either;
    // a numbered section always gets one so its first task can be added.
    const hasTasks = total > 0 || section.id !== null

    return (
        <section className="bg-card flex min-w-0 flex-col gap-4 rounded-xl border p-5">
            <header className="flex items-start gap-3">
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        {section.id && <span className="text-muted-foreground text-sm tabular-nums">{section.id}</span>}
                        <h2 className="text-lg leading-tight font-semibold">{section.title}</h2>
                        {priority && <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", priority.chip)}>{priority.label}</span>}
                    </div>
                    {section.note && <p className="text-muted-foreground mt-0.5 text-sm">{section.note}</p>}
                    {section.depends && <p className="text-muted-foreground mt-0.5 text-xs">Depends on: {section.depends}</p>}
                </div>
            </header>

            {total > 0 && (
                <div className="flex items-center gap-3">
                    <Progress value={(done / total) * 100} className="h-2 flex-1" />
                    <span className="text-muted-foreground text-xs tabular-nums">
                        {done} of {total} done
                    </span>
                </div>
            )}

            {section.body && <RoadmapMarkdown>{section.body}</RoadmapMarkdown>}

            {hasTasks && <TaskList tasks={section.tasks} sectionLine={section.headingLine} hideDone={hideDone} busy={busy} onEdit={onEdit} />}
        </section>
    )
}
