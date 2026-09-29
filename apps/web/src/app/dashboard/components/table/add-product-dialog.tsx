import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import { EMPTY_PRODUCT_FORM, ProductFormFields, toProductBody, validateProductForm } from "./product-form"

interface AddProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Admin-only "create product" dialog, opened from "+ Product" in the Admin panel. */
export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()

    const [form, setForm] = React.useState(EMPTY_PRODUCT_FORM)
    const [error, setError] = React.useState<string | null>(null)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (!open) return
        setForm(EMPTY_PRODUCT_FORM)
        setError(null)
    }, [open])

    const handleSave = async () => {
        const problem = validateProductForm(form)
        if (problem) {
            setError(problem)
            return
        }

        setSaving(true)
        try {
            const body = toProductBody(form)
            await api.createProduct({ ...body, description: body.description || undefined })
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            toast.success(`${body.name} added`)
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
                    <DialogTitle>Add product</DialogTitle>
                    <DialogDescription>Create a new product in the catalogue.</DialogDescription>
                </DialogHeader>

                <ProductFormFields
                    idPrefix="add-product"
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
                        {saving ? "Adding…" : "Add product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
