import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    X, Pause, Play, Trash2, Paintbrush, ShieldCheck, Plus, ArchiveRestore,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { cn } from "@/lib/utils"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { usePricingTools, SIDE_PANEL_WIDTH as PANEL_WIDTH } from "../../context/pricing-tools-context"
import { AddUserDialog } from "./add-user-dialog"
import { AddBranchDialog } from "./add-branch-dialog"
import { DeletedProductsDialog } from "./deleted-products-dialog"
import { AddProductDialog } from "../table/add-product-dialog"
import { SystemStatusPanel } from "./system-status-panel"
import { ErrorLogSection } from "./error-log"
import type { MetalCardData } from "../../schemas/card-data.schema"

interface AdminSidePanelProps {
    /** The dashboard's own per-metal freshness data, for the System Status section below — not refetched separately. */
    metalCards: MetalCardData[]
}

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
            className="flex w-full items-center gap-3 rounded-xl border bg-muted/30 p-3 text-left transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background">
                <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{label}</div>
                {description && <div className="text-muted-foreground text-xs">{description}</div>}
            </div>
        </button>
    )
}

function StatusPill({ running, loading }: { running: boolean; loading: boolean }) {
    return (
        <span
            className={cn(
                "flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold",
                loading
                    ? "border-border bg-muted text-muted-foreground"
                    : running
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            )}
        >
            <span
                className={cn(
                    "size-1.5 rounded-full",
                    !loading && "animate-pulse",
                    loading ? "bg-muted-foreground" : running ? "bg-emerald-500" : "bg-amber-500",
                )}
            />
            {loading ? "Checking…" : running ? "Running" : "Paused"}
        </span>
    )
}

/**
 * Admin side panel — occupies the exact same slot/width as the Pricing
 * Tools panel (see PricingToolsPanel), replacing it rather than floating
 * over the dashboard as a dialog. Visual language borrows from the
 * watermelon.sh "Deployment Card" pattern (compact icon-button header,
 * bordered list rows, pill status badges, metric tags) rebuilt with this
 * project's own Tailwind/shadcn tokens.
 */
export function AdminSidePanel({ metalCards }: AdminSidePanelProps) {
    const { adminPanelOpen, closeAdminPanel } = usePricingTools()
    const api = useAdminApi()
    const queryClient = useQueryClient()
    const [addUserOpen, setAddUserOpen] = React.useState(false)
    const [addBranchOpen, setAddBranchOpen] = React.useState(false)
    const [addProductOpen, setAddProductOpen] = React.useState(false)
    const [deletedProductsOpen, setDeletedProductsOpen] = React.useState(false)
    const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)

    const cronStatus = useQuery({
        queryKey: queryKeys.admin.cronStatus,
        queryFn: api.getCronStatus,
        enabled: adminPanelOpen,
    })

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

    const running = cronStatus.data?.running ?? true

    return (
        <>
            <div
                className="h-full shrink-0 overflow-hidden border-l bg-card transition-[width] duration-200 ease-in-out"
                style={{ width: adminPanelOpen ? PANEL_WIDTH : 0 }}
            >
                <div className="flex h-full flex-col" style={{ width: PANEL_WIDTH }}>
                    <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
                        <span className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                            <ShieldCheck className="size-3.5" />
                            Admin Panel
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                                title="Close"
                                aria-label="Close admin panel"
                                onClick={closeAdminPanel}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                        {/* ── Cron control ────────────────────────────────── */}
                        <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 p-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">Price-refresh cron</span>
                                <StatusPill running={running} loading={cronStatus.isLoading} />
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

                        <Separator />

                        {/* ── Create ──────────────────────────────────────── */}
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

                        {/* ── Quick actions ───────────────────────────────── */}
                        <div className="flex flex-col gap-2">
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
                            <ActionRow icon={Paintbrush} label="Theme editor" onClick={() => setThemeCustomizerOpen(true)} />
                        </div>

                        <p className="text-muted-foreground text-xs">
                            Edit, deactivate or delete a product from the &quot;⋯&quot; menu on its row in the table.
                        </p>

                        <Separator />

                        {/* ── Error log ───────────────────────────────────── */}
                        <ErrorLogSection active={adminPanelOpen} />

                        <Separator />

                        {/* ── System status ───────────────────────────────── */}
                        <SystemStatusPanel metalCards={metalCards} active={adminPanelOpen} />
                    </div>
                </div>
            </div>

            <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
            <AddBranchDialog open={addBranchOpen} onOpenChange={setAddBranchOpen} />
            <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />
            <DeletedProductsDialog open={deletedProductsOpen} onOpenChange={setDeletedProductsOpen} />
            <ThemeCustomizer open={themeCustomizerOpen} onOpenChange={setThemeCustomizerOpen} />
        </>
    )
}
