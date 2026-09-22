import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { buildClipboardPayload, toExportableColumnIds } from "./clipboard-table"
import type { DisplayProduct } from "./product-grouping"

interface CopyRowsButtonProps {
    selectedProducts: DisplayProduct[]
    visibleColumnIds: string[]
}

/** Copies the selected rows as both TSV (Excel/Sheets) and an HTML table (Outlook/Word/Slack) in one clipboard write, so the paste looks like a real table wherever it lands. */
export function CopyRowsButton({ selectedProducts, visibleColumnIds }: CopyRowsButtonProps) {
    const count = selectedProducts.length

    const handleCopy = async () => {
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

    return (
        <Button variant="outline" size="sm" className="h-8 cursor-pointer" disabled={count === 0} onClick={handleCopy}>
            <Copy />
            Copy{count > 0 ? ` (${count})` : ""}
        </Button>
    )
}
