import { cn } from "@/lib/utils"

/**
 * A ring that fills clockwise from the top. The default is 40px with the whole percentage in the middle; `size="sm"`
 * is a 20px ring with no number, for a row that already prints "3/5" beside it. Neutral stroke until complete, then
 * the "ok" green (DESIGN.md "Status colours"): the number is the signal, not the colour.
 */
export function ProgressRing({
    value,
    total,
    label,
    size = "md",
    className,
}: {
    value: number
    total: number
    label: string
    size?: "md" | "sm"
    className?: string
}) {
    const fraction = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0
    const percent = Math.round(fraction * 100)
    const small = size === "sm"
    const stroke = small ? 5 : 4
    const radius = 20 - stroke / 2 - 2
    const circumference = 2 * Math.PI * radius
    const complete = total > 0 && value >= total

    return (
        <div role="img" aria-label={`${label}: ${value} of ${total}`} className={cn("relative shrink-0", small ? "size-5" : "size-10", className)}>
            <svg viewBox="0 0 40 40" aria-hidden className="size-full -rotate-90">
                <circle cx="20" cy="20" r={radius} fill="none" strokeWidth={stroke} className="stroke-foreground/10" />
                <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    fill="none"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - fraction)}
                    className={cn("transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none", complete ? "stroke-emerald-500" : "stroke-foreground/80")}
                />
            </svg>
            {!small && <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium tabular-nums">{percent}%</span>}
        </div>
    )
}
