import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRoadmapSyncApi } from "@/api/roadmap-sync.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { canApplyPush, describeEntry, pushHeadline } from "../sync-state"

const SHOWN = 10

/**
 * Previews, then sends, the app's roadmap edits to GitHub as a pull request (roadmap 1.20 slice 3). The
 * preview is the server's dry run, so what is shown is what Apply sends. Nothing merges: the pull request
 * is reviewed and merged by hand on GitHub.
 */
export function PushDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const api = useRoadmapSyncApi()
    const queryClient = useQueryClient()

    const preview = useQuery({
        queryKey: [...queryKeys.roadmapSync, "push-preview"],
        queryFn: () => api.push({ dryRun: true }),
        enabled: open,
        gcTime: 0,
        staleTime: 0,
        retry: false,
    })

    const apply = useMutation({
        mutationFn: () => api.push({}),
        onSuccess: (result) => {
            const url = result.prUrl
            toast.success(`Pull request #${result.prNumber} is ready to review on GitHub.`, {
                action: url ? { label: "Open", onClick: () => window.open(url, "_blank", "noopener,noreferrer") } : undefined,
            })
            void queryClient.invalidateQueries({ queryKey: queryKeys.roadmapSync })
            onOpenChange(false)
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Could not send to GitHub"),
    })

    const result = preview.data

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Send app edits to GitHub</DialogTitle>
                    <DialogDescription>
                        What would go into the pull request. Nothing is sent until you press Apply, and nothing merges: you review and merge it on GitHub.
                    </DialogDescription>
                </DialogHeader>

                {preview.isLoading && <Skeleton className="h-32 w-full rounded-xl" />}
                {preview.isError && (
                    <p role="alert" className="text-destructive text-sm">
                        {preview.error instanceof Error ? preview.error.message : "Could not work out the edits."}
                    </p>
                )}

                {result && (
                    <div className="flex flex-col gap-3">
                        <p className="font-medium">{pushHeadline(result)}</p>
                        <p className="text-muted-foreground text-xs">
                            Built on master commit <span className="font-mono">{result.commit.slice(0, 7)}</span>
                        </p>

                        {result.edits.length > 0 && (
                            <div className="text-sm">
                                <p className="font-medium">What goes in</p>
                                <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5">
                                    {result.edits.slice(0, SHOWN).map((entry, i) => (
                                        <li key={i}>{describeEntry(entry)}</li>
                                    ))}
                                </ul>
                                {result.edits.length > SHOWN && (
                                    <p className="text-muted-foreground mt-1 pl-5 text-xs">and {result.edits.length - SHOWN} more</p>
                                )}
                            </div>
                        )}

                        {result.diffPreview.length > 0 && (
                            <details className="text-xs">
                                <summary className="cursor-pointer select-none">Show the change to docs/ROADMAP.md</summary>
                                <pre className="bg-muted mt-2 max-h-64 overflow-auto rounded-md p-3 font-mono whitespace-pre-wrap">
                                    {result.diffPreview.join("\n")}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="cursor-pointer" disabled={!result || !canApplyPush(result) || apply.isPending} onClick={() => apply.mutate()}>
                        {apply.isPending ? "Sending…" : "Apply"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
