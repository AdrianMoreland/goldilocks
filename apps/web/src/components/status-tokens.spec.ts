import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const css = readFileSync(fileURLToPath(new URL("../index.css", import.meta.url)), "utf8")
const tones = ["ok", "warn", "stale", "bad", "info"]

describe("status colour tokens", () => {
    // StatusDot uses bg-status-*; without both lines the class would render no colour.
    it.each(tones)("defines %s as a value and maps it to a Tailwind colour", (tone) => {
        expect(css).toMatch(new RegExp(`--status-${tone}:\\s*oklch\\(`))
        expect(css).toContain(`--color-status-${tone}: var(--status-${tone});`)
    })
})

describe("movement and metal text tokens", () => {
  // Components read text-up, text-down and text-mt-*; without both lines the class would render no colour.
  it.each(["up", "down", "mt-gold", "mt-silver", "mt-platinum", "mt-palladium"])("defines %s and maps it to a Tailwind colour", (token) => {
    expect(css).toMatch(new RegExp(`--${token}:\\s*#`))
    expect(css).toContain(`--color-${token}: var(--${token});`)
  })
})
