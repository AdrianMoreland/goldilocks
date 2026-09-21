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

export const formatGrams = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} g` : "—"

/** Expects an already-scaled percentage (23, not 0.23) — see the file-level note above. */
export const formatPercent = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(2)}%` : "—"
