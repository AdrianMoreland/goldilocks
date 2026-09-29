import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AlertTriangle, ChevronRight, Copy, RefreshCw, Trash2 } from "lucide-react"
import type { ErrorLogEntry, ErrorLogKind } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { clearLocalErrors, getLocalErrors, subscribeToLocalErrors, type LocalErrorEntry } from "@/lib/error-log"
import { cn } from "@/lib/utils"

type Origin = "server" | "browser"

export interface MergedErrorEntry extends ErrorLogEntry {
    origin: Origin
    /** Recorded in this browser but not yet delivered to the server (it was unreachable). */
    pending: boolean
}

export const KIND_LABEL: Record<ErrorLogKind, string> = {
    database: "Database",
    http: "Request failed",
    network: "No connection",
    "external-api": "Price feed",
    response: "Bad response",
    crash: "Crash",
}

// Plain-language "what does this mean" for each kind, shown in the details.
const KIND_EXPLANATION: Record<ErrorLogKind, string> = {
    database: "The API couldn't complete a database query. Codes P1001, P1002 and P1017 mean the database (Supabase) was unreachable or dropped the connection; other codes mean the query itself was rejected.",
    http: "The API answered with an error status. For 5xx errors, the matching server entry (same reference) has the full cause.",
    network: "This browser got no answer from the API at all: the API was down or restarting, the network dropped, or something (VPN, firewall, CORS) blocked the request.",
    "external-api": "The metal-price vendor didn't answer or returned an error. Prices fall back to the last stored values until a later fetch succeeds.",
    response: "The API answered, but the data didn't match what this version of the app expects — usually the API and web app were deployed at different versions.",
    crash: "An unexpected error in the code. The stack trace shows where it happened.",
}

const timeFormat = new Intl.DateTimeFormat("en-IE", { dateStyle: "medium", timeStyle: "medium" })
const shortTimeFormat = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

function useLocalErrors(): LocalErrorEntry[] {
    const [entries, setEntries] = React.useState(getLocalErrors)
    React.useEffect(() => subscribeToLocalErrors(() => setEntries(getLocalErrors())), [])
    return entries
}

/**
 * The server's log merged with this browser's own. A browser entry is
 * hidden once the server has the same reference (it was delivered, or it's
 * the client side of a server-logged 5xx) — otherwise it's shown, flagged
 * "not sent" if the server hasn't received it yet.
 */
export function useErrorLog(enabled: boolean) {
    const api = useAdminApi()
    const local = useLocalErrors()
    const serverQuery = useQuery({
        queryKey: queryKeys.admin.errorLog,
        queryFn: () => api.getErrorLog(200),
        enabled,
        refetchInterval: enabled ? 30_000 : false,
    })

    const entries = React.useMemo<MergedErrorEntry[]>(() => {
        const server = serverQuery.data?.entries ?? []
        const serverRefs = new Set(server.map((e) => e.reference))
        const merged: MergedErrorEntry[] = [
            ...server.map((e) => ({ ...e, origin: "server" as const, pending: false })),
            ...local
                .filter((e) => !serverRefs.has(e.reference))
                .map((e) => ({ ...e, origin: "browser" as const, pending: e.reportable && !e.synced })),
        ]
        return merged.sort((a, b) => b.at.localeCompare(a.at))
    }, [serverQuery.data, local])

    return { entries, serverQuery, persisted: serverQuery.data?.persisted ?? true }
}

function detailsText(entry: MergedErrorEntry): string {
    return [
        `Reference: ${entry.reference}`,
        `Time: ${timeFormat.format(new Date(entry.at))}`,
        `Where: ${entry.origin === "server" ? (entry.source === "client" ? "Reported by a browser" : "API server") : "This browser"}`,
        `Kind: ${KIND_LABEL[entry.kind]} (${entry.severity})`,
        `Message: ${entry.message}`,
        entry.statusCode != null ? `Status: ${entry.statusCode}` : null,
        entry.method || entry.path ? `Request: ${entry.method ?? ""} ${entry.path ?? ""}`.trim() : null,
        entry.code ? `Code: ${entry.code}` : null,
        entry.user ? `User: ${entry.user}` : null,
        entry.userAgent ? `Browser: ${entry.userAgent}` : null,
        entry.detail ? `\nDetail:\n${entry.detail}` : null,
        entry.stack ? `\nStack:\n${entry.stack}` : null,
    ]
        .filter(Boolean)
        .join("\n")
}

function KindBadge({ entry }: { entry: MergedErrorEntry }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "shrink-0 px-1.5 py-0 text-[11px]",
                entry.severity === "error" ? "border-destructive/40 text-destructive" : "text-muted-foreground",
            )}
        >
            {KIND_LABEL[entry.kind]}
        </Badge>
    )
}

function EntryRow({ entry }: { entry: MergedErrorEntry }) {
    const [open, setOpen] = React.useState(false)

    return (
        <li className="border-b last:border-b-0">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="hover:bg-muted/50 flex w-full cursor-pointer items-start gap-2 px-3 py-2.5 text-left"
            >
                <ChevronRight className={cn("text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform", open && "rotate-90")} />
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <KindBadge entry={entry} />
                        <span className="truncate text-sm font-medium">{entry.message}</span>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-x-2 text-xs tabular-nums">
                        <span>{timeFormat.format(new Date(entry.at))}</span>
                        <span>{entry.reference}</span>
                        {entry.statusCode != null && <span>HTTP {entry.statusCode}</span>}
                        {entry.path && <span className="truncate">{entry.method} {entry.path}</span>}
                        <span>{entry.origin === "browser" ? "this browser" : entry.source === "client" ? `browser${entry.user ? ` · ${entry.user}` : ""}` : "server"}</span>
                        {entry.pending && <span className="text-destructive font-medium">not sent yet</span>}
                    </div>
                </div>
            </button>
            {open && (
                <div className="space-y-2 px-3 pb-3 pl-9">
                    <p className="text-muted-foreground text-xs">{KIND_EXPLANATION[entry.kind]}</p>
                    <pre className="bg-muted max-h-72 overflow-auto rounded-md p-2.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words">
                        {detailsText(entry)}
                    </pre>
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                            void navigator.clipboard.writeText(detailsText(entry))
                            toast.success("Error details copied")
                        }}
                    >
                        <Copy /> Copy details
                    </Button>
                </div>
            )}
        </li>
    )
}

type Filter = "all" | "errors" | "server" | "browser"
const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "errors", label: "Errors only" },
    { value: "server", label: "Server" },
    { value: "browser", label: "Browsers" },
]

export function ErrorLogDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const api = useAdminApi()
    const queryClient = useQueryClient()
    const { entries, serverQuery, persisted } = useErrorLog(open)
    const [filter, setFilter] = React.useState<Filter>("all")
    const [search, setSearch] = React.useState("")
    const [confirmClear, setConfirmClear] = React.useState(false)

    const clearMutation = useMutation({
        mutationFn: api.clearErrorLog,
        onSuccess: () => {
            clearLocalErrors()
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.errorLog })
            toast.success("Error log cleared")
            setConfirmClear(false)
        },
    })

    const term = search.trim().toLowerCase()
    const visible = entries.filter((e) => {
        if (filter === "errors" && e.severity !== "error") return false
        if (filter === "server" && !(e.origin === "server" && e.source === "server")) return false
        if (filter === "browser" && !(e.source === "client")) return false
        if (!term) return true
        return [e.message, e.reference, e.path, e.detail, e.user, e.code].some((v) => v?.toLowerCase().includes(term))
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90svh] flex-col sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Error log</DialogTitle>
                    <DialogDescription>
                        Everything that went wrong on the API and in staff browsers, newest first. Search by the reference shown in an error message
                        (e.g. E-7F3K2).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Search message, reference, path, user"
                        aria-label="Search the error log"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-w-48 flex-1"
                    />
                    <div className="flex gap-1" role="group" aria-label="Filter">
                        {FILTERS.map((f) => (
                            <Button
                                key={f.value}
                                size="sm"
                                variant={filter === f.value ? "default" : "outline"}
                                aria-pressed={filter === f.value}
                                className="cursor-pointer"
                                onClick={() => setFilter(f.value)}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </div>
                    <Button
                        size="icon"
                        variant="outline"
                        className="size-8 cursor-pointer"
                        aria-label="Refresh"
                        title="Refresh"
                        disabled={serverQuery.isFetching}
                        onClick={() => void serverQuery.refetch()}
                    >
                        <RefreshCw className={cn(serverQuery.isFetching && "animate-spin")} />
                    </Button>
                </div>

                {serverQuery.isError && (
                    <p className="text-destructive flex items-center gap-2 text-sm">
                        <AlertTriangle className="size-4 shrink-0" /> Couldn&apos;t load the server log — showing this browser&apos;s entries only.
                    </p>
                )}
                {!persisted && (
                    <p className="text-muted-foreground text-xs">
                        Redis is unavailable, so the server log only has this API process&apos;s entries since it last started.
                    </p>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
                    {serverQuery.isLoading && entries.length === 0 ? (
                        <p className="text-muted-foreground p-4 text-sm">Loading the error log…</p>
                    ) : visible.length === 0 ? (
                        <p className="text-muted-foreground p-4 text-sm">
                            {entries.length === 0 ? "No errors recorded." : "No entries match this filter."}
                        </p>
                    ) : (
                        <ul>
                            {visible.map((entry) => (
                                <EntryRow key={`${entry.origin}-${entry.id}`} entry={entry} />
                            ))}
                        </ul>
                    )}
                </div>

                <DialogFooter className="items-center sm:justify-between">
                    <span className="text-muted-foreground text-xs tabular-nums">
                        {visible.length} of {entries.length} entries
                    </span>
                    {confirmClear ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Clear the whole log?</span>
                            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setConfirmClear(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="cursor-pointer"
                                disabled={clearMutation.isPending}
                                onClick={() => clearMutation.mutate()}
                            >
                                Clear log
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" className="cursor-pointer" disabled={entries.length === 0} onClick={() => setConfirmClear(true)}>
                            <Trash2 /> Clear log
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

/** Compact summary for the Admin panel: last-24h counts and the latest few entries, opening the full log. */
export function ErrorLogSection({ active }: { active: boolean }) {
    const { entries, serverQuery } = useErrorLog(active)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const dayAgo = Date.now() - 24 * 60 * 60 * 1000
    const recent = entries.filter((e) => new Date(e.at).getTime() >= dayAgo)
    const errorCount = recent.filter((e) => e.severity === "error").length
    const warningCount = recent.length - errorCount

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">Error log</span>
                <span className={cn("text-xs tabular-nums", errorCount > 0 ? "text-destructive font-medium" : "text-muted-foreground")}>
                    Last 24 h: {errorCount} error{errorCount === 1 ? "" : "s"}, {warningCount} warning{warningCount === 1 ? "" : "s"}
                </span>
            </div>

            {serverQuery.isError && (
                <p className="text-destructive text-xs">Couldn&apos;t load the server log. This browser&apos;s entries are still shown.</p>
            )}

            {entries.length === 0 ? (
                <p className="text-muted-foreground rounded-lg border px-3 py-2.5 text-xs">
                    {serverQuery.isLoading ? "Loading…" : "No errors recorded."}
                </p>
            ) : (
                <ul className="divide-y rounded-lg border">
                    {entries.slice(0, 4).map((entry) => (
                        <li key={`${entry.origin}-${entry.id}`} className="flex items-center gap-2 px-2.5 py-2">
                            <KindBadge entry={entry} />
                            <span className="min-w-0 flex-1 truncate text-xs" title={entry.message}>{entry.message}</span>
                            <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">{shortTimeFormat.format(new Date(entry.at))}</span>
                        </li>
                    ))}
                </ul>
            )}

            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setDialogOpen(true)}>
                Open error log{entries.length > 0 ? ` (${entries.length})` : ""}
            </Button>
            <ErrorLogDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    )
}
