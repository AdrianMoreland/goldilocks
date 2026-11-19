/** One price table for everything the dashboard copies out (Easy Copy and the customer email), so the two always look alike. */

export const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** Gold is the brand's own colour. Inline styles plus a bgcolor attribute: Outlook and Gmail drop most stylesheet rules but honour these. */
const headerCell = (value: string) =>
    `<th bgcolor="#DAAB69" style="border:1px solid #ddd;padding:6px 10px;text-align:left;background-color:#DAAB69;color:#1a1a1a;">${escapeHtml(value)}</th>`

const bodyCell = (value: string, strong: boolean) =>
    `<td style="border:1px solid #ddd;padding:6px 10px;text-align:left;${strong ? "font-weight:bold;" : ""}">${escapeHtml(value)}</td>`

/** `isStrong(columnIndex)` picks the body columns shown in bold (the figures, not the names). */
export function renderHtmlTable(headers: string[], rows: string[][], isStrong: (columnIndex: number) => boolean): string {
    return `<table style="border-collapse:collapse;margin:0 0 12px;font-family:sans-serif;font-size:13px;"><thead><tr>${headers.map(headerCell).join("")}</tr></thead><tbody>${rows
        .map((row) => `<tr>${row.map((value, i) => bodyCell(value, isStrong(i))).join("")}</tr>`)
        .join("")}</tbody></table>`
}
