import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { CurrencyEnum } from "@goldilocks/shared-types"
import { z } from "zod"

interface AddBranchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type Currency = z.infer<typeof CurrencyEnum>

const CURRENCIES: Currency[] = ["EUR", "USD", "GBP"]

const EMPTY_FORM = {
    name: "",
    address: "",
    currency: "EUR" as Currency,
}

/** Admin-only "add branch" dialog, opened from the Admin Panel. */
export function AddBranchDialog({ open, onOpenChange }: AddBranchDialogProps) {
    const api = useAdminApi()
    const queryClient = useQueryClient()
    const [form, setForm] = React.useState(EMPTY_FORM)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (open) setForm(EMPTY_FORM)
    }, [open])

    const handleSave = async () => {
        if (!form.name.trim()) {
            toast.error("Branch name is required")
            return
        }

        setSaving(true)
        try {
            await api.createBranch({
                name: form.name.trim(),
                address: form.address.trim() || undefined,
                currency: form.currency,
            })
            await queryClient.invalidateQueries({ queryKey: queryKeys.admin.branches })
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
                    <DialogTitle>Add branch</DialogTitle>
                    <DialogDescription>Create a new branch location.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="col-span-2 flex flex-col gap-1">
                        <Label className="text-xs">Name</Label>
                        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                        <Label className="text-xs">Address</Label>
                        <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Currency</Label>
                        <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v as Currency }))}>
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCIES.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
