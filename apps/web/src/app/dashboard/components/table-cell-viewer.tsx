import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button.tsx"
import { usePricingTools } from "../context/pricing-tools-context"

/**
 * Clicking a product name opens the shared pricing-tools panel (see
 * ../components/pricing-tools/pricing-tools-panel.tsx) on its Product tab,
 * in that product's metal mode.
 */
export function TableCellViewer({ item }: { item: Product }) {
    const { openWithProduct } = usePricingTools()

    return (
        <Button
            variant="link"
            className="text-foreground w-fit px-0 h-auto py-0 text-base font-medium text-left cursor-pointer"
            onClick={() => openWithProduct(item)}
        >
            {item.name}
        </Button>
    )
}
