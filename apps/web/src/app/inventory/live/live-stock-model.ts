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

const familyOrder = (a: string, b: string) => (a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b))

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
        .sort((a, b) => familyOrder(a.family, b.family))
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

/** What a summary tile filters the list to. */
export type StockFilter = "coins" | "bars" | "low" | "pick" | "proof"

export interface BoardSummary {
    coins: number
    bars: number
    /** Lines at or under their own low mark (empty lines are "none", not low). */
    low: number
    /** Bars sold from the sheet whose serial is not known yet. */
    toPick: number
}

export function summarise(lines: LiveStockLine[]): BoardSummary {
    let coins = 0
    let bars = 0
    let low = 0
    let toPick = 0
    for (const l of lines) {
        if (l.kind === "COIN") coins += l.qty
        else bars += l.qty
        if (levelOf(l) === "low") low += 1
        toPick += l.unassigned
    }
    return { coins, bars, low, toPick }
}

/** Keeps the lines a summary tile asks for; no filter keeps everything. */
export function applyFilter(lines: LiveStockLine[], filter: StockFilter | null): LiveStockLine[] {
    switch (filter) {
        case "coins":
            return lines.filter((l) => l.kind === "COIN")
        case "bars":
            return lines.filter((l) => l.kind === "BAR")
        case "low":
            return lines.filter((l) => levelOf(l) === "low")
        case "pick":
            return lines.filter((l) => l.unassigned > 0)
        case "proof":
            return lines.filter((l) => /\bproof\b/i.test(l.variant))
        default:
            return lines
    }
}

/**
 * The level of several lines counted together (all refineries of one bar weight). Low when the total is at or under
 * the sum of the low marks that are set, so one line keeps exactly the meaning of levelOf.
 */
export function levelOfMany(lines: Pick<LiveStockLine, "qty" | "lowThreshold">[]): StockLevel {
    const qty = lines.reduce((n, l) => n + l.qty, 0)
    const marked = lines.filter((l) => l.lowThreshold !== null)
    if (qty <= 0) return "zero"
    if (marked.length > 0 && qty <= marked.reduce((n, l) => n + (l.lowThreshold ?? 0), 0)) return "low"
    return "ok"
}

export interface GridCell {
    qty: number
    level: StockLevel
}

export interface GridRow {
    key: string
    label: string
    /** By branch code; a branch without the line has no cell. */
    cells: Record<string, GridCell>
    total: number
}

export interface GridGroup {
    kind: "BAR" | "COIN"
    rows: GridRow[]
}

/**
 * Every line across branches, for comparing counts: bars one row per weight (refineries added up), coins one row per
 * family and variant. Rows that are empty everywhere are left out; they only push the useful rows off the screen.
 */
export function branchGrid(boards: { code: string; lines: LiveStockLine[] }[]): GridGroup[] {
    const rows = new Map<string, { kind: "BAR" | "COIN"; family: string; variant: string; byBranch: Map<string, LiveStockLine[]> }>()
    for (const { code, lines } of boards) {
        for (const l of lines) {
            const key = l.kind === "BAR" ? `BAR|${l.variant}` : `COIN|${l.family}|${l.variant}`
            const row = rows.get(key) ?? { kind: l.kind, family: l.family, variant: l.variant, byBranch: new Map() }
            row.byBranch.set(code, [...(row.byBranch.get(code) ?? []), l])
            rows.set(key, row)
        }
    }
    const built = [...rows.entries()]
        .map(([key, r]) => {
            const cells: Record<string, GridCell> = {}
            for (const [code, ls] of r.byBranch) cells[code] = { qty: ls.reduce((n, l) => n + l.qty, 0), level: levelOfMany(ls) }
            const total = Object.values(cells).reduce((n, c) => n + c.qty, 0)
            return { ...r, key, label: r.kind === "BAR" ? `${r.variant} bar` : `${r.family} ${r.variant}`.trim(), cells, total }
        })
        .filter((r) => r.total > 0)
    const bySize = (a: { variant: string }, b: { variant: string }) => variantGrams(a.variant) - variantGrams(b.variant) || a.variant.localeCompare(b.variant)
    const strip = ({ key, label, cells, total }: GridRow) => ({ key, label, cells, total })
    return [
        { kind: "BAR" as const, rows: built.filter((r) => r.kind === "BAR").sort(bySize).map(strip) },
        { kind: "COIN" as const, rows: built.filter((r) => r.kind === "COIN").sort((a, b) => familyOrder(a.family, b.family) || bySize(a, b)).map(strip) },
    ].filter((g) => g.rows.length > 0)
}

/** Reasons offered as one-tap chips when typing a count. */
export const REASONS = ["Recount", "Sold at counter", "Received", "Found", "Damaged", "Other"] as const

export const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())

export const lineName = (l: Pick<LiveStockLine, "family" | "variant" | "refinery" | "kind">) =>
    l.kind === "BAR" ? `${l.variant} bar${l.refinery ? ` · ${titleCase(l.refinery)}` : ""}` : `${l.family} ${l.variant}`.trim()


// ---------------------------------------------------------------- edit mode draft

/** Counts changed in edit mode but not saved yet, by line id; each keeps its line so it can be saved from any board. */
export type CountDraft = Record<number, { line: LiveStockLine; qty: number }>

/** One step up or down on a line in the draft (never below 0); back at the saved count, the line leaves the draft. */
export function stepDraft(draft: CountDraft, line: LiveStockLine, delta: number): CountDraft {
    const from = draft[line.id]?.qty ?? line.qty
    const qty = Math.max(0, from + delta)
    const next = { ...draft }
    if (qty === line.qty) delete next[line.id]
    else next[line.id] = { line, qty }
    return next
}

/** The lines as they would be after saving the draft, so totals and groups show the new counts while editing. */
export function withDraft(lines: LiveStockLine[], draft: CountDraft): LiveStockLine[] {
    return lines.map((l) => (draft[l.id] ? { ...l, qty: draft[l.id].qty } : l))
}

export interface DraftChange {
    lineId: number
    label: string
    from: number
    to: number
}

/** The draft as a list to review and save, in the order the lines were first changed. */
export function draftChanges(draft: CountDraft): DraftChange[] {
    return Object.values(draft).map(({ line, qty }) => ({ lineId: line.id, label: lineName(line), from: line.qty, to: qty }))
}
