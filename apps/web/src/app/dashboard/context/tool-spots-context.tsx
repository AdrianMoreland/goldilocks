import * as React from "react"
import type { MetalType } from "@/lib/types"
import { useSpotPrices } from "./spot-prices-context"

/**
 * The side-panel tools that can hold a spot of their own. Each one is isolated:
 * editing it never freezes a card, moves the product table, or changes another
 * tool (docs/adr/0001-tool-spots-are-isolated-from-the-card-spot.md).
 */
export type SpotTool = "trade" | "melt" | "portfolio"

type ToolSpots = Record<SpotTool, Partial<Record<MetalType, number>>>

const EMPTY: ToolSpots = { trade: {}, melt: {}, portfolio: {} }

interface ToolSpotsContextValue {
    spots: ToolSpots
    setToolSpot: (tool: SpotTool, metal: MetalType, value: number) => void
    resetToolSpot: (tool: SpotTool, metal: MetalType) => void
}

const ToolSpotsContext = React.createContext<ToolSpotsContextValue | null>(null)

/**
 * Held in memory only, at the dashboard level so a tool's spot survives switching
 * tabs in the panel. Deliberately not persisted: a stale hand-typed spot silently
 * surviving a reload is the riskiest case. Ctrl+Z (which resets the cards) does
 * not touch it; each tool has its own Reset.
 */
export function ToolSpotsProvider({ children }: { children: React.ReactNode }) {
    const [spots, setSpots] = React.useState<ToolSpots>(EMPTY)

    const setToolSpot = React.useCallback((tool: SpotTool, metal: MetalType, value: number) => {
        setSpots((prev) => ({ ...prev, [tool]: { ...prev[tool], [metal]: value } }))
    }, [])

    const resetToolSpot = React.useCallback((tool: SpotTool, metal: MetalType) => {
        setSpots((prev) => {
            if (prev[tool][metal] === undefined) return prev
            const next = { ...prev[tool] }
            delete next[metal]
            return { ...prev, [tool]: next }
        })
    }, [])

    const value = React.useMemo(() => ({ spots, setToolSpot, resetToolSpot }), [spots, setToolSpot, resetToolSpot])
    return <ToolSpotsContext.Provider value={value}>{children}</ToolSpotsContext.Provider>
}

export interface ToolSpot {
    /** What the tool quotes from: its own spot once edited, otherwise the card's. Null while no price is loaded. */
    spot: number | null
    /** True once the user has edited this tool's spot; it then ignores later card changes. */
    detached: boolean
    /** The live market price, ignoring any freeze. */
    marketSpot: number | undefined
    /** The card's spot — live, or the frozen value. */
    cardSpot: number | null
    cardFrozen: boolean
    setSpot: (value: number) => void
    reset: () => void
}

export function useToolSpot(tool: SpotTool, metal: MetalType): ToolSpot {
    const ctx = React.useContext(ToolSpotsContext)
    if (!ctx) throw new Error("useToolSpot must be used within a ToolSpotsProvider")
    const { displayPrices, marketPrices, overriddenMetals } = useSpotPrices()
    const { spots, setToolSpot, resetToolSpot } = ctx

    const own = spots[tool][metal]
    const cardSpot = displayPrices[metal] > 0 ? displayPrices[metal] : null

    const setSpot = React.useCallback(
        (value: number) => {
            // A blank or zero field mid-typing must not become a €0 spot.
            if (value > 0) setToolSpot(tool, metal, value)
        },
        [tool, metal, setToolSpot],
    )
    const reset = React.useCallback(() => resetToolSpot(tool, metal), [tool, metal, resetToolSpot])

    return {
        spot: own ?? cardSpot,
        detached: own !== undefined,
        marketSpot: marketPrices[metal],
        cardSpot,
        cardFrozen: overriddenMetals.includes(metal),
        setSpot,
        reset,
    }
}
