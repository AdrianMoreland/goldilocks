import type { AnalyticsKpi, AnalyticsPreset, KpiUnit } from "@goldilocks/shared-types"

const eur0 = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
const eur2 = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
const int = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat("en-IE", { notation: "compact", maximumFractionDigits: 1 })

export const fmt = {
    eur: (n: number) => (Math.abs(n) < 100 ? eur2.format(n) : eur0.format(n)),
    eurCompact: (n: number) => `€${compact.format(n)}`,
    count: (n: number) => int.format(n),
    pct: (n: number, digits = 1) => `${(n * 100).toFixed(digits)}%`,
    seconds: (n: number) => `${n.toFixed(1)} s`,
    ms: (n: number) => `${int.format(n)} ms`,
    hours: (n: number) => (n >= 48 ? `${(n / 24).toFixed(1)} days` : `${n.toFixed(1)} h`),
}

export function formatKpi(value: number, unit: KpiUnit): string {
    switch (unit) {
        case "eur":
            return fmt.eur(value)
        case "pct":
            return fmt.pct(value)
        case "seconds":
            return fmt.seconds(value)
        case "ms":
            return fmt.ms(value)
        case "hours":
            return fmt.hours(value)
        default:
            return fmt.count(value)
    }
}

/** Change against the previous period. Percent figures change in points, others in percent. */
export function kpiChange(k: AnalyticsKpi): { text: string; up: boolean } | null {
    if (k.value === null || k.previous === null) return null
    if (k.unit === "pct") {
        const pts = (k.value - k.previous) * 100
        return { text: `${pts >= 0 ? "+" : ""}${pts.toFixed(1)} pts`, up: pts >= 0 }
    }
    if (k.previous === 0) return null
    const change = (k.value - k.previous) / Math.abs(k.previous)
    return { text: `${change >= 0 ? "+" : ""}${(change * 100).toFixed(1)}%`, up: change >= 0 }
}

const dayFmt = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", timeZone: "UTC" })
const monthFmt = new Intl.DateTimeFormat("en-IE", { month: "short", year: "2-digit", timeZone: "UTC" })
export const dayLabel = (iso: string) => dayFmt.format(new Date(`${iso}T00:00:00Z`))
export const monthLabel = (ym: string) => monthFmt.format(new Date(`${ym}-01T00:00:00Z`))

export const STEP_LABEL: Record<string, string> = {
    ORDERED: "Ordered",
    ARRIVED: "Arrived",
    ALLOCATED: "Allocated",
    MATCHED: "Matched",
    COLLECTED: "Collected",
    POSTED: "Posted",
}

/** Sentence case for enum labels such as INVOICED or AWAITING_HEDGE. */
export const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ")

export const PRESET_LABEL: Record<AnalyticsPreset, string> = { "30d": "30 days", "90d": "90 days", "12m": "12 months", ytd: "Year to date" }
