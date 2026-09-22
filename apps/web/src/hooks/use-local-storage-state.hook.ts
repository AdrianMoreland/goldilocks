import * as React from "react"

/**
 * useState backed by localStorage — reads the stored value once on mount
 * (or whenever `key` changes, e.g. switching users) and writes back on every
 * change. Wrapped in try/catch: private-browsing mode and a full storage
 * quota both throw on read/write, and neither should ever break the table.
 */
export function useLocalStorageState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = React.useState<T>(() => readStorage(key, initialValue))

    // Re-hydrate when the key itself changes (e.g. a different user logs
    // in) — a plain lazy useState initializer only runs once per mount.
    const lastKeyRef = React.useRef(key)
    if (lastKeyRef.current !== key) {
        lastKeyRef.current = key
        setState(readStorage(key, initialValue))
    }

    React.useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state))
        } catch {
            // Ignore — private-browsing or quota errors aren't worth surfacing here.
        }
        // Only the value should trigger a write; `key` changes are handled
        // by the re-hydrate above, not by re-writing under the new key.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    return [state, setState]
}

function readStorage<T>(key: string, initialValue: T): T {
    try {
        const stored = localStorage.getItem(key)
        return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
        return initialValue
    }
}
