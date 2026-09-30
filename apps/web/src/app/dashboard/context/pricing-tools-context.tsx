import * as React from "react"
import type { MetalType, Product } from "@/lib/types"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import type { TradeTransactionType } from "@goldilocks/shared-types"
import type { DisplayProduct } from "../components/table/product-grouping"

/** Element id of the first quantity field in the Trade tab — the "jump to quantity" shortcut focuses it. */
export const TRADE_FIRST_QTY_ID = "trade-first-qty"

export type PricingToolTab = "product" | "trade" | "portfolio" | "calculators" | "settings"

// Shared by both side panels (Pricing Tools and the Admin panel) so they
// occupy exactly the same slot at exactly the same width — scales with the
// viewport instead of staying pinned at 384px regardless of width: 384px on
// wide screens, shrinking down to a 260px floor so it never hogs most of a
// narrower window.
export const SIDE_PANEL_WIDTH = "clamp(260px, 32vw, 384px)"

interface PricingToolsContextValue {
    open: boolean
    activeTab: PricingToolTab
    activeMetal: MetalType
    selectedProduct: Product | null
    /** Product-table row-selection (the per-row toggle checkboxes), keyed by product id — owned here (not the table) so the Trade tab's cart and the table's checkboxes can both read AND write the same selection. */
    rowSelection: Record<string, boolean>
    /** Ids of the currently-selected rows, derived from `rowSelection` — the Trade tab uses this to build its cart. */
    selectedProductIds: number[]
    /**
     * Whether the metal spot-price cards are shown. There are two ways to
     * pick which metal's table is showing — the cards, and the small
     * per-metal buttons above the table — and only one is ever meant to be
     * visible at a time so they can't drift out of sync with each other.
     * Cards are the default; the small buttons only appear once the cards
     * are hidden (see the header's "Toggle metal cards" button).
     */
    cardsVisible: boolean
    /** Whether the Admin side panel is showing — occupies the exact same slot as the Pricing Tools panel (see PricingToolsPanel's own `open` check), so only one is ever visible at a time. */
    adminPanelOpen: boolean

    toggleOpen: () => void
    openTools: () => void
    openAdminPanel: () => void
    closeAdminPanel: () => void
    toggleAdminPanel: () => void
    setActiveTab: (tab: PricingToolTab) => void
    setActiveMetal: (metal: MetalType) => void
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    /** Unchecks one product's row-selection checkbox — used when a cart item tied to a selected row is removed from the Trade tab. */
    deselectProductId: (id: number) => void
    toggleCardsVisible: () => void

    /** Switches the panel to the Product tab for a specific product row, opening it if closed. */
    openWithProduct: (product: Product) => void

    /** A product id the Trade tab should seed its cart with on its next render — set by openInTrade, consumed (and cleared) by useTradeTools once that metal's bootstrap data is loaded. */
    pendingTradeProductId: number | null
    /** Switches to the Trade tab for a specific product's metal, replacing that metal's cart with just this product — "Open in Trade" from the Product tab. */
    openInTrade: (product: Product) => void
    clearPendingTradeProduct: () => void

    /** Which side of the trade is being quoted — "buying" is Price (customer buys from us), "selling" is Buyback. Held here, not in the Trade tab, so the Price/Buyback shortcut works from anywhere. */
    transactionType: TradeTransactionType
    setTransactionType: (mode: TradeTransactionType) => void
    flipTransactionType: () => void
    /** Unticks every product row (the Trade cart keeps whatever it already holds). */
    clearSelection: () => void
    /** The product table's current selection and visible columns, published by the table for the Trade tab's Easy Copy button. */
    tableCopySource: React.MutableRefObject<{ selectedProducts: DisplayProduct[]; visibleColumnIds: string[] } | null>
    /** Opens the Trade tab and puts the cursor in its first quantity field. */
    focusTradeQuantity: () => void
}

const PricingToolsContext = React.createContext<PricingToolsContextValue | null>(null)

/** Pricing tools panel state — open by default, toggled via a header button. */
export function PricingToolsProvider({ children }: { children: React.ReactNode }) {
    // Panel and card visibility are remembered per user; the rest is per-session.
    const [open, setOpen] = useUserPreference("tools-panel-open", true)
    const [activeTab, setActiveTab] = React.useState<PricingToolTab>("product")
    const [activeMetal, setActiveMetal] = React.useState<MetalType>("GOLD")
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
    const [cardsVisible, setCardsVisible] = useUserPreference("cards-visible", true)
    const [adminPanelOpen, setAdminPanelOpen] = React.useState(false)
    const [transactionType, setTransactionType] = React.useState<TradeTransactionType>("buying")

    const selectedProductIds = React.useMemo(
        () => Object.keys(rowSelection).filter((id) => rowSelection[id]).map(Number),
        [rowSelection],
    )

    // Ticking a row means "I want to quote this" — bring the Trade tab up
    // instead of leaving the clerk to discover the cart. Fires only when the
    // selection grows, so unticking or Ctrl+Z never yanks the panel around.
    const previousSelectionCount = React.useRef(0)
    React.useEffect(() => {
        if (selectedProductIds.length > previousSelectionCount.current) {
            setActiveTab("trade")
            setOpen(true)
        }
        previousSelectionCount.current = selectedProductIds.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProductIds.length])

    const tableCopySource = React.useRef<{ selectedProducts: DisplayProduct[]; visibleColumnIds: string[] } | null>(null)

    const clearSelection = React.useCallback(() => setRowSelection({}), [])
    const flipTransactionType = React.useCallback(
        () => setTransactionType((t) => (t === "buying" ? "selling" : "buying")),
        [],
    )

    const focusTradeQuantity = React.useCallback(() => {
        setActiveTab("trade")
        setOpen(true)
        // The tab body mounts on the next render, so poll briefly for the field.
        let attempts = 0
        const tryFocus = () => {
            const el = document.getElementById(TRADE_FIRST_QTY_ID) as HTMLInputElement | null
            if (el) {
                el.focus()
                el.select()
            } else if (attempts++ < 15) {
                setTimeout(tryFocus, 60)
            }
        }
        setTimeout(tryFocus, 0)
    }, [])

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
    const openTools = React.useCallback(() => setOpen(true), [])
    const toggleCardsVisible = React.useCallback(() => setCardsVisible((v) => !v), [])
    const openAdminPanel = React.useCallback(() => setAdminPanelOpen(true), [])
    const closeAdminPanel = React.useCallback(() => setAdminPanelOpen(false), [])
    const toggleAdminPanel = React.useCallback(() => setAdminPanelOpen((v) => !v), [])

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
            cardsVisible,
            adminPanelOpen,
            toggleOpen,
            openTools,
            openAdminPanel,
            closeAdminPanel,
            toggleAdminPanel,
            setActiveTab,
            setActiveMetal,
            setRowSelection,
            deselectProductId,
            toggleCardsVisible,
            openWithProduct,
            pendingTradeProductId,
            openInTrade,
            clearPendingTradeProduct,
            transactionType,
            setTransactionType,
            flipTransactionType,
            clearSelection,
            focusTradeQuantity,
            tableCopySource,
        }),
        [
            open, activeTab, activeMetal, selectedProduct, rowSelection, selectedProductIds, cardsVisible, adminPanelOpen,
            toggleOpen, openTools, openAdminPanel, closeAdminPanel, toggleAdminPanel, deselectProductId, toggleCardsVisible, openWithProduct,
            pendingTradeProductId, openInTrade, clearPendingTradeProduct,
            transactionType, flipTransactionType, clearSelection, focusTradeQuantity,
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
