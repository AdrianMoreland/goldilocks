import type { Cell, CellValue, Workbook, Worksheet } from "exceljs"
import {
    classifyTab,
    fillKind,
    findHeaderRow,
    isReferenceCell,
    type ImportSource,
    mapPurchaseHeaders,
    mapSaleHeaders,
    type TradesheetImportRequest,
    type TradesheetTab,
} from "@goldilocks/shared-types"

/** Columns past this are bank and scratch columns; the API accepts at most 80. */
const MAX_COLUMNS = 60
type Plain = string | number | boolean | null

/** Rows past this are refused by the API (6000 a tab); a real month is a few hundred. */
const MAX_ROWS = 6000
/** How many top rows to look through for the header. */
const HEADER_LOOKAHEAD = 5

/** What a cell holds as plain data: a formula's result, rich text as text, a hyperlink's label, an error as text. */
export function plainValue(v: CellValue): string | number | boolean | null {
    if (v === null || v === undefined) return null
    if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString()
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return v
    if ("error" in v) return String(v.error)
    if ("result" in v) return plainValue((v.result ?? null) as CellValue)
    if ("richText" in v) return v.richText.map((t) => t.text).join("")
    if ("text" in v) return String(v.text)
    return null
}

const fillOf = (cell: Cell): string | null => {
    const f = cell.fill
    if (!f || f.type !== "pattern" || f.pattern !== "solid") return null
    const argb = f.fgColor?.argb
    return argb && fillKind(argb) !== "NONE" ? argb : null
}

const isBlank = (v: string | number | boolean | null) => v === null || (typeof v === "string" && v.trim() === "")

function readTab(ws: Worksheet, source: ImportSource): TradesheetTab {
    const { kind } = classifyTab(ws.name, source)
    const skipped: TradesheetTab = { name: ws.name, headerRow: 1, headers: [], rows: [] }
    if (!kind) return skipped

    const isSale = kind === "IE_GOLD_SALES" || kind === "IE_SILVER_SALES"
    const columns = Math.min(Math.max(ws.columnCount, 1), MAX_COLUMNS)
    const rowValues = (rowNumber: number): Plain[] => {
        const row = ws.getRow(rowNumber)
        return Array.from({ length: columns }, (_, i) => plainValue(row.getCell(i + 1).value))
    }

    // The header is on row 1 in the real sheets and row 2 in the July copy, under a timestamp.
    const top: Plain[][] = []
    for (let r = 1; r <= Math.min(HEADER_LOOKAHEAD, ws.rowCount); r++) top.push(rowValues(r))
    const headerIndex = findHeaderRow(top, isSale ? "sale" : "purchase")
    if (headerIndex === -1) return { ...skipped, headers: top[0] ?? [] }

    const headers = top[headerIndex] ?? []
    const map = isSale ? mapSaleHeaders(headers) : mapPurchaseHeaders(headers)
    const referenceColumn = map.reference
    if (referenceColumn === undefined) return { ...skipped, headerRow: headerIndex + 1, headers }

    // Sheets are padded to thousands of formatted rows. Only a row with a reference is a trade or a purchase,
    // which is also what the API keeps, so the rest never leave the browser.
    const rows: TradesheetTab["rows"] = []
    ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber <= headerIndex + 1) return
        const ref = plainValue(row.getCell(referenceColumn + 1).value)
        if (isBlank(ref) || !isReferenceCell(String(ref))) return
        const cells: Plain[] = []
        const fills: Record<string, string> = {}
        for (let c = 0; c < columns; c++) {
            const cell = row.getCell(c + 1)
            cells.push(plainValue(cell.value))
            const fill = fillOf(cell)
            if (fill) fills[String(c)] = fill
        }
        rows.push({ row: rowNumber, cells, ...(Object.keys(fills).length > 0 ? { fills } : {}) })
    })
    if (rows.length > MAX_ROWS) throw new Error(`${ws.name} has ${rows.length} rows with a reference; the limit is ${MAX_ROWS}.`)
    return { name: ws.name, headerRow: headerIndex + 1, headers, rows }
}

/** One request body from an already-loaded workbook. Tabs the importer does not read are sent empty, so the preview can name them. */
export function workbookToRequest(
    wb: Workbook,
    fileName: string,
    sheetMonth: string,
    source: ImportSource = "TRADESHEET",
): TradesheetImportRequest {
    return {
        fileName,
        sheetMonth,
        source,
        tabs: wb.worksheets.map((ws) => readTab(ws, source)),
    }
}

/** Reads a dropped .xlsx. exceljs is large, so it loads only when a file is chosen. */
export async function readTradesheetFile(
    file: File,
    sheetMonth: string,
    source: ImportSource = "TRADESHEET",
): Promise<TradesheetImportRequest> {
    const { Workbook: WorkbookClass } = await import("exceljs")
    const wb = new WorkbookClass()
    await wb.xlsx.load(await file.arrayBuffer())
    return workbookToRequest(wb, file.name, sheetMonth, source)
}
