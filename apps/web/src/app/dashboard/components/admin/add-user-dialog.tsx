import * as React from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminApi } from "@/api/admin.api"
import { SessionUserRoleEnum } from "@goldilocks/shared-types"
import { z } from "zod"

interface AddUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type Role = z.infer<typeof SessionUserRoleEnum>

const ROLES: Role[] = ["ADMIN", "MANAGER", "SALES", "ACCOUNTING", "AUDITOR"]

const EMPTY_FORM = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "SALES" as Role,
    admin: false,
}

/** Admin-only "create staff account" dialog, opened from the Admin Panel. */
export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
    const api = useAdminApi()
    const [form, setForm] = React.useState(EMPTY_FORM)
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (open) setForm(EMPTY_FORM)
    }, [open])

    const handleSave = async () => {
        if (!form.email.trim() || !form.password || !form.firstName.trim() || !form.lastName.trim()) {
            toast.error("All fields are required")
            return
        }

        setSaving(true)
        try {
            await api.createUser({
                email: form.email.trim(),
                password: form.password,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                role: form.role,
                admin: form.admin,
            })
            toast.success(`${form.firstName} ${form.lastName} created`)
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
                    <DialogTitle>Add user</DialogTitle>
                    <DialogDescription>Provisions a new staff account (Supabase Auth + role).</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">First name</Label>
                        <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Last name</Label>
                        <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                        <Label className="text-xs">Email</Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                        <Label className="text-xs">Password</Label>
                        <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Role</Label>
                        <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as Role }))}>
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xs">Admin</Label>
                        <Select value={form.admin ? "yes" : "no"} onValueChange={(v) => setForm((f) => ({ ...f, admin: v === "yes" }))}>
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="yes">Yes</SelectItem>
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
