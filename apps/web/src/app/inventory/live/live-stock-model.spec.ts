import { describe, expect, it } from "vitest"
import type { LiveStockLine } from "@goldilocks/shared-types"
import { applyFilter, branchGrid, draftChanges, gaugeOf, groupBars, groupCoins, levelOf, levelOfMany, stepDraft, summarise, tileItems, withDraft } from "./live-stock-model"

const line = (o: Partial<LiveStockLine>): LiveStockLine => ({
    id: 1, branchCode: "DU", metal: "GOLD", kind: "COIN", family: "Krugerrand", variant: "1oz", refinery: "",
    qty: 1, lowThreshold: null, unassigned: 0, details: null, bars: [], updatedAt: "2026-11-18T00:00:00Z", ...o,
})
const all = { showAll: true, query: "" }
const some = { showAll: false, query: "" }

describe("levelOf", () => {
    it("zero, low, ok", () => {
        expect(levelOf(line({ qty: 0 }))).toBe("zero")
        expect(levelOf(line({ qty: 2, lowThreshold: 2 }))).toBe("low")
        expect(levelOf(line({ qty: 3, lowThreshold: 2 }))).toBe("ok")
        expect(levelOf(line({ qty: 1 }))).toBe("ok")
    })
})

describe("groupCoins", () => {
    const lines = [
        line({ id: 1, variant: "1oz", qty: 4 }),
        line({ id: 2, variant: "1/10oz", qty: 2 }),
        line({ id: 3, family: "Other", variant: "50€ Proof", qty: 1 }),
        line({ id: 4, family: "Maple", variant: "1oz", qty: 0 }),
    ]
    it("groups by family with totals, smallest weight first, Other last", () => {
        const g = groupCoins(lines, some)
        expect(g.map((f) => f.family)).toEqual(["Krugerrand", "Other"])
        expect(g[0]?.total).toBe(6)
        expect(g[0]?.rows.map((r) => r.variant)).toEqual(["1/10oz", "1oz"])
    })
    it("hides empty rows unless asked", () => {
        expect(groupCoins(lines, some).some((f) => f.family === "Maple")).toBe(false)
        expect(groupCoins(lines, all).some((f) => f.family === "Maple")).toBe(true)
    })
    it("searches family and variant words", () => {
        expect(groupCoins(lines, { showAll: true, query: "kruger 1/10" })[0]?.rows).toHaveLength(1)
    })
})

describe("groupBars", () => {
    const bars = [
        line({ id: 1, kind: "BAR", family: "Bar", variant: "1oz", refinery: "VALCAMBI SUISSE", qty: 5, bars: [{ id: 9, serial: "AG1", grams: null, details: null, status: "IN_STOCK" }] }),
        line({ id: 2, kind: "BAR", family: "Bar", variant: "1oz", refinery: "METALOR", qty: 3 }),
        line({ id: 3, kind: "BAR", family: "Bar", variant: "100g", refinery: "PAMP SUISSE", qty: 1, unassigned: 1 }),
    ]
    it("totals by weight, smallest first, refineries by count", () => {
        const g = groupBars(bars, some)
        expect(g.map((w) => w.variant)).toEqual(["1oz", "100g"])
        expect(g[0]?.total).toBe(8)
        expect(g[0]?.lines[0]?.refinery).toBe("VALCAMBI SUISSE")
        expect(g[1]?.unassigned).toBe(1)
    })
    it("finds a bar by serial", () => {
        expect(groupBars(bars, { showAll: false, query: "ag1" })[0]?.lines).toHaveLength(1)
    })
})

describe("summarise and applyFilter", () => {
    const lines = [
        line({ id: 1, qty: 4, lowThreshold: 5 }),
        line({ id: 2, variant: "1/10oz", qty: 0, lowThreshold: 2 }),
        line({ id: 3, kind: "BAR", family: "Bar", variant: "1oz", refinery: "PAMP", qty: 3, unassigned: 2 }),
        line({ id: 4, kind: "BAR", family: "Bar", variant: "100g", refinery: "PAMP", qty: 1, unassigned: 1, lowThreshold: 1 }),
    ]
    it("adds coins, bars, low lines (not empty ones) and serials to pick", () => {
        expect(summarise(lines)).toEqual({ coins: 4, bars: 4, low: 2, toPick: 3 })
    })
    it("filters by tile", () => {
        expect(applyFilter(lines, "coins").map((l) => l.id)).toEqual([1, 2])
        expect(applyFilter(lines, "bars").map((l) => l.id)).toEqual([3, 4])
        expect(applyFilter(lines, "low").map((l) => l.id)).toEqual([1, 4])
        expect(applyFilter(lines, "pick").map((l) => l.id)).toEqual([3, 4])
        expect(applyFilter(lines, null)).toHaveLength(4)
    })
})

describe("levelOfMany", () => {
    it("is low at or under the summed marks, and matches levelOf for one line", () => {
        expect(levelOfMany([{ qty: 2, lowThreshold: 2 }, { qty: 1, lowThreshold: 1 }])).toBe("low")
        expect(levelOfMany([{ qty: 3, lowThreshold: 2 }, { qty: 1, lowThreshold: null }])).toBe("ok")
        expect(levelOfMany([{ qty: 0, lowThreshold: 2 }])).toBe("zero")
        expect(levelOfMany([{ qty: 5, lowThreshold: null }])).toBe("ok")
    })
})

describe("branchGrid", () => {
    const grid = branchGrid([
        {
            code: "DU",
            lines: [
                line({ id: 1, qty: 4, lowThreshold: 5 }),
                line({ id: 2, family: "Other", variant: "Proof", qty: 1 }),
                line({ id: 3, kind: "BAR", family: "Bar", variant: "100g", refinery: "PAMP", qty: 2 }),
                line({ id: 4, kind: "BAR", family: "Bar", variant: "1oz", refinery: "PAMP", qty: 3 }),
                line({ id: 5, kind: "BAR", family: "Bar", variant: "1oz", refinery: "METALOR", qty: 1 }),
                line({ id: 6, family: "Maple", variant: "1oz", qty: 0 }),
            ],
        },
        { code: "CO", lines: [line({ id: 7, branchCode: "CO", qty: 0, lowThreshold: 1 }), line({ id: 8, branchCode: "CO", kind: "BAR", family: "Bar", variant: "1oz", refinery: "PAMP", qty: 2 })] },
    ])
    it("puts bars first by size and coins by family, Other last", () => {
        expect(grid.map((g) => g.kind)).toEqual(["BAR", "COIN"])
        expect(grid[0]?.rows.map((r) => r.label)).toEqual(["1oz bar", "100g bar"])
        expect(grid[1]?.rows.map((r) => r.label)).toEqual(["Krugerrand 1oz", "Other Proof"])
    })
    it("adds refineries per branch and totals across branches", () => {
        const oz = grid[0]?.rows[0]
        expect(oz?.cells.DU).toEqual({ qty: 4, level: "ok" })
        expect(oz?.cells.CO).toEqual({ qty: 2, level: "ok" })
        expect(oz?.total).toBe(6)
    })
    it("marks low and none per branch and leaves out rows empty everywhere", () => {
        const kr = grid[1]?.rows[0]
        expect(kr?.cells.DU?.level).toBe("low")
        expect(kr?.cells.CO?.level).toBe("zero")
        expect(grid[1]?.rows.some((r) => r.label === "Maple 1oz")).toBe(false)
    })
})

describe("proof filter", () => {
    it("keeps only proof variants, whatever the case", () => {
        const lines = [line({ id: 1, variant: "1oz Proof" }), line({ id: 2, variant: "1oz" }), line({ id: 3, variant: "Half proof" })]
        expect(applyFilter(lines, "proof").map((l) => l.id)).toEqual([1, 3])
    })
})

describe("count draft", () => {
    const a = line({ id: 1, kind: "COIN", family: "Krugerrand", variant: "1oz", qty: 31 })
    const b = line({ id: 2, kind: "BAR", family: "Bar", variant: "1g", refinery: "UMICORE", qty: 0 })

    it("collects steps, never goes below zero, and drops a line back at its saved count", () => {
        let d = stepDraft({}, a, -1)
        d = stepDraft(d, a, -1)
        expect(d[1].qty).toBe(29)
        d = stepDraft(d, b, -1)
        expect(d[2]).toBeUndefined()
        d = stepDraft(d, a, 1)
        d = stepDraft(d, a, 1)
        expect(d).toEqual({})
    })

    it("shows the drafted counts on the lines and lists the changes to save", () => {
        const d = stepDraft(stepDraft({}, a, -2), b, 3)
        expect(withDraft([a, b], d).map((l) => l.qty)).toEqual([29, 3])
        expect(draftChanges(d)).toEqual([
            { lineId: 1, label: "Krugerrand 1oz", from: 31, to: 29 },
            { lineId: 2, label: "1g bar · Umicore", from: 0, to: 3 },
        ])
    })
})

describe("tileItems", () => {
    const bars = groupBars(
        [
            line({ id: 10, kind: "BAR", family: "Bar", variant: "1oz", refinery: "PAMP", qty: 3, lowThreshold: 2 }),
            line({ id: 11, kind: "BAR", family: "Bar", variant: "1oz", refinery: "Perth Mint", qty: 1, lowThreshold: 3, unassigned: 2 }),
            line({ id: 12, kind: "BAR", family: "Bar", variant: "5g", refinery: "PAMP", qty: 9 }),
        ],
        all,
    )
    const coins = groupCoins([line({ id: 1, variant: "1oz", qty: 0, lowThreshold: 4 }), line({ id: 2, variant: "1/10oz", qty: 7 })], all)

    it("makes one tile per bar weight (refineries added up) and one per coin", () => {
        const t = tileItems(bars, coins)
        expect(t.map((x) => x.label)).toEqual(["5g bar", "1oz bar", "Krugerrand 1/10oz", "Krugerrand 1oz"])
        const oz = t.find((x) => x.label === "1oz bar")!
        // 3 + 1 against low marks 2 + 3: at or under the summed mark is low.
        expect(oz).toMatchObject({ kind: "BAR", qty: 4, lowMark: 5, level: "low", toPick: 2 })
        expect(oz.lines.map((l) => l.id)).toEqual([10, 11])
        expect(t.find((x) => x.label === "Krugerrand 1oz")).toMatchObject({ qty: 0, lowMark: 4, level: "zero" })
        expect(t.find((x) => x.label === "5g bar")).toMatchObject({ lowMark: null, level: "ok" })
    })
})

describe("gaugeOf", () => {
    it("scales the bar to three times the low mark, with the mark's position", () => {
        expect(gaugeOf(6, 4)).toEqual({ fill: 50, mark: (4 / 12) * 100 })
        expect(gaugeOf(30, 4)).toEqual({ fill: 100, mark: (4 / 30) * 100 })
        expect(gaugeOf(0, 4)).toEqual({ fill: 0, mark: (4 / 12) * 100 })
    })
    it("without a low mark fills by count with no mark", () => {
        expect(gaugeOf(5, null)).toEqual({ fill: 100, mark: null })
        expect(gaugeOf(0, null)).toEqual({ fill: 0, mark: null })
    })
})
