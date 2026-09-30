import type { FetchSource } from "@goldilocks/shared-types"

/** How far each tier is from a fresh vendor call — the summary badge shows the furthest one, because a single cached or database-served metal is what a clerk needs to know about. */
const FETCH_SOURCE_DISTANCE: Record<FetchSource, number> = { live: 0, cache: 1, db: 2 }

export const FETCH_SOURCE_LABEL: Record<FetchSource, string> = {
    cache: "Cache",
    db: "Database",
    live: "Live API",
}

/** Picks the single least-live fetchSource across a set of cards/prices, for the one summary badge in the top nav. Undefined if none of them carry a fetchSource (e.g. still loading). */
export function summarizeFetchSource(items: { fetchSource?: FetchSource }[]): FetchSource | undefined {
    let furthest: FetchSource | undefined

    for (const item of items) {
        if (!item.fetchSource) continue
        if (!furthest || FETCH_SOURCE_DISTANCE[item.fetchSource] > FETCH_SOURCE_DISTANCE[furthest]) {
            furthest = item.fetchSource
        }
    }

    return furthest
}
