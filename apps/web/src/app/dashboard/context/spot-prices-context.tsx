import * as React from "react"
import type { MetalType } from "@/lib/types"

interface SpotPricesContextValue {
    /** The spot each metal is being quoted from right now: the user's override if they froze or typed one, otherwise the live market price. */
    displayPrices: Record<MetalType, number>
    /** The live market price per metal, ignoring any freeze — what "live market" means in the tools' banners. */
    marketPrices: Partial<Record<MetalType, number>>
    overriddenMetals: MetalType[]
    /** Freezes the card (and so the table) at this spot. The side-panel tools must not call this: they hold their own spot (see tool-spots-context). */
    setSpot: (metal: MetalType, value: number) => void
    clearSpot: (metal: MetalType) => void
}

const SpotPricesContext = React.createContext<SpotPricesContextValue | null>(null)

/**
 * Publishes the workbook's spot state to the Pricing Tools panel, which sits
 * beside (not inside) the page that owns usePricingWorkbook(). Trade, Melt
 * and Portfolio start from the card's spot (override included) and follow it
 * until the user edits their own — see tool-spots-context.
 */
export function SpotPricesProvider({ value, children }: { value: SpotPricesContextValue; children: React.ReactNode }) {
    return <SpotPricesContext.Provider value={value}>{children}</SpotPricesContext.Provider>
}

export function useSpotPrices() {
    const ctx = React.useContext(SpotPricesContext)
    if (!ctx) {
        throw new Error("useSpotPrices must be used within a SpotPricesProvider")
    }
    return ctx
}
