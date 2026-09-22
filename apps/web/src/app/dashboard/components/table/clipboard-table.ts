import { formatEuro, formatGrams, formatPercent } from "../../utils/formatters"
import { productColumnLabels } from "./product-columns"
import type { DisplayProduct } from "./product-grouping"

/** Columns that make sense as plain-text/table data — excludes selection checkboxes, the row-actions menu, and the hidden filter-only columns (productType, priceBucket). */
const EXPORTABLE_COLUMN_IDS = [
    "name", "metalType", "weight", "marketValue", "priceSell", "spreadSell", "priceBuy", "spreadBuy", "priceSellVatExcl",
] as const

type ExportableColumnId = (typeof EXPORTABLE_COLUMN_IDS)[number]

const CELL_VALUE: Record<ExportableColumnId, (p: DisplayProduct) => string> = {
    name: (p) => p.name,
    metalType: (p) => p.metalType,
    weight: (p) => formatGrams(p.weight),
    marketValue: (p) => formatEuro(p.marketValue),
    priceSell: (p) => formatEuro(p.priceSell),
    spreadSell: (p) => formatPercent(p.spreadSell * 100),
    priceBuy: (p) => formatEuro(p.priceBuy),
    spreadBuy: (p) => formatPercent(p.spreadBuy * 100),
    priceSellVatExcl: (p) => formatEuro(p.priceSellVatExcl),
}

/** Narrows an arbitrary column-id list (e.g. a table's current visible-column order) down to the ones this module knows how to export, in that same order. */
export function toExportableColumnIds(columnIds: string[]): ExportableColumnId[] {
    return columnIds.filter((id): id is ExportableColumnId => EXPORTABLE_COLUMN_IDS.includes(id as ExportableColumnId))
}

/**
 * Builds both a tab-separated (Excel/Sheets) and an HTML `<table>` (Outlook,
 * Word, Slack, anything that renders text/html) representation of the same
 * rows, so a single clipboard write looks right everywhere it gets pasted.
 */
export function buildClipboardPayload(
    products: DisplayProduct[],
    columnIds: ExportableColumnId[],
): { text: string; html: string } {
    const headers = columnIds.map((id) => productColumnLabels[id] ?? id)
    const rows = products.map((product) => columnIds.map((id) => CELL_VALUE[id](product)))

    const text = [headers, ...rows].map((cells) => cells.join("\t")).join("\n")

    const htmlRow = (cells: string[], tag: "th" | "td") =>
        `<tr>${cells.map((cell) => `<${tag} style="border:1px solid #ddd;padding:6px 10px;text-align:left;">${escapeHtml(cell)}</${tag}>`).join("")}</tr>`

    const html = `<table style="border-collapse:collapse;font-family:sans-serif;font-size:13px;">
        <thead>${htmlRow(headers, "th")}</thead>
        <tbody>${rows.map((row) => htmlRow(row, "td")).join("")}</tbody>
    </table>`

    return { text, html }
}

function escapeHtml(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
