import { describe, expect, it } from "vitest"
import { GRAMS_PER_TROY_OUNCE, type Product } from "@goldilocks/shared-types"
import { buildDisplayProducts } from "./product-grouping"

const coin = (id: number, name: string, weight: number): Product =>
    ({
        id, sku: `SKU-${id}`, name, metalType: "GOLD", category: "COIN", weight,
        spotPrice: 3000, marketValue: 1000, spreadSell: 0.1, spreadBuy: 0.05, vatRate: 0,
        priceSell: 1100, priceSellVatExcl: 1100, priceBuy: 950, description: "", stock: 1, isActive: true,
        createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
    }) as unknown as Product

describe("merged fractional coin rows", () => {
    const quarter = GRAMS_PER_TROY_OUNCE / 4

    it("stand for the plain product, not a mint-specific one listed first", () => {
        const rows = buildDisplayProducts([coin(7, "1/4oz US Eagle", quarter), coin(9, "1/4oz Coin", quarter)])
        const merged = rows.find((r) => r.name === "1/4oz Coin")
        expect(merged?.id).toBe(9)
        expect(merged?.members).toHaveLength(2)
    })

    it("fall back to the first member when none is plain", () => {
        const rows = buildDisplayProducts([coin(7, "1/4oz US Eagle", quarter), coin(8, "1/4oz Kangaroo", quarter)])
        expect(rows.find((r) => r.name === "1/4oz Coin")?.id).toBe(7)
    })
})
