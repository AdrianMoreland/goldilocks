import { toast } from "sonner"
import { Download, Printer } from "lucide-react"
import {
    buildJournalExportRows,
    buildRegisterExportRows,
    JOURNAL_EXPORT_HEADERS,
    REGISTER_EXPORT_HEADERS,
    summarizeLines,
    toCsv,
    type StocktakeDetail,
} from "@goldilocks/shared-types"
import { downloadTextFile } from "@/lib/download"
import { downloadWorkbook } from "@/lib/xlsx-export"
import { Button } from "@/components/ui/button"
import { buildReportHtml } from "./report-html"

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "stocktake"

/** What goes to the accounts team: the journal with the added columns, the register, and a printable summary. */
export function ReportPanel({ stocktake }: { stocktake: StocktakeDetail }) {
    const sum = summarizeLines(stocktake.lines)
    const open = stocktake.discrepancies.filter((d) => !d.resolved).length

    const printReport = () => {
        const w = window.open("", "_blank")
        if (!w) return void toast.error("Allow pop-ups for this site to print the report.")
        w.document.write(buildReportHtml(stocktake))
        w.document.close()
        w.focus()
        w.print()
    }

    return (
        <div className="space-y-4 pt-3">
            <ul className="text-sm">
                <li>{sum.lines} journal lines, {sum.counted} counted, {sum.uncounted} not counted</li>
                <li>{sum.withVariance} lines differ from Business Central (net variance {sum.netVariance})</li>
                <li>{stocktake.discrepancies.length} register entries, {open} still open</li>
            </ul>
            {sum.uncounted > 0 && <p className="text-sm text-amber-700 dark:text-amber-400">{sum.uncounted} lines are not counted yet; their count and variance columns stay blank in the export.</p>}
            <div className="flex flex-wrap gap-2">
                <Button
                    className="cursor-pointer"
                    disabled={sum.lines === 0}
                    onClick={() =>
                        downloadWorkbook(`stocktake-${slug(stocktake.name)}.xlsx`, [
                            {
                                name: "Physical Inventory Journals",
                                headers: JOURNAL_EXPORT_HEADERS,
                                rows: buildJournalExportRows(stocktake.lines, stocktake.cutoffDate),
                            },
                            {
                                name: "Discrepancies",
                                headers: REGISTER_EXPORT_HEADERS,
                                rows: buildRegisterExportRows(stocktake.discrepancies),
                            },
                        ]).catch(() => toast.error("Could not build the Excel file."))
                    }
                >
                    <Download /> Excel workbook (.xlsx)
                </Button>
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    disabled={sum.lines === 0}
                    onClick={() =>
                        downloadTextFile(
                            `physical-inventory-journal-${slug(stocktake.name)}.csv`,
                            toCsv(JOURNAL_EXPORT_HEADERS, buildJournalExportRows(stocktake.lines, stocktake.cutoffDate)),
                        )
                    }
                >
                    <Download /> Journal with counts (CSV)
                </Button>
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                        downloadTextFile(
                            `discrepancies-${slug(stocktake.name)}.csv`,
                            toCsv(REGISTER_EXPORT_HEADERS, buildRegisterExportRows(stocktake.discrepancies)),
                        )
                    }
                >
                    <Download /> Discrepancy register (CSV)
                </Button>
                <Button className="cursor-pointer" onClick={printReport}>
                    <Printer /> Print or save as PDF
                </Button>
            </div>
            <p className="text-muted-foreground text-xs">
                The CSV opens in Excel with the journal's own columns first, then the added columns. For a PDF choose "Save as PDF" in the print window. The
                Posting Date column holds the month-end cutoff date.
            </p>
        </div>
    )
}
