import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MetalType, ProductCategory, RawProduct } from "@goldilocks/shared-types"
import { inferCategory } from "./product-grouping"
import { formatMetalName } from "../../utils/formatters"

const METAL_TYPES: MetalType[] = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]
const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
    { value: "BAR", label: "Bar" },
    { value: "COIN", label: "Coin" },
]

/**
 * The editable product fields in the units staff think in: percentages as
 * whole numbers (7 = 7%), discount as a positive number. The stored
 * spreadBuy is negative (a markdown), so the sign is applied in toProductBody.
 */
export interface ProductFormValues {
    name: string
    sku: string
    metalType: MetalType
    /** Null only on a fresh Add form — staff must pick one before saving. */
    category: ProductCategory | null
    weight: number
    premium: number
    discount: number
    vatRate: number
    stock: number
    description: string
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
    name: "",
    sku: "",
    metalType: "GOLD",
    category: null,
    weight: 0,
    premium: 0,
    discount: 0,
    vatRate: 0,
    stock: 0,
    description: "",
}

type ProductLike = Pick<RawProduct, "name" | "sku" | "metalType" | "weight" | "spreadSell" | "spreadBuy" | "vatRate" | "stock"> & {
    description?: string | null
    category?: ProductCategory | null
}

export function productToForm(product: ProductLike): ProductFormValues {
    return {
        name: product.name,
        sku: product.sku,
        metalType: product.metalType,
        // Older products have no stored category — prefill with what the
        // table currently infers from the name, so saving keeps it put.
        category: product.category ?? inferCategory(product.name),
        weight: product.weight,
        premium: Number((product.spreadSell * 100).toFixed(3)),
        discount: Number((Math.abs(product.spreadBuy) * 100).toFixed(3)),
        vatRate: Number((product.vatRate * 100).toFixed(2)),
        stock: product.stock,
        description: product.description ?? "",
    }
}

export function toProductBody(form: ProductFormValues) {
    return {
        name: form.name.trim(),
        sku: form.sku.trim(),
        metalType: form.metalType,
        category: form.category,
        weight: form.weight,
        spreadSell: form.premium / 100,
        spreadBuy: -Math.abs(form.discount) / 100,
        vatRate: form.vatRate / 100,
        stock: form.stock,
        description: form.description.trim(),
    }
}

/** Returns the first problem with the form, or null when it can be saved. */
export function validateProductForm(form: ProductFormValues): string | null {
    if (!form.name.trim()) return "Enter a product name."
    if (!form.sku.trim()) return "Enter a SKU."
    if (!form.category) return "Choose whether this is a bar or a coin."
    if (!(form.weight > 0)) return "Weight must be more than 0 g."
    if (form.stock < 0) return "Stock can't be negative."
    if (form.vatRate < 0 || form.vatRate > 100) return "VAT must be between 0 and 100%."
    return null
}

/**
 * Number inputs keep their own draft text, so clearing a field while typing
 * doesn't snap it to 0 (and an empty field can't silently save as 0 — the
 * old edit dialog did exactly that).
 */
function NumberField({
    id,
    label,
    value,
    step,
    onChange,
}: {
    id: string
    label: string
    value: number
    step: string
    onChange: (value: number) => void
}) {
    const [draft, setDraft] = React.useState(String(value))
    React.useEffect(() => setDraft(String(value)), [value])

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={id} className="text-xs">{label}</Label>
            <Input
                id={id}
                type="number"
                step={step}
                inputMode="decimal"
                value={draft}
                onChange={(e) => {
                    setDraft(e.target.value)
                    const parsed = Number(e.target.value)
                    if (e.target.value !== "" && Number.isFinite(parsed)) onChange(parsed)
                }}
                onBlur={() => setDraft(String(value))}
                className="tabular-nums"
            />
        </div>
    )
}

export function ProductFormFields({
    form,
    onChange,
    idPrefix,
}: {
    form: ProductFormValues
    onChange: (next: ProductFormValues) => void
    idPrefix: string
}) {
    const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => onChange({ ...form, [key]: value })

    return (
        <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2 flex flex-col gap-1">
                <Label htmlFor={`${idPrefix}-name`} className="text-xs">Name</Label>
                <Input id={`${idPrefix}-name`} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor={`${idPrefix}-sku`} className="text-xs">SKU</Label>
                <Input id={`${idPrefix}-sku`} value={form.sku} onChange={(e) => set("sku", e.target.value)} />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
                <Label id={`${idPrefix}-category-label`} className="text-xs">Type</Label>
                <div role="group" aria-labelledby={`${idPrefix}-category-label`} className="grid grid-cols-2 gap-2">
                    {CATEGORY_OPTIONS.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            variant={form.category === option.value ? "default" : "outline"}
                            aria-pressed={form.category === option.value}
                            className="cursor-pointer"
                            onClick={() => set("category", option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor={`${idPrefix}-metal`} className="text-xs">Metal</Label>
                <Select value={form.metalType} onValueChange={(v) => set("metalType", v as MetalType)}>
                    <SelectTrigger id={`${idPrefix}-metal`} className="w-full cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {METAL_TYPES.map((m) => (
                            <SelectItem key={m} value={m}>{formatMetalName(m)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <NumberField id={`${idPrefix}-weight`} label="Weight (g)" step="0.01" value={form.weight} onChange={(v) => set("weight", v)} />
            <NumberField id={`${idPrefix}-stock`} label="Stock" step="1" value={form.stock} onChange={(v) => set("stock", v)} />
            <NumberField id={`${idPrefix}-premium`} label="Premium % (Price)" step="0.01" value={form.premium} onChange={(v) => set("premium", v)} />
            <NumberField id={`${idPrefix}-discount`} label="Discount % (Buyback)" step="0.01" value={form.discount} onChange={(v) => set("discount", v)} />
            <NumberField id={`${idPrefix}-vat`} label="VAT %" step="0.01" value={form.vatRate} onChange={(v) => set("vatRate", v)} />
            <div className="col-span-2 flex flex-col gap-1">
                <Label htmlFor={`${idPrefix}-description`} className="text-xs">Description</Label>
                <Input id={`${idPrefix}-description`} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
        </div>
    )
}
