import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CloudDownload, CloudUpload, GitPullRequest, RefreshCw } from "lucide-react"
import { useRoadmapSyncApi } from "@/api/roadmap-sync.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusDot } from "@/components/status-dot"
import { pendingEditsText, summarize, tokenDaysLeft, type SyncTone } from "../sync-state"
import { DiffMeter } from "./diff-meter"
import { PullDialog } from "./pull-dialog"
import { PushDialog } from "./push-dialog"

const TITLE_TEXT: Partial<Record<SyncTone, string>> = {
    warn: "text-amber-700 dark:text-amber-400",
    bad: "text-red-700 dark:text-red-400",
}

/**
 * Where the app's roadmap stands against docs/ROADMAP.md on master (roadmap 1.20, slices 1 to 3).
 * Sync from GitHub previews and then pulls master into the app (slice 2); Send app edits to GitHub previews and then opens a pull request (slice 3). Built from the
 * shared Card, hairline borders and status dots, with no tinted backgrounds (DESIGN.md).
 */
export function SyncBanner() {
    const api = useRoadmapSyncApi()
    const query = useQuery({ queryKey: queryKeys.roadmapSync, queryFn: api.getSyncStatus })
    const [pulling, setPulling] = useState(false)
    const [pushing, setPushing] = useState(false)

    if (query.isLoading) return <Skeleton className="h-24 w-full rounded-xl" />
    if (query.isError || !query.data) {
        return (
            <Card role="alert">
                <CardContent className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2">
                        <StatusDot tone="bad" />
                        Could not load the sync status.
                    </span>
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => query.refetch()}>
                        Try again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const status = query.data
    const summary = summarize(status)
    const daysLeft = tokenDaysLeft(status, new Date())
    const pending = pendingEditsText(status.appEditsToPush)
    const unreachable = status.state === "unconfigured" || status.state === "unavailable"

    return (
        <Card aria-label="Sync with GitHub" role="region">
            <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-2.5">
                        <StatusDot tone={summary.tone} className="mt-2" />
                        <div>
                            <p className={cn("text-sm font-medium", TITLE_TEXT[summary.tone])}>{summary.title}</p>
                            <p className="text-muted-foreground text-sm">{summary.detail}</p>
                            {pending && (
                                <p className="mt-1 flex items-center gap-2 text-sm tabular-nums">
                                    <StatusDot tone="warn" />
                                    {pending}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => query.refetch()} disabled={query.isFetching}>
                            <RefreshCw className={cn(query.isFetching && "animate-spin")} /> Check
                        </Button>
                        <Button
                            variant={status.state === "differs" ? "default" : "outline"}
                            size="sm"
                            className="cursor-pointer"
                            disabled={unreachable}
                            onClick={() => setPulling(true)}
                        >
                            <CloudDownload /> Sync from GitHub
                        </Button>
                        <Button
                            variant={status.appEditsToPush ? "default" : "outline"}
                            size="sm"
                            className="cursor-pointer"
                            disabled={unreachable || status.appEditsToPush === null}
                            onClick={() => setPushing(true)}
                        >
                            <CloudUpload /> Send app edits to GitHub
                        </Button>
                    </div>
                </div>

                {status.state === "differs" && <DiffMeter appOnly={status.appOnlyLines} masterOnly={status.masterOnlyLines} />}

                <dl className="text-muted-foreground border-t pt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
                    <div>
                        <dt>App version</dt>
                        <dd className="text-foreground font-mono tabular-nums">{status.appVersion}</dd>
                    </div>
                    <div>
                        <dt>Master commit</dt>
                        <dd className="text-foreground font-mono tabular-nums">{status.masterCommit?.slice(0, 7) ?? "-"}</dd>
                    </div>
                    <div>
                        <dt>Repository</dt>
                        <dd className="text-foreground">{status.repo}</dd>
                    </div>
                    <div>
                        <dt>GitHub token</dt>
                        <dd
                            className={cn(
                                "text-foreground tabular-nums",
                                daysLeft !== null && daysLeft <= 14 && "text-amber-700 dark:text-amber-400",
                            )}
                        >
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
                        <summary className="cursor-pointer select-none">Show the difference (+ only in the app, − only on master)</summary>
                        <pre className="bg-muted mt-2 max-h-64 overflow-auto rounded-md p-3 font-mono whitespace-pre-wrap">
                            {status.preview.join("\n")}
                        </pre>
                    </details>
                )}
            </CardContent>
            <PullDialog open={pulling} onOpenChange={setPulling} />
            <PushDialog open={pushing} onOpenChange={setPushing} />
        </Card>
    )
}
