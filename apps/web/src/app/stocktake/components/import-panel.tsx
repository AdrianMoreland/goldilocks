import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { parseJournalPaste, type ImportJournalResult, type StocktakeDetail } from "@goldilocks/shared-types"
import { useStocktakeApi } from "@/api/stocktake.api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Props {
    stocktake: StocktakeDetail
    locked: boolean
    onChanged: () => void
}

/** Paste the Physical Inventory Journal exactly as Excel copies it (header row included). */
export function ImportPanel({ stocktake, locked, onChanged }: Props) {
    const api = useStocktakeApi()
    const [text, setText] = useState("")
    const [result, setResult] = useState<ImportJournalResult | null>(null)

    // The same parser the server runs, so the preview matches what will be stored.
    const preview = text.trim() ? parseJournalPaste(text) : null

    const run = useMutation({
        mutationFn: () => api.importJournal(stocktake.id, text),
        onSuccess: (r) => {
            setResult(r)
            if (r.added > 0) setText("")
            toast.success(`${r.added} added, ${r.skippedExisting} already there`)
            onChanged()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    return (
        <div className="space-y-3 pt-3">
            <p className="text-muted-foreground text-sm">
                In Business Central open the Physical Inventory Journal, choose Open in Excel, select the table including the header row and paste it
                here. Lines already imported are left as they are, so pasting the same journal twice is safe. Business Central is not changed.
            </p>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={locked}
                rows={8}
                placeholder="Batch Name	Posting Date	Entry Type	Document No.	Item No.	Description	Location Code	..."
                className="font-mono text-xs"
            />
            {preview && (
                <p className="text-sm">
                    Ready: <strong>{preview.rows.length}</strong> lines
                    {preview.issues.length > 0 && <span className="text-destructive"> · {preview.issues.length} rows will be rejected</span>}
                </p>
            )}
            <div>
                <Button className="cursor-pointer" disabled={locked || !preview || preview.rows.length === 0 || run.isPending} onClick={() => run.mutate()}>
                    Import {preview?.rows.length ?? 0} lines
                </Button>
            </div>
            {(result?.issues.length ? result.issues : (preview?.issues ?? [])).length > 0 && (
                <ul className="max-h-48 list-disc space-y-1 overflow-y-auto pl-5 text-sm">
                    {(result?.issues.length ? result.issues : (preview?.issues ?? [])).map((i, n) => (
                        <li key={n}>
                            Row {i.row}: {i.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
