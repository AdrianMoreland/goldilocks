import { describe, expect, it } from "vitest"
import type { RoadmapQueueEntry, RoadmapScope, RoadmapScopeItem } from "@goldilocks/shared-types"
import { filterScopeItems, isScopeFiltering, noteForItem, NO_SCOPE_FILTER, queueSummary, scopeCounts, scopeSource, sortScopeItems, taskCount, verifiedText } from "./scope-state"

const item = (over: Partial<RoadmapScopeItem> = {}): RoadmapScopeItem => ({
    id: "F-01",
    scope: "features",
    title: "Pricing",
    priority: "P1",
    effort: "M",
    status: "planned",
    after: [],
    flags: [],
    verified: null,
    was: null,
    evidence: [],
    spec: null,
    deadline: null,
    body: "",
    tasks: [],
    ...over,
})

describe("filterScopeItems", () => {
    const items = [
        item({ id: "F-01", title: "Hedge control", flags: ["BC"], tasks: [{ checked: false, text: "Add hedge ledger", depth: 0 }] }),
        item({ id: "B-01", scope: "fixes", title: "Dead refresh call", priority: "P0" }),
        item({ id: "O-01", scope: "ops", title: "Security baseline", priority: "P0", was: "0.6" }),
    ]

    it("returns everything without a filter", () => {
        expect(filterScopeItems(items, NO_SCOPE_FILTER)).toHaveLength(3)
        expect(isScopeFiltering(NO_SCOPE_FILTER)).toBe(false)
    })

    it("matches every word anywhere in the item: id, title, flags, old number, subtasks", () => {
        expect(filterScopeItems(items, { ...NO_SCOPE_FILTER, query: "hedge ledger" }).map((i) => i.id)).toEqual(["F-01"])
        expect(filterScopeItems(items, { ...NO_SCOPE_FILTER, query: "bc" }).map((i) => i.id)).toEqual(["F-01"])
        expect(filterScopeItems(items, { ...NO_SCOPE_FILTER, query: "0.6" }).map((i) => i.id)).toEqual(["O-01"])
        expect(filterScopeItems(items, { ...NO_SCOPE_FILTER, query: "hedge nothing" })).toEqual([])
    })

    it("combines scope, priority and query", () => {
        expect(filterScopeItems(items, { query: "", scope: "ops", priority: "all" }).map((i) => i.id)).toEqual(["O-01"])
        expect(filterScopeItems(items, { query: "", scope: "all", priority: "P0" }).map((i) => i.id)).toEqual(["B-01", "O-01"])
        expect(filterScopeItems(items, { query: "security", scope: "fixes", priority: "all" })).toEqual([])
        expect(isScopeFiltering({ ...NO_SCOPE_FILTER, priority: "P0" })).toBe(true)
    })
})

describe("sortScopeItems", () => {
    it("puts started items first, then orders by priority, then by id as numbers", () => {
        const sorted = sortScopeItems([
            item({ id: "F-10", priority: "P1" }),
            item({ id: "F-02", priority: "P1" }),
            item({ id: "F-03", priority: "P0" }),
            item({ id: "F-04", priority: "P3", status: "next" }),
            item({ id: "F-05", priority: "P2", status: "idea" }),
        ])
        expect(sorted.map((i) => i.id)).toEqual(["F-04", "F-03", "F-02", "F-10", "F-05"])
    })

    it("does not change the array it was given", () => {
        const input = [item({ id: "F-2", priority: "P2" }), item({ id: "F-1", priority: "P1" })]
        sortScopeItems(input)
        expect(input.map((i) => i.id)).toEqual(["F-2", "F-1"])
    })
})

describe("item and view numbers", () => {
    it("counts ticked subtasks", () => {
        expect(taskCount(item({ tasks: [{ checked: true, text: "a", depth: 0 }, { checked: false, text: "b", depth: 1 }] }))).toEqual({ done: 1, total: 2 })
        expect(taskCount(item())).toEqual({ done: 0, total: 0 })
    })

    it("says whether an item was verified", () => {
        expect(verifiedText(item())).toBe("Not verified against the code yet")
        expect(verifiedText(item({ verified: "abc1234" }))).toBe("Verified at abc1234")
    })

    it("counts open items, done lines and open decisions", () => {
        const view: RoadmapScope["view"] = {
            items: [item(), item({ id: "F-02" })],
            done: [{ id: "F-00", scope: "features", text: "x" }],
            decisions: [
                { id: "D-1", title: "a", settled: false, default: null, blocks: null, text: "a" },
                { id: "D-2", title: "b", settled: true, default: null, blocks: null, text: "b" },
            ],
            now: null,
        }
        expect(scopeCounts(view)).toEqual({ open: 2, done: 1, decisions: 1 })
    })
})

describe("scopeSource", () => {
    const base: RoadmapScope = {
        enabled: true,
        configured: true,
        empty: false,
        repo: "o/r",
        branch: "main",
        commit: "0123456789abcdef",
        version: 3,
        syncedAt: "2026-11-10T08:00:00.000Z",
        syncedBy: "boss@example.com",
        view: { items: [], done: [], decisions: [], now: null },
    }

    it("explains an unset repository first, then an empty store", () => {
        expect(scopeSource({ ...base, configured: false }).tone).toBe("muted")
        expect(scopeSource({ ...base, empty: true })).toMatchObject({ tone: "warn", title: "Nothing pulled yet" })
    })

    it("names the commit, repository and who refreshed it", () => {
        const s = scopeSource(base)
        expect(s.tone).toBe("ok")
        expect(s.title).toBe("Scope files at 0123456")
        expect(s.detail).toContain("o/r (main)")
        expect(s.detail).toContain("by boss@example.com")
    })
})

describe("queue helpers", () => {
    it("starts a note about an item with its id", () => {
        expect(noteForItem(item({ id: "F-12" }), "  tick the first box ")).toBe("F-12: tick the first box")
    })

    it("counts waiting and filed notes", () => {
        const entry = (status: RoadmapQueueEntry["status"]): RoadmapQueueEntry => ({
            id: 1,
            text: "x",
            source: "web",
            status,
            line: "- 2026-11-10 (web): x",
            createdAt: "2026-11-10T08:00:00.000Z",
            filedAt: null,
        })
        expect(queueSummary([entry("new"), entry("new"), entry("filed")])).toEqual({ waiting: 2, filed: 1 })
    })
})
