import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";

import React, {type SVGProps, useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {PauseIcon, PlayIcon, ArrowUp, ArrowDown} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {MetalCardData} from "../schemas/card-data.schema";
import {metalAccentStyle} from "./pricing-tools/tab-theme";
import {formatMinutesAgo, formatSpot} from "../utils/formatters";
import {FETCH_SOURCE_LABEL} from "../utils/fetch-source";

const FRESHNESS_DOT_COLOR: Record<MetalCardData["freshness"], string> = {
    fresh: "bg-emerald-500",
    stale: "bg-amber-500",
    fallback: "bg-orange-500",
    failed: "bg-red-500",
}

const FRESHNESS_LABEL: Record<MetalCardData["freshness"], string> = {
    fresh: "Fresh",
    stale: "Stale",
    fallback: "Live fetch failed — showing last known price",
    failed: "Failed to fetch",
}

/** The small dot next to the metal name — fresh/stale/failed, computed from lastFetchedAt + degradedMetals (see use-pricing-workbook.hook.ts). Money-risk signal: a red or amber dot means don't trust this price without checking further. */
function FreshnessDot({ data }: { data: MetalCardData }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={`inline-block size-1.5 shrink-0 rounded-full ${FRESHNESS_DOT_COLOR[data.freshness]}`}
                    aria-label={`Price freshness: ${FRESHNESS_LABEL[data.freshness]}`}
                />
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{FRESHNESS_LABEL[data.freshness]} — updated {formatMinutesAgo(data.lastFetchedAt)}</p>
                {data.fetchSource && <p className="opacity-70">Source: {FETCH_SOURCE_LABEL[data.fetchSource]}</p>}
            </TooltipContent>
        </Tooltip>
    )
}


interface SectionCardProps {
    data: MetalCardData;
    active?: boolean;
    onClick: () => void;
    onValueChange?: (newValue: number) => void;
    onClearOverride?: () => void;   // <-- add this
}

export function SectionCards({
                                 data,
                                 active = false,
                                 onClick,
                                 onValueChange,
                                 onClearOverride,
                             }: SectionCardProps) {

    const [isFrozen, setIsFrozen] = useState(false);
    const [overridePrice, setOverridePrice] = useState<number | null>(null);
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [localValue, setLocalValue] = useState<number | "">(data.price);

    const displayedPrice =
        isFrozen && overridePrice !== null
            ? overridePrice
            : data.price;

    const handleEditStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalValue(displayedPrice);
        setIsEditingValue(true);
    };
    const handleBlur = () => {
        setIsEditingValue(false);
        if (localValue === "") {
            return;
        }
        if (localValue !== data.price) {
            // Store temporary display override
            setOverridePrice(localValue);
            // Tell parent to recalculate products
            onValueChange?.(localValue);
            // Freeze automatically
            setIsFrozen(true);
        }
    };

    const changeClass =
        data.direction === "up" ? "text-green-600" : data.direction === "down" ? "text-red-600" : "text-muted-foreground";

    const handleFreezeToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsFrozen(prev => {
            const next = !prev;
            if (!next) {
                // User clicked play
                setOverridePrice(null);
                // Tell parent to remove backend recalculation override
                onClearOverride?.();
            }
            return next;
        });
    };

    return (<Card
            onClick={onClick}
            style={metalAccentStyle(data.metal)}
            className={`bg-card-raised cursor-pointer group hover:shadow-lg transition-all duration-200 aspect-[3.2/1] sm:aspect-[2.4/1] lg:aspect-[3.2/1] py-3 gap-1.5 border-2 ${
                active ? "border-[var(--tab-accent)]" : "border-transparent"
            }`}
        >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-[var(--tab-accent-text)]">
                {data.metal}
                <span onClick={(e) => e.stopPropagation()}>
                    <FreshnessDot data={data} />
                </span>
            </CardTitle>
            <div
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ background: "var(--tab-accent-soft)" }}
                onClick={handleFreezeToggle}
            >
                {isFrozen ? (
                    <PlayIcon className="h-3.5 w-3.5 text-[var(--tab-accent-text)] transition-colors"/>
                ) : (
                    <PauseIcon className="h-3.5 w-3.5 text-[var(--tab-accent-text)] transition-colors"/>
                )}
            </div>
        </CardHeader>

        <CardContent className="px-4 pt-0">
            <div
                className="text-xl font-bold mb-1 cursor-text leading-none tabular-nums"
                onClick={handleEditStart}
            >
                {isEditingValue ? (
                    <Input
                        autoFocus
                        type="number"
                        placeholder="Enter price..."
                                value={localValue}
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
                                onChange={(e) =>
                                    setLocalValue(
                                        e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                    )
                                }
                                onBlur={handleBlur}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.currentTarget.blur();
                                    }
                                }}
                            />
                        ) : (
                            formatSpot(data.metal, displayedPrice)

                        )}
                </div>

                {data.showChange ? (
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
                ) : (
                    <div className="text-xs text-muted-foreground tabular-nums">
                        <p className="font-medium">Manual Override</p>

                        {data.marketPrice !== undefined && (<p>
                                Market Price:{" "}
                                {formatSpot(data.metal, data.marketPrice)}
                            </p>)}
                    </div>)}
            </CardContent>
        </Card>);
}