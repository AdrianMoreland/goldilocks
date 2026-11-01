import type { RoadmapSyncStatus } from "@goldilocks/shared-types"

export type SyncTone = "ok" | "warn" | "bad" | "muted"

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
