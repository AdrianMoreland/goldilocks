export interface SheetSpec {
    name: string
    headers: readonly string[]
    rows: (string | number)[][]
}

/**
 * Builds an .xlsx in the browser and saves it. exceljs is large, so it is loaded only when someone presses
 * the button. Cells keep their types: counts stay numbers (usable in formulas), item numbers stay text.
 */
export async function downloadWorkbook(filename: string, sheets: SheetSpec[]) {
    const { Workbook } = await import("exceljs")
    const wb = new Workbook()
    for (const spec of sheets) {
        // Excel sheet names: at most 31 characters, none of \ / ? * [ ]
        const ws = wb.addWorksheet(spec.name.replace(/[\\/?*[\]]/g, " ").slice(0, 31))
        ws.addRow([...spec.headers])
        // An ISO date string becomes a real date cell, so Excel sorts and formats it as a date. UTC midnight
        // keeps the day the same in every time zone.
        const asDate = (v: string | number) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00Z`) : v)
        for (const row of spec.rows) {
            const added = ws.addRow(row.map(asDate))
            added.eachCell((cell) => {
                if (cell.value instanceof Date) cell.numFmt = "dd/mm/yyyy"
            })
        }
        const header = ws.getRow(1)
        header.font = { bold: true }
        header.alignment = { vertical: "top", wrapText: true }
        ws.views = [{ state: "frozen", ySplit: 1 }]
        ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: spec.headers.length } }
        spec.headers.forEach((h, i) => {
            const longest = spec.rows.reduce((m, r) => Math.max(m, String(r[i] ?? "").length), 0)
            ws.getColumn(i + 1).width = Math.min(48, Math.max(10, Math.min(h.length, 24), longest + 2))
        })
    }
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}
