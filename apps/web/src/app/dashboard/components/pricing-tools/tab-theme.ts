import type { CSSProperties } from "react"

/**
 * Per-tab accents — each pricing tool tab gets its own accent instead of one
 * flat app-wide color (originally inspired by the Apps Script tool's
 * `.theme-buy`/`.theme-sell`/etc.). Applied via CSS custom properties on a
 * wrapper div so plain Tailwind arbitrary-value utilities (`text-[var(--tab-accent)]`,
 * etc.) can reference them without hardcoding a color per component.
 *
 * Unlike the first version of this file, these are no longer fixed hex
 * values — they're derived from the *active* shadcn/tweakcn theme's own
 * tokens via color-mix(), so switching brand theme (e.g. to Merrion Gold)
 * or between light/dark automatically carries through to every tab instead
 * of leaving them stuck on one hardcoded palette that only ever matched
 * the original Apps Script mockup.
 */
export type TabThemeName = "buy" | "sell" | "invest" | "calc" | "settings"

// The one theme token each tab's accent is built from — every other value
// (soft background tint, two text strengths) is derived from this via
// color-mix(), so it stays in sync with the active theme automatically.
// Buy/Sell/Invest/Calc/Settings each get a distinct hue from the theme's own
// palette (green/rose/gold/teal/grey) rather than reusing destructive red for
// Sell — Sell is a normal business action, not an error state.
const TAB_BASE_VAR: Record<TabThemeName, string> = {
    buy: "var(--secondary)",
    sell: "var(--chart-4)",
    invest: "var(--primary)",
    calc: "var(--accent)",
    settings: "var(--muted-foreground)",
}

function accentStyleFrom(base: string): CSSProperties {
    return {
        "--tab-accent": base,
        "--tab-accent-soft": `color-mix(in srgb, ${base} 16%, var(--background))`,
        "--tab-accent-text": `color-mix(in srgb, ${base} 70%, var(--foreground))`,
        "--tab-accent-text-soft": `color-mix(in srgb, ${base} 45%, var(--foreground))`,
    } as CSSProperties
}

export function tabThemeStyle(theme: TabThemeName): CSSProperties {
    return accentStyleFrom(TAB_BASE_VAR[theme])
}

/**
 * Per-metal accent (not from the Apps Script tool — it has no equivalent) —
 * used by the metal spot-price cards, whose subject is "which metal" rather
 * than a workflow direction like Buy/Sell. Colors evoke the metal itself:
 * warm gold, cool silver, blue-steel platinum, slate-violet palladium. Run
 * through the same color-mix() derivation as the tab accents so the soft
 * tint/text strengths stay legible in both light and dark mode instead of
 * being fixed pastels tuned for one mode only.
 */
export type MetalAccentName = "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM"

const METAL_ACCENT: Record<MetalAccentName, string> = {
    GOLD: "#D4A017",
    SILVER: "#8B95A1",
    PLATINUM: "#4C8EA3",
    PALLADIUM: "#8073B8",
}

export function metalAccentStyle(metal: MetalAccentName): CSSProperties {
    return accentStyleFrom(METAL_ACCENT[metal])
}
