import { useState, type ReactNode } from "react"
import { ArrowLeftRight, Table2, Tag } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { PriceScope } from "../table/clipboard-table"

interface EasyCopyButtonProps {
    disabled: boolean
    /** True in Price mode (the customer buying), false in Buyback mode: decides which side is named first. */
    isPrice: boolean
    onCopy: (scope: PriceScope) => void
    /** Runs before the choices open (the stale-spot check); it calls `open` to carry on. */
    beforeOpen?: (open: () => void) => void
}

/** Easy Copy: asks which prices the copied table should show, then hands the choice to `onCopy`. */
export function EasyCopyButton({ disabled, isPrice, onCopy, beforeOpen }: EasyCopyButtonProps) {
    const [open, setOpen] = useState(false)
    const selected = isPrice ? "Price" : "Buyback"
    const other = isPrice ? "Buyback" : "Price"

    const choose = (scope: PriceScope) => {
        setOpen(false)
        onCopy(scope)
    }

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                if (next && beforeOpen) beforeOpen(() => setOpen(true))
                else setOpen(next)
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="border-border bg-card hover:bg-muted flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Table2 className="size-4" /> Easy Copy
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 rounded-2xl p-3" align="center">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold">Which prices should it show?</p>
                    <Choice
                        icon={<Tag className="size-4" />}
                        label={`${selected} only`}
                        hint={isPrice ? "What the customer would pay" : "What we would pay the customer"}
                        onClick={() => choose({ price: isPrice, buyback: !isPrice })}
                    />
                    <Choice
                        icon={<ArrowLeftRight className="size-4" />}
                        label={`${selected} and ${other}`}
                        hint="Both sides, side by side"
                        onClick={() => choose({ price: true, buyback: true })}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

function Choice({ icon, label, hint, onClick }: { icon: ReactNode; label: string; hint: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="hover:bg-muted flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors">
            <span className="text-muted-foreground">{icon}</span>
            <span className="flex flex-col">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-muted-foreground text-xs">{hint}</span>
            </span>
        </button>
    )
}
