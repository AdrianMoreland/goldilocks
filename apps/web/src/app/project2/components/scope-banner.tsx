import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import type { RoadmapScope } from "@goldilocks/shared-types"
import { useRoadmapScopeApi } from "@/api/roadmap-scope.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusDot } from "@/components/status-dot"
import { scopeSource } from "../scope-state"

/**
 * Where the stored roadmap came from, with a Refresh button. The page only reads: the scope files are
 * changed at a laptop, and notes typed here go to the queue (see ScopeQueue). Refresh asks the API to read
 * the roadmap repository again; it never writes to GitHub.
 */
export function ScopeBanner({ scope }: { scope: RoadmapScope }) {
    const api = useRoadmapScopeApi()
    const queryClient = useQueryClient()
    const source = scopeSource(scope)

    const refresh = useMutation({
        mutationFn: api.refreshScope,
        onSuccess: (result) => {
            toast.success(result.changed ? `Refreshed: ${result.items} open items at ${result.commit.slice(0, 7)}` : "Already up to date")
            void queryClient.invalidateQueries({ queryKey: queryKeys.roadmapScope })
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Could not refresh the roadmap"),
    })

    return (
        <Card aria-label="Roadmap source" role="region">
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-2.5">
                    <StatusDot tone={source.tone} className="mt-2" />
                    <div>
                        <p className="text-sm font-medium">{source.title}</p>
                        <p className="text-muted-foreground text-sm">{source.detail}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 cursor-pointer" disabled={!scope.configured || refresh.isPending} onClick={() => refresh.mutate()}>
                    <RefreshCw className={cn(refresh.isPending && "animate-spin")} /> Refresh
                </Button>
            </CardContent>
        </Card>
    )
}
