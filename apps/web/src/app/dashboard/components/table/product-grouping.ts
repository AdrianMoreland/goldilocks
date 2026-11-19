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

/** Variant labels in the order the Trade tab's dropdown lists them (after "Regular"). */
export const VARIANT_ORDER = ["US", "CombiBar", "PAMP", "PAMP Diwali"] as const
export type VariantLabel = (typeof VARIANT_ORDER)[number]
export const REGULAR_VARIANT = "Regular"

/** The US Eagle version of a small coin ("1/2oz US Eagle"). */
export function isUsFractionCoin(product: { name: string; weight: number }): boolean {
    return isFractionCoin(product) && /\bUS\b/i.test(product.name)
}

/**
 * Which variant a product is: US (small coins), CombiBar, PAMP or PAMP Diwali (bars); null for a regular product.
 * The main table hides variants until a search matches them.
 */
export function variantLabel(product: { name: string; weight: number }): VariantLabel | null {
    if (isUsFractionCoin(product)) return "US"
    if (!isBar(product.name) || isBonded(product.name)) return null
    if (/pamp/i.test(product.name)) return /diwali/i.test(product.name) ? "PAMP Diwali" : "PAMP"
    if (/combi/i.test(product.name)) return "CombiBar"
    return null
}

export function isVariantProduct(product: { name: string; weight: number }): boolean {
    return variantLabel(product) !== null
}

export interface VariantChoice<T> {
    label: typeof REGULAR_VARIANT | VariantLabel
    product: T
}

/**
 * The regular product and its variants at the same weight and metal, "Regular" first. Empty when the product has no
 * variants (or there is no single regular product to pair them with), so the Trade tab shows no dropdown.
 */
export function variantChoices<T extends { id: number; name: string; weight: number; metalType: MetalType }>(
    product: T,
    all: T[],
): VariantChoice<T>[] {
    const sameKind = isBar(product.name) ? (p: T) => isBar(p.name) : (p: T) => isFractionCoin(p)
    if (!sameKind(product) || isBonded(product.name)) return []
    const group = all.filter(
        (other) =>
            other.metalType === product.metalType &&
            Math.abs(other.weight - product.weight) < MERGE_TOLERANCE_G &&
            sameKind(other) &&
            !isBonded(other.name),
    )
    const regulars = group.filter((p) => !isVariantProduct(p))
    const variants = VARIANT_ORDER.flatMap((label) =>
        group.filter((p) => variantLabel(p) === label).map((p) => ({ label, product: p })),
    )
    if (regulars.length !== 1 || variants.length === 0) return []
    return [{ label: REGULAR_VARIANT, product: regulars[0] }, ...variants]
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
