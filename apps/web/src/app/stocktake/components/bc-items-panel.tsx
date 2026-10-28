import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useStocktakeApi } from "@/api/stocktake.api"
import { queryKeys } from "@/lib/query-keys"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/**
 * Links each Business Central item code (one per refinery, e.g. 1015 "Umicore - 250g bar") to the single
 * Goldilocks product it belongs to (e.g. "250g Gold Bar"). Names on either side are never changed. A hint
 * is only ever a suggestion for a person to confirm.
 */
export function BcItemsPanel() {
    const api = useStocktakeApi()
    const qc = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: queryKeys.stocktake.bcItems, queryFn: api.bcItems })
    const [onlyUnlinked, setOnlyUnlinked] = useState(true)

    const link = useMutation({
        mutationFn: ({ itemNo, productId }: { itemNo: string; productId: number | null }) => api.linkBcItem(itemNo, productId),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.stocktake.bcItems }),
        onError: (e: Error) => toast.error(e.message),
    })

    if (isLoading || !data) return <Skeleton className="mt-3 h-32" />
    const rows = data.items.filter((i) => !onlyUnlinked || i.productId === null)
    // Products share names across metals (1oz Britannia is both gold and silver), so every label carries the metal.
    const label = (p: { name: string; metalType: string; category: string | null }) =>
        `${p.name} · ${p.metalType[0]}${p.metalType.slice(1).toLowerCase()}${p.category ? ` ${p.category.toLowerCase()}` : ""}`
    const nameOf = (id: number) => {
        const p = data.products.find((x) => x.id === id)
        return p ? label(p) : `#${id}`
    }

    return (
        <div className="space-y-3 pt-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                    <Checkbox checked={onlyUnlinked} onCheckedChange={(v) => setOnlyUnlinked(v === true)} /> Not linked yet
                </label>
                <span className="text-muted-foreground">
                    {data.items.filter((i) => i.productId !== null).length} of {data.items.length} BC items linked. Several BC items can share one product.
                </span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>BC item</TableHead>
                            <TableHead>BC description</TableHead>
                            <TableHead>Goldilocks product</TableHead>
                            <TableHead>Suggestion</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((i) => (
                            <TableRow key={i.itemNo}>
                                <TableCell className="font-mono text-xs">{i.itemNo}</TableCell>
                                <TableCell>{i.description}</TableCell>
                                <TableCell>
                                    <select
                                        value={i.productId ?? ""}
                                        onChange={(e) => link.mutate({ itemNo: i.itemNo, productId: e.target.value ? Number(e.target.value) : null })}
                                        className="border-input bg-background h-8 max-w-64 rounded-md border px-1 text-sm"
                                        aria-label={`Product for ${i.itemNo}`}
                                    >
                                        <option value="">Not linked</option>
                                        {data.products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {label(p)}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                    {i.productId === null && i.suggestedProductIds.length > 0 ? (
                                        i.suggestedProductIds.length === 1 ? (
                                            <button
                                                type="button"
                                                className="cursor-pointer underline"
                                                onClick={() => link.mutate({ itemNo: i.itemNo, productId: i.suggestedProductIds[0] ?? null })}
                                            >
                                                Use {nameOf(i.suggestedProductIds[0] ?? 0)}
                                            </button>
                                        ) : (
                                            `Same weight as: ${i.suggestedProductIds.map(nameOf).join(", ")}`
                                        )
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
