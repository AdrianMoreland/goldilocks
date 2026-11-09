import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRoadmapScopeApi } from "@/api/roadmap-scope.api"
import { queryKeys } from "@/lib/query-keys"

/** Adds one note to the roadmap queue and refreshes the list. Used by the Queue tab and by the note box on each item. */
export function useQueueNote(onDone?: () => void) {
    const api = useRoadmapScopeApi()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (text: string) => api.addToQueue(text),
        onSuccess: () => {
            toast.success("Queued. It becomes an inbox line at the next laptop session.")
            void queryClient.invalidateQueries({ queryKey: queryKeys.roadmapQueue })
            onDone?.()
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Could not queue the note"),
    })
}
