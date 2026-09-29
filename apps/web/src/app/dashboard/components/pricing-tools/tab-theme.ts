import type { CSSProperties } from "react"

/**
 * Per-tab accents — each pricing tool tab gets its own accent instead of one
 * flat app-wide color (originally inspired by the Apps Script tool's
 * `.theme-buy`/`.theme-sell`/etc.). Applied via CSS custom properties on a
 * wrapper div so plain Tailwind arbitrary-value utilities (`text-[var(--tab-accent)]`,
 * etc.) can reference them without hardcoding a color per component.
 *
 * Derived from the *active* theme's own tokens via color-mix(), so switching
 * brand theme or between light/dark carries through to every tab instead of
 * leaving them stuck on one hardcoded palette.
 */
export type TabThemeName = "price" | "buyback" | "invest" | "calc" | "settings"

// The one theme token each tab's accent is built from — every other value
// (soft background tint, two text strengths, text-on-fill) is derived from
// it. Price and Buyback use the dedicated --price/--buyback tokens rather
// than primary/secondary, so the two sides of a trade keep the same colour
// as their table columns in every theme (DESIGN.md: The Direction Is Colour
// Rule).
const TAB_BASE_VAR: Record<TabThemeName, string> = {
    price: "var(--price)",
    buyback: "var(--buyback)",
    invest: "var(--primary)",
    calc: "var(--accent)",
    settings: "var(--muted-foreground)",
}

// Tabs whose accent has a theme-defined text tone (a darker shade in light
// mode, where the fill itself is too light to read as text on white). Other
// tabs derive their text colour by mixing the fill toward the foreground.
const TAB_TEXT_VAR: Partial<Record<TabThemeName, string>> = {
    price: "var(--price-text)",
    buyback: "var(--buyback-text)",
    invest: "var(--primary-text)",
}

function accentStyleFrom(base: string, text?: string): CSSProperties {
    return {
        "--tab-accent": base,
        "--tab-accent-soft": `color-mix(in srgb, ${base} 16%, var(--background))`,
        "--tab-accent-text": text ?? `color-mix(in srgb, ${base} 70%, var(--foreground))`,
        "--tab-accent-text-soft": `color-mix(in srgb, ${text ?? base} ${text ? 80 : 45}%, var(--foreground))`,
        // Text on a solid accent fill: near-black ink on light accents (the
        // teal and gold both sit above L 0.6), near-white on dark ones. White
        // on the Merrion teal/gold was ~2.6:1 / ~1.7:1 — well under AA.
        "--tab-accent-on": `oklch(from ${base} clamp(0.2, (0.62 - l) * 100, 0.99) 0.02 h)`,
    } as CSSProperties
}

export function tabThemeStyle(theme: TabThemeName): CSSProperties {
    return accentStyleFrom(TAB_BASE_VAR[theme], TAB_TEXT_VAR[theme])
}

/**
 * Per-metal accent (not from the Apps Script tool — it has no equivalent) —
 * used by the metal spot-price cards and the price chart, whose subject is
 * "which metal" rather than a workflow direction like Price/Buyback. Colors
 * evoke the metal itself: warm gold, cool silver, blue-steel platinum,
 * slate-violet palladium.
 */
export type MetalAccentName = "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM"

export const METAL_ACCENT: Record<MetalAccentName, string> = {
    GOLD: "#D4A017",
    SILVER: "#8B95A1",
    PLATINUM: "#4C8EA3",
    PALLADIUM: "#8073B8",
}

export function metalAccentStyle(metal: MetalAccentName): CSSProperties {
    return accentStyleFrom(METAL_ACCENT[metal])
}
