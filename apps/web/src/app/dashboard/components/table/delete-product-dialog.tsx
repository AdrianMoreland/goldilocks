import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import type { Product } from "@goldilocks/shared-types"

interface DeleteProductDialogProps {
    product: Product
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Confirms a soft delete. The product disappears everywhere but stays restorable from Admin panel → Deleted products. */
export function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()
    const [deleting, setDeleting] = React.useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await api.deleteProduct(product.id)
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all }),
                queryClient.invalidateQueries({ queryKey: queryKeys.admin.deletedProducts }),
            ])
            toast.success(`${product.name} deleted`, {
                description: "You can restore it from Admin panel → Deleted products.",
            })
            onOpenChange(false)
        } catch {
            // useApi already shows an error toast on failure
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete {product.name}?</DialogTitle>
                    <DialogDescription>
                        {product.sku} will be hidden from the table, the pricing tools and every quote. You can restore it later from
                        Admin panel → Deleted products.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" className="cursor-pointer" disabled={deleting} onClick={handleDelete}>
                        {deleting ? "Deleting…" : "Delete product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
