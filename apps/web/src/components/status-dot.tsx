import { cn } from "@/lib/utils"

export type StatusTone = "ok" | "warn" | "bad" | "muted"

/** The 6px status dot of DESIGN.md "Status colours". Colour never carries a state alone: put the state in words beside it. */
const TONE: Record<StatusTone, string> = {
    ok: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-red-500",
    muted: "bg-muted-foreground/50",
}

export function StatusDot({ tone, className }: { tone: StatusTone; className?: string }) {
    return <span aria-hidden className={cn("inline-block size-1.5 shrink-0 rounded-full", TONE[tone], className)} />
}
