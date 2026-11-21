import { describe, expect, it } from "vitest"
import type { MetalType, Product } from "@goldilocks/shared-types"
import { AUTO_ROTATE_SECONDS, autoMetal, boardLists, changeSincePreviousClose, perGram, recentCloses, sparkPath, togglePin } from "./board-model"

function product(id: number, name: string, metalType: MetalType, weight: number): Product {
    return {
        id,
        sku: `SKU-${id}`,
        name,
        metalType,
        weight,
        spotPrice: 0,
        spreadBuy: 0,
        spreadSell: 0,
        vatRate: 0,
        category: null,
        description: "",
        marketValue: 0,
        priceSell: 0,
        priceSellVatExcl: 0,
        priceBuy: 0,
        stock: 0,
        isActive: true,
    } as Product
}

const products = [
    product(1, "1oz Gold Bar", "GOLD", 31.1035),
    product(2, "1oz Gold Bar PAMP", "GOLD", 31.1035),
    product(3, "Gold Britannia 1oz", "GOLD", 31.1035),
    product(4, "1oz Silver Bar", "SILVER", 31.1035),
    product(5, "10g Gold Bar", "GOLD", 10),
    product(6, "Full Sovereign", "GOLD", 7.3224),
]

describe("boardLists", () => {
    it("splits one metal into bars by weight and coins, hiding variants", () => {
        const { bars, coins } = boardLists(products, "GOLD", [])
        expect(bars.map((p) => p.id)).toEqual([5, 1])
        expect(coins.map((p) => p.id)).toEqual([3, 6])
    })

    it("moves pinned products to the top of their own list only", () => {
        const { bars, coins } = boardLists(products, "GOLD", [1, 6, 4])
        expect(bars.map((p) => p.id)).toEqual([1, 5])
        expect(coins.map((p) => p.id)).toEqual([6, 3])
    })

    it("keeps names containing every word searched, in any case", () => {
        const { bars, coins } = boardLists(products, "GOLD", [], "  SOVEREIGN full ")
        expect(bars).toEqual([])
        expect(coins.map((p) => p.id)).toEqual([6])
    })
})

describe("togglePin", () => {
    it("adds a new pin and removes an existing one", () => {
        expect(togglePin([1], 2)).toEqual([1, 2])
        expect(togglePin([1, 2], 1)).toEqual([2])
    })
})

describe("autoMetal", () => {
    const step = AUTO_ROTATE_SECONDS * 1000

    it("cycles through the metals that have products only", () => {
        expect(autoMetal(products, 0)).toBe("GOLD")
        expect(autoMetal(products, step)).toBe("SILVER")
        expect(autoMetal(products, 2 * step)).toBe("GOLD")
    })

    it("falls back to all four metals when nothing is loaded", () => {
        expect(autoMetal([], 3 * step)).toBe("PALLADIUM")
    })
})

describe("recentCloses", () => {
    it("keeps one metal's newest closes, oldest first, and skips zero prices", () => {
        const h = [
            { metalType: "GOLD", priceEur: 3, timestamp: "2026-11-03T00:00:00.000Z" },
            { metalType: "GOLD", priceEur: 1, timestamp: "2026-11-01T00:00:00.000Z" },
            { metalType: "SILVER", priceEur: 9, timestamp: "2026-11-02T00:00:00.000Z" },
            { metalType: "GOLD", priceEur: 0, timestamp: "2026-11-04T00:00:00.000Z" },
            { metalType: "GOLD", priceEur: 2, timestamp: "2026-11-02T00:00:00.000Z" },
        ]
        expect(recentCloses(h, "GOLD")).toEqual([1, 2, 3])
        expect(recentCloses(h, "GOLD", 2)).toEqual([2, 3])
    })
})

describe("sparkPath", () => {
    it("draws the lowest value at the bottom and the highest at the top", () => {
        expect(sparkPath([10, 20, 15], 100, 20)).toBe("M0.0 20.0 L50.0 0.0 L100.0 10.0")
    })

    it("draws nothing for fewer than two points, and a flat line for equal values", () => {
        expect(sparkPath([5], 100, 20)).toBe("")
        expect(sparkPath([5, 5], 100, 20)).toBe("M0.0 20.0 L100.0 20.0")
    })
})

describe("perGram and changeSincePreviousClose", () => {
    it("converts a troy-ounce spot to grams", () => {
        expect(perGram(3110.3477)).toBeCloseTo(100, 3)
    })

    it("gives the move since the previous close from the spot's percentage change", () => {
        expect(changeSincePreviousClose(110, 10)).toBeCloseTo(10, 6)
        expect(changeSincePreviousClose(90, -10)).toBeCloseTo(-10, 6)
        expect(changeSincePreviousClose(100, null)).toBeNull()
    })
})
