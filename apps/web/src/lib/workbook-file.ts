import type { RawSheets } from "@goldilocks/shared-types"
import { plainValue } from "@/lib/tradesheet-reader"

/** Sheets past this many rows are not read: the assembled workbook's biggest table is about 14,000. */
const MAX_ROWS = 60000
const MAX_COLUMNS = 80

/** Reads every sheet of an .xlsx into plain rows (first row = header). Runs in the browser; nothing is sent anywhere. */
export async function readSheets(file: File): Promise<RawSheets> {
    const { Workbook } = await import("exceljs")
    const wb = new Workbook()
    await wb.xlsx.load(await file.arrayBuffer())
    const sheets: Record<string, unknown[][]> = {}
    wb.eachSheet((ws) => {
        const columns = Math.min(Math.max(ws.columnCount, 1), MAX_COLUMNS)
        const rows: unknown[][] = []
        const last = Math.min(ws.rowCount, MAX_ROWS)
        for (let r = 1; r <= last; r++) {
            const row = ws.getRow(r)
            rows.push(Array.from({ length: columns }, (_, i) => plainValue(row.getCell(i + 1).value)))
        }
        sheets[ws.name] = rows
    })
    return sheets
}

/** Just the tab names and header rows, for deciding what a file is without reading all of it. */
export function headersOf(sheets: RawSheets): { name: string; headers: readonly unknown[] }[] {
    return Object.entries(sheets).map(([name, rows]) => ({ name, headers: rows[0] ?? [] }))
}
