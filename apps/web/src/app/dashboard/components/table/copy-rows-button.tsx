import { toast } from "sonner"
import { buildClipboardPayload, toExportableColumnIds } from "./clipboard-table"
import type { DisplayProduct } from "./product-grouping"

/** Copies the selected rows as both TSV (Excel/Sheets) and an HTML table (Outlook/Word/Slack) in one clipboard write, so the paste looks like a real table wherever it lands. Used by the Trade tab's Easy Copy button. */
export async function copyRowsToClipboard(selectedProducts: DisplayProduct[], visibleColumnIds: string[]) {
    const count = selectedProducts.length
    const columnIds = toExportableColumnIds(visibleColumnIds)
    const { text, html } = buildClipboardPayload(selectedProducts, columnIds)

    try {
        if (typeof ClipboardItem !== "undefined") {
            await navigator.clipboard.write([
                new ClipboardItem({
                    "text/plain": new Blob([text], { type: "text/plain" }),
                    "text/html": new Blob([html], { type: "text/html" }),
                }),
            ])
        } else {
            await navigator.clipboard.writeText(text)
        }
        toast.success(`Copied ${count} row${count === 1 ? "" : "s"} to clipboard`)
    } catch {
        toast.error("Couldn't copy to clipboard")
    }
}
