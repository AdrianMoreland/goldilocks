import { variantGrams, type LiveStockLine } from "@goldilocks/shared-types"

export type StockLevel = "zero" | "low" | "ok"

/** Zero is out; at or under the line's own threshold (when it has one) is low. */
export function levelOf(line: Pick<LiveStockLine, "qty" | "lowThreshold">): StockLevel {
    if (line.qty <= 0) return "zero"
    if (line.lowThreshold !== null && line.qty <= line.lowThreshold) return "low"
    return "ok"
}

export interface CoinFamily {
    family: string
    total: number
    rows: LiveStockLine[]
}

export interface BarWeight {
    variant: string
    total: number
    unassigned: number
    /** One line per refinery in stock (or all of them with "show all"). */
    lines: LiveStockLine[]
}

export interface GroupOptions {
    showAll: boolean
    query: string
}

function matches(line: LiveStockLine, q: string): boolean {
    if (!q) return true
    const hay = [line.family, line.variant, line.refinery, ...line.bars.map((b) => b.serial)].join(" ").toLowerCase()
    return q
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((w) => hay.includes(w))
}

function visible(lines: LiveStockLine[], { showAll, query }: GroupOptions): LiveStockLine[] {
    return lines.filter((l) => (showAll || l.qty > 0 || l.unassigned > 0) && matches(l, query.trim()))
}

/** Coins by family (Other last), each family's variants smallest weight first. */
export function groupCoins(lines: LiveStockLine[], opts: GroupOptions): CoinFamily[] {
    const byFamily = new Map<string, LiveStockLine[]>()
    for (const l of visible(lines.filter((x) => x.kind === "COIN"), opts)) {
        byFamily.set(l.family, [...(byFamily.get(l.family) ?? []), l])
    }
    return [...byFamily.entries()]
        .map(([family, rows]) => ({
            family,
            total: rows.reduce((n, r) => n + r.qty, 0),
            rows: [...rows].sort((a, b) => variantGrams(a.variant) - variantGrams(b.variant) || a.variant.localeCompare(b.variant)),
        }))
        .sort((a, b) => (a.family === "Other" ? 1 : b.family === "Other" ? -1 : a.family.localeCompare(b.family)))
}

/** Bars by weight (smallest first), each with the refineries in stock. */
export function groupBars(lines: LiveStockLine[], opts: GroupOptions): BarWeight[] {
    const byWeight = new Map<string, LiveStockLine[]>()
    for (const l of visible(lines.filter((x) => x.kind === "BAR"), opts)) {
        byWeight.set(l.variant, [...(byWeight.get(l.variant) ?? []), l])
    }
    return [...byWeight.entries()]
        .map(([variant, rows]) => ({
            variant,
            total: rows.reduce((n, r) => n + r.qty, 0),
            unassigned: rows.reduce((n, r) => n + r.unassigned, 0),
            lines: [...rows].sort((a, b) => b.qty - a.qty || a.refinery.localeCompare(b.refinery)),
        }))
        .sort((a, b) => variantGrams(a.variant) - variantGrams(b.variant) || a.variant.localeCompare(b.variant))
}

/** Reasons offered as one-tap chips when typing a count. */
export const REASONS = ["Recount", "Sold at counter", "Received", "Found", "Damaged", "Other"] as const

export const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())

export const lineName = (l: Pick<LiveStockLine, "family" | "variant" | "refinery" | "kind">) =>
    l.kind === "BAR" ? `${l.variant} bar${l.refinery ? ` · ${titleCase(l.refinery)}` : ""}` : `${l.family} ${l.variant}`.trim()

