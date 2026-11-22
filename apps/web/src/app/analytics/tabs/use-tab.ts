import { useQuery } from "@tanstack/react-query"
import type { AnalyticsPreset } from "@goldilocks/shared-types"
import { useAnalyticsApi } from "@/api/analytics.api"
import { useAuth } from "@/contexts/auth-context"
import { queryKeys } from "@/lib/query-keys"

type Api = ReturnType<typeof useAnalyticsApi>
export type TabName = keyof Api
type TabData<K extends TabName> = Awaited<ReturnType<Api[K]>>

/** One tab's data. The server caches for 5 minutes, so there is no point refetching sooner. */
export function useAnalyticsTab<K extends TabName>(tab: K, preset: AnalyticsPreset) {
    const api = useAnalyticsApi()
    const { user } = useAuth()
    return useQuery<TabData<K>>({
        queryKey: queryKeys.analytics(user?.id ?? "", tab, preset),
        queryFn: () => api[tab](preset) as Promise<TabData<K>>,
        staleTime: 5 * 60_000,
    })
}
