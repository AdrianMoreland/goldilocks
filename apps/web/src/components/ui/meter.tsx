import { cn } from "@/lib/utils"
import { meterPercent, segmentWidths } from "@/components/ui/meter-math"

export type MeterTone = "ink" | "ok" | "warn" | "bad"

export interface MeterSegment {
    value: number
    /** Said aloud by screen readers and shown on hover, so a colour is never the only clue. */
    label: string
    tone?: MeterTone
}

export interface MeterMarker {
    at: number
    label: string
}

interface MeterProps {
    segments: MeterSegment[]
    max: number
    /** One line across the bar for "the point I care about", for example where a warning starts. */
    marker?: MeterMarker
    "aria-label": string
    className?: string
}

const TONE: Record<Exclude<MeterTone, "ink">, string> = {
    ok: "bg-status-ok",
    warn: "bg-status-warn",
    bad: "bg-status-bad",
}

// Segments with no tone are one ink at falling strength, so order (not hue) tells them apart.
const INK = ["bg-foreground/85", "bg-foreground/55", "bg-foreground/35", "bg-foreground/20"]

export function Meter({ segments, max, marker, className, "aria-label": ariaLabel }: MeterProps) {
    const widths = segmentWidths(segments, max)
    const total = segments.reduce((sum, segment) => sum + segment.value, 0)
    let inkIndex = 0
    const valueText = [
        `${total} of ${max}`,
        ...segments.map((segment) => `${segment.label} ${segment.value}`),
        ...(marker ? [`${marker.label} at ${marker.at}`] : []),
    ].join(", ")

    return (
        <div
            role="meter"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.min(Math.max(total, 0), max)}
            aria-valuetext={valueText}
            className={cn("relative h-2 w-full rounded-full bg-muted", className)}
        >
            <div className="flex h-full w-full overflow-hidden rounded-full">
                {segments.map((segment, index) => {
                    const colour = segment.tone && segment.tone !== "ink" ? TONE[segment.tone] : INK[Math.min(inkIndex++, INK.length - 1)]
                    return <span key={`${segment.label}-${index}`} title={`${segment.label}: ${segment.value}`} className={cn("h-full", colour)} style={{ width: `${widths[index]}%` }} />
                })}
            </div>
            {marker && (
                <span
                    aria-hidden
                    title={`${marker.label}: ${marker.at}`}
                    className="bg-foreground absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full"
                    style={{ left: `${meterPercent(marker.at, max)}%` }}
                />
            )}
        </div>
    )
}
