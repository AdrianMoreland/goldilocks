import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

/** Wrap a route's element with this to require a logged-in session. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex h-svh items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-in" state={{ from: location }} replace />
    }

    return <>{children}</>
}

/** Like RequireAuth, but a signed-in non-admin is sent back to the dashboard. Discoverability only: the API rejects non-admins on its own. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
    const { isAdmin, isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-svh items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />
    if (!isAdmin) return <Navigate to="/dashboard" replace />

    return <>{children}</>
}
