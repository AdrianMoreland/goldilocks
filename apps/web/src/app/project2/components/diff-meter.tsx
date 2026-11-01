import { cn } from "@/lib/utils"
import { meterShares } from "../sync-state"

/**
 * How far the app's roadmap has drifted from master, as one thin two-part bar: lines only in the app on the
 * left, lines only on master on the right. Neutral tones only (the colour is in the words, DESIGN.md "Earned
 * Colour Rule"); the counts under it carry the exact numbers.
 */
export function DiffMeter({ appOnly, masterOnly, className }: { appOnly: number; masterOnly: number; className?: string }) {
    const shares = meterShares(appOnly, masterOnly)
    if (!shares) return null

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <div
                role="img"
                aria-label={`${appOnly} lines only in the app, ${masterOnly} lines only on master`}
                className="bg-muted flex h-1.5 w-full gap-px overflow-hidden rounded-full"
            >
                <div className="bg-foreground/70 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${shares.app * 100}%` }} />
                <div className="bg-muted-foreground/40 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${shares.master * 100}%` }} />
            </div>
            <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
                <span>
                    <span className="text-foreground font-mono">{appOnly}</span> only in the app
                </span>
                <span>
                    <span className="text-foreground font-mono">{masterOnly}</span> only on master
                </span>
            </div>
        </div>
    )
}
