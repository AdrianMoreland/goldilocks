import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProductsApi, type DeletedProduct } from "@/api/products.api"
import { queryKeys } from "@/lib/query-keys"
import { formatMetalName } from "../../utils/formatters"

interface DeletedProductsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const deletedAtFormat = new Intl.DateTimeFormat("en-IE", { dateStyle: "medium", timeStyle: "short" })

/** Lists soft-deleted products, newest first, each with a one-click Restore. */
export function DeletedProductsDialog({ open, onOpenChange }: DeletedProductsDialogProps) {
    const api = useProductsApi()
    const queryClient = useQueryClient()
    const [search, setSearch] = React.useState("")

    const deletedQuery = useQuery({
        queryKey: queryKeys.admin.deletedProducts,
        queryFn: api.getDeletedProducts,
        enabled: open,
    })

    const restoreMutation = useMutation({
        mutationFn: (product: DeletedProduct) => api.restoreProduct(product.id),
        onSuccess: async (_result, product) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.admin.deletedProducts }),
                queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all }),
            ])
            toast.success(`${product.name} restored`)
        },
    })

    const term = search.trim().toLowerCase()
    const products = (deletedQuery.data ?? []).filter(
        (p) => !term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term),
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Deleted products</DialogTitle>
                    <DialogDescription>Deleted products are hidden everywhere. Restore one to bring it back exactly as it was.</DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Search name or SKU"
                    aria-label="Search deleted products"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="max-h-[min(60vh,28rem)] overflow-y-auto rounded-lg border">
                    {deletedQuery.isLoading ? (
                        <p className="text-muted-foreground p-4 text-sm">Loading deleted products…</p>
                    ) : deletedQuery.isError ? (
                        <p className="text-destructive p-4 text-sm">Couldn&apos;t load deleted products. Close and reopen to try again.</p>
                    ) : products.length === 0 ? (
                        <p className="text-muted-foreground p-4 text-sm">
                            {term ? "No deleted products match that search." : "Nothing has been deleted."}
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {products.map((product) => (
                                <li key={product.id} className="flex items-center gap-3 px-3 py-2.5">
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-medium">{product.name}</div>
                                        <div className="text-muted-foreground truncate text-xs">
                                            {product.sku} · {formatMetalName(product.metalType)} · deleted{" "}
                                            {deletedAtFormat.format(new Date(product.deletedAt))}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="shrink-0 cursor-pointer"
                                        disabled={restoreMutation.isPending && restoreMutation.variables?.id === product.id}
                                        onClick={() => restoreMutation.mutate(product)}
                                    >
                                        <RotateCcw /> Restore
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
