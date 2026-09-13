import type { MetalType } from "@/lib/types"

export type MetalTabValue = "gold" | "silver" | "platinum" | "palladium"

export const METAL_TABS: { value: MetalTabValue; label: string; metalType: MetalType }[] = [
    { value: "gold", label: "Gold", metalType: "GOLD" },
    { value: "silver", label: "Silver", metalType: "SILVER" },
    { value: "platinum", label: "Platinum", metalType: "PLATINUM" },
    { value: "palladium", label: "Palladium", metalType: "PALLADIUM" },
]