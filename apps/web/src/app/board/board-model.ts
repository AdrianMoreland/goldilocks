import type { MetalType, Product } from "@goldilocks/shared-types"
import { buildDisplayProducts, isVariantProduct, type DisplayProduct } from "../dashboard/components/table/product-grouping"

export const BOARD_METALS: MetalType[] = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]

/** What the board shows: one metal, every metal in turn ("auto"), or only the viewer's pinned products. */
export type BoardView = MetalType | "auto" | "pinned"

/** Seconds each metal stays on screen in "auto". */
export const AUTO_ROTATE_SECONDS = 20

/**
 * The cards for one metal: the same order and grouping as the dashboard table, without the variants
 * (US small coins, PAMP, CombiBar) the table also hides until searched.
 */
export function boardProducts(products: Product[], metal: MetalType): DisplayProduct[] {
    return buildDisplayProducts(products.filter((p) => p.metalType === metal && !isVariantProduct(p)))
}

/** The pinned products in metal order (gold first), each metal keeping the table's order. Unknown ids are skipped. */
export function pinnedProducts(products: Product[], pins: number[]): DisplayProduct[] {
    const wanted = new Set(pins)
    return BOARD_METALS.flatMap((metal) => buildDisplayProducts(products.filter((p) => p.metalType === metal && wanted.has(p.id))))
}

/** Adds or removes a pin, keeping the list free of repeats. */
export function togglePin(pins: number[], id: number): number[] {
    return pins.includes(id) ? pins.filter((p) => p !== id) : [...pins, id]
}

/** The metal "auto" shows at a given moment: it cycles every AUTO_ROTATE_SECONDS, skipping metals with no products. */
export function autoMetal(products: Product[], nowMs: number): MetalType {
    const withProducts = BOARD_METALS.filter((m) => products.some((p) => p.metalType === m && !isVariantProduct(p)))
    const metals = withProducts.length > 0 ? withProducts : BOARD_METALS
    return metals[Math.floor(nowMs / (AUTO_ROTATE_SECONDS * 1000)) % metals.length]
}
