/**
 * Per-user persistence for everything the theme editor controls. Keyed by
 * user id so two staff accounts on the same browser don't clobber each
 * other's pick. Signed-out screens (the sign-in page) always get the default.
 */
import type { ImportedTheme } from "@/types/theme-customizer"

const STORAGE_PREFIX = "goldilocks:theme-preference:"

/** The app's own default theme preset. */
export const DEFAULT_TWEAKCN_THEME = "merrion-gold"

export type ThemeSource = "shadcn" | "tweakcn" | "imported"
export type Density = "compact" | "default" | "comfortable"
export type ShadowStrength = "none" | "subtle" | "default"

export interface FontOption {
    value: string
    label: string
    /** CSS font-family stack. */
    stack: string
    /** Google Fonts css2 family spec, or null for a system font that needs no download. */
    googleFamily: string | null
}

// Each of these has tabular figures, which every price column relies on.
export const FONT_OPTIONS: FontOption[] = [
    { value: "inter", label: "Inter", stack: "'Inter', system-ui, sans-serif", googleFamily: "Inter:wght@400;500;600;700;800" },
    { value: "geist", label: "Geist", stack: "'Geist', system-ui, sans-serif", googleFamily: "Geist:wght@400;500;600;700;800" },
    { value: "ibm-plex-sans", label: "IBM Plex Sans", stack: "'IBM Plex Sans', system-ui, sans-serif", googleFamily: "IBM+Plex+Sans:wght@400;500;600;700" },
    { value: "manrope", label: "Manrope", stack: "'Manrope', system-ui, sans-serif", googleFamily: "Manrope:wght@400;500;600;700;800" },
    { value: "system", label: "System font", stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", googleFamily: null },
]

export const DENSITY_FACTOR: Record<Density, number> = { compact: 0.85, default: 1, comfortable: 1.2 }

export interface ThemePreference {
    source: ThemeSource
    /** Preset key for shadcn/tweakcn; unused for imported. */
    value: string
    imported: ImportedTheme | null
    radius: string
    /** Per-mode colour edits, keyed by CSS variable ("--primary"). Applied on top of the preset. */
    colorOverrides: { light: Record<string, string>; dark: Record<string, string> }
    font: string
    /** Root font-size multiplier — everything sized in rem scales with it. */
    fontScale: number
    density: Density
    /** In em, applied to the whole document. */
    letterSpacing: number
    shadows: ShadowStrength
}

export const DEFAULT_THEME_PREFERENCE: ThemePreference = {
    source: "tweakcn",
    value: DEFAULT_TWEAKCN_THEME,
    imported: null,
    radius: "0.5rem",
    colorOverrides: { light: {}, dark: {} },
    font: "inter",
    fontScale: 1,
    density: "default",
    letterSpacing: 0,
    shadows: "default",
}

function storageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId}`
}

/** Merges whatever was stored (including the older {kind, value, radius} shape) over the defaults, dropping anything malformed. */
function normalize(raw: unknown): ThemePreference | null {
    if (!raw || typeof raw !== "object") return null
    const r = raw as Record<string, unknown>
    const source = (r.source ?? r.kind) as ThemeSource | undefined
    const pref: ThemePreference = { ...DEFAULT_THEME_PREFERENCE, colorOverrides: { light: {}, dark: {} } }

    if (source === "shadcn" || source === "tweakcn" || source === "imported") pref.source = source
    if (typeof r.value === "string") pref.value = r.value
    if (r.imported && typeof r.imported === "object") pref.imported = r.imported as ImportedTheme
    if (pref.source === "imported" && !pref.imported) {
        pref.source = DEFAULT_THEME_PREFERENCE.source
        pref.value = DEFAULT_THEME_PREFERENCE.value
    }
    if (typeof r.radius === "string") pref.radius = r.radius
    const overrides = r.colorOverrides as ThemePreference["colorOverrides"] | undefined
    if (overrides && typeof overrides === "object") {
        pref.colorOverrides = { light: { ...(overrides.light ?? {}) }, dark: { ...(overrides.dark ?? {}) } }
    }
    if (typeof r.font === "string" && FONT_OPTIONS.some((f) => f.value === r.font)) pref.font = r.font
    if (typeof r.fontScale === "number" && r.fontScale >= 0.8 && r.fontScale <= 1.3) pref.fontScale = r.fontScale
    if (r.density === "compact" || r.density === "default" || r.density === "comfortable") pref.density = r.density
    if (typeof r.letterSpacing === "number" && Math.abs(r.letterSpacing) <= 0.1) pref.letterSpacing = r.letterSpacing
    if (r.shadows === "none" || r.shadows === "subtle" || r.shadows === "default") pref.shadows = r.shadows
    return pref
}

export function loadThemePreference(userId: string): ThemePreference | null {
    try {
        const raw = localStorage.getItem(storageKey(userId))
        return raw ? normalize(JSON.parse(raw)) : null
    } catch {
        return null
    }
}

export function saveThemePreference(userId: string, preference: ThemePreference): void {
    try {
        localStorage.setItem(storageKey(userId), JSON.stringify(preference))
    } catch {
        // Best-effort — a private-browsing quota error shouldn't break theming.
    }
}
