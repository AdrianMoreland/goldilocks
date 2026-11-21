import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { SessionUserRoleEnum } from "@goldilocks/shared-types"
import { useAdminApi } from "@/api/admin.api"
import { usePeopleApi } from "@/api/people.api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { queryKeys } from "@/lib/query-keys"

const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", MANAGER: "Manager", SALES: "Sales", ACCOUNTING: "Accounting", AUDITOR: "Auditor" }
type Method = "invite" | "password"

/** New staff account: an emailed link where they set their own password, or a temporary password for someone at the desk. */
export function AddPersonDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
    const api = usePeopleApi()
    const admin = useAdminApi()
    const client = useQueryClient()
    const branches = useQuery({ queryKey: queryKeys.admin.branches, queryFn: admin.getBranches, enabled: open })
    const [method, setMethod] = useState<Method>("invite")
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "SALES" as (typeof SessionUserRoleEnum.options)[number], branchId: null as number | null, password: "" })
    const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))
    const ready = form.firstName && form.lastName && /.+@.+\..+/.test(form.email) && (method === "invite" || form.password.length >= 10)

    const create = useMutation({
        mutationFn: () => {
            const base = { email: form.email.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), role: form.role, admin: false, branchId: form.branchId }
            return method === "invite" ? api.invite(base) : api.create({ ...base, password: form.password })
        },
        onSuccess: () => {
            toast.success(method === "invite" ? `Invite sent to ${form.email}` : `Account created for ${form.email}`)
            void client.invalidateQueries({ queryKey: queryKeys.people.list })
            onOpenChange(false)
            setForm((f) => ({ ...f, firstName: "", lastName: "", email: "", password: "" }))
        },
        onError: (e) =>
            toast.error(
                e instanceof Error && method === "invite"
                    ? `${e.message} If invites are not set up yet, use a temporary password instead.`
                    : e instanceof Error
                      ? e.message
                      : "Couldn't create the account.",
            ),
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add person</DialogTitle>
                    <DialogDescription>There is no sign-up: every account starts here.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <ToggleGroup type="single" variant="outline" size="sm" value={method} onValueChange={(v) => v && setMethod(v as Method)} aria-label="How they get in">
                        <ToggleGroupItem value="invite" className="flex-none px-3">Email an invite</ToggleGroupItem>
                        <ToggleGroupItem value="password" className="flex-none px-3">Temporary password</ToggleGroupItem>
                    </ToggleGroup>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="n-first">First name</Label>
                            <Input id="n-first" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="n-last">Last name</Label>
                            <Input id="n-last" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="n-email">Email</Label>
                        <Input id="n-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="n-role">Role</Label>
                            <Select value={form.role} onValueChange={(v) => set("role", v as typeof form.role)}>
                                <SelectTrigger id="n-role" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {SessionUserRoleEnum.options.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="n-branch">Branch</Label>
                            <Select value={form.branchId === null ? "none" : String(form.branchId)} onValueChange={(v) => set("branchId", v === "none" ? null : Number(v))}>
                                <SelectTrigger id="n-branch" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No branch</SelectItem>
                                    {(branches.data ?? []).map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {method === "password" && (
                        <div className="space-y-1.5">
                            <Label htmlFor="n-pass">Temporary password <span className="text-muted-foreground font-normal">(10 characters or more)</span></Label>
                            <Input id="n-pass" type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" disabled={!ready || create.isPending} onClick={() => create.mutate()}>
                        {create.isPending ? "Working…" : method === "invite" ? "Send invite" : "Create account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
