import * as React from "react"
import { useAuthApi } from "@/api/auth.api"
import { capabilitiesFor, type Capabilities, type SessionUser } from "@goldilocks/shared-types"
import { SESSION_EXPIRED_EVENT, tokenStore, viewAsStore } from "@/lib/session"

interface AuthContextValue {
    user: SessionUser | null
    isAuthenticated: boolean
    isAdmin: boolean
    /** Admin flag or the MANAGER role: the people who may run the month-end stocktake. UX only; the API checks it too. */
    isManager: boolean
    /** What this person's branch allows. UX only — the API refuses the same things on its own. */
    capabilities: Capabilities
    /** True only while restoring a session from a stored token on first load. */
    isLoading: boolean
    /** A real admin, even while viewing the app as someone else: the only people offered the "view as" switcher. */
    canViewAs: boolean
    /** The "view as" choice in force (a VIEW_AS_OPTIONS value), or null when seeing the app as themselves. */
    viewAs: string | null
    /** Switch the view (null returns to the admin's own). Reloads the page so every screen starts clean. */
    setViewAs: (value: string | null) => void
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

/**
 * App-wide session state. This is the ONLY place in the frontend that knows
 * about auth — it talks to our own backend's /auth/login + /auth/me, never
 * to Supabase (or whatever provider is behind it) directly, so the actual
 * identity provider can change without touching a single component that
 * calls useAuth().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const api = useAuthApi()
    const [user, setUser] = React.useState<SessionUser | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        if (!tokenStore.getAccess()) {
            setIsLoading(false)
            return
        }

        api.me()
            .then(setUser)
            .catch(() => {
                // me() already tried to renew an expired token; reaching here means the session is gone.
                tokenStore.clear()
                setUser(null)
            })
            .finally(() => setIsLoading(false))
        // Runs once on mount only — restoring whatever session is already stored.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // The request layer fires this when the server rejects the refresh token (revoked or expired): sign out
    // so RequireAuth sends the user to the sign-in page instead of leaving them on failing screens.
    React.useEffect(() => {
        const onExpired = () => setUser(null)
        window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
    }, [])

    const login = React.useCallback(
        async (email: string, password: string) => {
            const result = await api.login({ email, password })
            tokenStore.set(result.accessToken, result.refreshToken)
            setUser(result.user)
        },
        [api],
    )

    const setViewAs = React.useCallback((value: string | null) => {
        viewAsStore.set(value)
        window.location.assign(import.meta.env.VITE_BASENAME || "/")
    }, [])

    const logout = React.useCallback(() => {
        tokenStore.clear()
        viewAsStore.set(null)
        setUser(null)
    }, [])

    const value = React.useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isAdmin: user?.admin === true,
            isManager: user?.admin === true || user?.role === 'MANAGER',
            capabilities: capabilitiesFor({ branchRegion: user?.branch?.region ?? null, admin: user?.admin === true }),
            isLoading,
            canViewAs: user?.canViewAs === true,
            viewAs: user?.viewAs ?? null,
            setViewAs,
            login,
            logout,
        }),
        [user, isLoading, login, logout, setViewAs],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = React.useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return ctx
}
