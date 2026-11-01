import type { RoadmapPullResult, RoadmapSyncStatus } from "@goldilocks/shared-types"

import type { StatusTone } from "@/components/status-dot"

export type SyncTone = StatusTone

export interface SyncSummary {
    tone: SyncTone
    title: string
    detail: string
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Whole days until the token expires (negative once it has), or null if GitHub did not say. */
export function tokenDaysLeft(status: RoadmapSyncStatus, now: Date): number | null {
    if (!status.tokenExpiresAt) return null
    return Math.floor((new Date(status.tokenExpiresAt).getTime() - now.getTime()) / DAY_MS)
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

/** The one-line story for the banner: what state the app's roadmap is in against master, and what it means. */
export function summarize(status: RoadmapSyncStatus): SyncSummary {
    switch (status.state) {
        case "unconfigured":
            return {
                tone: "muted",
                title: "Sync is not set up",
                detail: "Add GITHUB_SYNC_TOKEN to the API's environment to compare this roadmap with the file on master.",
            }
        case "unavailable":
            return {
                tone: "bad",
                title: "Could not reach GitHub",
                detail: status.error ?? "GitHub did not answer. The app's roadmap is unchanged.",
            }
        case "in-sync":
            return { tone: "ok", title: "Matches master", detail: "The app's roadmap and docs/ROADMAP.md are the same." }
        case "differs":
            return {
                tone: "warn",
                title: "Differs from master",
                detail: `${plural(status.appOnlyLines, "line")} only in the app, ${plural(status.masterOnlyLines, "line")} only on master.`,
            }
    }
}

type LogEntry = RoadmapPullResult["log"][number]

export const clip = (text: string, max = 90) => (text.length > max ? `${text.slice(0, max - 1)}…` : text)

/** One merge log entry in plain words, for the sync dialog. */
export function describeEntry(entry: LogEntry): string {
    const text = clip(entry.text)
    switch (entry.kind) {
        case "to-app":
            return `Brought in from master: ${text}`
        case "to-file":
            return `Only in the app (kept, not sent to GitHub yet): ${text}`
        case "conflict-app-wins":
            return `Both changed it, the app's version is kept: ${text}`
        case "kept-file-edit":
            return `Deleted in the app but changed on master, master's version is kept: ${text}`
        case "missing-from-file":
            return `Deleted on master, kept in the app: ${text}`
        case "both-added":
            return `Both added lines here, both are kept: ${text}`
    }
}

/** The one-line question the sync dialog asks, from what the preview found. */
export function pullHeadline(result: RoadmapPullResult): string {
    if (result.mode === "nothing") return "Already up to date with master"
    if (result.mode === "adopt") return result.appChanged ? "Replace the app's roadmap with master's" : "The app already matches master"
    return result.appChanged ? "Bring master's changes into the app" : "Nothing to change in the app"
}

/** Whether Apply does anything: a merge or first run that changes nothing still records the sync point, so it is allowed. */
export function canApply(result: RoadmapPullResult, confirmed: boolean): boolean {
    if (result.mode === "nothing") return false
    if (result.mode === "adopt") return confirmed
    return true
}

/** Widths for the drift meter as fractions of one: null when nothing differs, so the meter is not drawn. */
export function meterShares(appOnly: number, masterOnly: number): { app: number; master: number } | null {
    const total = appOnly + masterOnly
    if (total <= 0) return null
    return { app: appOnly / total, master: masterOnly / total }
}

const ENTRY_LABEL: Record<LogEntry["kind"], string> = {
    "to-app": "From master",
    "to-file": "App only",
    "conflict-app-wins": "Conflict, app kept",
    "kept-file-edit": "Conflict, master kept",
    "missing-from-file": "Deleted on master",
    "both-added": "Both added",
}

/** Short label for a merge log row. */
export const entryLabel = (entry: LogEntry): string => ENTRY_LABEL[entry.kind]

/** Dot colour for a merge log row: plain bring-ins are fine, a decision between two versions needs a look. */
export function entryTone(entry: LogEntry): SyncTone {
    switch (entry.kind) {
        case "to-app":
            return "ok"
        case "to-file":
            return "muted"
        default:
            return "warn"
    }
}

/** Counts for the line above the merge log: what comes in, what stays only in the app, what needs a look. */
export function summarizeLog(log: LogEntry[]): { fromMaster: number; appOnly: number; needLook: number } {
    return log.reduce(
        (sum, entry) => {
            const tone = entryTone(entry)
            return {
                fromMaster: sum.fromMaster + (tone === "ok" ? 1 : 0),
                appOnly: sum.appOnly + (tone === "muted" ? 1 : 0),
                needLook: sum.needLook + (tone === "warn" ? 1 : 0),
            }
        },
        { fromMaster: 0, appOnly: 0, needLook: 0 },
    )
}
