import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
    key: string
    label: string
    icon: LucideIcon
}

export interface NavGroup {
    name: string
    items: NavItem[]
}

/** A left section list beside a content pane: the shape the Engineering and Design views share. */
export function HubLayout({ groups, selected, onSelect, children }: { groups: NavGroup[]; selected: string; onSelect: (key: string) => void; children: ReactNode }) {
    return (
        <div className="grid items-start gap-4 lg:grid-cols-[19rem_1fr]">
            <nav aria-label="Sections" className="bg-card max-h-72 overflow-y-auto rounded-xl border p-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-9rem)]">
                {groups.map((group) => (
                    <div key={group.name} className="mb-2 last:mb-0">
                        <p className="text-muted-foreground px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wide uppercase">{group.name}</p>
                        {group.items.map((item) => {
                            const active = item.key === selected
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => onSelect(item.key)}
                                    aria-current={active ? "true" : undefined}
                                    className={cn("hover:bg-muted flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm", active && "bg-muted font-medium")}
                                >
                                    <item.icon className="text-muted-foreground size-4 shrink-0" />
                                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>
                ))}
            </nav>
            <div className="min-w-0">{children}</div>
        </div>
    )
}

/** The pane every topic or section renders into: icon, title, one-line summary, then the content. */
export function PaneCard({ icon: Icon, title, summary, source, children }: { icon: LucideIcon; title: string; summary?: string; source?: string; children: ReactNode }) {
    return (
        <section className="bg-card flex min-w-0 flex-col gap-5 rounded-xl border p-5">
            <header className="flex items-start gap-3">
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg leading-tight font-semibold">{title}</h2>
                    {summary && <p className="text-muted-foreground mt-0.5 text-sm">{summary}</p>}
                </div>
                {source && <span className="bg-muted text-muted-foreground hidden shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] sm:inline">{source}</span>}
            </header>
            {children}
        </section>
    )
}
