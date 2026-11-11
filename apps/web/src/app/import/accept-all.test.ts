import { describe, expect, it } from "vitest"
import type { AliasRow } from "@goldilocks/shared-types"
import { expectedOf, planAcceptAll } from "./accept-all"

const row = (over: Partial<AliasRow>): AliasRow => ({
    id: 1,
    alias: "x",
    uses: 1,
    refinery: null,
    sources: null,
    confidence: "LIKELY",
    reason: null,
    question: null,
    catalogueGap: false,
    decidedBy: null,
    suggestion: { kind: "PRICING", id: 10, name: "1oz Krugerrand" },
    settledTo: null,
    ...over,
})

describe("expectedOf", () => {
    it("names exactly one target", () => {
        expect(expectedOf({ kind: "PRICING", id: 10, name: "a" })).toEqual({ productId: 10 })
        expect(expectedOf({ kind: "SPECIFIC", id: 7, name: "a" })).toEqual({ salesProductId: 7 })
        expect(expectedOf({ kind: "NOT_A_PRODUCT", id: null, name: "a" })).toEqual({ noProduct: true })
    })
})

describe("planAcceptAll", () => {
    it("sends the suggestion each name was shown with, and leaves out not-a-product suggestions", () => {
        const plan = planAcceptAll([
            row({ id: 1 }),
            row({ id: 2, suggestion: { kind: "SPECIFIC", id: 7, name: "s" }, catalogueGap: true }),
            row({ id: 3, suggestion: { kind: "NOT_A_PRODUCT", id: null, name: "Not a product" } }),
            row({ id: 4, confidence: "UNCLEAR", suggestion: null }),
            row({ id: 5, decidedBy: "RULE" }),
        ])
        expect(plan.items).toEqual([
            { id: 1, expected: { productId: 10 } },
            { id: 2, expected: { salesProductId: 7 } },
        ])
        expect(plan.catalogueGaps).toBe(1)
        expect(plan.notProducts).toBe(1)
    })
})
