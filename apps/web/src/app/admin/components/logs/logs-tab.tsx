import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, RefreshCw } from "lucide-react"
import type { AdminLogEntry, LogLevel } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { ErrorLogView } from "@/app/dashboard/components/admin/error-log"
import { Panel } from "../panel"
import { formatDateTime } from "../../lib/format"

const LEVELS: { value: LogLevel; label: string }[] = [
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warn", label: "Warnings" },
    { value: "error", label: "Errors" },
]

const LEVEL_STYLE: Record<LogLevel, string> = {
    trace: "text-muted-foreground",
    debug: "text-muted-foreground",
    info: "text-foreground",
    warn: "border-amber-500/40 text-amber-700 dark:text-amber-400",
    error: "border-destructive/40 text-destructive",
    fatal: "border-destructive bg-destructive text-white",
}

function statusTone(status: number) {
    if (status >= 500) return "text-destructive"
    if (status >= 400) return "text-amber-700 dark:text-amber-400"
    return "text-muted-foreground"
}

function LogRow({ entry }: { entry: AdminLogEntry }) {
    const [open, setOpen] = React.useState(false)
    const isRequest = entry.method !== null
    const extra = Object.keys(entry.extra).length > 0

    return (
        <li className="border-b last:border-b-0">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="hover:bg-muted/50 focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-inset"
            >
                <ChevronRight className={cn("text-muted-foreground size-3.5 shrink-0 transition-transform", open && "rotate-90")} />
                <span className="text-muted-foreground w-32 shrink-0 tabular-nums">{formatDateTime(entry.time)}</span>
                <span className={cn("w-12 shrink-0 rounded border px-1 text-center text-[11px] uppercase", LEVEL_STYLE[entry.level])}>{entry.level}</span>
                {isRequest ? (
                    <span className="flex min-w-0 flex-1 items-center gap-2 font-mono">
                        <span className="shrink-0 font-semibold">{entry.method}</span>
                        <span className="truncate" title={entry.url ?? ""}>
                            {entry.url}
                        </span>
                        {entry.status !== null && <span className={cn("shrink-0 tabular-nums", statusTone(entry.status))}>{entry.status}</span>}
                        {entry.responseTimeMs !== null && <span className="text-muted-foreground shrink-0 tabular-nums">{Math.round(entry.responseTimeMs)} ms</span>}
                    </span>
                ) : (
                    <span className="min-w-0 flex-1 truncate" title={entry.message}>
                        {entry.context && <span className="text-muted-foreground">[{entry.context}] </span>}
                        {entry.message}
                    </span>
                )}
            </button>
            {open && (
                <pre className="bg-muted mx-3 mb-2 max-h-72 overflow-auto rounded-md p-2.5 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                    {JSON.stringify({ time: new Date(entry.time).toISOString(), message: entry.message, context: entry.context, ...(extra ? entry.extra : {}) }, null, 2)}
                </pre>
            )}
        </li>
    )
}

function ApplicationLog() {
    const api = useAdminApi()
    const [level, setLevel] = React.useState<LogLevel>("info")
    const [search, setSearch] = React.useState("")
    const [live, setLive] = React.useState(true)

    // Search is applied on the server so the 1,000-line buffer is filtered before it is sent.
    const q = React.useDeferredValue(search.trim())
    const logs = useQuery({
        queryKey: queryKeys.admin.logs(level, q),
        queryFn: () => api.getLogs(level, q),
        refetchInterval: live ? 5_000 : false,
    })

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <Input
                    placeholder="Search message, path, context"
                    aria-label="Search the application log"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-w-48 flex-1"
                />
                <div className="flex gap-1" role="group" aria-label="Minimum level">
                    {LEVELS.map((l) => (
                        <Button
                            key={l.value}
                            size="sm"
                            variant={level === l.value ? "default" : "outline"}
                            aria-pressed={level === l.value}
                            className="cursor-pointer"
                            onClick={() => setLevel(l.value)}
                        >
                            {l.label}
                        </Button>
                    ))}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Switch checked={live} onCheckedChange={setLive} aria-label="Live updates" />
                    Live
                </label>
                <Button size="icon" variant="outline" className="cursor-pointer" aria-label="Refresh" title="Refresh" onClick={() => void logs.refetch()}>
                    <RefreshCw className={cn(logs.isFetching && "animate-spin")} />
                </Button>
            </div>

            <div className="rounded-lg border">
                {logs.isError ? (
                    <p className="text-destructive p-4 text-sm">Couldn&apos;t load the application log.</p>
                ) : logs.isLoading ? (
                    <p className="text-muted-foreground p-4 text-sm">Loading…</p>
                ) : logs.data && logs.data.entries.length === 0 ? (
                    <p className="text-muted-foreground p-4 text-sm">Nothing matches. The log holds the latest {logs.data.capacity} lines since the API last started.</p>
                ) : (
                    <ul className="max-h-[32rem] overflow-y-auto">
                        {logs.data?.entries.map((entry) => (
                            <LogRow key={entry.id} entry={entry} />
                        ))}
                    </ul>
                )}
            </div>
            <p className="text-muted-foreground text-xs">
                Showing the latest {logs.data?.entries.length ?? 0} lines. The full history is in Railway&apos;s log view; this buffer resets when the API restarts.
            </p>
        </div>
    )
}

function ActivityLog() {
    const api = useAdminApi()
    const audit = useQuery({ queryKey: queryKeys.admin.audit, queryFn: api.getAudit, refetchInterval: 15_000 })

    return (
        <div className="flex flex-col gap-3">
            <div className="rounded-lg border">
                {audit.isLoading ? (
                    <p className="text-muted-foreground p-4 text-sm">Loading…</p>
                ) : audit.data?.entries.length === 0 ? (
                    <p className="text-muted-foreground p-4 text-sm">No changes made from the console yet. Edits in the Database tab appear here.</p>
                ) : (
                    <ul>
                        {audit.data?.entries.map((e, i) => (
                            <li key={`${e.at}-${i}`} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-b px-3 py-2 text-xs last:border-b-0">
                                <span className="text-muted-foreground w-32 shrink-0 tabular-nums">{formatDateTime(e.at)}</span>
                                <span className="shrink-0 font-medium">{e.user}</span>
                                <span className="min-w-0 flex-1">{e.detail}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {audit.data && !audit.data.persisted && (
                <p className="text-muted-foreground text-xs">Redis is unavailable, so this only shows changes since the API last started.</p>
            )}
        </div>
    )
}

export function LogsTab() {
    return (
        <Panel title="Logs" description="What the API is doing, what went wrong, and what admins changed.">
            <Tabs defaultValue="application" className="gap-3">
                <TabsList>
                    <TabsTrigger value="application" className="cursor-pointer px-3">
                        Application
                    </TabsTrigger>
                    <TabsTrigger value="errors" className="cursor-pointer px-3">
                        Errors
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="cursor-pointer px-3">
                        Admin activity
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="application">
                    <ApplicationLog />
                </TabsContent>
                <TabsContent value="errors">
                    <ErrorLogView />
                </TabsContent>
                <TabsContent value="activity">
                    <ActivityLog />
                </TabsContent>
            </Tabs>
        </Panel>
    )
}
