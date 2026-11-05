import { cn } from "@/lib/utils"
import { PRIORITY_LABEL, type Priority } from "../roadmap-state"

/** How many of the three bars fill for each level; Now (P0) gets its own mark instead, since it means "before anything else". */
const BARS: Record<Exclude<Priority, "P0">, number> = { P1: 3, P2: 2, P3: 1 }
const HEIGHT = ["h-1.5", "h-2.5", "h-3.5"]

/** The priority as a small glyph: three rising bars filled by level, or a solid "!" for Now. Neutral ink: the glyph and its label carry it, not colour. */
export function PriorityGlyph({ priority, showLabel = false, className }: { priority: Priority; showLabel?: boolean; className?: string }) {
    const label = `${priority}, ${PRIORITY_LABEL[priority].toLowerCase()}`

    return (
        <span className={cn("inline-flex items-center gap-1.5", className)} title={label}>
            {priority === "P0" ? (
                <span role="img" aria-label={label} className="bg-foreground text-background flex size-3.5 items-center justify-center rounded-[3px] text-[10px] leading-none font-bold">
                    !
                </span>
            ) : (
                <span role="img" aria-label={label} className="flex h-3.5 items-end gap-px">
                    {HEIGHT.map((height, i) => (
                        <span key={i} className={cn("w-[3px] rounded-[1px]", height, i < BARS[priority] ? "bg-foreground" : "bg-foreground/15")} />
                    ))}
                </span>
            )}
            {showLabel && <span className="text-muted-foreground text-xs">{PRIORITY_LABEL[priority]}</span>}
        </span>
    )
}
