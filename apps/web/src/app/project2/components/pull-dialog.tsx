import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRoadmapSyncApi } from "@/api/roadmap-sync.api"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { canApply, describeEntry, pullHeadline } from "../sync-state"

const SHOWN = 10

function List({ title, items }: { title: string; items: string[] }) {
    if (items.length === 0) return null
    return (
        <div className="text-sm">
            <p className="font-medium">{title}</p>
            <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5">
                {items.slice(0, SHOWN).map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
            {items.length > SHOWN && <p className="text-muted-foreground mt-1 pl-5 text-xs">and {items.length - SHOWN} more</p>}
        </div>
    )
}

/**
 * Previews, then applies, a pull of master's roadmap into the app (roadmap 1.20 slice 2). The preview is the
 * server's dry run, so what is shown is what Apply does. The first run replaces the app's copy, so it needs a
 * tick in the box; a snapshot of the old text is kept either way.
 */
export function PullDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const api = useRoadmapSyncApi()
    const queryClient = useQueryClient()
    const [confirmed, setConfirmed] = useState(false)

    const preview = useQuery({
        queryKey: [...queryKeys.roadmapSync, "preview"],
        queryFn: () => api.pull({ dryRun: true }),
        enabled: open,
        gcTime: 0,
        staleTime: 0,
        retry: false,
    })

    const apply = useMutation({
        mutationFn: () => api.pull({ confirmReplace: confirmed || undefined }),
        onSuccess: (result) => {
            toast.success(result.snapshotId ? `Synced. The old text is kept as snapshot #${result.snapshotId}.` : "Synced.")
            void queryClient.invalidateQueries({ queryKey: queryKeys.roadmapSync })
            void queryClient.invalidateQueries({ queryKey: queryKeys.roadmap })
            setConfirmed(false)
            onOpenChange(false)
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Could not sync"),
    })

    const result = preview.data

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) setConfirmed(false)
                onOpenChange(next)
            }}
        >
            <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Sync from GitHub</DialogTitle>
                    <DialogDescription>What would change in the app's roadmap. Nothing is written until you press Apply.</DialogDescription>
                </DialogHeader>

                {preview.isLoading && <Skeleton className="h-32 w-full rounded-xl" />}
                {preview.isError && (
                    <p role="alert" className="text-destructive text-sm">
                        {preview.error instanceof Error ? preview.error.message : "Could not read master."}
                    </p>
                )}

                {result && (
                    <div className="flex flex-col gap-3">
                        <p className="font-medium">{pullHeadline(result)}</p>
                        <p className="text-muted-foreground text-xs">
                            Master commit <span className="font-mono">{result.commit.slice(0, 7)}</span> · app version <span className="tabular-nums">{result.appVersion}</span>
                        </p>

                        {result.mode === "adopt" && result.appChanged && (
                            <>
                                <p className="text-sm tabular-nums">
                                    {result.appOnlyLines} lines only in the app will be replaced; {result.masterOnlyLines} lines only on master will come in.
                                </p>
                                <List
                                    title={`${result.appOnlyTaskCount} task${result.appOnlyTaskCount === 1 ? "" : "s"} exist only in the app`}
                                    items={result.appOnlyTasks.map((t) => `${t.section}: ${t.title}${t.checked ? " (ticked)" : ""}`)}
                                />
                                <List
                                    title={`${result.ticksOnlyInAppCount} tick${result.ticksOnlyInAppCount === 1 ? "" : "s"} made in the app are not on master`}
                                    items={result.ticksOnlyInApp.map((t) => `${t.section}: ${t.title}`)}
                                />
                                {result.appOnlyTaskCount === 0 && result.ticksOnlyInAppCount === 0 && (
                                    <p className="text-muted-foreground text-sm">No task or tick will be lost: everything in the app is already on master.</p>
                                )}
                                <div className="flex items-start gap-2">
                                    <Checkbox id="confirm-replace" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5 cursor-pointer" />
                                    <Label htmlFor="confirm-replace" className="cursor-pointer text-sm leading-snug font-normal">
                                        I have seen what will be replaced. The old text is kept as a snapshot.
                                    </Label>
                                </div>
                            </>
                        )}

                        {result.mode === "merge" && <List title="What happens" items={result.log.map(describeEntry)} />}
                        {result.mode === "merge" && result.log.length === 0 && result.appChanged === false && (
                            <p className="text-muted-foreground text-sm">Master has changes, but none that the app needs.</p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="cursor-pointer" disabled={!result || !canApply(result, confirmed) || apply.isPending} onClick={() => apply.mutate()}>
                        {apply.isPending ? "Syncing…" : "Apply"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
