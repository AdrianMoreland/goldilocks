import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import type { ToastDeckStore } from "./devl/toast-deck"

/** What every section of the Rules hub shares: the toast deck for "Saved" / "Deleted" with undo. */
export interface HubContextValue {
  toasts: ToastDeckStore
  /** Marks the draft as changed, so the header offers to review and publish. */
  markChanged: (what: string) => void
}

export const HubContext = createContext<HubContextValue | null>(null)

export function useHub(): HubContextValue {
  const value = useContext(HubContext)
  if (!value) throw new Error("useHub must be used inside the Rules hub")
  return value
}

/**
 * A change handler for one section that ignores the calls some devl.dev components make while they mount (they report
 * their starting value once). Child effects run before the parent's, so anything before this effect is the mount.
 */
export function useEditHandler(what: string): () => void {
  const { markChanged } = useHub()
  const ready = useRef(false)
  useEffect(() => {
    ready.current = true
  }, [])
  return useCallback(() => {
    if (ready.current) markChanged(what)
  }, [markChanged, what])
}
