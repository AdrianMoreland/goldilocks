import {
    computeVariance,
    ISSUE_TYPE_LABELS,
    summarizeBars,
    summarizeLines,
    type PhysicalRegister,
    type StocktakeDetail,
} from "@goldilocks/shared-types"

const esc = (s: string | number | null | undefined) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

/**
 * A self-contained page for printing or saving as PDF: summary, differences, the discrepancy register and the
 * sign-off block from the month-end guide. Everything is escaped because item names and notes are typed by people.
 */
export function buildReportHtml(s: StocktakeDetail, register?: PhysicalRegister): string {
    const sum = summarizeLines(s.lines)
    const diffs = s.lines.filter((l) => {
        const v = computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted)
        return v !== null && v !== 0
    })
    const uncounted = s.lines.filter((l) => !l.counted)
    const open = s.discrepancies.filter((d) => !d.resolved).length

    const diffRows = diffs
        .map(
            (l) =>
                `<tr><td>${esc(l.itemNo)}</td><td>${esc(l.description)}</td><td>${esc(l.locationCode)}</td><td class="n">${l.qtyCalculated}</td><td class="n">${l.countedNormal ?? ""}</td><td class="n">${l.countedCustomer ?? ""}</td><td class="n">${computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted)}</td><td>${esc(l.reason)}</td></tr>`,
        )
        .join("")
    const regRows = s.discrepancies
        .map(
            (d) =>
                `<tr><td>${esc(d.itemNo)}</td><td>${esc(d.description)}</td><td>${ISSUE_TYPE_LABELS[d.issueType]}</td><td>${esc(d.bcShows)}</td><td>${esc(d.physicalFound)}</td><td>${esc(d.serialNo)}</td><td>${esc(d.action)}</td><td>${d.resolved ? "Yes" : "No"}</td></tr>`,
        )
        .join("")

    const bars = register?.bars ?? []
    const barSum = summarizeBars(bars)
    const unseen = bars.filter((b) => b.status === "UNCONFIRMED")
    const label = (b: (typeof bars)[number]) => esc([b.locationCode, b.weightLabel, b.refinery, b.serial].filter(Boolean).join(" "))
    const coinChanges = (register?.coins ?? []).filter((c) => c.countedQty !== null && c.previousQty !== null && c.countedQty !== c.previousQty)
    const coinsOpen = (register?.coins ?? []).filter((c) => c.countedQty === null).length
    const coinRows = coinChanges
        .map((c) => `<tr><td>${esc(c.item)}</td><td>${esc(c.locationCode)}</td><td class="n">${c.previousQty}</td><td class="n">${c.countedQty}</td></tr>`)
        .join("")
    const physical = register
        ? `<h2>Bars and coins</h2>
<p>${barSum.total} bars on the register: ${barSum.confirmed} confirmed, ${barSum.added} found new, ${barSum.unconfirmed} carried from last time and not seen, ${barSum.withoutSerial} without a serial. ${barSum.gone} marked gone. Coin lines not counted: ${coinsOpen}.</p>
${unseen.length ? `<p><strong>Not seen (${unseen.length}):</strong> ${unseen.map(label).join("; ")}</p>` : ""}
${coinChanges.length ? `<table><tr><th>Coin line</th><th>Branch</th><th>Last count</th><th>Counted now</th></tr>${coinRows}</table>` : ""}`
        : ""

    return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(s.name)} stocktake</title><style>
body{font:12px/1.4 system-ui,sans-serif;margin:24px;color:#111}
h1{font-size:18px;margin:0 0 4px}h2{font-size:14px;margin:20px 0 6px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:3px 6px;text-align:left;vertical-align:top}
th{background:#f0f0f0}.n{text-align:right}.meta td{border:0;padding:1px 12px 1px 0}
.sign td{height:34px;width:25%}p.note{color:#444}
</style></head><body>
<h1>Month-end stocktake: ${esc(s.name)}</h1>
<table class="meta"><tr><td>Count date</td><td>${esc(s.countDate)}</td><td>Reconciled to</td><td>${esc(s.cutoffDate)}</td></tr>
<tr><td>Stocktake lead</td><td>${esc(s.stocktakeLead)}</td><td>Second checker</td><td>${esc(s.secondChecker)}</td></tr>
<tr><td>Status</td><td>${esc(s.status)}${s.finalisedAt ? ` (${esc(s.finalisedAt.slice(0, 16).replace("T", " "))} by ${esc(s.finalisedBy)})` : ""}</td></tr></table>
<h2>Summary</h2>
<p>${sum.lines} journal lines · ${sum.counted} counted · ${sum.uncounted} not counted · ${sum.withVariance} with a difference (net variance ${sum.netVariance}) · ${s.discrepancies.length} register entries, ${open} still open.</p>
<p class="note">Variance = Qty. (Calculated) − (normal safe + customer safe). Negative means more was found than Business Central expects. This report does not mean Business Central has been adjusted.</p>
<h2>Lines with a difference</h2>
${diffs.length ? `<table><tr><th>Item No.</th><th>Description</th><th>Loc.</th><th>BC qty</th><th>Normal safe</th><th>Customer safe</th><th>Variance</th><th>Reason</th></tr>${diffRows}</table>` : "<p>None.</p>"}
${uncounted.length ? `<h2>Not counted (${uncounted.length})</h2><p>${uncounted.map((l) => `${esc(l.itemNo)} ${esc(l.locationCode)}`).join(", ")}</p>` : ""}
${physical}
<h2>Discrepancies / outstanding items</h2>
${s.discrepancies.length ? `<table><tr><th>Item No.</th><th>Description</th><th>Issue Type</th><th>BC Shows</th><th>Physical Count / Found</th><th>Serial No.</th><th>Action / Notes</th><th>Resolved</th></tr>${regRows}</table>` : "<p>None recorded.</p>"}
<p>Total discrepancies: ${s.discrepancies.length} · Still outstanding: ${open}</p>
<h2>Sign-off</h2>
<table class="sign"><tr><td>Count completed by</td><td></td><td>Time</td><td></td></tr><tr><td>Checked by</td><td></td><td>Sent to Finance</td><td></td></tr></table>
</body></html>`
}
