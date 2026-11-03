import { cn } from "@/lib/utils"

export type StatusTone = "ok" | "warn" | "stale" | "bad" | "info" | "active" | "muted"

/**
 * The 6px status dot of DESIGN.md "Status colours". Colour never carries a state alone: put the state in words beside it.
 * `ok`, `warn`, `stale`, `bad` and `info` read the `--status-*` tokens in index.css; `active` follows the theme's
 * primary colour (gold in Merrion Gold, amber in Sonar).
 */
const TONE: Record<StatusTone, string> = {
    ok: "bg-status-ok",
    warn: "bg-status-warn",
    stale: "bg-status-stale",
    bad: "bg-status-bad",
    info: "bg-status-info",
    active: "bg-primary",
    muted: "bg-muted-foreground/50",
}

export function StatusDot({ tone, className }: { tone: StatusTone; className?: string }) {
    return <span aria-hidden className={cn("inline-block size-1.5 shrink-0 rounded-full", TONE[tone], className)} />
}
