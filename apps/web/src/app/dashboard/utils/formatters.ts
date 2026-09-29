/**
 * Shared display formatters for the pricing workbook — euro currency, gram
 * weights, and percentages. Used by both the pricing-tools panel and the
 * product table, so this lives one level up from either rather than inside
 * pricing-tools/ (where a second, incompatible formatPercent once got
 * defined locally in the table code — same name, same signature, but
 * expecting a raw fraction instead of an already-scaled percentage. Only
 * one definition exists now; every call site is expected to pass an
 * already-scaled value, e.g. `formatPercent(spreadSell * 100)`).
 */

export const formatEuro = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value)
        ? new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(value)
        : "—"

const wholeEuro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 })

/**
 * Quoted prices (Price, Buyback, totals) — whole euros, no cents. The API
 * already rounds them in the dealer's favour (up when we charge, down when
 * we pay); Math.round here only absorbs anything that isn't a quoted price
 * yet (market value). Keep formatEuro for per-gram and other precise figures.
 */
export const formatPrice = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? wholeEuro.format(Math.round(value)) : "—"

/** Spot prices: whole euros for gold, platinum and palladium; silver (tens of euros an ounce) keeps its cents. */
export const formatSpot = (metal: string, value: number | null | undefined) =>
    metal === "SILVER" ? formatEuro(value) : formatPrice(value)

export const formatGrams = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} g` : "—"

/** Expects an already-scaled percentage (23, not 0.23) — see the file-level note above. */
export const formatPercent = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(2)}%` : "—"

/** "less than 1 minute ago" / "14 minutes ago" — used for both the top-nav "Last Updated" line and each metal card's freshness tooltip, so the two never phrase the same age differently. */
export function formatMinutesAgo(isoTimestamp: string | null | undefined): string {
    if (!isoTimestamp) return "unknown"

    const diffMins = Math.floor((Date.now() - new Date(isoTimestamp).getTime()) / 60000)
    if (diffMins < 1) return "less than 1 minute ago"

    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
}

/** "GOLD" -> "Gold" — for anywhere a metal enum would otherwise leak into copy verbatim. */
export const formatMetalName = (metal: string) => metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase()
