import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import type { Product } from "@goldilocks/shared-types"

interface HideProductDialogProps {
    product: Product
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Confirms marking a product inactive: it leaves every price list but can be shown again from Hidden products. */
export function HideProductDialog({ product, open, onOpenChange }: HideProductDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()
    const [hiding, setHiding] = React.useState(false)

    const handleHide = async () => {
        setHiding(true)
        try {
            await api.updateProduct(product.id, { isActive: false })
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all }),
                queryClient.invalidateQueries({ queryKey: queryKeys.admin.inactiveProducts }),
            ])
            toast.success(`${product.name} marked inactive`, {
                description: "You can show it again from Hidden products.",
            })
            onOpenChange(false)
        } catch {
            // useApi already shows an error toast on failure
        } finally {
            setHiding(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Mark {product.name} inactive?</DialogTitle>
                    <DialogDescription>
                        {product.sku} will be hidden from price lists. You can show it again from Hidden products (Admin panel → Deleted and hidden products).
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={hiding} onClick={handleHide}>
                        {hiding ? "Hiding…" : "Mark inactive"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
