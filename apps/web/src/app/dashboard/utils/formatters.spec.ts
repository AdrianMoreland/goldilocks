import { describe, expect, it } from "vitest"
import { formatEuro, formatGrams, formatPercent, formatPrice, formatSpot } from "./formatters"

describe("formatPrice (quoted prices, whole euros)", () => {
    it("shows euros with a thousands separator and no cents", () => {
        expect(formatPrice(2100)).toBe("€2,100")
    })

    it("rounds a value that is not a quoted price yet to the nearest euro", () => {
        expect(formatPrice(2099.6)).toBe("€2,100")
        expect(formatPrice(2099.4)).toBe("€2,099")
    })

    it("shows a dash instead of NaN or a missing value", () => {
        expect(formatPrice(null)).toBe("-")
        expect(formatPrice(undefined)).toBe("-")
        expect(formatPrice(Number.NaN)).toBe("-")
        expect(formatPrice(Number.POSITIVE_INFINITY)).toBe("-")
    })
})

describe("formatEuro (precise figures)", () => {
    it("keeps the cents", () => {
        expect(formatEuro(1234.5)).toBe("€1,234.50")
        expect(formatEuro(0.07)).toBe("€0.07")
    })

    it("shows a dash for a missing value", () => {
        expect(formatEuro(undefined)).toBe("-")
    })
})

describe("formatSpot", () => {
    it("keeps cents for silver, which trades at tens of euros an ounce", () => {
        expect(formatSpot("SILVER", 31.256)).toBe("€31.26")
    })

    it("uses whole euros for gold", () => {
        expect(formatSpot("GOLD", 3012.4)).toBe("€3,012")
    })
})

describe("formatGrams and formatPercent", () => {
    it("shows one decimal for grams", () => {
        expect(formatGrams(31.1034768)).toBe("31.1 g")
    })

    it("shows an already-scaled percentage to two decimals", () => {
        expect(formatPercent(23)).toBe("23.00%")
        expect(formatPercent(0.5)).toBe("0.50%")
    })

    it("shows a dash for a missing value", () => {
        expect(formatGrams(null)).toBe("-")
        expect(formatPercent(undefined)).toBe("-")
    })
})
