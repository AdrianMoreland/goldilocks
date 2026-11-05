import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { countTasks, parseRoadmap, type RoadmapEdit } from "@goldilocks/shared-types"
import { useRoadmapApi } from "@/api/roadmap.api"
import { useRoadmapSyncApi } from "@/api/roadmap-sync.api"
import { queryKeys } from "@/lib/query-keys"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { newItems } from "../inbox-state"
import { NO_FILTER, sectionMatches, type RoadmapFilter } from "../roadmap-state"
import { BoardTab } from "./board-tab"
import { InboxTab } from "./inbox-tab"
import { OverviewTab } from "./overview-tab"
import { RoadmapTree } from "./roadmap-tree"
import { SectionSheet } from "./section-sheet"

const TABS = [
    { key: "overview", label: "Overview" },
    { key: "roadmap", label: "Roadmap" },
    { key: "board", label: "Board" },
    { key: "inbox", label: "Inbox" },
] as const

type TabKey = (typeof TABS)[number]["key"]

/**
 * The roadmap on /project2 (roadmap 1.20), as three tabs over the same stored copy of docs/ROADMAP.md that /project
 * uses: an overview (numbers, phase rings, an open-work gauge and a run list), the roadmap as a tree of phases and
 * sections whose tasks are cards, and a board by priority whose cards open a drawer. Every edit goes to the API as
 * one small change against the version on screen, so the file stays the format and this page never invents its own.
 * The tab and the open section live in the URL (?tab=board&s=1.20) so a refresh or a shared link lands in the same place.
 */
export function RoadmapView() {
    const api = useRoadmapApi()
    const syncApi = useRoadmapSyncApi()
    const queryClient = useQueryClient()
    const [params, setParams] = useSearchParams()
    const [filter, setFilter] = useState<RoadmapFilter>(NO_FILTER)

    const roadmap = useQuery({ queryKey: queryKeys.roadmap, queryFn: api.getRoadmap })
    // Shares its key with the Inbox tab, so opening the tab does not fetch again. A failure only hides the count.
    const inbox = useQuery({ queryKey: queryKeys.roadmapInbox, queryFn: syncApi.getInbox })
    const markdown = roadmap.data?.markdown
    const sections = useMemo(() => (markdown ? parseRoadmap(markdown) : []), [markdown])
    const visible = useMemo(() => sections.filter((s) => sectionMatches(s, filter)), [sections, filter])

    const tab: TabKey = TABS.find((t) => t.key === params.get("tab"))?.key ?? "overview"
    const openKey = params.get("s") ?? undefined
    const openSection = sections.find((s) => s.key === openKey)

    const update = (changes: Record<string, string | null>) =>
        setParams(
            (prev) => {
                const next = new URLSearchParams(prev)
                for (const [name, value] of Object.entries(changes)) {
                    if (value === null) next.delete(name)
                    else next.set(name, value)
                }
                return next
            },
            { replace: true },
        )

    const edit = useMutation({
        mutationFn: (change: RoadmapEdit) => api.editRoadmap({ version: roadmap.data?.version ?? 0, edit: change }),
        onSuccess: (doc) => queryClient.setQueryData(queryKeys.roadmap, doc),
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Could not save the change")
            void roadmap.refetch()
        },
    })

    if (roadmap.isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />
    if (roadmap.isError) {
        return (
            <p role="alert" className="text-destructive text-sm">
                Could not load the roadmap.
            </p>
        )
    }
    if (roadmap.data?.version === 0) {
        return (
            <p className="text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-center text-sm">
                The roadmap has not been imported yet. Press Sync from GitHub above to bring in master&apos;s copy.
            </p>
        )
    }

    const openSections = sections.filter((s) => {
        const { done, total } = countTasks(s.tasks)
        return done < total
    }).length
    const counts: Record<TabKey, number | null> = { overview: null, roadmap: sections.length, board: openSections, inbox: inbox.data ? newItems(inbox.data.items).length : null }
    const runEdit = (change: RoadmapEdit) => edit.mutate(change)
    const select = (next: TabKey) => update({ tab: next === "overview" ? null : next, s: null })

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Goldilocks roadmap</h1>
                <p className="text-muted-foreground mt-1 max-w-prose text-sm">
                    Every phase, section and task from docs/ROADMAP.md. Tick, add, edit and delete here; the file on master stays the record.
                </p>
                {roadmap.data?.updatedAt && (
                    <p className="text-muted-foreground mt-2 text-xs">
                        Version <span className="text-foreground font-mono tabular-nums">{roadmap.data.version}</span> · saved {new Date(roadmap.data.updatedAt).toLocaleString()}
                        {roadmap.data.updatedBy ? ` by ${roadmap.data.updatedBy}` : ""}
                    </p>
                )}
            </div>

            <div role="tablist" aria-label="Roadmap views" className="border-border -mb-1 flex gap-1 overflow-x-auto border-b">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={tab === key}
                        onClick={() => select(key)}
                        className={cn(
                            "-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                            tab === key ? "border-primary text-foreground" : "text-muted-foreground hover:text-foreground border-transparent",
                        )}
                    >
                        {label}
                        {counts[key] !== null && <span className="bg-muted rounded-full px-1.5 py-0.5 font-mono text-[11px] tabular-nums">{counts[key]}</span>}
                    </button>
                ))}
            </div>

            {tab === "overview" && <OverviewTab sections={sections} onOpen={(key) => update({ s: key })} onGoBoard={() => select("board")} />}
            {tab === "roadmap" && (
                <RoadmapTree
                    sections={visible}
                    totalSections={sections.length}
                    filter={filter}
                    openKey={openKey}
                    busy={edit.isPending}
                    onFilter={setFilter}
                    onToggle={(key) => update({ s: key === openKey ? null : key })}
                    onEdit={runEdit}
                />
            )}
            {tab === "board" && <BoardTab sections={sections} onOpen={(key) => update({ s: key })} />}

            {tab === "inbox" && <InboxTab sections={sections} version={roadmap.data?.version ?? 0} busy={edit.isPending} />}

            {(tab === "overview" || tab === "board") && <SectionSheet section={openSection} hideDone={filter.hideDone} busy={edit.isPending} onEdit={runEdit} onClose={() => update({ s: null })} />}
        </div>
    )
}
