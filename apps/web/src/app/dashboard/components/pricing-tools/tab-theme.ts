import type { CSSProperties } from "react"

/**
 * Per-tab accent palettes lifted from the Apps Script tool's own design
 * system (`.theme-buy`/`.theme-sell`/etc. in its stylesheet) — each pricing
 * tool tab gets its own accent instead of one flat app-wide color, exactly
 * like the original. Applied via CSS custom properties on a wrapper div so
 * plain Tailwind arbitrary-value utilities (`bg-(--tab-accent)`, etc.) can
 * reference them without hardcoding a color per component.
 */
export type TabThemeName = "buy" | "sell" | "invest" | "tax" | "calc" | "settings"

interface TabPalette {
    accent: string
    accentSoft: string
    accentText: string
    accentTextSoft: string
}

const TAB_PALETTES: Record<TabThemeName, TabPalette> = {
    buy: { accent: "#17B26A", accentSoft: "#E3FBEF", accentText: "#0B5A38", accentTextSoft: "#1D9A5D" },
    sell: { accent: "#F2478B", accentSoft: "#FFEAF2", accentText: "#93123F", accentTextSoft: "#E24C86" },
    invest: { accent: "#FFA23E", accentSoft: "#FFF1DF", accentText: "#7A3D00", accentTextSoft: "#C9711A" },
    tax: { accent: "#FF4D5E", accentSoft: "#FFE9EB", accentText: "#7A0E20", accentTextSoft: "#D63A4C" },
    calc: { accent: "#17A2A2", accentSoft: "#E4F6F6", accentText: "#0B4F4F", accentTextSoft: "#128686" },
    settings: { accent: "#5B6472", accentSoft: "#EEF1F4", accentText: "#2B323B", accentTextSoft: "#4B5563" },
}

export function tabThemeStyle(theme: TabThemeName): CSSProperties {
    const palette = TAB_PALETTES[theme]
    return {
        "--tab-accent": palette.accent,
        "--tab-accent-soft": palette.accentSoft,
        "--tab-accent-text": palette.accentText,
        "--tab-accent-text-soft": palette.accentTextSoft,
    } as CSSProperties
}

/**
 * Per-metal accent palette (not from the Apps Script tool — it has no
 * equivalent) used only by the Product tab, whose subject is "which metal /
 * which item" rather than a workflow direction like Buy/Sell. Colors evoke
 * the metal itself: warm gold, cool silver, blue-steel platinum, slate-violet
 * palladium.
 */
const METAL_PALETTES: Record<"GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM", TabPalette> = {
    GOLD: { accent: "#D4A017", accentSoft: "#FBF3DA", accentText: "#7A5B0B", accentTextSoft: "#A9800F" },
    SILVER: { accent: "#8B95A1", accentSoft: "#F1F3F5", accentText: "#454C54", accentTextSoft: "#69727C" },
    PLATINUM: { accent: "#4C8EA3", accentSoft: "#E6F2F6", accentText: "#204552", accentTextSoft: "#336E80" },
    PALLADIUM: { accent: "#8073B8", accentSoft: "#F0EDF9", accentText: "#3E3670", accentTextSoft: "#5F5390" },
}

export function metalThemeStyle(metal: keyof typeof METAL_PALETTES): CSSProperties {
    const palette = METAL_PALETTES[metal]
    return {
        "--tab-accent": palette.accent,
        "--tab-accent-soft": palette.accentSoft,
        "--tab-accent-text": palette.accentText,
        "--tab-accent-text-soft": palette.accentTextSoft,
    } as CSSProperties
}
