import * as React from "react"

interface Dock {
    open: boolean
    toggle: () => void
    close: () => void
}

function useDockState(): Dock {
    const [open, setOpen] = React.useState(false)
    return React.useMemo(
        () => ({ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }),
        [open],
    )
}

const AssistantDockContext = React.createContext<Dock | null>(null)
const ThemeEditorContext = React.createContext<Dock | null>(null)

/**
 * Open/closed state for the two docked panels that more than one component
 * needs to reach: the Ask button (in a page header) and its panel (beside the
 * page), and the user menu item and the theme editor. Held above the router so
 * the state survives navigating between pages.
 */
export function DocksProvider({ children }: { children: React.ReactNode }) {
    const assistant = useDockState()
    const themeEditor = useDockState()
    return (
        <AssistantDockContext.Provider value={assistant}>
            <ThemeEditorContext.Provider value={themeEditor}>{children}</ThemeEditorContext.Provider>
        </AssistantDockContext.Provider>
    )
}

export function useAssistantDock(): Dock {
    const ctx = React.useContext(AssistantDockContext)
    if (!ctx) throw new Error("useAssistantDock must be used within DocksProvider")
    return ctx
}

export function useThemeEditorDock(): Dock {
    const ctx = React.useContext(ThemeEditorContext)
    if (!ctx) throw new Error("useThemeEditorDock must be used within DocksProvider")
    return ctx
}
