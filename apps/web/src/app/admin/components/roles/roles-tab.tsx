import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ADMIN_ONLY_PAGES, PERMISSION_KEYS, PERMISSION_LABELS, SessionUserRoleEnum, type PermissionKey, type PermissionMatrix, type PermissionRole, diffPermissionMatrix } from "@goldilocks/shared-types"
import { usePeopleApi } from "@/api/people.api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { queryKeys } from "@/lib/query-keys"

const ROLES = SessionUserRoleEnum.options
/** Pages first: they are what an admin switches most often. */
const SWITCH_GROUPS = ["Pages", "Features"]
const rank = (g: string) => (SWITCH_GROUPS.includes(g) ? SWITCH_GROUPS.indexOf(g) : SWITCH_GROUPS.length)
const GROUPS = [...new Set(PERMISSION_KEYS.map((k) => PERMISSION_LABELS[k].group))].sort((a, b) => rank(a) - rank(b))
const ROLE_LABEL: Record<PermissionRole, string> = { ADMIN: "Admin", MANAGER: "Manager", SALES: "Sales", ACCOUNTING: "Accounting", AUDITOR: "Auditor" }
const fromSets = (d: Record<PermissionRole, Set<PermissionKey>>) => Object.fromEntries(ROLES.map((r) => [r, [...d[r]]])) as unknown as PermissionMatrix
const toSets = (m: PermissionMatrix) => Object.fromEntries(ROLES.map((r) => [r, new Set(m[r])])) as Record<PermissionRole, Set<PermissionKey>>

/** Admin → Roles & permissions: what each role starts with. Admin always holds everything. */
export function RolesTab() {
    const api = usePeopleApi()
    const client = useQueryClient()
    const matrix = useQuery({ queryKey: queryKeys.people.matrix, queryFn: api.matrix })
    // Unsaved edits only; until the first click the saved matrix shows as it is.
    const [edits, setEdits] = useState<Record<PermissionRole, Set<PermissionKey>> | null>(null)
    const [reason, setReason] = useState("")
    const draft = edits ?? (matrix.data ? toSets(matrix.data) : null)

    const changed = matrix.data && draft ? ROLES.flatMap((r) => PERMISSION_KEYS.filter((k) => new Set(matrix.data[r]).has(k) !== draft[r].has(k))).length : 0
    const save = useMutation({
        // Only the toggled cells, so two admins editing at once never undo each other's work.
        mutationFn: () => api.setMatrix({ changes: diffPermissionMatrix(matrix.data!, fromSets(draft!)), reason: reason.trim() }),
        onSuccess: () => {
            toast.success("Roles saved")
            setReason("")
            setEdits(null)
            void client.invalidateQueries({ queryKey: queryKeys.people.matrix })
            void client.invalidateQueries({ queryKey: queryKeys.people.list })
            void client.invalidateQueries({ queryKey: queryKeys.permissions.all })
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the roles."),
    })

    if (matrix.isError) return <p role="alert" className="text-destructive text-sm">Couldn&apos;t load the roles. Try again in a moment.</p>
    if (!draft) return <p className="text-muted-foreground text-sm">Loading…</p>

    const toggle = (r: PermissionRole, k: PermissionKey) =>
        setEdits(() => {
            const next = { ...draft, [r]: new Set(draft[r]) }
            if (next[r].has(k)) next[r].delete(k)
            else next[r].add(k)
            return next
        })

    return (
        <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
                What each role starts with. A person can still be given or denied a single permission on their own sheet in People.
            </p>
            {GROUPS.map((group) => {
                const keys = PERMISSION_KEYS.filter((k) => PERMISSION_LABELS[k].group === group)
                const isPages = group === "Pages"
                const isSwitch = SWITCH_GROUPS.includes(group)
                return (
                    <section key={group} className="space-y-2">
                        <h3 className="text-sm font-semibold">{isPages ? "Pages each role can open" : group === "Features" ? "Features inside a page" : group}</h3>
                        {isPages && (
                            <p className="text-muted-foreground text-sm">
                                Switch a page on for a role and its people see it in the menu and the server answers its requests. Off means hidden and refused, even if they know the address. New pages start admin-only.
                                {" "}{ADMIN_ONLY_PAGES.join(" and ")} are always admin-only and not listed.
                            </p>
                        )}
                        {group === "Features" && (
                            <p className="text-muted-foreground text-sm">
                                Parts of a page that are still being finished. Off hides the feature and the server refuses its data. New features start admin-only.
                            </p>
                        )}
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{isPages ? "Page" : isSwitch ? "Feature" : "Permission"}</TableHead>
                                        {ROLES.map((r) => <TableHead key={r} className="text-center">{ROLE_LABEL[r]}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {keys.map((k) => (
                                        <TableRow key={k}>
                                            <TableCell>{isSwitch ? PERMISSION_LABELS[k].label : <><span className="text-muted-foreground">{PERMISSION_LABELS[k].group} · </span>{PERMISSION_LABELS[k].label}</>}</TableCell>
                                            {ROLES.map((r) => {
                                                const props = {
                                                    checked: r === "ADMIN" || draft[r].has(k),
                                                    disabled: r === "ADMIN",
                                                    onCheckedChange: () => toggle(r, k),
                                                    "aria-label": `${ROLE_LABEL[r]}: ${PERMISSION_LABELS[k].label}`,
                                                }
                                                return (
                                                    <TableCell key={r} className="text-center">
                                                        {isSwitch ? <Switch {...props} /> : <Checkbox {...props} />}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>
                )
            })}
            {changed > 0 && (
                <div className="bg-background sticky bottom-0 z-20 -mx-4 border-t px-4 py-3 lg:-mx-6 lg:px-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium tabular-nums">{changed} change{changed === 1 ? "" : "s"}</span>
                        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (goes to the audit log)" className="min-w-0 flex-1" aria-label="Reason for the change" />
                        <Button type="button" variant="outline" onClick={() => setEdits(null)}>Discard</Button>
                        <Button type="button" disabled={reason.trim().length < 3 || save.isPending} onClick={() => save.mutate()}>
                            {save.isPending ? "Saving…" : "Save"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
