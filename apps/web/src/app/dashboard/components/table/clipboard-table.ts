import { formatGrams, formatPercent, formatPrice } from "../../utils/formatters"
import { renderHtmlTable } from "../../utils/html-table"
import { productColumnLabels } from "./product-columns"
import type { DisplayProduct } from "./product-grouping"

/** Columns that make sense as plain-text/table data - excludes selection checkboxes, the row-actions menu, and the hidden filter-only columns (productType, priceBucket). */
const EXPORTABLE_COLUMN_IDS = [
    "name", "metalType", "weight", "marketValue", "priceSell", "spreadSell", "priceBuy", "spreadBuy", "priceSellVatExcl",
] as const

type ExportableColumnId = (typeof EXPORTABLE_COLUMN_IDS)[number]

const CELL_VALUE: Record<ExportableColumnId, (p: DisplayProduct) => string> = {
    name: (p) => p.name,
    metalType: (p) => p.metalType,
    weight: (p) => formatGrams(p.weight),
    marketValue: (p) => formatPrice(p.marketValue),
    priceSell: (p) => formatPrice(p.priceSell),
    spreadSell: (p) => formatPercent(p.spreadSell * 100),
    priceBuy: (p) => formatPrice(p.priceBuy),
    spreadBuy: (p) => formatPercent(p.spreadBuy * 100),
    priceSellVatExcl: (p) => formatPrice(p.priceSellVatExcl),
}

/** Narrows an arbitrary column-id list (e.g. a table's current visible-column order) down to the ones this module knows how to export, in that same order. */
export function toExportableColumnIds(columnIds: string[]): ExportableColumnId[] {
    return columnIds.filter((id): id is ExportableColumnId => EXPORTABLE_COLUMN_IDS.includes(id as ExportableColumnId))
}

/** Which price sides an Easy Copy shows: the Price columns, the Buyback columns, or both (always Price first, as in the customer email). */
export interface PriceScope {
    price: boolean
    buyback: boolean
}

const PRICE_SIDE_IDS: ExportableColumnId[] = ["priceSell", "spreadSell", "priceSellVatExcl"]
const BUYBACK_SIDE_IDS: ExportableColumnId[] = ["priceBuy", "spreadBuy"]
const FIGURE_IDS: ExportableColumnId[] = ["priceSell", "spreadSell", "priceBuy", "spreadBuy", "priceSellVatExcl"]

/**
 * Applies a price scope to the table's visible columns: the other columns stay in their order, then the chosen price
 * sides follow, Price before Buyback, each with its percentage. A side the table has hidden is still added when asked for.
 */
export function applyPriceScope(columnIds: ExportableColumnId[], scope: PriceScope): ExportableColumnId[] {
    const rest = columnIds.filter((id) => !PRICE_SIDE_IDS.includes(id) && !BUYBACK_SIDE_IDS.includes(id))
    const withVat = columnIds.includes("priceSellVatExcl") ? PRICE_SIDE_IDS : PRICE_SIDE_IDS.filter((id) => id !== "priceSellVatExcl")
    return [...rest, ...(scope.price ? withVat : []), ...(scope.buyback ? BUYBACK_SIDE_IDS : [])]
}

/**
 * Builds both a tab-separated (Excel/Sheets) and an HTML `<table>` (Outlook,
 * Word, Slack, anything that renders text/html) representation of the same
 * rows, so a single clipboard write looks right everywhere it gets pasted.
 * The HTML table is the same gold-headed table the customer email uses.
 */
export function buildClipboardPayload(
    products: DisplayProduct[],
    columnIds: ExportableColumnId[],
): { text: string; html: string } {
    const headers = columnIds.map((id) => productColumnLabels[id] ?? id)
    const rows = products.map((product) => columnIds.map((id) => CELL_VALUE[id](product)))

    const text = [headers, ...rows].map((cells) => cells.join("\t")).join("\n")
    const html = renderHtmlTable(headers, rows, (i) => FIGURE_IDS.includes(columnIds[i]))

    return { text, html }
}
