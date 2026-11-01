import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2, CircleSlash, GitPullRequest, RefreshCw } from "lucide-react"
import { useRoadmapSyncApi } from "@/api/roadmap-sync.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { summarize, tokenDaysLeft, type SyncTone } from "../sync-state"

const TONE: Record<SyncTone, { box: string; icon: typeof CheckCircle2 }> = {
    ok: { box: "border-emerald-500/40 bg-emerald-500/10", icon: CheckCircle2 },
    warn: { box: "border-amber-500/40 bg-amber-500/10", icon: AlertTriangle },
    bad: { box: "border-red-500/40 bg-red-500/10", icon: AlertTriangle },
    muted: { box: "border-border bg-muted/40", icon: CircleSlash },
}

/**
 * Read-only: where the app's roadmap stands against docs/ROADMAP.md on master (roadmap 1.20, slice 1).
 * Nothing here changes the roadmap or GitHub; the sync buttons arrive in slices 2 and 3.
 */
export function SyncBanner() {
    const api = useRoadmapSyncApi()
    const query = useQuery({ queryKey: queryKeys.roadmapSync, queryFn: api.getSyncStatus })

    if (query.isLoading) return <Skeleton className="h-24 w-full rounded-xl" />
    if (query.isError || !query.data) {
        return (
            <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
                Could not load the sync status.{" "}
                <Button variant="link" className="h-auto cursor-pointer p-0" onClick={() => query.refetch()}>
                    Try again
                </Button>
            </div>
        )
    }

    const status = query.data
    const summary = summarize(status)
    const { box, icon: Icon } = TONE[summary.tone]
    const daysLeft = tokenDaysLeft(status, new Date())

    return (
        <section aria-label="Sync with GitHub" className={cn("flex flex-col gap-3 rounded-xl border p-4", box)}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
                    <div>
                        <p className="font-medium">{summary.title}</p>
                        <p className="text-muted-foreground text-sm">{summary.detail}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 cursor-pointer"
                    onClick={() => query.refetch()}
                    disabled={query.isFetching}
                >
                    <RefreshCw className={cn(query.isFetching && "animate-spin")} /> Check
                </Button>
            </div>

            <dl className="text-muted-foreground grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                <div>
                    <dt>App version</dt>
                    <dd className="text-foreground">{status.appVersion}</dd>
                </div>
                <div>
                    <dt>Master commit</dt>
                    <dd className="text-foreground font-mono">{status.masterCommit?.slice(0, 7) ?? "-"}</dd>
                </div>
                <div>
                    <dt>Repository</dt>
                    <dd className="text-foreground">{status.repo}</dd>
                </div>
                <div>
                    <dt>GitHub token</dt>
                    <dd className={cn("text-foreground", daysLeft !== null && daysLeft <= 14 && "font-medium text-amber-700 dark:text-amber-300")}>
                        {daysLeft === null ? "-" : daysLeft < 0 ? "expired" : `${daysLeft} days left`}
                    </dd>
                </div>
            </dl>

            {status.openSyncPr && (
                <a
                    href={status.openSyncPr.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-fit items-center gap-2 text-sm underline-offset-4 hover:underline"
                >
                    <GitPullRequest className="size-4" aria-hidden /> #{status.openSyncPr.number} {status.openSyncPr.title}
                </a>
            )}

            {status.preview.length > 0 && (
                <details className="text-xs">
                    <summary className="cursor-pointer select-none">Show the difference (app against master)</summary>
                    <pre className="bg-background/60 mt-2 max-h-64 overflow-auto rounded-md p-3 font-mono whitespace-pre-wrap">
                        {status.preview.join("\n")}
                    </pre>
                </details>
            )}
        </section>
    )
}
