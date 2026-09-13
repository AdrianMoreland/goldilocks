import { GRAMS_PER_TROY_OUNCE, type MetalType, type Product } from "@goldilocks/shared-types"

export type ProductGroup = "bar" | "coin" | "bonded"

export type DisplayProduct = Product & { productType: ProductGroup }

const METAL_WORDS: Record<MetalType, string> = {
    GOLD: "gold",
    SILVER: "silver",
    PLATINUM: "platinum",
    PALLADIUM: "palladium",
}

const ONE_OZ_TOLERANCE_G = 0.5
const MERGE_TOLERANCE_G = 0.05

// The only fractional coin weights that get collapsed into one generic row
// per metal. 1oz coins and sovereigns keep their specific mint/name — see
// isConcreteCoin below.
const COIN_MERGE_TARGETS: { label: string; weightGrams: number }[] = [
    { label: "1/10oz Coin", weightGrams: GRAMS_PER_TROY_OUNCE / 10 },
    { label: "1/4oz Coin", weightGrams: GRAMS_PER_TROY_OUNCE / 4 },
    { label: "1/2oz Coin", weightGrams: GRAMS_PER_TROY_OUNCE / 2 },
    { label: "1g Coin", weightGrams: 1 },
]

function isBar(name: string): boolean {
    return /bar/i.test(name)
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

/** 1oz coins and sovereigns are the only coins with "concrete" (mint-specific) names — everything else is a merge candidate. */
function isConcreteCoin(product: Product): boolean {
    return isOneOz(product.weight) || isSovereign(product.name)
}

function findCoinMergeLabel(weightGrams: number): string | null {
    const match = COIN_MERGE_TARGETS.find((t) => Math.abs(weightGrams - t.weightGrams) < MERGE_TOLERANCE_G)
    return match?.label ?? null
}

/** "1 oz Gold Bar" -> "1oz Bar", "500 g Gold Bar" -> "500g Bar" — drops the
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

function average(values: number[]): number {
    return values.reduce((sum, v) => sum + v, 0) / values.length
}

function mergeCoinGroup(metalType: MetalType, label: string, group: Product[]): DisplayProduct {
    const mostRecent = group.reduce((latest, p) => (p.updatedAt > latest.updatedAt ? p : latest), group[0])

    return {
        id: group[0].id,
        sku: group.map((p) => p.sku).join(" / "),
        name: label,
        metalType,
        weight: average(group.map((p) => p.weight)),
        spotPrice: average(group.map((p) => p.spotPrice)),
        marketValue: average(group.map((p) => p.marketValue)),
        spreadSell: average(group.map((p) => p.spreadSell)),
        spreadBuy: average(group.map((p) => p.spreadBuy)),
        vatRate: average(group.map((p) => p.vatRate)),
        priceSell: average(group.map((p) => p.priceSell)),
        priceSellVatExcl: average(group.map((p) => p.priceSellVatExcl)),
        priceBuy: average(group.map((p) => p.priceBuy)),
        description: `Averaged across ${group.length} coin types: ${group.map((p) => p.name).join(", ")}`,
        stock: group.reduce((sum, p) => sum + p.stock, 0),
        isActive: group.some((p) => p.isActive),
        createdAt: mostRecent.createdAt,
        updatedAt: mostRecent.updatedAt,
        productType: "coin",
    }
}

/**
 * Builds the display-ready product list: bars renamed to drop the metal
 * word (weight order), then coins (reverse weight order) — with 1oz coins
 * and sovereigns kept as their specific mint/name, and every other
 * fractional coin weight (1/2oz, 1/4oz, 1/10oz, 1g) collapsed into one
 * generic "{fraction} Coin" row per metal, averaging price/premium across
 * whichever mint variants exist at that weight and summing their stock.
 *
 * This is purely a display transform — the underlying per-mint products in
 * the database are untouched, so per-mint stock tracking still works.
 */
export function buildDisplayProducts(products: Product[]): DisplayProduct[] {
    const bars: DisplayProduct[] = []
    const concreteCoins: DisplayProduct[] = []
    const bonded: DisplayProduct[] = []
    const mergeGroups = new Map<string, Product[]>()

    for (const product of products) {
        // "Bonded" (deferred-VAT storage) products get their own section
        // under Coins, regardless of whether they're bar- or coin-shaped —
        // they're priced differently from the standard stock and shouldn't
        // blend into either regular list. Only Silver has these today.
        if (isBonded(product.name)) {
            bonded.push({
                ...product,
                name: isBar(product.name) ? stripMetalWord(product.name, product.metalType) : product.name,
                productType: "bonded",
            })
            continue
        }

        if (isBar(product.name)) {
            bars.push({
                ...product,
                name: stripMetalWord(product.name, product.metalType),
                productType: "bar",
            })
            continue
        }

        if (isConcreteCoin(product)) {
            concreteCoins.push({ ...product, productType: "coin" })
            continue
        }

        const mergeLabel = findCoinMergeLabel(product.weight)
        if (!mergeLabel) {
            // Doesn't match a known merge weight — fall back to showing it as-is.
            concreteCoins.push({ ...product, productType: "coin" })
            continue
        }

        const key = `${product.metalType}|${mergeLabel}`
        const group = mergeGroups.get(key) ?? []
        group.push(product)
        mergeGroups.set(key, group)
    }

    const mergedCoins: DisplayProduct[] = Array.from(mergeGroups.entries()).map(([key, group]) => {
        const [metalType, label] = key.split("|") as [MetalType, string]
        return mergeCoinGroup(metalType, label, group)
    })

    bars.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name))
    bonded.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name))

    const coins = [...concreteCoins, ...mergedCoins].sort(
        (a, b) => b.weight - a.weight || a.name.localeCompare(b.name),
    )

    return [...bars, ...coins, ...bonded]
}
