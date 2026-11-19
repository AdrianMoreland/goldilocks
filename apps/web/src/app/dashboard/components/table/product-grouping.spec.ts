import { describe, expect, it } from "vitest"
import { GRAMS_PER_TROY_OUNCE, type Product } from "@goldilocks/shared-types"
import { buildDisplayProducts, isVariantProduct, variantChoices, variantLabel } from "./product-grouping"

const product = (id: number, name: string, weight: number, category: "BAR" | "COIN" = "COIN"): Product =>
    ({
        id, sku: `SKU-${id}`, name, metalType: "GOLD", category, weight,
        spotPrice: 3000, marketValue: 1000, spreadSell: 0.1, spreadBuy: 0.05, vatRate: 0,
        priceSell: 1100, priceSellVatExcl: 1100, priceBuy: 950, description: "", stock: 1, isActive: true,
        createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
    }) as unknown as Product

const quarter = GRAMS_PER_TROY_OUNCE / 4
const oz = GRAMS_PER_TROY_OUNCE

describe("small coins", () => {
    it("keep their own row and premium, never averaged", () => {
        const generic = { ...product(9, "1/4oz Coin", quarter), spreadSell: 0.15 }
        const us = { ...product(7, "1/4oz US Eagle", quarter), spreadSell: 0.1675 }
        const rows = buildDisplayProducts([us, generic])
        expect(rows).toHaveLength(2)
        expect(rows.find((r) => r.id === 9)?.spreadSell).toBe(0.15)
        expect(rows.find((r) => r.id === 7)?.spreadSell).toBe(0.1675)
    })
})

describe("variants", () => {
    it("recognises US, CombiBar, PAMP and PAMP Diwali, and leaves regular products and 1oz US Eagle alone", () => {
        expect(variantLabel(product(1, "1/4oz US Eagle", quarter))).toBe("US")
        expect(variantLabel(product(2, "20 g Gold CombiBar", 20, "BAR"))).toBe("CombiBar")
        expect(variantLabel(product(3, "1 oz Gold PAMP Bar", oz, "BAR"))).toBe("PAMP")
        expect(variantLabel(product(4, "5 g Gold PAMP Diwali Bar", 5, "BAR"))).toBe("PAMP Diwali")
        expect(isVariantProduct(product(5, "1/4oz Coin", quarter))).toBe(false)
        expect(isVariantProduct(product(6, "1oz US Eagle", oz))).toBe(false)
        expect(isVariantProduct(product(7, "20 g Gold Bar", 20, "BAR"))).toBe(false)
    })

    it("lists Regular first, then the variants at the same weight", () => {
        const regular = product(1, "20 g Gold Bar", 20, "BAR")
        const all = [product(3, "20 g Gold PAMP Bar", 20, "BAR"), product(2, "20 g Gold CombiBar", 20, "BAR"), regular, product(4, "50 g Gold Bar", 50, "BAR")]
        expect(variantChoices(regular, all).map((c) => [c.label, c.product.id])).toEqual([["Regular", 1], ["CombiBar", 2], ["PAMP", 3]])
        // asking from a variant gives the same list
        expect(variantChoices(all[0], all).map((c) => c.label)).toEqual(["Regular", "CombiBar", "PAMP"])
    })

    it("offers nothing for a product without variants", () => {
        const bar = product(1, "10 g Gold Bar", 10, "BAR")
        expect(variantChoices(bar, [bar, product(2, "20 g Gold PAMP Bar", 20, "BAR")])).toEqual([])
        const maple = product(3, "1oz Maple Leaf", oz)
        expect(variantChoices(maple, [maple, product(4, "1oz US Eagle", oz)])).toEqual([])
    })

    it("pairs a small coin with its US Eagle", () => {
        const generic = product(9, "1/2oz Coin", oz / 2)
        const us = product(7, "1/2oz US Eagle", oz / 2)
        expect(variantChoices(generic, [generic, us]).map((c) => c.label)).toEqual(["Regular", "US"])
    })
})
