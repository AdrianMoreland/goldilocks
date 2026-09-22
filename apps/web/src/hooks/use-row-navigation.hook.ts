import * as React from "react"
import type { Row } from "@tanstack/react-table"

function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
}

/**
 * Arrow-key navigation over the table's currently visible rows (already
 * sorted/filtered) — Up/Down moves a keyboard-only focus highlight, Enter
 * or Space toggles that row's selection checkbox. Scoped to this table
 * (not the page-wide shortcuts in use-global-shortcuts.hook.ts) since it
 * needs the live row model to know what "next row" even means.
 */
export function useRowNavigation<TData>(rows: Row<TData>[]) {
    const [focusedRowId, setFocusedRowId] = React.useState<string | null>(null)

    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (isTypingTarget(event.target) || rows.length === 0) return

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault()
                const delta = event.key === "ArrowDown" ? 1 : -1
                const currentIndex = rows.findIndex((row) => row.id === focusedRowId)
                const nextIndex =
                    currentIndex === -1
                        ? event.key === "ArrowDown" ? 0 : rows.length - 1
                        : Math.min(rows.length - 1, Math.max(0, currentIndex + delta))
                setFocusedRowId(rows[nextIndex].id)
                return
            }

            if (event.key === "Enter" || event.key === " ") {
                const row = rows.find((r) => r.id === focusedRowId)
                if (row?.getCanSelect()) {
                    event.preventDefault()
                    row.toggleSelected()
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [rows, focusedRowId])

    // A filter/search/sort change can make the focused row disappear from
    // the current row model — drop the stale focus rather than pointing at
    // a row that's no longer shown.
    React.useEffect(() => {
        if (focusedRowId && !rows.some((row) => row.id === focusedRowId)) {
            setFocusedRowId(null)
        }
    }, [rows, focusedRowId])

    return { focusedRowId }
}
