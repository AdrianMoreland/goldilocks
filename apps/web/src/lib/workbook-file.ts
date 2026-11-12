import type { RawSheets } from "@goldilocks/shared-types"
import { plainValue } from "@/lib/tradesheet-reader"

/** Sheets past this many rows are not read: the assembled workbook's biggest table is about 14,000. */
const MAX_ROWS = 60000
const MAX_COLUMNS = 80

/** Reads every sheet of an .xlsx into plain rows (first row = header). Runs in the browser; nothing is sent anywhere. */
export async function readSheets(file: File): Promise<RawSheets> {
    const { Workbook } = await import("exceljs")
    const wb = new Workbook()
    const bytes = await file.arrayBuffer()
    try {
        await wb.xlsx.load(bytes)
    } catch {
        // Business Central exports write every tag with an "x:" prefix and absolute part paths, which ExcelJS cannot read.
        await wb.xlsx.load(await repairPrefixedXlsx(bytes))
    }
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

/** Path of `target` (from the package root) relative to the folder `dir`, as a relationship part expects it. */
function relativeTarget(dir: string, target: string): string {
    const from = dir.split("/").filter(Boolean)
    const to = target.split("/")
    let i = 0
    while (i < from.length && i < to.length - 1 && from[i] === to[i]) i++
    return [...from.slice(i).map(() => ".."), ...to.slice(i)].join("/")
}

/**
 * Rewrites an .xlsx so ExcelJS can open it: drops the byte-order mark, the "x:" namespace prefix on SpreadsheetML tags,
 * and turns absolute relationship targets ("/xl/workbook.xml") into relative ones. Cell values are not touched.
 */
export async function repairPrefixedXlsx(bytes: ArrayBuffer): Promise<ArrayBuffer> {
    const { default: JSZip } = await import("jszip")
    const zip = await JSZip.loadAsync(bytes)
    for (const name of Object.keys(zip.files).filter((n) => /\.(xml|rels)$/.test(n))) {
        const dir = name.replace(/_rels\/[^/]+$/, "")
        const xml = (await zip.file(name)!.async("string"))
            .replace(/^\uFEFF/, "")
            .replace(/<(\/?)x:/g, "<$1")
            .replace(/xmlns:x=/g, "xmlns=")
            .replace(/Target="\/([^"]+)"/g, (_, target: string) => `Target="${relativeTarget(dir, target)}"`)
        zip.file(name, xml)
    }
    return zip.generateAsync({ type: "arraybuffer" })
}
