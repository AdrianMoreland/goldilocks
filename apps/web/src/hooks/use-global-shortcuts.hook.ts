import * as React from "react"
import type { MetalType } from "@/lib/types"

interface GlobalShortcutsOptions {
    onToggleTools: () => void
    onToggleChart: () => void
    onToggleAdminPanel?: () => void
    /** 1–4 — jump to Gold / Silver / Platinum / Palladium. */
    onSelectMetal: (metal: MetalType) => void
    /** p — flip the Trade tab between Price and Buyback. */
    onFlipTransaction: () => void
    /** q — open Trade and focus its quantity field. */
    onFocusQuantity: () => void
    /** Ctrl+Z — unfreeze every metal and untick every selected row. */
    onResetAll: () => void
}

const SEARCH_INPUT_ID = "product-search-input"

const METAL_BY_KEY: Record<string, MetalType> = {
    "1": "GOLD",
    "2": "SILVER",
    "3": "PLATINUM",
    "4": "PALLADIUM",
}

function isTypingTarget(target: EventTarget | null): target is HTMLElement {
    if (!(target instanceof HTMLElement)) return false
    return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
}

// Checkboxes and buttons are INPUTs too, but Ctrl+Z means nothing to them —
// only fields that have their own native undo should keep the key.
function isTextEntry(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    if (target.isContentEditable || target.tagName === "TEXTAREA") return true
    if (target.tagName !== "INPUT") return false
    const type = (target as HTMLInputElement).type
    return !["checkbox", "radio", "button", "submit", "range"].includes(type)
}

function isDialogOpen(): boolean {
    return document.querySelector('[role="dialog"]') !== null
}

/**
 * Page-chrome shortcuts: "/" to focus search, single letters to toggle the
 * tools panel / chart / admin panel, 1–4 to switch metal, p to flip
 * Price/Buyback, q to jump to the Trade quantity, and Ctrl+Z to reset the
 * working state. Row navigation (arrow keys) lives separately in
 * use-row-navigation.hook.ts since it needs the table's live row model —
 * this hook only knows about page-level actions.
 *
 * Single letters (no modifier) are used rather than Ctrl/Cmd combos so they
 * don't fight the browser's own shortcuts — guarded to never fire while
 * typing in a field or while a dialog is open. Ctrl+Z is the one exception,
 * and it steps aside whenever a text field has focus so native undo still works.
 */
export function useGlobalShortcuts({
    onToggleTools,
    onToggleChart,
    onToggleAdminPanel,
    onSelectMetal,
    onFlipTransaction,
    onFocusQuantity,
    onResetAll,
}: GlobalShortcutsOptions) {
    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "z") {
                if (isTextEntry(event.target) || isDialogOpen()) return
                event.preventDefault()
                onResetAll()
                return
            }

            if (event.ctrlKey || event.metaKey || event.altKey) return
            if (isTypingTarget(event.target) || isDialogOpen()) return

            if (event.key === "/") {
                event.preventDefault()
                document.getElementById(SEARCH_INPUT_ID)?.focus()
                return
            }

            const metal = METAL_BY_KEY[event.key]
            if (metal) {
                onSelectMetal(metal)
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
                case "p":
                    onFlipTransaction()
                    break
                case "q":
                    // preventDefault: otherwise the keystroke lands in the field we just focused.
                    event.preventDefault()
                    onFocusQuantity()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onToggleTools, onToggleChart, onToggleAdminPanel, onSelectMetal, onFlipTransaction, onFocusQuantity, onResetAll])
}
