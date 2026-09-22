import type { FetchSource } from "@goldilocks/shared-types"

/** How notable each tier is, for picking one badge to represent several metals — a live call is the most worth flagging (Redis+DB were both stale), a DB read next (Redis was cold), a cache hit least. */
const FETCH_SOURCE_RANK: Record<FetchSource, number> = { cache: 0, db: 1, live: 2 }

export const FETCH_SOURCE_LABEL: Record<FetchSource, string> = {
    cache: "Cache",
    db: "Database",
    live: "Live API",
}

/** Picks the single most-notable fetchSource across a set of cards/prices, for the one summary badge in the top nav. Undefined if none of them carry a fetchSource (e.g. still loading). */
export function summarizeFetchSource(items: { fetchSource?: FetchSource }[]): FetchSource | undefined {
    let worst: FetchSource | undefined

    for (const item of items) {
        if (!item.fetchSource) continue
        if (!worst || FETCH_SOURCE_RANK[item.fetchSource] > FETCH_SOURCE_RANK[worst]) {
            worst = item.fetchSource
        }
    }

    return worst
}
