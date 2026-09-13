export const formatEuro = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value)
        ? new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(value)
        : "—"

export const formatGrams = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} g` : "—"

export const formatPercent = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(2)}%` : "—"
