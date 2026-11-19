import { describe, expect, it } from "vitest"
import { applyPriceScope } from "./clipboard-table"

const visible = ["name", "weight", "priceSell", "spreadSell", "priceBuy", "spreadBuy"] as const

describe("applyPriceScope", () => {
    it("keeps only the Price side", () => {
        expect(applyPriceScope([...visible], { price: true, buyback: false })).toEqual(["name", "weight", "priceSell", "spreadSell"])
    })
    it("keeps only the Buyback side", () => {
        expect(applyPriceScope([...visible], { price: false, buyback: true })).toEqual(["name", "weight", "priceBuy", "spreadBuy"])
    })
    it("shows both, Price first, even when the table hid a side", () => {
        expect(applyPriceScope(["name", "priceBuy", "spreadBuy"], { price: true, buyback: true })).toEqual([
            "name", "priceSell", "spreadSell", "priceBuy", "spreadBuy",
        ])
    })
})
