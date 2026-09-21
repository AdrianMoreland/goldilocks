import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProductsApi } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import type { MetalType } from "@goldilocks/shared-types"

interface AddProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const METAL_TYPES: MetalType[] = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]

const EMPTY_FORM = {
    sku: "",
    name: "",
    metalType: "GOLD" as MetalType,
    weight: 0,
    premium: 0,
    discount: 0,
    vatRate: 0,
    stock: 0,
    description: "",
}

/** Admin-only "create product" dialog, opened from the "+" button in the table toolbar. */
export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()

    const [form, setForm] = React.useState(EMPTY_FORM)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (open) setForm(EMPTY_FORM)
    }, [open])

    const handleSave = async () => {
        if (!form.sku.trim() || !form.name.trim()) {
            toast.error("SKU and name are required")
            return
        }

        setSaving(true)
        try {
            await api.createProduct({
                sku: form.sku.trim(),
                name: form.name.trim(),
                metalType: form.metalType,
                weight: form.weight,
                spreadSell: form.premium / 100,
                spreadBuy: -Math.abs(form.discount) / 100,
                vatRate: form.vatRate / 100,
                stock: form.stock,
                description: form.description.trim() || undefined,
            })
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            toast.success(`${form.name} created`)
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
                    <DialogTitle>Add product</DialogTitle>
                    <DialogDescription>Create a new product in the catalogue.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="col-span-2 flex flex-col gap-1">
                        <Label className="text-xs">Name</Label>
                        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">SKU</Label>
                        <Input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Metal</Label>
                        <Select value={form.metalType} onValueChange={(v) => setForm((f) => ({ ...f, metalType: v as MetalType }))}>
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {METAL_TYPES.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Weight (g)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={form.weight}
                            onChange={(e) => setForm((f) => ({ ...f, weight: Number(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Stock</Label>
                        <Input
                            type="number"
                            step="1"
                            value={form.stock}
                            onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Premium %</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={form.premium}
                            onChange={(e) => setForm((f) => ({ ...f, premium: Number(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Discount %</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={form.discount}
                            onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">VAT %</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={form.vatRate}
                            onChange={(e) => setForm((f) => ({ ...f, vatRate: Number(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                        <Label className="text-xs">Description</Label>
                        <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={saving} onClick={handleSave}>
                        {saving ? "Creating…" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
