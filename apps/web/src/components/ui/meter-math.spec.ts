import { describe, expect, it } from "vitest"
import { meterPercent, segmentWidths } from "./meter-math"

describe("meterPercent", () => {
    it("gives the share of max as a percent", () => {
        expect(meterPercent(25, 100)).toBe(25)
        expect(meterPercent(1, 8)).toBe(12.5)
    })

    it("keeps the result between 0 and 100", () => {
        expect(meterPercent(150, 100)).toBe(100)
        expect(meterPercent(-5, 100)).toBe(0)
    })

    it("gives 0 when max is zero, negative or not a number, or the value is not a number", () => {
        expect(meterPercent(5, 0)).toBe(0)
        expect(meterPercent(5, -10)).toBe(0)
        expect(meterPercent(5, Number.NaN)).toBe(0)
        expect(meterPercent(Number.NaN, 10)).toBe(0)
    })
})

describe("segmentWidths", () => {
    it("sizes each segment against max", () => {
        expect(segmentWidths([{ value: 20 }, { value: 30 }], 100)).toEqual([20, 30])
    })

    it("never lets the segments together pass the full bar", () => {
        const widths = segmentWidths([{ value: 70 }, { value: 50 }, { value: 10 }], 100)
        expect(widths).toEqual([70, 30, 0])
        expect(widths.reduce((a, b) => a + b, 0)).toBe(100)
    })

    it("returns nothing for no segments", () => {
        expect(segmentWidths([], 100)).toEqual([])
    })
})
