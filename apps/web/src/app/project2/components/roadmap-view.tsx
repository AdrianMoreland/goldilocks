import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { parseRoadmap, type RoadmapEdit } from "@goldilocks/shared-types"
import { useRoadmapApi } from "@/api/roadmap.api"
import { queryKeys } from "@/lib/query-keys"
import { Skeleton } from "@/components/ui/skeleton"
import { NO_FILTER, pickSection, sectionMatches, type RoadmapFilter } from "../roadmap-state"
import { PhaseStrip } from "./phase-strip"
import { SectionNav } from "./section-nav"
import { SectionPane } from "./section-pane"
import { UpNext } from "./up-next"

/**
 * The roadmap on /project2 (roadmap 1.20): phase rings, an "up next" list, a searchable section navigator and
 * the editable task tree. It reads and edits the same stored copy of docs/ROADMAP.md as /project, one small edit
 * at a time against the version on screen, so the file stays the format and this page never invents its own.
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

    // The open section comes from the URL so a refresh or a shared link lands on it. A section the filter hides still shows if it is the one asked for.
    const selected = pickSection(visible.length ? visible : sections, params.get("s"))
    const select = (key: string) => setParams((prev) => ({ ...Object.fromEntries(prev), s: key }), { replace: true })

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
    if (!selected) return null

    return (
        <div className="flex flex-col gap-4">
            <PhaseStrip sections={sections} />

            <div className="grid items-start gap-4 lg:grid-cols-[19rem_1fr]">
                <div className="flex flex-col gap-4">
                    <UpNext sections={sections} selectedKey={selected.key} onSelect={select} />
                    <SectionNav sections={visible} selectedKey={selected.key} filter={filter} totalSections={sections.length} onFilter={setFilter} onSelect={select} />
                </div>

                <SectionPane section={selected} hideDone={filter.hideDone} busy={edit.isPending} onEdit={(change) => edit.mutate(change)} />
            </div>

            {roadmap.data?.updatedAt && (
                <p className="text-muted-foreground text-xs">
                    Version <span className="font-mono tabular-nums">{roadmap.data.version}</span>, last saved {new Date(roadmap.data.updatedAt).toLocaleString()}
                    {roadmap.data.updatedBy ? ` by ${roadmap.data.updatedBy}` : ""}.
                </p>
            )}
        </div>
    )
}
