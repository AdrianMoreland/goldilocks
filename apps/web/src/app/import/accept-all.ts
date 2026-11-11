import type { AliasRow, NameSuggestionTarget } from "@goldilocks/shared-types"

type Suggestion = AliasRow["suggestion"]

/** The suggestion as the server compares it: exactly one of a pricing product, a specific product, "not a product". */
export function expectedOf(s: NonNullable<Suggestion>): NameSuggestionTarget {
    if (s.kind === "NOT_A_PRODUCT") return { noProduct: true }
    if (s.kind === "SPECIFIC") return { salesProductId: s.id as number }
    return { productId: s.id as number }
}

export interface AcceptAllPlan {
    items: { id: number; expected: NameSuggestionTarget }[]
    /** Names in the plan that have no pricing row of their own yet: they go to the generic coin row. */
    catalogueGaps: number
    /** "Not a product" suggestions, left out: each needs its own Yes. */
    notProducts: number
}

/**
 * What Accept all takes: every name waiting for a Yes or No, except "not a product" suggestions. Each item carries
 * the suggestion the person saw, so the server skips a name whose suggestion changed since.
 */
export function planAcceptAll(rows: readonly AliasRow[]): AcceptAllPlan {
    const items: AcceptAllPlan["items"] = []
    let catalogueGaps = 0
    let notProducts = 0
    for (const r of rows) {
        if (r.decidedBy !== null || r.confidence !== "LIKELY" || r.suggestion === null) continue
        if (r.suggestion.kind === "NOT_A_PRODUCT") {
            notProducts++
            continue
        }
        items.push({ id: r.id, expected: expectedOf(r.suggestion) })
        if (r.catalogueGap) catalogueGaps++
    }
    return { items, catalogueGaps, notProducts }
}
