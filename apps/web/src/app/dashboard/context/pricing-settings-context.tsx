import * as React from "react"
import type { MetalType } from "@/lib/types"

/**
 * Market-condition modes + per-metal-group adjustment percentages — ported
 * from the pricing workbook's SETTINGS sheet ("Merrion Gold — Pricing
 * Control Centre"). Modes stack additively, matching the sheet's own note:
 * "Weekend + Shortage ON = both adjustments active simultaneously."
 *
 * Weekend/Volatile widen the spread both ways (worse for the customer on
 * both buy and sell) — "wider spread for closed markets" / "tight
 * adjustment for fast-moving prices". Metal Shortage instead makes both
 * sides better for the customer selling to us: it reduces the buy-side
 * discount and increases the sell-side premium ("sell more / buy closer to
 * spot") — the sheet's own labels for its two shortage columns.
 */

export type MetalGroup = "GOLD" | "SILVER" | "PGM"

export type MarketMode = "weekend" | "volatile" | "shortage"

export interface GroupAdjustment {
    wkdBuy: number
    wkdSell: number
    volBuy: number
    volSell: number
    shortageBuyReduction: number
    shortageSellIncrease: number
}

const DEFAULT_ADJUSTMENTS: Record<MetalGroup, GroupAdjustment> = {
    GOLD: { wkdBuy: 0.025, wkdSell: 0.025, volBuy: 0.005, volSell: 0.005, shortageBuyReduction: 0.0075, shortageSellIncrease: 0.01 },
    SILVER: { wkdBuy: 0.05, wkdSell: 0.05, volBuy: 0.0125, volSell: 0.0125, shortageBuyReduction: 0.01, shortageSellIncrease: 0.025 },
    PGM: { wkdBuy: 0.05, wkdSell: 0.05, volBuy: 0.025, volSell: 0.025, shortageBuyReduction: 0, shortageSellIncrease: 0 },
}

const MODE_LABELS: Record<MarketMode, string> = {
    weekend: "WEEKEND",
    volatile: "VOLATILE",
    shortage: "METAL SHORTAGE",
}

export function metalGroupFor(metal: MetalType): MetalGroup {
    if (metal === "GOLD") return "GOLD"
    if (metal === "SILVER") return "SILVER"
    return "PGM" // PLATINUM + PALLADIUM
}

interface PricingSettingsContextValue {
    modes: Record<MarketMode, boolean>
    toggleMode: (mode: MarketMode) => void
    adjustments: Record<MetalGroup, GroupAdjustment>
    updateAdjustment: (group: MetalGroup, field: keyof GroupAdjustment, value: number) => void
    resetAdjustments: () => void
    activeStatusLabel: string
    /** Additive delta to apply to a product's premium % (sell) or discount magnitude % (buy), given the active modes. */
    getAdjustmentDelta: (metal: MetalType, side: "buy" | "sell") => number
}

const PricingSettingsContext = React.createContext<PricingSettingsContextValue | null>(null)

export function PricingSettingsProvider({ children }: { children: React.ReactNode }) {
    const [modes, setModes] = React.useState<Record<MarketMode, boolean>>({
        weekend: false,
        volatile: false,
        shortage: false,
    })
    const [adjustments, setAdjustments] = React.useState<Record<MetalGroup, GroupAdjustment>>(DEFAULT_ADJUSTMENTS)

    const toggleMode = React.useCallback((mode: MarketMode) => {
        setModes((prev) => ({ ...prev, [mode]: !prev[mode] }))
    }, [])

    const updateAdjustment = React.useCallback((group: MetalGroup, field: keyof GroupAdjustment, value: number) => {
        setAdjustments((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }))
    }, [])

    const resetAdjustments = React.useCallback(() => setAdjustments(DEFAULT_ADJUSTMENTS), [])

    const activeStatusLabel = React.useMemo(() => {
        const active = (Object.keys(modes) as MarketMode[]).filter((m) => modes[m])
        if (!active.length) return "STANDARD"
        return active.map((m) => MODE_LABELS[m]).join(" + ")
    }, [modes])

    const getAdjustmentDelta = React.useCallback(
        (metal: MetalType, side: "buy" | "sell") => {
            const adj = adjustments[metalGroupFor(metal)]
            let delta = 0
            if (modes.weekend) delta += side === "buy" ? adj.wkdBuy : adj.wkdSell
            if (modes.volatile) delta += side === "buy" ? adj.volBuy : adj.volSell
            if (modes.shortage) delta += side === "buy" ? -adj.shortageBuyReduction : adj.shortageSellIncrease
            return delta
        },
        [modes, adjustments],
    )

    const value = React.useMemo<PricingSettingsContextValue>(
        () => ({ modes, toggleMode, adjustments, updateAdjustment, resetAdjustments, activeStatusLabel, getAdjustmentDelta }),
        [modes, toggleMode, adjustments, updateAdjustment, resetAdjustments, activeStatusLabel, getAdjustmentDelta],
    )

    return <PricingSettingsContext.Provider value={value}>{children}</PricingSettingsContext.Provider>
}

export function usePricingSettings() {
    const ctx = React.useContext(PricingSettingsContext)
    if (!ctx) {
        throw new Error("usePricingSettings must be used within a PricingSettingsProvider")
    }
    return ctx
}
