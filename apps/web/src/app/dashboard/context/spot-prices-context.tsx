import * as React from "react"
import type { MetalType } from "@/lib/types"

interface SpotPricesContextValue {
    /** The spot each metal is being quoted from right now: the user's override if they froze or typed one, otherwise the live market price. */
    displayPrices: Record<MetalType, number>
    overriddenMetals: MetalType[]
    setSpot: (metal: MetalType, value: number) => void
    clearSpot: (metal: MetalType) => void
}

const SpotPricesContext = React.createContext<SpotPricesContextValue | null>(null)

/**
 * Publishes the workbook's spot state to the Pricing Tools panel, which sits
 * beside (not inside) the page that owns usePricingWorkbook(). Trade, Melt
 * and Portfolio read their spot from here so an override on a card is what
 * they quote from, instead of quietly using the market price.
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
