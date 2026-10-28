import type { StocktakeStatus } from "@goldilocks/shared-types"

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
