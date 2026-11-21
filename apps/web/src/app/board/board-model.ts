import { GRAMS_PER_TROY_OUNCE, type MetalType, type Product } from "@goldilocks/shared-types"
import { buildDisplayProducts, isVariantProduct, type DisplayProduct } from "../dashboard/components/table/product-grouping"

export const BOARD_METALS: MetalType[] = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]

/** What the board shows: one metal, or every metal in turn ("auto", shown as Rotate). */
export type BoardView = MetalType | "auto"

/** Seconds each metal stays on screen while rotating. */
export const AUTO_ROTATE_SECONDS = 20

export interface BoardLists {
    bars: DisplayProduct[]
    coins: DisplayProduct[]
}

/**
 * One metal's products as two lists, bars and coins (bonded products sit with the coins), in the dashboard table's
 * order without the variants the table also hides. Pinned products move to the top of their own list, keeping the
 * table's order among themselves. A search keeps only names that contain every word typed.
 */
export function boardLists(products: Product[], metal: MetalType, pins: number[], query = ""): BoardLists {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    const pinned = new Set(pins)
    const rows = buildDisplayProducts(products.filter((p) => p.metalType === metal && !isVariantProduct(p))).filter((p) =>
        words.every((w) => p.name.toLowerCase().includes(w)),
    )
    const pinFirst = (list: DisplayProduct[]) => [...list.filter((p) => pinned.has(p.id)), ...list.filter((p) => !pinned.has(p.id))]
    return {
        bars: pinFirst(rows.filter((p) => p.productType === "bar")),
        coins: pinFirst(rows.filter((p) => p.productType !== "bar")),
    }
}

/** Adds or removes a pin, keeping the list free of repeats. */
export function togglePin(pins: number[], id: number): number[] {
    return pins.includes(id) ? pins.filter((p) => p !== id) : [...pins, id]
}

/** The metal Rotate shows at a given moment: it cycles every AUTO_ROTATE_SECONDS, skipping metals with no products. */
export function autoMetal(products: Product[], nowMs: number): MetalType {
    const withProducts = BOARD_METALS.filter((m) => products.some((p) => p.metalType === m && !isVariantProduct(p)))
    const metals = withProducts.length > 0 ? withProducts : BOARD_METALS
    return metals[Math.floor(nowMs / (AUTO_ROTATE_SECONDS * 1000)) % metals.length]
}

/** The last `days` daily closes for one metal, oldest first (the history thins to weekly beyond a year, so 30 is daily). */
export function recentCloses(history: { metalType: string; priceEur: number; timestamp: string }[], metal: MetalType, days = 30): number[] {
    return history
        .filter((h) => h.metalType === metal && h.priceEur > 0)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .slice(-days)
        .map((h) => h.priceEur)
}

/** An SVG path through the values, scaled to fill a width × height box (top is the highest value). Empty below 2 points. */
export function sparkPath(values: number[], width: number, height: number): string {
    if (values.length < 2) return ""
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    return values
        .map((v, i) => {
            const x = (i * width) / (values.length - 1)
            const y = height - ((v - min) / span) * height
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
        })
        .join(" ")
}

/** Euro per gram from a per-troy-ounce spot. */
export function perGram(spotPerOz: number): number {
    return spotPerOz / GRAMS_PER_TROY_OUNCE
}

/**
 * How much a price moved since the previous close, from the spot's own percentage change. Product prices scale with
 * spot (premium and VAT are percentages of it), so the product moved by the same percentage.
 */
export function changeSincePreviousClose(price: number, spotChangePercent: number | null | undefined): number | null {
    if (spotChangePercent == null || !Number.isFinite(spotChangePercent) || spotChangePercent <= -100) return null
    return price - price / (1 + spotChangePercent / 100)
}
