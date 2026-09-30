import * as React from "react"

type StorageKind = "local" | "session"

function getStorage(kind: StorageKind): Storage {
    return kind === "session" ? sessionStorage : localStorage
}

/**
 * useState backed by localStorage (or sessionStorage, for state that should
 * die with the tab) — reads the stored value once on mount (or whenever `key`
 * changes, e.g. switching users) and writes back on every change. Wrapped in
 * try/catch: private-browsing mode and a full storage quota both throw on
 * read/write, and neither should ever break the table.
 */
export function useLocalStorageState<T>(
    key: string,
    initialValue: T,
    kind: StorageKind = "local",
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = React.useState<T>(() => readStorage(key, initialValue, kind))

    // Re-hydrate when the key itself changes (e.g. a different user logs
    // in) — a plain lazy useState initializer only runs once per mount.
    const lastKeyRef = React.useRef(key)
    if (lastKeyRef.current !== key) {
        lastKeyRef.current = key
        setState(readStorage(key, initialValue, kind))
    }

    React.useEffect(() => {
        try {
            getStorage(kind).setItem(key, JSON.stringify(state))
        } catch {
            // Ignore — private-browsing or quota errors aren't worth surfacing here.
        }
        // Only the value should trigger a write; `key` changes are handled
        // by the re-hydrate above, not by re-writing under the new key.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    return [state, setState]
}

function readStorage<T>(key: string, initialValue: T, kind: StorageKind): T {
    try {
        const stored = getStorage(kind).getItem(key)
        return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
        return initialValue
    }
}
