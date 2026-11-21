import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSettingsApi } from "@/api/settings.api"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"

const when = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

/** The header bell: unread count, the latest 30, mark read. Admins only for now (the server only writes theirs). */
export function NotificationBell() {
    const api = useSettingsApi()
    const { user } = useAuth()
    const client = useQueryClient()
    const navigate = useNavigate()
    const key = queryKeys.notifications(user?.id ?? "")
    const list = useQuery({ queryKey: key, queryFn: api.notifications, enabled: !!user, refetchInterval: 60_000 })
    const read = useMutation({ mutationFn: (ids?: number[]) => api.markRead(ids), onSettled: () => client.invalidateQueries({ queryKey: key }) })
    const unread = list.data?.unread ?? 0

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="relative cursor-pointer" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
                    <Bell />
                    {unread > 0 && (
                        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 min-w-5 rounded-full px-1 text-center text-xs leading-5 font-semibold tabular-nums" aria-hidden>
                            {unread > 9 ? "9+" : unread}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-sm font-medium">Notifications</span>
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" disabled={unread === 0} onClick={() => read.mutate(undefined)}>
                        Mark all read
                    </Button>
                </div>
                <ul className="max-h-96 divide-y overflow-y-auto">
                    {(list.data?.items ?? []).length === 0 && <li className="text-muted-foreground px-3 py-6 text-center text-sm">Nothing yet.</li>}
                    {(list.data?.items ?? []).map((n) => (
                        <li key={n.id}>
                            <button
                                type="button"
                                className={cn("hover:bg-muted/60 w-full px-3 py-2 text-left", !n.readAt && "bg-muted/30")}
                                onClick={() => {
                                    if (!n.readAt) read.mutate([n.id])
                                    if (n.link) navigate(n.link)
                                }}
                            >
                                <span className="flex items-start gap-2">
                                    {!n.readAt && <span className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" aria-label="Unread" />}
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium">{n.title}</span>
                                        <span className="text-muted-foreground block text-xs">{n.body}</span>
                                        <span className="text-muted-foreground block text-xs">{when.format(new Date(n.createdAt))}</span>
                                    </span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    )
}
