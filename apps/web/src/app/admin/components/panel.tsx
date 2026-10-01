import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** The admin console's one container: a hairline-bordered card with a title row. Never nested. */
export function Panel({
    title,
    description,
    action,
    children,
    className,
}: {
    title: string
    description?: ReactNode
    action?: ReactNode
    children: ReactNode
    className?: string
}) {
    return (
        <section className={cn("bg-card flex h-full min-w-0 flex-col gap-3 rounded-xl border p-4", className)}>
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold">{title}</h2>
                    {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </header>
            {children}
        </section>
    )
}

/** A quiet "nothing here yet" line for empty panels. */
export function PanelEmpty({ children }: { children: ReactNode }) {
    return <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-6 text-center text-sm">{children}</p>
}

/** A small label/value pair used in panel summaries; tabular so figures line up. */
export function Stat({ label, value, tone }: { label: string; value: string; tone?: "bad" | "warn" }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span
                className={cn(
                    "text-base font-semibold tabular-nums",
                    tone === "bad" && "text-destructive",
                    tone === "warn" && "text-amber-700 dark:text-amber-400",
                )}
            >
                {value}
            </span>
        </div>
    )
}
