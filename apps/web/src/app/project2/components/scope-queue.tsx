import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRoadmapScopeApi } from "@/api/roadmap-scope.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusDot } from "@/components/status-dot"
import { QUEUE_MAX, queueSummary } from "../scope-state"

/** Adds one note to the queue and refreshes the list. Used by the Queue tab and by the note box on each item. */
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

/**
 * The only way to change the roadmap from this page: a note. Nothing here edits the scope files. A laptop
 * session turns each note into a dated line in the inbox and then, when it triages, into an item with an ID,
 * priority and effort. Until then a note has none of those.
 */
export function ScopeQueue() {
    const api = useRoadmapScopeApi()
    const [text, setText] = useState("")
    const queue = useQuery({ queryKey: queryKeys.roadmapQueue, queryFn: api.getQueue })
    const add = useQueueNote(() => setText(""))
    const submit = () => {
        if (text.trim()) add.mutate(text.trim())
    }
    const summary = queue.data ? queueSummary(queue.data.entries) : null

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardContent className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-sm font-medium">Add a note</h2>
                        <p className="text-muted-foreground mt-1 max-w-prose text-sm">
                            An idea, a change, or a tick for an item (start with its ID, like F-12: ...). It is queued, not added to the roadmap: a laptop session files it and gives it an ID, priority and effort.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            value={text}
                            maxLength={QUEUE_MAX}
                            placeholder="What should be added or changed?"
                            aria-label="Note for the roadmap queue"
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submit()}
                            className="h-9 text-sm"
                        />
                        <Button size="sm" className="cursor-pointer" disabled={!text.trim() || add.isPending} onClick={submit}>
                            Add to queue
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {queue.isLoading && <Skeleton className="h-32 w-full rounded-xl" />}
            {queue.isError && (
                <p role="alert" className="text-destructive text-sm">
                    Could not load the queue.
                </p>
            )}
            {queue.data && queue.data.entries.length === 0 && (
                <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-8 text-center text-sm">The queue is empty.</p>
            )}
            {queue.data && queue.data.entries.length > 0 && (
                <section aria-label="Queued notes" className="flex flex-col gap-2">
                    {summary && (
                        <p className="text-muted-foreground font-mono text-xs tabular-nums">
                            {summary.waiting} waiting · {summary.filed} filed
                        </p>
                    )}
                    <ul className="flex flex-col divide-y rounded-xl border">
                        {queue.data.entries.map((entry) => (
                            <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
                                <StatusDot tone={entry.status === "new" ? "info" : "ok"} className="mt-2" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm break-words">{entry.text}</p>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        <span className="tabular-nums">{new Date(entry.createdAt).toLocaleDateString()}</span> · {entry.source === "phone" ? "Phone" : "Web"} ·{" "}
                                        {entry.status === "new" ? "Waiting for a laptop session" : "Filed in the inbox"}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}
