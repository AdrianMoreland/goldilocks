import type { BaselineBarRow, BaselineCoinRow, LiveMetal, RawSheets } from "@goldilocks/shared-types"

/** Reads the monthly "Stock <month>" workbook into baseline rows. Gold and silver only; PGM and Melt come later. */

const BRANCH = /^(DU|CO|BL|BC)$/i
const text = (v: unknown): string => (v === null || v === undefined ? "" : String(v).trim())
const count = (v: unknown): number | null => {
    if (typeof v === "number") return Number.isFinite(v) ? v : null
    const t = text(v)
    return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null
}
const truthy = (v: unknown): boolean => v === true || /^(true|yes|x|1|sold)$/i.test(text(v))

/** First column whose header (trimmed, lower case) equals the name; the side pivot repeats headers, so first wins. */
function col(header: readonly unknown[], name: string): number {
    return header.findIndex((h) => text(h).toLowerCase() === name.toLowerCase())
}

function metalOf(sheetName: string): LiveMetal | null {
    const n = sheetName.trim().toUpperCase()
    if (n.startsWith("GOLD")) return "GOLD"
    if (n.startsWith("SILVER")) return "SILVER"
    return null
}

export interface StockSheetRead {
    bars: BaselineBarRow[]
    coins: BaselineCoinRow[]
    /** Tabs read, with how many rows each gave. */
    tabs: { name: string; rows: number }[]
    skippedTabs: string[]
}

export function readStockSheet(sheets: RawSheets): StockSheetRead {
    const bars: BaselineBarRow[] = []
    const coins: BaselineCoinRow[] = []
    const tabs: StockSheetRead["tabs"] = []
    const skippedTabs: string[] = []

    for (const [name, rows] of Object.entries(sheets)) {
        const metal = metalOf(name)
        const lower = name.toLowerCase()
        const kind = lower.includes("bars") ? "bars" : lower.includes("coins") ? "coins" : null
        if (!metal || !kind) {
            skippedTabs.push(name)
            continue
        }
        const header = rows[0] ?? []
        let added = 0

        if (kind === "bars") {
            const c = {
                branch: col(header, "Branch"),
                sold: col(header, "SOLD"),
                weight: col(header, "Weight"),
                refinery: col(header, "Refinery"),
                serial: col(header, "Serial"),
                details: col(header, "Details"),
                gram: col(header, "Gram"),
            }
            if (c.branch < 0 || c.weight < 0) {
                skippedTabs.push(name)
                continue
            }
            rows.slice(1).forEach((r, i) => {
                const weight = text(r[c.weight])
                const branch = text(r[c.branch])
                if (!weight && !branch) return
                bars.push({
                    metal,
                    row: i + 2,
                    branch,
                    weight,
                    refinery: c.refinery >= 0 ? text(r[c.refinery]) || null : null,
                    serial: c.serial >= 0 ? text(r[c.serial]) || null : null,
                    grams: c.gram >= 0 ? count(r[c.gram]) : null,
                    details: c.details >= 0 ? text(r[c.details]) || null : null,
                    sold: c.sold >= 0 && truthy(r[c.sold]),
                })
                added += 1
            })
        } else {
            const item = col(header, "Weight")
            if (item < 0) {
                skippedTabs.push(name)
                continue
            }
            // A branch column is headed by its code; its details column is the next "Details ..." column after it.
            const branchCols: { code: string; at: number; details: number }[] = []
            header.forEach((h, at) => {
                const t = text(h)
                if (!BRANCH.test(t)) return
                let details = -1
                for (let j = at + 1; j < header.length; j++) {
                    const hj = text(header[j])
                    if (BRANCH.test(hj)) break
                    if (hj.toLowerCase().startsWith("details")) {
                        details = j
                        break
                    }
                }
                branchCols.push({ code: t.toUpperCase(), at, details })
            })
            rows.slice(1).forEach((r, i) => {
                const label = text(r[item])
                if (!label) return
                const counts: Record<string, number | null> = {}
                const details: Record<string, string | null> = {}
                for (const b of branchCols) {
                    counts[b.code] = count(r[b.at])
                    details[b.code] = b.details >= 0 ? text(r[b.details]) || null : null
                }
                coins.push({ metal, row: i + 2, item: label, counts, details })
                added += 1
            })
        }
        tabs.push({ name, rows: added })
    }
    return { bars, coins, tabs, skippedTabs }
}
