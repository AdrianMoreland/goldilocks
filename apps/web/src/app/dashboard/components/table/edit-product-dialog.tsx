import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import type { DisplayProduct } from "./product-grouping"

interface EditProductDialogProps {
    product: DisplayProduct
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Admin-only pricing editor for one product row — premium, discount, stock, VAT. */
export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()

    const [premium, setPremium] = React.useState(0)
    const [discount, setDiscount] = React.useState(0)
    const [stock, setStock] = React.useState(0)
    const [vatRate, setVatRate] = React.useState(0)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (!open) return
        setPremium(Number((product.spreadSell * 100).toFixed(3)))
        setDiscount(Number((Math.abs(product.spreadBuy) * 100).toFixed(3)))
        setStock(product.stock)
        setVatRate(Number((product.vatRate * 100).toFixed(2)))
    }, [open, product])

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.updateProduct(product.id, {
                spreadSell: premium / 100,
                spreadBuy: -Math.abs(discount) / 100,
                stock,
                vatRate: vatRate / 100,
            })
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            toast.success(`${product.name} updated`)
            onOpenChange(false)
        } catch {
            // useApi already shows an error toast on failure
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit pricing</DialogTitle>
                    <DialogDescription>{product.name} · {product.sku}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Premium %</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={premium}
                            onChange={(e) => setPremium(Number(e.target.value) || 0)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Discount %</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Stock</Label>
                        <Input
                            type="number"
                            step="1"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value) || 0)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">VAT %</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={vatRate}
                            onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={saving} onClick={handleSave}>
                        {saving ? "Saving…" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
