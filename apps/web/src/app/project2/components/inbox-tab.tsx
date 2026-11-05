import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import type { RoadmapInboxItem, RoadmapSection } from "@goldilocks/shared-types"
import { useRoadmapSyncApi } from "@/api/roadmap-sync.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusDot } from "@/components/status-dot"
import { defaultTaskText, excerpt, newItems, refreshMessage, sectionLabel } from "../inbox-state"

const errorText = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback)

/** One idea waiting for triage: what was captured, then Add to roadmap (pick a section, tidy the text) or Dismiss. */
function InboxCard({ item, sections, version, busy, onChanged }: { item: RoadmapInboxItem; sections: RoadmapSection[]; version: number; busy: boolean; onChanged: () => void }) {
    const syncApi = useRoadmapSyncApi()
    const queryClient = useQueryClient()
    const [adding, setAdding] = useState(false)
    const [sectionLine, setSectionLine] = useState<string>("")
    const [text, setText] = useState(defaultTaskText(item))
    const note = excerpt(item.body)

    const promote = useMutation({
        mutationFn: () => syncApi.promoteInboxItem(item.id, { sectionLine: Number(sectionLine), text: text.trim(), version }),
        onSuccess: () => {
            toast.success("Added to the roadmap")
            // The roadmap text and its sync status both changed.
            void queryClient.invalidateQueries({ queryKey: queryKeys.roadmap })
            onChanged()
        },
        onError: (error) => toast.error(errorText(error, "Could not add it")),
    })
    const dismiss = useMutation({
        mutationFn: () => syncApi.dismissInboxItem(item.id),
        onSuccess: () => {
            toast.success("Dismissed")
            onChanged()
        },
        onError: (error) => toast.error(errorText(error, "Could not dismiss it")),
    })
    const working = promote.isPending || dismiss.isPending || busy

    return (
        <Card>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium break-words">{item.title}</p>
                        {note && <p className="text-muted-foreground mt-1 text-sm break-words">{note}</p>}
                        <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            {item.kind && <span className="text-foreground font-medium">{item.kind}</span>}
                            <span className="tabular-nums">{new Date(item.issueCreatedAt).toLocaleDateString()}</span>
                            <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-foreground inline-flex items-center gap-1 underline-offset-2 hover:underline">
                                Issue #{item.issueNumber} <ExternalLink className="size-3" aria-hidden />
                            </a>
                        </p>
                    </div>
                    {!adding && (
                        <div className="flex shrink-0 gap-2">
                            <Button size="sm" className="cursor-pointer" disabled={working} onClick={() => setAdding(true)}>
                                Add to roadmap
                            </Button>
                            <Button size="sm" variant="outline" className="cursor-pointer" disabled={working} onClick={() => dismiss.mutate()}>
                                Dismiss
                            </Button>
                        </div>
                    )}
                </div>

                {adding && (
                    <div className="flex flex-col gap-2 border-t pt-3">
                        <Select value={sectionLine} onValueChange={setSectionLine}>
                            <SelectTrigger className="w-full cursor-pointer" aria-label="Section">
                                <SelectValue placeholder="Choose a section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map((s) => (
                                    <SelectItem key={s.key} value={String(s.headingLine)}>
                                        {sectionLabel(s)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input value={text} onChange={(e) => setText(e.target.value)} aria-label="Task text" maxLength={500} />
                        <div className="flex gap-2">
                            <Button size="sm" className="cursor-pointer" disabled={working || sectionLine === "" || text.trim() === ""} onClick={() => promote.mutate()}>
                                Add task
                            </Button>
                            <Button size="sm" variant="outline" className="cursor-pointer" disabled={working} onClick={() => setAdding(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

/**
 * The roadmap inbox (roadmap 1.20 slice 4): ideas captured as GitHub issues labelled "roadmap" (the phone shortcut, the
 * Idea or task form). Refresh fetches the new ones; each is added to a section as a task or dismissed, and its issue is
 * closed. Adding a task changes only the app's copy; Send app edits to GitHub carries it into docs/ROADMAP.md.
 */
export function InboxTab({ sections, version, busy }: { sections: RoadmapSection[]; version: number; busy: boolean }) {
    const api = useRoadmapSyncApi()
    const queryClient = useQueryClient()
    const inbox = useQuery({ queryKey: queryKeys.roadmapInbox, queryFn: api.getInbox })

    const refresh = useMutation({
        mutationFn: api.refreshInbox,
        onSuccess: (result) => {
            toast.success(refreshMessage(result))
            void inbox.refetch()
        },
        onError: (error) => toast.error(errorText(error, "Could not fetch from GitHub")),
    })
    const changed = () => {
        void inbox.refetch()
        void queryClient.invalidateQueries({ queryKey: queryKeys.roadmapSync })
    }

    if (inbox.isLoading) return <Skeleton className="h-40 w-full rounded-xl" />
    if (inbox.isError || !inbox.data) {
        return (
            <p role="alert" className="text-destructive text-sm">
                Could not load the inbox.
            </p>
        )
    }

    const waiting = newItems(inbox.data.items)
    const handled = inbox.data.items.filter((i) => i.status !== "new").slice(0, 10)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground max-w-prose text-sm">
                    Ideas captured on GitHub with the roadmap label. New ones arrive by themselves; Fetch checks now.
                </p>
                <Button variant="outline" size="sm" className="cursor-pointer" disabled={refresh.isPending || !inbox.data.configured} onClick={() => refresh.mutate()}>
                    <RefreshCw className={refresh.isPending ? "animate-spin" : ""} /> Fetch from GitHub
                </Button>
            </div>

            {!inbox.data.configured && (
                <p className="flex items-center gap-2 text-sm">
                    <StatusDot tone="muted" /> Sync is not set up: add GITHUB_SYNC_TOKEN to the API to fetch ideas.
                </p>
            )}

            {waiting.length === 0 ? (
                <p className="text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-center text-sm">Nothing waiting. Ideas you capture will show up here.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {waiting.map((item) => (
                        <InboxCard key={item.id} item={item} sections={sections} version={version} busy={busy} onChanged={changed} />
                    ))}
                </div>
            )}

            {handled.length > 0 && (
                <div>
                    <h2 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">Handled</h2>
                    <ul className="divide-y rounded-xl border text-sm">
                        {handled.map((item) => (
                            <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2">
                                <span className="min-w-0 truncate">{item.title}</span>
                                <span className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
                                    <StatusDot tone={item.status === "promoted" ? "ok" : "muted"} />
                                    {item.status === "promoted" ? "Added" : "Dismissed"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
