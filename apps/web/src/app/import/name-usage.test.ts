import { describe, expect, it } from "vitest"
import { seenInText } from "./name-usage"

describe("seenInText", () => {
    it("lists sales and purchases per metal, then Zoho and the customer safe", () => {
        expect(
            seenInText([
                { source: "SALES", metal: "GOLD", count: 153 },
                { source: "SALES", metal: "SILVER", count: 63 },
                { source: "PURCHASES", metal: "GOLD", count: 74 },
                { source: "ZOHO", metal: null, count: 4 },
                { source: "CUSTOMER_SAFE", metal: "GOLD", count: 2 },
            ]),
        ).toBe("gold sales 153 · silver sales 63 · gold purchases 74 · Zoho invoices 4 · customer safe 2")
    })
    it("is empty for a name seen nowhere", () => {
        expect(seenInText([])).toBe("")
    })
})
