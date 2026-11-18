import { describe, expect, it } from "vitest"
import { readStockSheet } from "./stock-sheet"

const sheets = {
    "GOLD - Bars Stock Serials": [
        ["Branch", "SOLD", "Weight", "Refinery", "Serial", "Details", "Gram", "Current Value", null, "Product Weight", "Refinery", "Stock DU"],
        ["DU", false, "100g Bar", "Metalor", "046156", null, 100, 1, null, "100g Bar", "Heraeus", 1],
        ["CO", true, "1oz Bar", "Valcambi Suisse", "AA1", "x", null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, "10g Bar", "Metalor", 4],
    ],
    "GOLD - Coins Stock": [
        ["Gram", "Checked", "Checked 2", "Weight", "DU", "Current Weight", "Current Value", "Details", "CO", "Details Cork", "BL", "Details Blanchardstown"],
        [31.1, true, false, "1oz Krugerrand", 31, 964, null, null, 7, "(damaged)", null, null],
        [31.1, true, false, "", 5, 1, null, null, null, null, null, null],
    ],
    "SILVER - Coins Stock": [
        ["SILVER", "Weight", "DU", "Details Dublin", "CO", "Details Cork"],
        [31.1, "1oz Maple", 51, "red box", "[object Object]", null],
    ],
    Melt: [["a"]],
}

describe("readStockSheet", () => {
    const r = readStockSheet(sheets)
    it("reads bars from the table, not the side pivot, and flags sold", () => {
        expect(r.bars).toHaveLength(2)
        expect(r.bars[0]).toMatchObject({ metal: "GOLD", branch: "DU", weight: "100g Bar", refinery: "Metalor", serial: "046156", grams: 100, sold: false })
        expect(r.bars[1]?.sold).toBe(true)
    })
    it("reads coin counts and the details beside each branch", () => {
        expect(r.coins).toHaveLength(2)
        const k = r.coins[0]
        expect(k?.counts).toEqual({ DU: 31, CO: 7, BL: null })
        expect(k?.details.CO).toBe("(damaged)")
        expect(r.coins[1]?.details.DU).toBe("red box")
        expect(r.coins[1]?.counts.CO).toBeNull()
    })
    it("lists tabs it did not read", () => {
        expect(r.skippedTabs).toEqual(["Melt"])
    })
})
