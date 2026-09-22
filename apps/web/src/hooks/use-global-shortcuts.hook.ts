import * as React from "react"

interface GlobalShortcutsOptions {
    onToggleTools: () => void
    onToggleChart: () => void
    onToggleAdminPanel?: () => void
}

const SEARCH_INPUT_ID = "product-search-input"

function isTypingTarget(target: EventTarget | null): target is HTMLElement {
    if (!(target instanceof HTMLElement)) return false
    return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
}

function isDialogOpen(): boolean {
    return document.querySelector('[role="dialog"]') !== null
}

/**
 * Page-chrome shortcuts: "/" to focus search, single letters to toggle the
 * tools panel / chart / admin panel. Row navigation (arrow keys) lives
 * separately in use-row-navigation.hook.ts since it needs the table's live
 * row model — this hook only knows about page-level layout toggles.
 *
 * Single letters (no modifier) are used rather than Ctrl/Cmd combos so they
 * don't fight the browser's own shortcuts — guarded to never fire while
 * typing in a field or while a dialog is open.
 */
export function useGlobalShortcuts({ onToggleTools, onToggleChart, onToggleAdminPanel }: GlobalShortcutsOptions) {
    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.ctrlKey || event.metaKey || event.altKey) return
            if (isTypingTarget(event.target) || isDialogOpen()) return

            if (event.key === "/") {
                event.preventDefault()
                document.getElementById(SEARCH_INPUT_ID)?.focus()
                return
            }

            switch (event.key.toLowerCase()) {
                case "t":
                    onToggleTools()
                    break
                case "g":
                    onToggleChart()
                    break
                case "a":
                    onToggleAdminPanel?.()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onToggleTools, onToggleChart, onToggleAdminPanel])
}
