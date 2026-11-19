import { describe, expect, it } from "vitest"
import type { LiveStockLine } from "@goldilocks/shared-types"
import { groupBars, groupCoins, levelOf } from "./live-stock-model"

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
