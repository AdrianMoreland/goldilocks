import { describe, expect, it } from "vitest"
import { DEFAULT_THEME_PREFERENCE, initialLook, themePreferenceFrom } from "./theme-preference"

describe("initialLook", () => {
    const local = { ...DEFAULT_THEME_PREFERENCE, font: "geist", density: "compact" as const }

    it("uses the account's look and mode when the person saved one, over this browser's", () => {
        const r = initialLook({ mode: "light", look: { font: "manrope", fontScale: 1.1 } }, local, "dark")
        expect(r.mode).toBe("light")
        expect(r.preference.font).toBe("manrope")
        expect(r.preference.fontScale).toBe(1.1)
    })

    it("keeps this browser's earlier choice when the account has none yet", () => {
        expect(initialLook(null, local, "light")).toEqual({ preference: local, mode: "light" })
    })

    it("is dark with the default theme for someone who never chose, even when the browser follows the system", () => {
        expect(initialLook(null, null, null)).toEqual({ preference: DEFAULT_THEME_PREFERENCE, mode: "dark" })
        expect(initialLook(null, null, "system").mode).toBe("dark")
    })

    it("falls back to the default theme when the saved look is unusable", () => {
        expect(initialLook({ mode: "dark", look: null }, local, "light")).toEqual({ preference: DEFAULT_THEME_PREFERENCE, mode: "dark" })
    })
})

describe("themePreferenceFrom", () => {
    it("drops out-of-range values and keeps valid ones", () => {
        const p = themePreferenceFrom({ font: "comic-sans", fontScale: 5, density: "comfortable" })
        expect(p?.font).toBe(DEFAULT_THEME_PREFERENCE.font)
        expect(p?.fontScale).toBe(1)
        expect(p?.density).toBe("comfortable")
    })
})
