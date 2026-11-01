import { describe, expect, it } from "vitest"
import type { RoadmapSection, RoadmapTask } from "@goldilocks/shared-types"
import { NO_FILTER, boardColumns, groupSections, isFiltering, overviewTotals, phaseName, pickSection, priorityMix, progressOf, sectionMatches, taskDone, upNext } from "./roadmap-state"

const task = (text: string, checked: boolean, children: RoadmapTask[] = []): RoadmapTask => ({ line: 0, checked, text, notes: [], children })

const section = (key: string, over: Partial<RoadmapSection> = {}): RoadmapSection => ({
    key,
    id: key,
    title: `Section ${key}`,
    note: null,
    depends: null,
    priority: null,
    group: "PHASE 1 — Internal",
    headingLine: 0,
    body: "",
    tasks: [],
    ...over,
})

describe("progressOf and phaseName", () => {
    it("adds up ticked and total tasks across sections, children included", () => {
        const sections = [section("1.1", { tasks: [task("a", true), task("b", false, [task("c", true), task("d", false)])] }), section("1.2", { tasks: [task("e", true)] })]
        expect(progressOf(sections)).toEqual({ done: 3, total: 5 })
    })

    it("keeps the text before the dash as the phase name", () => {
        expect(phaseName("PHASE 1 — Internal features")).toBe("PHASE 1")
        expect(phaseName("Icebox")).toBe("Icebox")
    })
})

describe("groupSections", () => {
    it("groups neighbours with the same heading and starts a new group when it changes", () => {
        const groups = groupSections([section("a", { group: "X" }), section("b", { group: "X" }), section("c", { group: "Y" }), section("d", { group: "X" })])
        expect(groups.map((g) => [g.name, g.sections.length])).toEqual([
            ["X", 2],
            ["Y", 1],
            ["X", 1],
        ])
    })
})

describe("taskDone", () => {
    it("needs the task and all its children ticked", () => {
        expect(taskDone(task("a", true, [task("b", true)]))).toBe(true)
        expect(taskDone(task("a", true, [task("b", false)]))).toBe(false)
    })
})

describe("sectionMatches", () => {
    const s = section("1.4", { title: "Knowledge Center", priority: "P1", tasks: [task("parse the SOP files", false, [task("handle frontmatter", false)])] })

    it("matches everything with no filter", () => {
        expect(isFiltering(NO_FILTER)).toBe(false)
        expect(sectionMatches(s, NO_FILTER)).toBe(true)
    })

    it("searches the ID, the title and tasks at any depth, ignoring case", () => {
        expect(sectionMatches(s, { ...NO_FILTER, query: "1.4" })).toBe(true)
        expect(sectionMatches(s, { ...NO_FILTER, query: "KNOWLEDGE" })).toBe(true)
        expect(sectionMatches(s, { ...NO_FILTER, query: "frontmatter" })).toBe(true)
        expect(sectionMatches(s, { ...NO_FILTER, query: "invoice" })).toBe(false)
    })

    it("filters by priority and leaves out sections that have none", () => {
        expect(sectionMatches(s, { ...NO_FILTER, priorities: ["P1"] })).toBe(true)
        expect(sectionMatches(s, { ...NO_FILTER, priorities: ["P0"] })).toBe(false)
        expect(sectionMatches(section("x"), { ...NO_FILTER, priorities: ["P0"] })).toBe(false)
    })

    it("hides finished sections but keeps ones with nothing to tick", () => {
        const done = section("d", { tasks: [task("a", true)] })
        expect(sectionMatches(done, { ...NO_FILTER, hideDone: true })).toBe(false)
        expect(sectionMatches(section("prose"), { ...NO_FILTER, hideDone: true })).toBe(true)
    })
})

describe("upNext", () => {
    it("lists open sections by priority, then fewest tasks left, and skips finished or unranked ones", () => {
        const sections = [
            section("a", { priority: "P1", tasks: [task("1", false), task("2", false), task("3", false)] }),
            section("b", { priority: "P0", tasks: [task("1", false), task("2", false)] }),
            section("c", { priority: "P0", tasks: [task("1", false)] }),
            section("d", { priority: "P0", tasks: [task("1", true)] }),
            section("e", { priority: null, tasks: [task("1", false)] }),
        ]
        expect(upNext(sections, 5).map((i) => i.section.key)).toEqual(["c", "b", "a"])
        expect(upNext(sections, 2)).toHaveLength(2)
    })
})

describe("pickSection", () => {
    const a = section("a", { tasks: [task("1", true)] })
    const b = section("b", { tasks: [task("1", false)] })

    it("honours the requested key, else the first with open tasks, else the first", () => {
        expect(pickSection([a, b], "a")?.key).toBe("a")
        expect(pickSection([a, b], null)?.key).toBe("b")
        expect(pickSection([a], "missing")?.key).toBe("a")
        expect(pickSection([], null)).toBeUndefined()
    })
})

describe("boardColumns", () => {
    const sections = [
        section("a", { priority: "P1", tasks: [task("1", false), task("2", false), task("3", false)] }),
        section("b", { priority: "P1", tasks: [task("1", false)] }),
        section("c", { priority: "P0", tasks: [task("1", true)] }),
        section("d", { priority: null, tasks: [task("1", false)] }),
        section("prose", { priority: "P0" }),
    ]

    it("sorts sections into priority columns, finished ones into Done, and skips sections with no tasks", () => {
        const columns = boardColumns(sections)
        expect(columns.map((c) => [c.key, c.items.map((i) => i.section.key)])).toEqual([
            ["P0", []],
            ["P1", ["b", "a"]],
            ["P2", []],
            ["P3", []],
            ["none", ["d"]],
            ["done", ["c"]],
        ])
    })

    it("leaves out the no-priority column when it is empty", () => {
        expect(boardColumns([section("a", { priority: "P2", tasks: [task("1", false)] })]).some((c) => c.key === "none")).toBe(false)
    })
})

describe("priorityMix and overviewTotals", () => {
    const sections = [
        section("a", { priority: "P0", tasks: [task("1", false), task("2", true)] }),
        section("b", { priority: "P2", tasks: [task("1", false), task("2", false)] }),
        section("c", { tasks: [task("1", false)] }),
    ]

    it("counts open tasks by the priority of their section", () => {
        expect(priorityMix(sections).map((m) => [m.key, m.open])).toEqual([
            ["P0", 1],
            ["P1", 0],
            ["P2", 2],
            ["P3", 0],
            ["none", 1],
        ])
    })

    it("totals open and done tasks, open sections, and open Now tasks", () => {
        expect(overviewTotals(sections)).toEqual({ tasksOpen: 4, tasksDone: 1, sectionsOpen: 3, nowOpen: 1 })
    })
})
