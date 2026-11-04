import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";

import React, {useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {PauseIcon, PlayIcon, ArrowUp, ArrowDown, Snowflake, Pencil} from "lucide-react";
import {features} from "@/config/features";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {MetalCardData} from "../schemas/card-data.schema";
import {metalAccentStyle} from "./pricing-tools/tab-theme";
import {formatMinutesAgo, formatSnapshotTime, formatSpot, roundSpot} from "../utils/formatters";
import {FETCH_SOURCE_LABEL} from "../utils/fetch-source";

const FRESHNESS_DOT_COLOR: Record<MetalCardData["freshness"], string> = {
    fresh: "bg-status-ok",
    stale: "bg-status-warn",
    fallback: "bg-status-stale",
    failed: "bg-status-bad",
}

const FRESHNESS_LABEL: Record<MetalCardData["freshness"], string> = {
    fresh: "Fresh",
    stale: "Stale",
    fallback: "Live fetch failed - showing last known price",
    failed: "Failed to fetch",
}

/** The dot next to the metal name — fresh/stale/failed, computed from the vendor snapshot time + degradedMetals (see use-pricing-workbook.hook.ts). Money-risk signal: a red or amber dot means don't trust this price without checking further. The age is not repeated per card: all four come from one vendor call, so the header's status text and stale triangle say it once. */
function FreshnessDot({ data }: { data: MetalCardData }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex items-center" tabIndex={0} aria-label={`Price freshness: ${FRESHNESS_LABEL[data.freshness]}`}>
                    <span className={`inline-block size-2 shrink-0 rounded-full ${FRESHNESS_DOT_COLOR[data.freshness]}`} />
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{FRESHNESS_LABEL[data.freshness]}</p>
                <p>API snapshot: {formatSnapshotTime(data.lastFetchedAt)} ({formatMinutesAgo(data.lastFetchedAt)})</p>
                {data.fetchSource && <p className="opacity-70">Served from: {FETCH_SOURCE_LABEL[data.fetchSource]}</p>}
            </TooltipContent>
        </Tooltip>
    )
}


interface SectionCardProps {
    data: MetalCardData;
    active?: boolean;
    onClick: () => void;
    /** Types a manual spot — the card freezes at it. */
    onValueChange?: (newValue: number) => void;
    /** Pins the spot at its current live value. */
    onFreeze?: () => void;
    /** Back to live market prices. */
    onClearOverride?: () => void;
}

export function SectionCards({
                                 data,
                                 active = false,
                                 onClick,
                                 onValueChange,
                                 onFreeze,
                                 onClearOverride,
                             }: SectionCardProps) {

    // Frozen is simply "there is an override" — held by the workbook, so it
    // survives a refresh and the other tools quote from the same number.
    const isFrozen = data.isCustomPrice;
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [draft, setDraft] = useState("");

    const handleEditStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // The rounded figure, not the raw float the vendor math produces
        // (3684.6078821868737) — that is what's on the card and what a clerk types over.
        setDraft(String(roundSpot(data.metal, data.price)));
        setIsEditingValue(true);
    };

    const commit = () => {
        setIsEditingValue(false);
        const value = Number(draft);
        if (draft.trim() === "" || !Number.isFinite(value) || value <= 0) return;
        // Untouched text must not freeze the card at the rounded figure.
        if (value === roundSpot(data.metal, data.price)) return;
        onValueChange?.(value);
    };

    // The Sonar prototype's compact card: price and change share a line, the freeze button is a quiet icon, and a pencil appears
    // on hover and focus to say the price can be typed over.
    const compact = features.redesign;

    const changeClass =
        data.direction === "up" ? "text-up" : data.direction === "down" ? "text-down" : "text-muted-foreground";

    const handleFreezeToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFrozen) onClearOverride?.();
        else onFreeze?.();
    };

    return (<Card
            onClick={onClick}
            style={compact ? { ...metalAccentStyle(data.metal), "--tab-accent-text": `var(--mt-${data.metal.toLowerCase()})` } as React.CSSProperties : metalAccentStyle(data.metal)}
            className={cn(
                "bg-card-raised cursor-pointer group transition-all duration-200 border-2",
                compact
                    ? "min-w-0 gap-0 py-2 hover:border-muted-foreground/30"
                    : "hover:shadow-lg aspect-[3.2/1] sm:aspect-[2.4/1] lg:aspect-[3.2/1] py-3 gap-1.5",
                isFrozen && "border-dashed",
                active || isFrozen ? "border-[var(--tab-accent)]" : compact ? "border-border" : "border-transparent",
            )}
        >
        <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-0", compact ? "px-3" : "px-4")}>
            <CardTitle className={cn("flex min-w-0 items-center text-sm font-bold text-[var(--tab-accent-text)]", compact ? "gap-1.5" : "gap-2")}>
                {data.metal}
                <span onClick={(e) => e.stopPropagation()}>
                    <FreshnessDot data={data} />
                </span>
            </CardTitle>
            <div className="flex items-center gap-1.5">
                {isFrozen && (
                    <span
                        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-extrabold tracking-wide text-[var(--tab-accent-text)] uppercase"
                        style={{ background: "var(--tab-accent-soft)" }}
                    >
                        <Snowflake className="size-3" aria-hidden />
                        Frozen
                    </span>
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={handleFreezeToggle}
                            aria-pressed={isFrozen}
                            aria-label={isFrozen ? `Resume live ${data.metal.toLowerCase()} price` : `Freeze ${data.metal.toLowerCase()} price`}
                            className={cn("cursor-pointer transition-colors", compact ? "hover:bg-muted rounded-md p-1" : "rounded-lg p-2 hover:brightness-95")}
                            style={compact ? undefined : { background: "var(--tab-accent-soft)" }}
                        >
                            {isFrozen ? (
                                <PlayIcon className={cn("text-[var(--tab-accent-text)]", compact ? "size-4" : "size-5")}/>
                            ) : (
                                <PauseIcon className={cn("text-[var(--tab-accent-text)]", compact ? "size-4" : "size-5")}/>
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {isFrozen
                            ? "Resume live prices for this metal (Ctrl+Z resumes all)"
                            : "Freeze this spot so live updates stop moving your quote"}
                    </TooltipContent>
                </Tooltip>
            </div>
        </CardHeader>

        <CardContent className={cn("pt-0", compact ? "flex flex-wrap items-baseline gap-x-2 px-3" : "px-4")}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn("text-xl font-bold cursor-text leading-none tabular-nums w-fit", compact ? "flex items-center gap-1" : "mb-1")}
                        onClick={handleEditStart}
                        {...(compact && !isEditingValue ? {
                            role: "button",
                            tabIndex: 0,
                            onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter") handleEditStart(e as unknown as React.MouseEvent) },
                        } : {})}
                    >
                        {isEditingValue ? (
                            <Input
                                autoFocus
                                type="number"
                                inputMode="decimal"
                                placeholder="Enter price..."
                                value={draft}
                                onFocus={(e) => e.currentTarget.select()}
                                onClick={(e) => e.stopPropagation()}
                                className="
                                    !h-auto
                                    !w-40
                                    !p-0
                                    !border-0
                                    !rounded-none
                                    !shadow-none
                                    !text-xl
                                    !font-semibold
                                    !leading-none
                                    !bg-transparent
                                    focus-visible:ring-0
                                    focus-visible:ring-offset-0
                                    placeholder:text-muted-foreground
                                    [appearance:textfield]
                                    [&::-webkit-inner-spin-button]:appearance-none
                                    [&::-webkit-outer-spin-button]:appearance-none
                                "
                                onChange={(e) => setDraft(e.target.value)}
                                onBlur={commit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") e.currentTarget.blur();
                                    if (e.key === "Escape") {
                                        e.stopPropagation();
                                        setIsEditingValue(false);
                                    }
                                }}
                            />
                        ) : (
                            <>
                                {formatSpot(data.metal, data.price)}
                                {compact && <Pencil className="text-muted-foreground size-3 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100" aria-hidden />}
                            </>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Click to type your own spot price - Enter to apply, Esc to cancel</TooltipContent>
            </Tooltip>

            {isFrozen ? (
                <div className={cn("text-xs text-muted-foreground tabular-nums", compact && "w-full")}>
                    {data.marketPrice !== undefined && (
                        <p>
                            Live market now: <span className="font-semibold">{formatSpot(data.metal, data.marketPrice)}</span>
                        </p>
                    )}
                </div>
            ) : data.showChange ? (
                <div className={`flex items-center gap-1.5 text-xs tabular-nums ${changeClass}`}>
                    <span>
                        {data.change! >= 0 ? "+" : ""}
                        {formatSpot(data.metal, data.change)}
                    </span>

                    <span>
                        {data.changePercent! >= 0 ? "+" : ""}
                        {data.changePercent?.toFixed(2)}%
                    </span>

                    {data.direction === "up" && (<ArrowUp className="h-3 w-3"/>)}

                    {data.direction === "down" && (<ArrowDown className="h-3 w-3"/>)}
                </div>
            ) : null}
        </CardContent>
    </Card>);
}
