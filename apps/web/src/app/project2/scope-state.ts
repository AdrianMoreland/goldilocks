import type { RoadmapQueueEntry, RoadmapScope, RoadmapScopeItem, RoadmapScopeKey } from "@goldilocks/shared-types"
import type { StatusTone } from "@/components/status-dot"
import type { Priority } from "./roadmap-state"

/** Pure helpers for the scope-file view of /project2: filtering, ordering, and the words the page shows. */

export const SCOPE_LABEL: Record<RoadmapScopeKey, string> = {
    features: "Features",
    fixes: "Fixes",
    ops: "Ops",
}

export interface ScopeFilter {
    query: string
    scope: RoadmapScopeKey | "all"
    priority: Priority | "all"
}

export const NO_SCOPE_FILTER: ScopeFilter = { query: "", scope: "all", priority: "all" }

export const isScopeFiltering = (f: ScopeFilter): boolean => f.query.trim() !== "" || f.scope !== "all" || f.priority !== "all"

const searchable = (item: RoadmapScopeItem): string =>
    [item.id, item.title, item.was ?? "", item.flags.join(" "), item.after.join(" "), item.body, ...item.tasks.map((t) => t.text)].join(" ").toLowerCase()

/** Items that match every part of the filter; the query is split on spaces and each word must appear somewhere in the item. */
export function filterScopeItems(items: RoadmapScopeItem[], filter: ScopeFilter): RoadmapScopeItem[] {
    const words = filter.query.toLowerCase().split(/\s+/).filter(Boolean)
    return items.filter((item) => {
        if (filter.scope !== "all" && item.scope !== filter.scope) return false
        if (filter.priority !== "all" && item.priority !== filter.priority) return false
        if (words.length === 0) return true
        const text = searchable(item)
        return words.every((w) => text.includes(w))
    })
}

const STATUS_RANK: Record<RoadmapScopeItem["status"], number> = { doing: 0, next: 1, planned: 2, idea: 3, dropped: 4, done: 5 }

/** Doing first, then by priority, then by status, then by id, so the top of the list is what to look at first. */
export function sortScopeItems(items: RoadmapScopeItem[]): RoadmapScopeItem[] {
    return [...items].sort(
        (a, b) =>
            Number(STATUS_RANK[a.status] > 1) - Number(STATUS_RANK[b.status] > 1) ||
            a.priority.localeCompare(b.priority) ||
            STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
            a.id.localeCompare(b.id, undefined, { numeric: true }),
    )
}

export interface TaskCount {
    done: number
    total: number
}

export const taskCount = (item: RoadmapScopeItem): TaskCount => ({ done: item.tasks.filter((t) => t.checked).length, total: item.tasks.length })

export const STATUS_TONE: Record<RoadmapScopeItem["status"], StatusTone> = {
    doing: "active",
    next: "active",
    planned: "info",
    idea: "muted",
    dropped: "stale",
    done: "ok",
}

/** "Not verified" for an item no sync has checked yet, otherwise the commit its evidence was last checked at. */
export const verifiedText = (item: RoadmapScopeItem): string => (item.verified ? `Verified at ${item.verified}` : "Not verified against the code yet")

export interface ScopeCounts {
    open: number
    done: number
    decisions: number
}

export const scopeCounts = (view: RoadmapScope["view"]): ScopeCounts => ({
    open: view.items.length,
    done: view.done.length,
    decisions: view.decisions.filter((d) => !d.settled).length,
})

/** One line on where the stored roadmap came from, for the banner. */
export function scopeSource(scope: RoadmapScope): { tone: StatusTone; title: string; detail: string } {
    if (!scope.configured) {
        return {
            tone: "muted",
            title: "The roadmap repository is not set up",
            detail: "Set GITHUB_ROADMAP_REPO (and a token that can read it) on the API, then press Refresh.",
        }
    }
    if (scope.empty) {
        return { tone: "warn", title: "Nothing pulled yet", detail: "Press Refresh to read the scope files from the roadmap repository." }
    }
    const when = scope.syncedAt ? new Date(scope.syncedAt).toLocaleString() : "unknown time"
    return {
        tone: "ok",
        title: `Scope files at ${scope.commit?.slice(0, 7) ?? "unknown commit"}`,
        detail: `Read from ${scope.repo ?? "the roadmap repository"} (${scope.branch ?? "main"}), refreshed ${when}${scope.syncedBy ? ` by ${scope.syncedBy}` : ""}.`,
    }
}

/** What a note about one item looks like in the inbox: the id first, so triage can find the item. */
export const noteForItem = (item: RoadmapScopeItem, text: string): string => `${item.id}: ${text.trim()}`

export interface QueueSummary {
    waiting: number
    filed: number
}

export const queueSummary = (entries: RoadmapQueueEntry[]): QueueSummary => ({
    waiting: entries.filter((e) => e.status === "new").length,
    filed: entries.filter((e) => e.status === "filed").length,
})

export const QUEUE_MAX = 500
