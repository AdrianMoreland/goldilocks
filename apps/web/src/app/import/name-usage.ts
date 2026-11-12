import type { AliasSeenIn, AliasUsageMetal } from "@goldilocks/shared-types"

const METAL: Record<AliasUsageMetal, string> = { GOLD: "gold", SILVER: "silver", PGM: "PGM" }

export const metalLabel = (m: AliasUsageMetal | null): string => (m ? METAL[m] : "")

/** "gold sales 153 · silver sales 63 · gold purchases 74 · Zoho invoices 4 · customer safe 2" */
export function seenInText(seenIn: readonly AliasSeenIn[]): string {
    const parts: string[] = []
    let zoho = 0
    let safe = 0
    for (const s of seenIn) {
        if (s.source === "SALES") parts.push(`${metalLabel(s.metal)} sales ${s.count.toLocaleString()}`.trim())
        else if (s.source === "PURCHASES") parts.push(`${metalLabel(s.metal)} purchases ${s.count.toLocaleString()}`.trim())
        else if (s.source === "ZOHO") zoho += s.count
        else safe += s.count
    }
    if (zoho) parts.push(`Zoho invoices ${zoho.toLocaleString()}`)
    if (safe) parts.push(`customer safe ${safe.toLocaleString()}`)
    return parts.join(" · ")
}
