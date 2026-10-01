import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArchiveRestore, CloudDownload, Pause, Play, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { AddUserDialog } from "@/app/dashboard/components/admin/add-user-dialog"
import { AddBranchDialog } from "@/app/dashboard/components/admin/add-branch-dialog"
import { DeletedProductsDialog } from "@/app/dashboard/components/admin/deleted-products-dialog"
import { AddProductDialog } from "@/app/dashboard/components/table/add-product-dialog"

function ActionRow({
    icon: Icon,
    label,
    description,
    onClick,
    disabled,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    description?: string
    onClick: () => void
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="bg-muted/30 hover:bg-muted/60 focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="bg-background flex size-8 shrink-0 items-center justify-center rounded-lg border">
                <Icon className="text-muted-foreground size-4" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{label}</div>
                {description && <div className="text-muted-foreground text-xs">{description}</div>}
            </div>
        </button>
    )
}

export function CronStatusPill({ running, loading }: { running: boolean; loading: boolean }) {
    return (
        <span
            className={cn(
                "flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold",
                loading
                    ? "border-border bg-muted text-muted-foreground"
                    : running
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
            )}
        >
            <span
                className={cn(
                    "size-1.5 rounded-full",
                    !loading && "animate-pulse motion-reduce:animate-none",
                    loading ? "bg-muted-foreground" : running ? "bg-emerald-500" : "bg-amber-500",
                )}
            />
            {loading ? "Checking…" : running ? "Running" : "Paused"}
        </span>
    )
}

/**
 * The admin buttons — price-refresh cron, create product/branch/user, cache
 * and catalogue actions. Rendered in two places (the Pricing Tools settings
 * tab and the admin console's Overview) from this one component, so the two
 * can never drift apart. `compact` stacks everything in one narrow column.
 */
export function AdminActions({ compact = false }: { compact?: boolean }) {
    const api = useAdminApi()
    const queryClient = useQueryClient()
    const [addUserOpen, setAddUserOpen] = React.useState(false)
    const [addBranchOpen, setAddBranchOpen] = React.useState(false)
    const [addProductOpen, setAddProductOpen] = React.useState(false)
    const [deletedProductsOpen, setDeletedProductsOpen] = React.useState(false)

    const cronStatus = useQuery({ queryKey: queryKeys.admin.cronStatus, queryFn: api.getCronStatus })

    const toggleCronMutation = useMutation({
        mutationFn: api.toggleCron,
        onSuccess: ({ running }) => {
            queryClient.setQueryData(queryKeys.admin.cronStatus, { running })
            toast.success(running ? "Price-refresh cron resumed" : "Price-refresh cron paused")
        },
    })

    const clearCacheMutation = useMutation({
        mutationFn: api.clearPriceCache,
        onSuccess: () => toast.success("Price cache cleared"),
    })

    const refreshMutation = useMutation({
        mutationFn: api.refreshPrices,
        onSuccess: () => {
            toast.success("Prices fetched from the vendor")
            void queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.fetchMetrics })
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.fetchLog })
            void queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview })
        },
    })

    const running = cronStatus.data?.running ?? true

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-muted/30 flex items-center justify-between gap-3 rounded-xl border p-3">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Price-refresh cron</span>
                    <CronStatusPill running={running} loading={cronStatus.isLoading} />
                </div>
                <Button
                    variant={running ? "outline" : "default"}
                    size="sm"
                    className="cursor-pointer"
                    disabled={toggleCronMutation.isPending || cronStatus.isLoading}
                    onClick={() => toggleCronMutation.mutate()}
                >
                    {running ? <Pause className="size-4" /> : <Play className="size-4" />}
                    {running ? "Pause" : "Resume"}
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setAddProductOpen(true)}>
                    <Plus /> Product
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setAddBranchOpen(true)}>
                    <Plus /> Branch
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setAddUserOpen(true)}>
                    <Plus /> User
                </Button>
            </div>

            <div className={cn("grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
                <ActionRow
                    icon={CloudDownload}
                    label="Fetch prices now"
                    description="Calls the vendor immediately, outside the schedule"
                    disabled={refreshMutation.isPending}
                    onClick={() => refreshMutation.mutate()}
                />
                <ActionRow
                    icon={Trash2}
                    label="Clear price cache"
                    description="Forces the next read back to the DB/live API"
                    disabled={clearCacheMutation.isPending}
                    onClick={() => clearCacheMutation.mutate()}
                />
                <ActionRow
                    icon={ArchiveRestore}
                    label="Deleted products"
                    description="Review and restore deleted products"
                    onClick={() => setDeletedProductsOpen(true)}
                />
            </div>

            <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
            <AddBranchDialog open={addBranchOpen} onOpenChange={setAddBranchOpen} />
            <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />
            <DeletedProductsDialog open={deletedProductsOpen} onOpenChange={setDeletedProductsOpen} />
        </div>
    )
}
