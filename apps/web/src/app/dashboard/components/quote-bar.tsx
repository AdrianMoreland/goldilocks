import { Button } from "@/components/ui/button"
import { features } from "@/config/features"
import { useMediaQuery } from "@/hooks/use-media-query.hook"
import { usePricingTools } from "../context/pricing-tools-context"

/**
 * Phones only: once rows are ticked and the tools sheet is closed, a bar at the bottom says how many are ticked and opens the
 * quote. The money total stays in the Trade tab, where the server prices the cart.
 */
export function QuoteBar() {
    const phone = useMediaQuery("(max-width: 900px)")
    const { open, rowSelection, openTools, setActiveTab } = usePricingTools()
    const count = Object.values(rowSelection).filter(Boolean).length

    if (!features.redesign || !phone || open || count === 0) return null

    return (
        <div role="region" aria-label="Quote" className="bg-popover fixed inset-x-2 bottom-2 z-[48] flex items-center gap-3 rounded-[18px] border py-2 pr-2 pl-4 shadow-lg">
            <span className="text-sm font-medium tabular-nums">{count} {count === 1 ? "item" : "items"} ticked</span>
            <Button className="ml-auto cursor-pointer" onClick={() => { setActiveTab("trade"); openTools() }}>
                Open quote
            </Button>
        </div>
    )
}
