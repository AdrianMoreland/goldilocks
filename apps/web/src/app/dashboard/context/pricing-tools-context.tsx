import * as React from "react"
import type { MetalType, Product } from "@/lib/types"

export type PricingToolTab = "product" | "trade" | "portfolio" | "tax" | "calculators" | "settings"

interface PricingToolsContextValue {
    open: boolean
    activeTab: PricingToolTab
    activeMetal: MetalType
    selectedProduct: Product | null
    /** Product-table row-selection (the per-row toggle checkboxes), keyed by product id — owned here (not the table) so the Trade tab's cart and the table's checkboxes can both read AND write the same selection. */
    rowSelection: Record<string, boolean>
    /** Ids of the currently-selected rows, derived from `rowSelection` — the Trade tab uses this to build its cart. */
    selectedProductIds: number[]
    /** Whether the per-row "…" pricing-edit menu is shown — only meaningful for admins; see the header's admin-mode button. */
    adminMode: boolean

    toggleOpen: () => void
    setActiveTab: (tab: PricingToolTab) => void
    setActiveMetal: (metal: MetalType) => void
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    /** Unchecks one product's row-selection checkbox — used when a cart item tied to a selected row is removed from the Trade tab. */
    deselectProductId: (id: number) => void
    toggleAdminMode: () => void

    /** Switches the panel to the Product tab for a specific product row, opening it if closed. */
    openWithProduct: (product: Product) => void

    /** A product id the Trade tab should seed its cart with on its next render — set by openInTrade, consumed (and cleared) by useTradeTools once that metal's bootstrap data is loaded. */
    pendingTradeProductId: number | null
    /** Switches to the Trade tab for a specific product's metal, replacing that metal's cart with just this product — "Open in Trade" from the Product tab. */
    openInTrade: (product: Product) => void
    clearPendingTradeProduct: () => void
}

const PricingToolsContext = React.createContext<PricingToolsContextValue | null>(null)

/** Pricing tools panel state — open by default, toggled via a header button. */
export function PricingToolsProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState<PricingToolTab>("product")
    const [activeMetal, setActiveMetal] = React.useState<MetalType>("GOLD")
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
    const [adminMode, setAdminMode] = React.useState(false)

    const selectedProductIds = React.useMemo(
        () => Object.keys(rowSelection).filter((id) => rowSelection[id]).map(Number),
        [rowSelection],
    )

    const deselectProductId = React.useCallback((id: number) => {
        setRowSelection((prev) => {
            const key = String(id)
            if (!prev[key]) return prev
            const next = { ...prev }
            delete next[key]
            return next
        })
    }, [])

    const toggleOpen = React.useCallback(() => setOpen((o) => !o), [])
    const toggleAdminMode = React.useCallback(() => setAdminMode((v) => !v), [])

    const openWithProduct = React.useCallback((product: Product) => {
        setSelectedProduct(product)
        setActiveMetal(product.metalType)
        setActiveTab("product")
        setOpen(true)
    }, [])

    const [pendingTradeProductId, setPendingTradeProductId] = React.useState<number | null>(null)

    const openInTrade = React.useCallback((product: Product) => {
        setActiveMetal(product.metalType)
        setPendingTradeProductId(product.id)
        setActiveTab("trade")
        setOpen(true)
    }, [])

    const clearPendingTradeProduct = React.useCallback(() => setPendingTradeProductId(null), [])

    const value = React.useMemo<PricingToolsContextValue>(
        () => ({
            open,
            activeTab,
            activeMetal,
            selectedProduct,
            rowSelection,
            selectedProductIds,
            adminMode,
            toggleOpen,
            setActiveTab,
            setActiveMetal,
            setRowSelection,
            deselectProductId,
            toggleAdminMode,
            openWithProduct,
            pendingTradeProductId,
            openInTrade,
            clearPendingTradeProduct,
        }),
        [
            open, activeTab, activeMetal, selectedProduct, rowSelection, selectedProductIds, adminMode,
            toggleOpen, deselectProductId, toggleAdminMode, openWithProduct,
            pendingTradeProductId, openInTrade, clearPendingTradeProduct,
        ],
    )

    return <PricingToolsContext.Provider value={value}>{children}</PricingToolsContext.Provider>
}

export function usePricingTools() {
    const ctx = React.useContext(PricingToolsContext)
    if (!ctx) {
        throw new Error("usePricingTools must be used within a PricingToolsProvider")
    }
    return ctx
}
