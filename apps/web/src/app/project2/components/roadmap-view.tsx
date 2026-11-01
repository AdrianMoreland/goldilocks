import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { countTasks, parseRoadmap, type RoadmapEdit } from "@goldilocks/shared-types"
import { useRoadmapApi } from "@/api/roadmap.api"
import { queryKeys } from "@/lib/query-keys"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NO_FILTER, sectionMatches, type RoadmapFilter } from "../roadmap-state"
import { BoardTab } from "./board-tab"
import { OverviewTab } from "./overview-tab"
import { RoadmapTab } from "./roadmap-tab"
import { SectionSheet } from "./section-sheet"

const TABS = [
    { key: "overview", label: "Overview" },
    { key: "roadmap", label: "Roadmap" },
    { key: "board", label: "Board" },
] as const

type TabKey = (typeof TABS)[number]["key"]

/**
 * The roadmap on /project2 (roadmap 1.20), as three tabs over the same stored copy of docs/ROADMAP.md that /project
 * uses: an overview (numbers, phase rings, open work, up next), the roadmap as phase cards that open in place, and a
 * board by priority whose cards open a drawer. Every edit goes to the API as one small change against the version on
 * screen, so the file stays the format and this page never invents its own. The tab and the open section live in the
 * URL (?tab=board&s=1.20) so a refresh or a shared link lands in the same place.
 */
export function RoadmapView() {
    const api = useRoadmapApi()
    const queryClient = useQueryClient()
    const [params, setParams] = useSearchParams()
    const [filter, setFilter] = useState<RoadmapFilter>(NO_FILTER)

    const roadmap = useQuery({ queryKey: queryKeys.roadmap, queryFn: api.getRoadmap })
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

    if (roadmap.isLoading) return <Skeleton className="h-96 w-full rounded-xl" />
    if (roadmap.isError) {
        return (
            <p role="alert" className="text-destructive text-sm">
                Could not load the roadmap.
            </p>
        )
    }
    if (roadmap.data?.version === 0) {
        return (
            <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-8 text-center text-sm">
                The roadmap has not been imported yet. Press Sync from GitHub above to bring in master&apos;s copy.
            </p>
        )
    }

    const openSections = sections.filter((s) => {
        const { done, total } = countTasks(s.tasks)
        return done < total
    }).length
    const counts: Record<TabKey, number | null> = { overview: null, roadmap: sections.length, board: openSections }
    const runEdit = (change: RoadmapEdit) => edit.mutate(change)

    return (
        <div className="flex flex-col gap-4">
            <Tabs value={tab} onValueChange={(value) => update({ tab: value === "overview" ? null : value, s: null })}>
                <TabsList aria-label="Roadmap views">
                    {TABS.map(({ key, label }) => (
                        <TabsTrigger key={key} value={key} className="cursor-pointer gap-2">
                            {label}
                            {counts[key] !== null && <span className="text-muted-foreground font-mono text-xs tabular-nums">{counts[key]}</span>}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {tab === "overview" && <OverviewTab sections={sections} onOpen={(key) => update({ s: key })} />}
            {tab === "roadmap" && (
                <RoadmapTab
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

            {tab !== "roadmap" && <SectionSheet section={openSection} hideDone={filter.hideDone} busy={edit.isPending} onEdit={runEdit} onClose={() => update({ s: null })} />}

            {roadmap.data?.updatedAt && (
                <p className="text-muted-foreground text-xs">
                    Version <span className="font-mono tabular-nums">{roadmap.data.version}</span>, last saved {new Date(roadmap.data.updatedAt).toLocaleString()}
                    {roadmap.data.updatedBy ? ` by ${roadmap.data.updatedBy}` : ""}.
                </p>
            )}
        </div>
    )
}
