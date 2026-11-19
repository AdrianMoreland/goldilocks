import { GRAMS_PER_TROY_OUNCE, type MetalType, type Product, type ProductCategory } from "@goldilocks/shared-types"

export type ProductGroup = "bar" | "coin" | "bonded"

export type DisplayProduct = Product & {
    productType: ProductGroup
}

const METAL_WORDS: Record<MetalType, string> = {
    GOLD: "gold",
    SILVER: "silver",
    PLATINUM: "platinum",
    PALLADIUM: "palladium",
}

const ONE_OZ_TOLERANCE_G = 0.5
const MERGE_TOLERANCE_G = 0.05

// The small coin weights that have a generic version and a US Eagle version.
const COIN_MERGE_TARGETS: { label: string; weightGrams: number }[] = [
    { label: "1/10oz Coin", weightGrams: GRAMS_PER_TROY_OUNCE / 10 },
    { label: "1/4oz Coin", weightGrams: GRAMS_PER_TROY_OUNCE / 4 },
    { label: "1/2oz Coin", weightGrams: GRAMS_PER_TROY_OUNCE / 2 },
    { label: "1g Coin", weightGrams: 1 },
]

function isBar(name: string): boolean {
    return /bar/i.test(name)
}

/** Name-based fallback for products created before category existed. */
export function inferCategory(name: string): ProductCategory {
    return isBar(name) ? "BAR" : "COIN"
}

/** The stored category wins; only uncategorised (older) products fall back to the name. */
function isBarProduct(product: Product): boolean {
    return (product.category ?? inferCategory(product.name)) === "BAR"
}

function isBonded(name: string): boolean {
    return /bonded/i.test(name)
}

function isSovereign(name: string): boolean {
    return /sovereign/i.test(name)
}

function isOneOz(weightGrams: number): boolean {
    return Math.abs(weightGrams - GRAMS_PER_TROY_OUNCE) < ONE_OZ_TOLERANCE_G
}

function findCoinMergeLabel(weightGrams: number): string | null {
    const match = COIN_MERGE_TARGETS.find((t) => Math.abs(weightGrams - t.weightGrams) < MERGE_TOLERANCE_G)
    return match?.label ?? null
}

/** "1 oz Gold Bar" -> "1oz Bar", "500 g Gold Bar" -> "500g Bar" - drops the
 * metal word and tightens the number/unit spacing to match the coin naming
 * convention ("1oz Britannia") for a more compact, readable table. */
function stripMetalWord(name: string, metalType: MetalType): string {
    const word = METAL_WORDS[metalType]
    return name
        .replace(new RegExp(word, "i"), "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/(\d+(?:\.\d+)?)\s+(g|kg|oz)\b/gi, "$1$2")
}

/** A small coin (1/10oz, 1/4oz, 1/2oz, 1g) rather than a bar, a bonded product, a sovereign or a 1oz coin. */
function isFractionCoin(product: { name: string; weight: number }): boolean {
    return (
        !isBar(product.name) &&
        !isBonded(product.name) &&
        !isSovereign(product.name) &&
        !isOneOz(product.weight) &&
        findCoinMergeLabel(product.weight) !== null
    )
}

/** The US Eagle version of a small coin ("1/2oz US Eagle"). The main table hides these until the user searches. */
export function isUsFractionCoin(product: { name: string; weight: number }): boolean {
    return isFractionCoin(product) && /\bUS\b/i.test(product.name)
}

/** The US version of a generic small coin at the same weight and metal, or undefined when there is none (or the product is not a generic small coin). */
export function usCounterpart<T extends { id: number; name: string; weight: number; metalType: MetalType }>(
    product: T,
    all: T[],
): T | undefined {
    if (!isFractionCoin(product) || isUsFractionCoin(product)) return undefined
    return all.find(
        (other) =>
            other.id !== product.id &&
            other.metalType === product.metalType &&
            isUsFractionCoin(other) &&
            Math.abs(other.weight - product.weight) < MERGE_TOLERANCE_G,
    )
}

/**
 * Builds the display-ready product list: bars renamed to drop the metal
 * word (weight order), then coins (reverse weight order), then bonded. Every
 * product keeps its own row, name and premium; nothing is averaged.
 */
export function buildDisplayProducts(products: Product[]): DisplayProduct[] {
    const bars: DisplayProduct[] = []
    const coins: DisplayProduct[] = []
    const bonded: DisplayProduct[] = []

    for (const product of products) {
        // "Bonded" (deferred-VAT storage) products get their own section
        // under Coins, regardless of whether they're bar- or coin-shaped -
        // they're priced differently from the standard stock and shouldn't
        // blend into either regular list. Only Silver has these today.
        if (isBonded(product.name)) {
            bonded.push({
                ...product,
                name: isBarProduct(product) ? stripMetalWord(product.name, product.metalType) : product.name,
                productType: "bonded",
            })
            continue
        }

        if (isBarProduct(product)) {
            bars.push({
                ...product,
                name: stripMetalWord(product.name, product.metalType),
                productType: "bar",
            })
            continue
        }

        coins.push({ ...product, productType: "coin" })
    }

    bars.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name))
    bonded.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name))
    coins.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name))

    return [...bars, ...coins, ...bonded]
}
