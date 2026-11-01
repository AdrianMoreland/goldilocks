import { cn } from "@/lib/utils"

/**
 * A 40px ring that fills clockwise from the top, with the whole percentage in the middle. Neutral stroke
 * until it is complete, then the "ok" green (DESIGN.md "Status colours"); the number is the signal, not the colour.
 */
export function ProgressRing({ value, total, label, className }: { value: number; total: number; label: string; className?: string }) {
    const fraction = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0
    const percent = Math.round(fraction * 100)
    const radius = 16
    const circumference = 2 * Math.PI * radius
    const complete = total > 0 && value >= total

    return (
        <div role="img" aria-label={`${label}: ${value} of ${total}`} className={cn("relative size-10 shrink-0", className)}>
            <svg viewBox="0 0 40 40" aria-hidden className="size-10 -rotate-90">
                <circle cx="20" cy="20" r={radius} fill="none" strokeWidth="4" className="stroke-foreground/10" />
                <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - fraction)}
                    className={cn("transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none", complete ? "stroke-emerald-500" : "stroke-foreground/80")}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium tabular-nums">{percent}%</span>
        </div>
    )
}
