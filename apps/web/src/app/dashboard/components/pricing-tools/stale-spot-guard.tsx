import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NumberInput } from "@/components/number-input"
import { keepKeyboardClosedOnTouch } from "@/lib/dialog-focus"
import type { MetalType } from "@/lib/types"
import { useSpotPrices } from "../../context/spot-prices-context"
import { useToolSpot } from "../../context/tool-spots-context"
import { formatAge, formatMetalName, formatSnapshotTime, formatSpot } from "../../utils/formatters"

/**
 * Before a price leaves the building (Easy Copy, Message customer): if the
 * quote still follows the live spot and that spot is late (amber) or stale
 * (red), ask first. The user can type a spot - it becomes the Trade tool's
 * own spot, so the copy and the message are priced from it - or go on with
 * the old price. A spot the user froze or typed is their own number, so it
 * is never questioned.
 */
export function useStaleSpotGuard(metal: MetalType) {
    const { freshness, snapshotAt } = useSpotPrices()
    const tradeSpot = useToolSpot("trade", metal)
    const [pending, setPending] = useState<(() => void) | null>(null)
    const [typed, setTyped] = useState<number | null>(null)

    const followsLive = !tradeSpot.detached && !tradeSpot.cardFrozen
    const needsCheck = followsLive && (freshness.state === "late" || freshness.state === "stale")

    /** Runs `proceed` now, or after the user has answered the dialog. */
    const guard = (proceed: () => void) => {
        if (!needsCheck) return proceed()
        setTyped(null)
        setPending(() => proceed)
    }

    const close = () => setPending(null)
    const goOn = () => {
        const proceed = pending
        close()
        proceed?.()
    }
    const applyTyped = () => {
        if (!typed || typed <= 0) return
        tradeSpot.setSpot(typed)
        goOn()
    }

    const red = freshness.state === "stale"
    const dialog = (
        <Dialog open={pending !== null} onOpenChange={(open) => !open && close()}>
            <DialogContent className="sm:max-w-md" onOpenAutoFocus={keepKeyboardClosedOnTouch}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className={red ? "size-5 text-red-600 dark:text-red-400" : "size-5 text-amber-600 dark:text-amber-400"} aria-hidden />
                        {red ? "This spot price is very old" : "This spot price may be out of date"}
                    </DialogTitle>
                    <DialogDescription>
                        The {formatMetalName(metal).toLowerCase()} spot of {formatSpot(metal, tradeSpot.spot ?? 0)} is the market price at{" "}
                        {formatSnapshotTime(snapshotAt)} ({formatAge(freshness.priceAgeMs)}). Enter a current spot to price this quote from, or go on with the old one.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="flex flex-col gap-1.5"
                    onSubmit={(e) => {
                        e.preventDefault()
                        applyTyped()
                    }}
                >
                    <label htmlFor="stale-spot-input" className="text-sm font-medium">
                        Spot to use (€ per troy ounce)
                    </label>
                    <NumberInput
                        id="stale-spot-input"
                        inputMode="decimal"
                        placeholder={tradeSpot.spot ? String(Math.round(tradeSpot.spot)) : undefined}
                        value={typed}
                        emptyValue={0}
                        onValueChange={(value) => setTyped(value > 0 ? value : null)}
                    />
                    <p className="text-muted-foreground text-xs">It becomes the Trade tool's spot for {formatMetalName(metal).toLowerCase()}; Reset there to follow the card again.</p>
                </form>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="ghost" onClick={close}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={goOn}>
                        Use the old price
                    </Button>
                    <Button onClick={applyTyped} disabled={!typed}>
                        Use this spot
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return { guard, dialog }
}
