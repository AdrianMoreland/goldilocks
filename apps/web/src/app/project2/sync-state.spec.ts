import { describe, expect, it } from "vitest"
import type { RoadmapPullResult, RoadmapPushResult, RoadmapSyncStatus } from "@goldilocks/shared-types"
import {
    canApply,
    canApplyPush,
    describeEntry,
    entryLabel,
    entryTone,
    meterShares,
    pendingEditsText,
    pullHeadline,
    pushHeadline,
    summarize,
    summarizeLog,
    tokenDaysLeft,
} from "./sync-state"

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
    appEditsToPush: null,
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

describe("meterShares", () => {
    it("is null when nothing differs", () => {
        expect(meterShares(0, 0)).toBeNull()
    })

    it("splits the bar in proportion, and one side can take all of it", () => {
        expect(meterShares(1, 3)).toEqual({ app: 0.25, master: 0.75 })
        expect(meterShares(0, 5)).toEqual({ app: 0, master: 1 })
    })
})

describe("merge log rows", () => {
    const entry = (kind: Parameters<typeof entryLabel>[0]["kind"]) => ({ kind, baseLine: 1, text: "x" })

    it("labels every kind and flags only the two-version decisions", () => {
        expect(entryLabel(entry("to-app"))).toBe("From master")
        expect(entryTone(entry("to-app"))).toBe("ok")
        expect(entryTone(entry("to-file"))).toBe("muted")
        expect(entryTone(entry("conflict-app-wins"))).toBe("warn")
        expect(entryTone(entry("missing-from-file"))).toBe("warn")
    })

    it("counts what comes in, what stays only in the app and what needs a look", () => {
        const log = [entry("to-app"), entry("to-app"), entry("to-file"), entry("both-added"), entry("kept-file-edit")]
        expect(summarizeLog(log)).toEqual({ fromMaster: 2, appOnly: 1, needLook: 2 })
        expect(summarizeLog([])).toEqual({ fromMaster: 0, appOnly: 0, needLook: 0 })
    })
})

const pushResult = (over: Partial<RoadmapPushResult> = {}): RoadmapPushResult => ({
    mode: "push",
    applied: false,
    commit: "abc1234",
    edits: [{ kind: "to-file", baseLine: 4, text: "- [x] two" }],
    diffPreview: [],
    prNumber: null,
    prUrl: null,
    ...over,
})

describe("pendingEditsText", () => {
    it("says nothing when there are no edits or sync cannot tell", () => {
        expect(pendingEditsText(0)).toBeNull()
        expect(pendingEditsText(null)).toBeNull()
    })

    it("counts the edits, singular and plural", () => {
        expect(pendingEditsText(1)).toBe("1 edit in the app is not on GitHub yet")
        expect(pendingEditsText(3)).toBe("3 edits in the app are not on GitHub yet")
    })
})

describe("pushHeadline and canApplyPush", () => {
    it("offers to send the edits when there are some", () => {
        const r = pushResult({ edits: [pushResult().edits[0], pushResult().edits[0]] })
        expect(pushHeadline(r)).toBe("Send 2 edits to GitHub as a pull request")
        expect(canApplyPush(r)).toBe(true)
    })

    it("has nothing to apply when GitHub already has the edits", () => {
        const r = pushResult({ mode: "nothing", edits: [] })
        expect(pushHeadline(r)).toMatch(/^Nothing to send/)
        expect(canApplyPush(r)).toBe(false)
    })
})
