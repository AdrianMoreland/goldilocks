import { describe, expect, it } from "vitest"
import type { RoadmapSyncStatus } from "@goldilocks/shared-types"
import { summarize, tokenDaysLeft } from "./sync-state"

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
