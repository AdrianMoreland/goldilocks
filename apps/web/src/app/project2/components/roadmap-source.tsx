import { useQuery } from "@tanstack/react-query"
import { useRoadmapScopeApi } from "@/api/roadmap-scope.api"
import { queryKeys } from "@/lib/query-keys"
import { Skeleton } from "@/components/ui/skeleton"
import { RoadmapView } from "./roadmap-view"
import { ScopeView } from "./scope-view"
import { SyncBanner } from "./sync-banner"

/** The stored scope-file roadmap and whether the API has switched to it (ROADMAP_SOURCE=scope). Shared by every page that shows the roadmap, so it is fetched once. */
export function useScopeRoadmap() {
    const api = useRoadmapScopeApi()
    return useQuery({ queryKey: queryKeys.roadmapScope, queryFn: api.getScope })
}

/**
 * Picks the roadmap on screen. While the API is not switched to the scope files (or cannot say), the page is exactly what it was:
 * the sync banner over the roadmap copied from docs/ROADMAP.md. Once it is switched, the scope-file view with the queue takes over.
 */
export function RoadmapSource() {
    const scope = useScopeRoadmap()

    if (scope.isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />
    if (scope.data?.enabled) return <ScopeView scope={scope.data} />
    return (
        <div className="flex flex-col gap-4">
            <SyncBanner />
            <RoadmapView />
        </div>
    )
}
