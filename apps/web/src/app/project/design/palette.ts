/** Colour helpers and the light / dark specimen palettes, built from DESIGN.md's own tokens. */

export type Mode = "light" | "dark"

/** WCAG relative luminance of a `#rrggbb` colour. */
export function luminance(hex: string): number {
    const n = parseInt(hex.replace("#", ""), 16)
    const channel = (v: number) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}

/** Contrast ratio between two `#rrggbb` colours, e.g. 4.5 for the AA text threshold. */
export function contrast(a: string, b: string): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
    return (hi + 0.05) / (lo + 0.05)
}

/** Readable ink on a given fill: near-black, or white when the fill is dark. */
export const inkOn = (fill: string) => (luminance(fill) > 0.3 ? "#18181b" : "#fafafa")

export interface Palette {
    bg: string
    fg: string
    card: string
    cardRaised: string
    muted: string
    mutedFg: string
    border: string
    ink: string
    primary: string
    primaryText: string
    price: string
    priceText: string
    buyback: string
    buybackText: string
    destructive: string
}

/**
 * The values the "Colors" section of DESIGN.md assigns per mode: background and cards white or zinc-950, muted
 * surfaces zinc-100 or zinc-800, borders zinc-200 or zinc-800, and the accent text tones that are darker in
 * light mode only. Fills come straight from the front-matter tokens.
 */
export function buildPalette(mode: Mode, c: Record<string, string>): Palette {
    const light = mode === "light"
    return {
        bg: light ? c["zinc-white"]! : c["zinc-950"]!,
        fg: light ? c["ink-black"]! : c["zinc-50"]!,
        card: light ? c["zinc-white"]! : c["zinc-950"]!,
        cardRaised: light ? "#fafafa" : "#171717",
        muted: light ? c["zinc-100"]! : c["zinc-800"]!,
        mutedFg: light ? c["zinc-500"]! : c["zinc-400"]!,
        border: light ? c["zinc-200"]! : c["zinc-800"]!,
        ink: c["zinc-900"]!,
        primary: c["merrion-gold"]!,
        primaryText: light ? c["merrion-gold-text"]! : c["merrion-gold"]!,
        price: c["price-teal"]!,
        priceText: light ? c["price-teal-text"]! : c["price-teal"]!,
        buyback: c["buyback-raspberry"]!,
        buybackText: light ? c["buyback-raspberry-text"]! : c["buyback-raspberry"]!,
        destructive: light ? c["signal-red"]! : c["night-red"]!,
    }
}

/** Soft tint of a colour on the mode's surface, the `color-mix()` recipe DESIGN.md prescribes for every derived tint. */
export const tint = (color: string, percent: number, onto: string) => `color-mix(in oklab, ${color} ${percent}%, ${onto})`
