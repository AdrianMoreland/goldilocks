import { describe, expect, it } from "vitest"
import { GRAMS_PER_TROY_OUNCE, type Product } from "@goldilocks/shared-types"
import { buildDisplayProducts, isUsFractionCoin, usCounterpart } from "./product-grouping"

const coin = (id: number, name: string, weight: number): Product =>
    ({
        id, sku: `SKU-${id}`, name, metalType: "GOLD", category: "COIN", weight,
        spotPrice: 3000, marketValue: 1000, spreadSell: 0.1, spreadBuy: 0.05, vatRate: 0,
        priceSell: 1100, priceSellVatExcl: 1100, priceBuy: 950, description: "", stock: 1, isActive: true,
        createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
    }) as unknown as Product

const quarter = GRAMS_PER_TROY_OUNCE / 4

describe("small coins", () => {
    it("keep their own row and premium, never averaged", () => {
        const generic = { ...coin(9, "1/4oz Coin", quarter), spreadSell: 0.15 }
        const us = { ...coin(7, "1/4oz US Eagle", quarter), spreadSell: 0.1675 }
        const rows = buildDisplayProducts([us, generic])
        expect(rows).toHaveLength(2)
        expect(rows.find((r) => r.id === 9)?.spreadSell).toBe(0.15)
        expect(rows.find((r) => r.id === 7)?.spreadSell).toBe(0.1675)
    })

    it("tells US versions apart from generic ones", () => {
        expect(isUsFractionCoin(coin(1, "1/4oz US Eagle", quarter))).toBe(true)
        expect(isUsFractionCoin(coin(2, "1/4oz Coin", quarter))).toBe(false)
        expect(isUsFractionCoin(coin(3, "1oz US Eagle", GRAMS_PER_TROY_OUNCE))).toBe(false)
    })

    it("pairs a generic coin with its US twin at the same weight, and nothing else", () => {
        const generic = coin(9, "1/4oz Coin", quarter)
        const us = coin(7, "1/4oz US Eagle", quarter)
        const half = coin(8, "1/2oz US Eagle", GRAMS_PER_TROY_OUNCE / 2)
        const oneOz = coin(10, "1oz Maple Leaf", GRAMS_PER_TROY_OUNCE)
        const all = [generic, us, half, oneOz]
        expect(usCounterpart(generic, all)?.id).toBe(7)
        expect(usCounterpart(us, all)).toBeUndefined()
        expect(usCounterpart(oneOz, all)).toBeUndefined()
    })
})
