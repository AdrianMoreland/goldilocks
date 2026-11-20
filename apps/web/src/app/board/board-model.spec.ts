import { describe, expect, it } from "vitest"
import type { MetalType, Product } from "@goldilocks/shared-types"
import { AUTO_ROTATE_SECONDS, autoMetal, boardProducts, pinnedProducts, togglePin } from "./board-model"

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
]

describe("boardProducts", () => {
    it("keeps one metal, hides variants, and orders bars by weight before coins", () => {
        expect(boardProducts(products, "GOLD").map((p) => p.id)).toEqual([5, 1, 3])
    })

    it("is empty for a metal with no products", () => {
        expect(boardProducts(products, "PALLADIUM")).toEqual([])
    })
})

describe("pinnedProducts", () => {
    it("shows pins in metal order, including a pinned variant, and skips ids that no longer exist", () => {
        expect(pinnedProducts(products, [4, 2, 99, 1]).map((p) => p.id)).toEqual([1, 2, 4])
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
