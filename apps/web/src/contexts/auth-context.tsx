import * as React from "react"
import { useAuthApi } from "@/api/auth.api"
import type { SessionUser } from "@goldilocks/shared-types"

const TOKEN_STORAGE_KEY = "token"

interface AuthContextValue {
    user: SessionUser | null
    isAuthenticated: boolean
    isAdmin: boolean
    /** True only while restoring a session from a stored token on first load. */
    isLoading: boolean
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
        const token = localStorage.getItem(TOKEN_STORAGE_KEY)
        if (!token) {
            setIsLoading(false)
            return
        }

        api.me()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem(TOKEN_STORAGE_KEY)
                setUser(null)
            })
            .finally(() => setIsLoading(false))
        // Runs once on mount only — restoring whatever session is already stored.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const login = React.useCallback(
        async (email: string, password: string) => {
            const result = await api.login({ email, password })
            localStorage.setItem(TOKEN_STORAGE_KEY, result.accessToken)
            setUser(result.user)
        },
        [api],
    )

    const logout = React.useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setUser(null)
    }, [])

    const value = React.useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isAdmin: user?.admin === true,
            isLoading,
            login,
            logout,
        }),
        [user, isLoading, login, logout],
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
