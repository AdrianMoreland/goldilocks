import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Pause, Play, Trash2, Paintbrush, UserPlus, Building2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { AddUserDialog } from "./add-user-dialog"
import { AddBranchDialog } from "./add-branch-dialog"

interface AdminPanelDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Opens the existing theme-customizer sheet (owned by BaseLayout) — this panel just triggers it rather than duplicating that UI. */
    onOpenThemeCustomizer: () => void
}

/**
 * Admin-only control center, opened from the header's "Admin" button.
 * Replaces the old per-row admin-mode toggle (see CLAUDE.md §6 — the "…"
 * row menu is now always shown for admins; that toggle was never the real
 * security boundary, just discoverability).
 */
export function AdminPanelDialog({ open, onOpenChange, onOpenThemeCustomizer }: AdminPanelDialogProps) {
    const api = useAdminApi()
    const queryClient = useQueryClient()
    const [addUserOpen, setAddUserOpen] = React.useState(false)
    const [addBranchOpen, setAddBranchOpen] = React.useState(false)

    const cronStatus = useQuery({
        queryKey: queryKeys.admin.cronStatus,
        queryFn: api.getCronStatus,
        enabled: open,
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
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Admin panel</DialogTitle>
                        <DialogDescription>Operational controls.</DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Price-refresh cron</span>
                                <span className="text-muted-foreground text-xs">
                                    {cronStatus.isLoading ? "Checking…" : running ? "Running every 10 minutes" : "Paused"}
                                </span>
                            </div>
                            <Button
                                variant={running ? "outline" : "default"}
                                size="sm"
                                className="cursor-pointer"
                                disabled={toggleCronMutation.isPending || cronStatus.isLoading}
                                onClick={() => toggleCronMutation.mutate()}
                            >
                                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                {running ? "Pause" : "Resume"}
                            </Button>
                        </div>

                        <Separator />

                        <Button
                            variant="outline"
                            className="cursor-pointer justify-start"
                            disabled={clearCacheMutation.isPending}
                            onClick={() => clearCacheMutation.mutate()}
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear price cache
                        </Button>

                        <Button
                            variant="outline"
                            className="cursor-pointer justify-start"
                            onClick={() => {
                                onOpenChange(false)
                                onOpenThemeCustomizer()
                            }}
                        >
                            <Paintbrush className="h-4 w-4" />
                            Theme editor
                        </Button>

                        <Separator />

                        <Button
                            variant="outline"
                            className="cursor-pointer justify-start"
                            onClick={() => setAddUserOpen(true)}
                        >
                            <UserPlus className="h-4 w-4" />
                            Add new user
                        </Button>

                        <Button
                            variant="outline"
                            className="cursor-pointer justify-start"
                            onClick={() => setAddBranchOpen(true)}
                        >
                            <Building2 className="h-4 w-4" />
                            Add new branch
                        </Button>

                        <p className="text-muted-foreground text-xs">
                            Product active/inactive is toggled from each row&apos;s &quot;⋯&quot; menu in the table.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
            <AddBranchDialog open={addBranchOpen} onOpenChange={setAddBranchOpen} />
        </>
    )
}
