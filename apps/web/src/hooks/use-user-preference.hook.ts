import { useAuth } from "@/contexts/auth-context"
import { useLocalStorageState } from "@/hooks/use-local-storage-state.hook"

/**
 * A dashboard view setting (chart range, panel visibility, selected metal…)
 * remembered per user on this browser — keyed by user id so two staff
 * accounts sharing a counter PC keep their own layout.
 */
export function useUserPreference<T>(name: string, defaultValue: T) {
    const { user } = useAuth()
    return useLocalStorageState<T>(`dashboard:${user?.id ?? "anon"}:${name}`, defaultValue)
}

/** Like useUserPreference, but forgotten when the tab closes — for working state (a spot override mid-quote) that shouldn't outlive the session. */
export function useUserSessionState<T>(name: string, defaultValue: T) {
    const { user } = useAuth()
    return useLocalStorageState<T>(`dashboard:${user?.id ?? "anon"}:${name}`, defaultValue, "session")
}
