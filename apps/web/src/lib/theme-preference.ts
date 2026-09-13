/**
 * Per-user persistence for the theme customizer's selection. Keyed by user id
 * so two staff accounts on the same browser don't clobber each other's pick.
 */

const STORAGE_PREFIX = "goldilocks:theme-preference:"

/** The app's own default theme (a copy of "Northern Lights") — applied on a
 * fresh login with no saved preference, and by the customizer's reset button. */
export const DEFAULT_TWEAKCN_THEME = "merrion-gold"

export interface ThemePreference {
    kind: "shadcn" | "tweakcn"
    value: string
    radius: string
}

export const DEFAULT_THEME_PREFERENCE: ThemePreference = {
    kind: "tweakcn",
    value: DEFAULT_TWEAKCN_THEME,
    radius: "0.5rem",
}

function storageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId}`
}

export function loadThemePreference(userId: string): ThemePreference | null {
    try {
        const raw = localStorage.getItem(storageKey(userId))
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (
            (parsed.kind === "shadcn" || parsed.kind === "tweakcn") &&
            typeof parsed.value === "string" &&
            typeof parsed.radius === "string"
        ) {
            return parsed as ThemePreference
        }
        return null
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
