import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import type { Product } from "@goldilocks/shared-types"
import { ProductFormFields, productToForm, toProductBody, validateProductForm, type ProductFormValues } from "./product-form"

interface EditProductDialogProps {
    /** A single real product — never a merged "avg of N mints" display row. */
    product: Product
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Admin-only editor for every stored field of one product. */
export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()

    const [form, setForm] = React.useState<ProductFormValues>(() => productToForm(product))
    const [error, setError] = React.useState<string | null>(null)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (!open) return
        setForm(productToForm(product))
        setError(null)
    }, [open, product])

    const handleSave = async () => {
        const problem = validateProductForm(form)
        if (problem) {
            setError(problem)
            return
        }

        setSaving(true)
        try {
            await api.updateProduct(product.id, toProductBody(form))
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            toast.success(`${form.name.trim()} updated`)
            onOpenChange(false)
        } catch {
            // useApi already shows an error toast on failure
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit product</DialogTitle>
                    <DialogDescription>{product.name} · {product.sku}</DialogDescription>
                </DialogHeader>

                <ProductFormFields
                    idPrefix={`edit-product-${product.id}`}
                    form={form}
                    onChange={(next) => {
                        setForm(next)
                        setError(null)
                    }}
                />
                {error && <p className="text-destructive text-sm">{error}</p>}

                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={saving} onClick={handleSave}>
                        {saving ? "Saving…" : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
