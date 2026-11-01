import type { StocktakeStatus } from "@goldilocks/shared-types"
import type { StatusTone } from "@/components/status-dot"

export const statusLabel: Record<StocktakeStatus, string> = {
    DRAFT: "Draft",
    COUNTING: "Counting",
    RECONCILING: "Reconciling",
    FINALISED: "Finalised",
}

/** The steps a person moves a stocktake through by hand; finalising has its own button. */
export const nextStatus: Partial<Record<StocktakeStatus, { to: StocktakeStatus; label: string }>> = {
    DRAFT: { to: "COUNTING", label: "Start counting" },
    COUNTING: { to: "RECONCILING", label: "Move to reconciling" },
}

/** The order a stocktake moves through, left to right. */
export const STATUS_ORDER: StocktakeStatus[] = ["DRAFT", "COUNTING", "RECONCILING", "FINALISED"]

export interface StatusStep {
    status: StocktakeStatus
    label: string
    state: "done" | "current" | "todo"
}

/** The four steps and where this stocktake is: earlier ones done, its own current, later ones still to do. */
export function statusSteps(current: StocktakeStatus): StatusStep[] {
    const at = STATUS_ORDER.indexOf(current)
    return STATUS_ORDER.map((status, i) => ({
        status,
        label: statusLabel[status],
        // A finalised stocktake has nothing left to do, so its last step reads as done rather than current.
        state: i < at || current === "FINALISED" ? "done" : i === at ? "current" : "todo",
    }))
}

const URGENCY: Record<StocktakeStatus, number> = { COUNTING: 0, RECONCILING: 1, DRAFT: 2, FINALISED: 3 }

/** Open work first: counting, then reconciling, then drafts, with finalised ones last. Newest count first within a group. */
export function sortByUrgency<T extends { status: StocktakeStatus; countDate: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => URGENCY[a.status] - URGENCY[b.status] || b.countDate.localeCompare(a.countDate))
}

/** Dot colour for the list: work in progress is amber because someone has to act, a draft is quiet, finalised is done. */
export const statusTone: Record<StocktakeStatus, StatusTone> = {
    DRAFT: "muted",
    COUNTING: "warn",
    RECONCILING: "warn",
    FINALISED: "ok",
}
