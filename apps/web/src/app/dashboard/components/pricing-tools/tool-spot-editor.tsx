import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Snowflake } from "lucide-react"
import { useTradeApi } from "@/api/trade.api"
import { queryKeys } from "@/lib/query-keys"
import type { MetalType } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToolSpot, type SpotTool } from "../../context/tool-spots-context"
import { formatMetalName, formatSpot, roundSpot } from "../../utils/formatters"
import { FieldLabel } from "./tab-widgets"

interface ToolSpotEditorProps {
    tool: SpotTool
    metal: MetalType
    /** Hides the slider (and so the bounds lookup) where a compact field is enough. */
    slider?: boolean
    id?: string
    label?: string
}

/**
 * One tool's spot: a field, a slider and Reset. It follows the card's spot until
 * edited; after that it is the tool's own and the card, the table and the other
 * tools are untouched. Reset re-attaches this tool only.
 */
export function ToolSpotEditor({ tool, metal, slider = true, id, label = "Spot price" }: ToolSpotEditorProps) {
    const { spot, detached, marketSpot, cardSpot, cardFrozen, setSpot, reset } = useToolSpot(tool, metal)
    const api = useTradeApi()
    const bounds = useQuery({
        queryKey: queryKeys.trade.bootstrap(metal),
        queryFn: () => api.getBootstrap(metal),
        enabled: slider,
        refetchInterval: 60_000,
    })

    const rounded = spot !== null ? roundSpot(metal, spot) : ""
    const [draft, setDraft] = useState(String(rounded))
    const [focused, setFocused] = useState(false)

    // Mid-typing the draft is the user's; otherwise it tracks the spot (a card tick, a slider move, a reset).
    useEffect(() => {
        if (!focused) setDraft(String(rounded))
    }, [rounded, focused])

    const minSpot = bounds.data?.minSpot ?? 0
    const maxSpot = bounds.data?.maxSpot ?? 0

    return (
        <div className="flex flex-col gap-2.5">
            <FieldLabel>{label}</FieldLabel>
            <div className="flex items-center gap-2">
                <Input
                    id={id}
                    type="number"
                    step="0.01"
                    value={draft}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                        setDraft(e.target.value)
                        setSpot(parseFloat(e.target.value))
                    }}
                    className="h-10 w-28 shrink-0 rounded-xl"
                    aria-label={`${formatMetalName(metal)} spot price`}
                />
                {slider && maxSpot > minSpot && (
                    <Slider
                        value={spot ?? minSpot}
                        min={minSpot}
                        max={maxSpot}
                        step={0.01}
                        onValueChange={setSpot}
                        className="flex-1 accent-[var(--tab-accent)]"
                        aria-label="Adjust spot price"
                    />
                )}
                <button
                    type="button"
                    onClick={reset}
                    disabled={!detached}
                    title="Go back to the app's main spot price (this tool only)"
                    className="border-border bg-background hover:bg-muted ml-auto shrink-0 cursor-pointer rounded-full border px-3 py-2 text-xs font-bold transition-colors disabled:cursor-default disabled:opacity-40"
                >
                    Reset
                </button>
            </div>
            <p className="text-muted-foreground text-[11px]">
                {detached ? (
                    <>
                        <span className="inline-flex items-center gap-1 font-bold text-[var(--tab-accent-text)]">
                            <Snowflake className="size-3" aria-hidden /> Frozen
                        </span>
                        {marketSpot ? <> — live market {formatSpot(metal, marketSpot)}</> : null}
                        {cardFrozen && cardSpot ? <> · Card frozen at {formatSpot(metal, cardSpot)}</> : null}
                    </>
                ) : (
                    <>Following the app's main spot price</>
                )}
            </p>
        </div>
    )
}
