import { describe, expect, it } from "vitest"
import type { RoadmapPullResult, RoadmapSyncStatus } from "@goldilocks/shared-types"
import { canApply, describeEntry, pullHeadline, summarize, tokenDaysLeft } from "./sync-state"

const status = (over: Partial<RoadmapSyncStatus> = {}): RoadmapSyncStatus => ({
    state: "in-sync",
    repo: "owner/repo",
    branch: "master",
    masterCommit: "abc1234",
    appVersion: 3,
    appUpdatedAt: "2026-10-19T10:00:00.000Z",
    appOnlyLines: 0,
    masterOnlyLines: 0,
    preview: [],
    openSyncPr: null,
    tokenExpiresAt: null,
    error: null,
    ...over,
})

describe("summarize", () => {
    it("says sync is not set up without a token", () => {
        expect(summarize(status({ state: "unconfigured" }))).toMatchObject({ tone: "muted", title: "Sync is not set up" })
    })

    it("shows the GitHub error when it is unavailable", () => {
        const s = summarize(status({ state: "unavailable", error: "GitHub refused the token" }))
        expect(s.tone).toBe("bad")
        expect(s.detail).toBe("GitHub refused the token")
    })

    it("is ok when in sync", () => {
        expect(summarize(status()).tone).toBe("ok")
    })

    it("counts the differing lines, singular and plural", () => {
        expect(summarize(status({ state: "differs", appOnlyLines: 1, masterOnlyLines: 361 })).detail).toBe(
            "1 line only in the app, 361 lines only on master.",
        )
    })
})

describe("tokenDaysLeft", () => {
    const now = new Date("2026-11-01T12:00:00Z")

    it("is null when GitHub gave no expiry", () => {
        expect(tokenDaysLeft(status(), now)).toBeNull()
    })

    it("counts whole days, and goes negative once expired", () => {
        expect(tokenDaysLeft(status({ tokenExpiresAt: "2026-11-11T12:00:00.000Z" }), now)).toBe(10)
        expect(tokenDaysLeft(status({ tokenExpiresAt: "2026-10-30T12:00:00.000Z" }), now)).toBe(-2)
    })
})

const pulled = (over: Partial<RoadmapPullResult> = {}): RoadmapPullResult => ({
    mode: "merge",
    applied: false,
    commit: "abc1234",
    appChanged: true,
    log: [],
    appOnlyTasks: [],
    appOnlyTaskCount: 0,
    ticksOnlyInApp: [],
    ticksOnlyInAppCount: 0,
    appOnlyLines: 0,
    masterOnlyLines: 0,
    snapshotId: null,
    appVersion: 3,
    ...over,
})

describe("describeEntry", () => {
    it("says in plain words what happened to each kind of change", () => {
        expect(describeEntry({ kind: "to-app", baseLine: 4, text: "- [x] one" })).toBe("Brought in from master: - [x] one")
        expect(describeEntry({ kind: "missing-from-file", baseLine: 4, text: "- [ ] two" })).toBe("Deleted on master, kept in the app: - [ ] two")
        expect(describeEntry({ kind: "conflict-app-wins", baseLine: 1, text: "x" })).toContain("app's version is kept")
    })

    it("shortens a very long line", () => {
        const text = describeEntry({ kind: "to-app", baseLine: 1, text: "x".repeat(300) })
        expect(text.length).toBeLessThan(140)
        expect(text.endsWith("…")).toBe(true)
    })
})

describe("pullHeadline and canApply", () => {
    it("asks the right question for each mode", () => {
        expect(pullHeadline(pulled({ mode: "adopt" }))).toBe("Replace the app's roadmap with master's")
        expect(pullHeadline(pulled({ mode: "adopt", appChanged: false }))).toBe("The app already matches master")
        expect(pullHeadline(pulled())).toBe("Bring master's changes into the app")
        expect(pullHeadline(pulled({ mode: "nothing", appChanged: false }))).toBe("Already up to date with master")
    })

    it("needs the confirmation only for the first run, and never applies when nothing moved", () => {
        expect(canApply(pulled({ mode: "adopt" }), false)).toBe(false)
        expect(canApply(pulled({ mode: "adopt" }), true)).toBe(true)
        expect(canApply(pulled(), false)).toBe(true)
        expect(canApply(pulled({ mode: "nothing" }), true)).toBe(false)
    })
})
