import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import {
    PERMISSION_KEYS,
    PERMISSION_LABELS,
    SessionUserRoleEnum,
    type AdminUser,
    type PermissionKey,
    type PermissionOverride,
} from "@goldilocks/shared-types"
import { useAdminApi } from "@/api/admin.api"
import { usePeopleApi } from "@/api/people.api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { queryKeys } from "@/lib/query-keys"
import { AddPersonDialog } from "./add-person-dialog"

const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", MANAGER: "Manager", SALES: "Sales", ACCOUNTING: "Accounting", AUDITOR: "Auditor" }
const when = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", year: "numeric" })
const fullName = (u: AdminUser) => `${u.firstName} ${u.lastName}`.trim() || u.email

/** Admin → People: the staff directory. A row opens the person's sheet. */
export function PeopleTab() {
    const api = usePeopleApi()
    const people = useQuery({ queryKey: queryKeys.people.list, queryFn: api.list })
    const [q, setQ] = useState("")
    const [openId, setOpenId] = useState<string | null>(null)
    const [adding, setAdding] = useState(false)
    const rows = useMemo(() => {
        const needle = q.trim().toLowerCase()
        return (people.data ?? []).filter((u) => !needle || `${fullName(u)} ${u.email} ${u.branch?.name ?? ""}`.toLowerCase().includes(needle))
    }, [people.data, q])
    const open = people.data?.find((u) => u.id === openId) ?? null

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or branch" className="max-w-xs" aria-label="Search people" />
                <Button type="button" size="sm" onClick={() => setAdding(true)}>
                    <UserPlus aria-hidden /> Add person
                </Button>
            </div>
            {people.isError ? (
                <p role="alert" className="text-destructive text-sm">Couldn&apos;t load the staff list. Try again in a moment.</p>
            ) : (
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Last sign-in</TableHead>
                                <TableHead className="text-right">Overrides</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {people.isPending && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground">Loading…</TableCell>
                                </TableRow>
                            )}
                            {rows.map((u) => (
                                <TableRow key={u.id} className="cursor-pointer" onClick={() => setOpenId(u.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpenId(u.id)}>
                                    <TableCell>
                                        <div className="font-medium">{fullName(u)}</div>
                                        <div className="text-muted-foreground text-xs">{u.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        {ROLE_LABEL[u.role] ?? u.role}
                                        {u.admin && u.role !== "ADMIN" && <span className="text-muted-foreground"> · admin</span>}
                                    </TableCell>
                                    <TableCell>{u.branch?.name ?? <span className="text-muted-foreground">No branch</span>}</TableCell>
                                    <TableCell>{u.isActive ? <Badge variant="outline">Active</Badge> : <Badge variant="destructive">Disabled</Badge>}</TableCell>
                                    <TableCell className="text-muted-foreground hidden text-xs md:table-cell">{u.lastLoginAt ? when.format(new Date(u.lastLoginAt)) : "Not recorded yet"}</TableCell>
                                    <TableCell className="text-right tabular-nums">{u.overrides.length || ""}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {open && <PersonSheet person={open} onClose={() => setOpenId(null)} />}
            <AddPersonDialog open={adding} onOpenChange={setAdding} />
        </div>
    )
}

type OverrideChoice = "role" | "grant" | "remove"

function PersonSheet({ person, onClose }: { person: AdminUser; onClose: () => void }) {
    const api = usePeopleApi()
    const admin = useAdminApi()
    const client = useQueryClient()
    const { user: me } = useAuth()
    const branches = useQuery({ queryKey: queryKeys.admin.branches, queryFn: admin.getBranches })
    const [role, setRole] = useState(person.role)
    const [isAdmin, setIsAdmin] = useState(person.admin)
    const [active, setActive] = useState(person.isActive)
    const [branchId, setBranchId] = useState<number | null>(person.branch?.id ?? null)
    const [overrides, setOverrides] = useState<Record<PermissionKey, { choice: OverrideChoice; until: string }>>(() =>
        Object.fromEntries(
            PERMISSION_KEYS.map((k) => {
                const o = person.overrides.find((x) => x.key === k)
                return [k, { choice: o ? (o.granted ? "grant" : "remove") : "role", until: o?.expiresAt?.slice(0, 10) ?? "" }]
            }),
        ) as Record<PermissionKey, { choice: OverrideChoice; until: string }>,
    )
    const [reason, setReason] = useState("")
    const isMe = me?.id === person.id

    const nextOverrides: PermissionOverride[] = PERMISSION_KEYS.filter((k) => overrides[k].choice !== "role").map((k) => ({
        key: k,
        granted: overrides[k].choice === "grant",
        expiresAt: overrides[k].until ? new Date(`${overrides[k].until}T23:59:59Z`).toISOString() : null,
    }))
    const sameOverride = (a: PermissionOverride, b?: { granted: boolean; expiresAt: string | null }) =>
        !!b && a.granted === b.granted && (a.expiresAt?.slice(0, 10) ?? null) === (b.expiresAt?.slice(0, 10) ?? null)
    const overridesChanged =
        nextOverrides.length !== person.overrides.length || nextOverrides.some((o) => !sameOverride(o, person.overrides.find((x) => x.key === o.key)))
    const detailsChanged = role !== person.role || isAdmin !== person.admin || active !== person.isActive || branchId !== (person.branch?.id ?? null)
    const dirty = detailsChanged || overridesChanged

    const save = useMutation({
        mutationFn: async () => {
            const why = reason.trim()
            // Only the fields this admin changed, so a stale sheet never undoes someone else's edit.
            if (detailsChanged)
                await api.update(person.id, {
                    ...(role !== person.role ? { role } : {}),
                    ...(isAdmin !== person.admin ? { admin: isAdmin } : {}),
                    ...(active !== person.isActive ? { isActive: active } : {}),
                    ...(branchId !== (person.branch?.id ?? null) ? { branchId } : {}),
                    reason: why,
                })
            if (overridesChanged) await api.setOverrides(person.id, { overrides: nextOverrides, reason: why })
        },
        onSuccess: () => {
            toast.success(`Saved ${fullName(person)}`)
            onClose()
        },
        // Also after a failure: the first of the two saves may already have gone through.
        onSettled: () => {
            void client.invalidateQueries({ queryKey: queryKeys.people.list })
            void client.invalidateQueries({ queryKey: queryKeys.permissions.all })
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save. Try again."),
    })

    return (
        <Sheet open onOpenChange={(o) => !o && onClose()}>
            <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{fullName(person)}</SheetTitle>
                    <SheetDescription>{person.email}</SheetDescription>
                </SheetHeader>
                <div className="space-y-5 px-4 pb-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="p-role">Role</Label>
                            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                                <SelectTrigger id="p-role" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {SessionUserRoleEnum.options.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="p-branch">Branch</Label>
                            <Select value={branchId === null ? "none" : String(branchId)} onValueChange={(v) => setBranchId(v === "none" ? null : Number(v))}>
                                <SelectTrigger id="p-branch" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No branch</SelectItem>
                                    {(branches.data ?? []).map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label htmlFor="p-admin">Admin access</Label>
                            <p className="text-muted-foreground text-xs">Every page and every permission</p>
                        </div>
                        <Switch id="p-admin" checked={isAdmin} onCheckedChange={setIsAdmin} disabled={isMe} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label htmlFor="p-active">Can sign in</Label>
                            <p className="text-muted-foreground text-xs">Turning this off signs them out everywhere on their next click</p>
                        </div>
                        <Switch id="p-active" checked={active} onCheckedChange={setActive} disabled={isMe} />
                    </div>
                    {isMe && <p className="text-muted-foreground text-xs">You can&apos;t remove your own admin access or disable yourself.</p>}

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium">Permissions</legend>
                        <p className="text-muted-foreground text-xs">
                            &ldquo;From role&rdquo; follows the {ROLE_LABEL[role]} preset. Grant or remove one permission for this person only, until a date if you like.
                        </p>
                        {PERMISSION_KEYS.map((k) => {
                            const held = person.permissions.includes(k)
                            const o = overrides[k]
                            return (
                                <div key={k} className="grid grid-cols-[1fr_auto] items-center gap-2 border-t pt-2 sm:grid-cols-[1fr_auto_auto]">
                                    <div className="text-sm">
                                        {PERMISSION_LABELS[k].group} · {PERMISSION_LABELS[k].label}
                                        <span className="text-muted-foreground block text-xs">{held ? "Has it now" : "Doesn't have it now"}</span>
                                    </div>
                                    <Select value={o.choice} onValueChange={(v) => setOverrides((s) => ({ ...s, [k]: { ...s[k], choice: v as OverrideChoice } }))}>
                                        <SelectTrigger className="h-8 w-32 text-xs" aria-label={`${PERMISSION_LABELS[k].label} override`}><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="role">From role</SelectItem>
                                            <SelectItem value="grant">Grant</SelectItem>
                                            <SelectItem value="remove">Remove</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {o.choice !== "role" && (
                                        <Input
                                            type="date"
                                            className="col-span-2 h-8 text-xs sm:col-span-1 sm:w-36"
                                            value={o.until}
                                            min={new Date().toISOString().slice(0, 10)}
                                            onChange={(e) => setOverrides((s) => ({ ...s, [k]: { ...s[k], until: e.target.value } }))}
                                            aria-label={`${PERMISSION_LABELS[k].label} until (optional)`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </fieldset>
                </div>
                <SheetFooter className="mt-auto border-t">
                    <Label htmlFor="p-reason">Reason <span className="text-muted-foreground font-normal">(goes to the audit log)</span></Label>
                    <Textarea id="p-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="For example: covering Pat's orders while Pat is away" />
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="button" disabled={!dirty || reason.trim().length < 3 || save.isPending} onClick={() => save.mutate()}>
                            {save.isPending ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
