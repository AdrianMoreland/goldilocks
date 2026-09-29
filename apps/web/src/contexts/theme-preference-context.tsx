import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useThemeManager } from "@/hooks/use-theme-manager"
import { colorThemes, tweakcnThemes } from "@/config/theme-data"
import {
    DEFAULT_THEME_PREFERENCE,
    DENSITY_FACTOR,
    FONT_OPTIONS,
    loadThemePreference,
    saveThemePreference,
    type ThemePreference,
} from "@/lib/theme-preference"

interface ThemePreferenceContextValue {
    preference: ThemePreference
    isDarkMode: boolean
    /** Merge a change into the preference; it's applied and saved immediately. */
    update: (patch: Partial<ThemePreference>) => void
    /** Set (or clear, with null) one colour override for the current light/dark mode. */
    setColorOverride: (cssVar: string, value: string | null) => void
    /** Back to the app default (Merrion Gold, default typography and density). */
    resetAll: () => void
    /** Back to Merrion Gold colours and radius, keeping typography/density/shadows. */
    resetColors: () => void
    /** The active preset's value for a CSS variable in the current mode, before overrides. */
    presetValue: (cssVar: string) => string | undefined
}

const ThemePreferenceContext = React.createContext<ThemePreferenceContextValue | null>(null)

function presetStylesFor(pref: ThemePreference, dark: boolean): Record<string, string> {
    const mode = dark ? "dark" : "light"
    if (pref.source === "imported" && pref.imported) return pref.imported[mode] ?? {}
    const list = pref.source === "shadcn" ? colorThemes : tweakcnThemes
    return list.find((t) => t.value === pref.value)?.preset.styles[mode] ?? {}
}

const loadedFonts = new Set<string>()
function ensureFontLoaded(googleFamily: string | null) {
    if (!googleFamily || loadedFonts.has(googleFamily)) return
    loadedFonts.add(googleFamily)
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css2?family=${googleFamily}&display=swap`
    document.head.appendChild(link)
}

/**
 * Owns the signed-in user's theme preference and applies it to <html>.
 * Lives at the app root (not inside the theme editor) so the saved theme is
 * applied on every screen from first render — previously it only applied
 * once the Admin panel mounted, and the saved radius was never re-applied.
 */
export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const { isDarkMode, resetTheme, applyTheme, applyTweakcnTheme, applyImportedTheme } = useThemeManager()

    const [preference, setPreference] = React.useState<ThemePreference>(DEFAULT_THEME_PREFERENCE)
    const userId = user?.id ?? null

    // Load on sign-in / user switch; signed-out screens get the default.
    React.useEffect(() => {
        setPreference(userId ? loadThemePreference(userId) ?? DEFAULT_THEME_PREFERENCE : DEFAULT_THEME_PREFERENCE)
    }, [userId])

    // Apply whenever the preference or light/dark mode changes.
    React.useEffect(() => {
        const root = document.documentElement
        resetTheme()
        if (preference.source === "imported" && preference.imported) {
            applyImportedTheme(preference.imported, isDarkMode)
        } else if (preference.source === "shadcn") {
            applyTheme(preference.value, isDarkMode)
        } else {
            const preset = tweakcnThemes.find((t) => t.value === preference.value)?.preset
            if (preset) applyTweakcnTheme(preset, isDarkMode)
        }

        root.style.setProperty("--radius", preference.radius)

        for (const [cssVar, value] of Object.entries(preference.colorOverrides[isDarkMode ? "dark" : "light"])) {
            if (value) root.style.setProperty(cssVar, value)
        }

        const font = FONT_OPTIONS.find((f) => f.value === preference.font) ?? FONT_OPTIONS[0]
        ensureFontLoaded(font.googleFamily)
        root.style.setProperty("--font-inter", font.stack)

        root.style.fontSize = preference.fontScale === 1 ? "" : `${preference.fontScale * 100}%`

        const factor = DENSITY_FACTOR[preference.density]
        if (factor !== 1) {
            const base = presetStylesFor(preference, isDarkMode).spacing ?? "0.25rem"
            root.style.setProperty("--spacing", `calc(${base} * ${factor})`)
        }

        root.style.letterSpacing = preference.letterSpacing ? `${preference.letterSpacing}em` : ""
        root.dataset.shadows = preference.shadows
    }, [preference, isDarkMode, resetTheme, applyTheme, applyTweakcnTheme, applyImportedTheme])

    const commit = React.useCallback(
        (next: ThemePreference) => {
            setPreference(next)
            if (userId) saveThemePreference(userId, next)
        },
        [userId],
    )

    const value = React.useMemo<ThemePreferenceContextValue>(
        () => ({
            preference,
            isDarkMode,
            update: (patch) => commit({ ...preference, ...patch }),
            setColorOverride: (cssVar, color) => {
                const mode = isDarkMode ? "dark" : "light"
                const modeOverrides = { ...preference.colorOverrides[mode] }
                if (color) modeOverrides[cssVar] = color
                else delete modeOverrides[cssVar]
                commit({ ...preference, colorOverrides: { ...preference.colorOverrides, [mode]: modeOverrides } })
            },
            resetAll: () => commit({ ...DEFAULT_THEME_PREFERENCE, colorOverrides: { light: {}, dark: {} } }),
            resetColors: () =>
                commit({
                    ...preference,
                    source: DEFAULT_THEME_PREFERENCE.source,
                    value: DEFAULT_THEME_PREFERENCE.value,
                    imported: null,
                    radius: DEFAULT_THEME_PREFERENCE.radius,
                    colorOverrides: { light: {}, dark: {} },
                }),
            presetValue: (cssVar) => presetStylesFor(preference, isDarkMode)[cssVar.replace(/^--/, "")],
        }),
        [preference, isDarkMode, commit],
    )

    return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
}

export function useThemePreference() {
    const context = React.useContext(ThemePreferenceContext)
    if (!context) throw new Error("useThemePreference must be used within a ThemePreferenceProvider")
    return context
}
