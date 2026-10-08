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

/** What the assistant was opened from, so it can say what it is being asked about. */
export interface AssistantContext {
    slug: string
    title: string
}

interface AssistantDock extends Dock {
    context: AssistantContext | null
    /** Opens the panel for a question about one procedure. */
    askAbout: (context: AssistantContext) => void
    clearContext: () => void
}

const AssistantDockContext = React.createContext<AssistantDock | null>(null)
const ThemeEditorContext = React.createContext<Dock | null>(null)

/**
 * Open/closed state for the two docked panels that more than one component
 * needs to reach: the Ask button (in a page header) and its panel (beside the
 * page), and the user menu item and the theme editor. Held above the router so
 * the state survives navigating between pages.
 */
export function DocksProvider({ children }: { children: React.ReactNode }) {
    const base = useDockState()
    const [context, setContext] = React.useState<AssistantContext | null>(null)
    const assistant = React.useMemo<AssistantDock>(
        () => ({
            ...base,
            context,
            askAbout: (next) => {
                setContext(next)
                if (!base.open) base.toggle()
            },
            clearContext: () => setContext(null),
        }),
        [base, context],
    )
    const themeEditor = useDockState()
    return (
        <AssistantDockContext.Provider value={assistant}>
            <ThemeEditorContext.Provider value={themeEditor}>{children}</ThemeEditorContext.Provider>
        </AssistantDockContext.Provider>
    )
}

export function useAssistantDock(): AssistantDock {
    const ctx = React.useContext(AssistantDockContext)
    if (!ctx) throw new Error("useAssistantDock must be used within DocksProvider")
    return ctx
}

export function useThemeEditorDock(): Dock {
    const ctx = React.useContext(ThemeEditorContext)
    if (!ctx) throw new Error("useThemeEditorDock must be used within DocksProvider")
    return ctx
}
