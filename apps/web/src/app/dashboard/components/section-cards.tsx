import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";

import React, {type SVGProps, useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {PauseIcon, PlayIcon, ArrowUp, ArrowDown} from "lucide-react";
import {MetalCardData} from "../schemas/card-data.schema";


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

    console.log({
        metal: data.metal,
        dataPrice: data.price,
        localValue,
        isEditingValue,
        overridePrice,
        isFrozen,
        displayedPrice
    });

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
        console.log("freeze clicked");
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
            className={`cursor-pointer group hover:shadow-lg transition-all duration-200 aspect-[3.2/1] sm:aspect-[2.4/1] lg:aspect-[3.2/1] py-3 gap-1.5 ${active ? "border-2 border-primary" : ""}`}
        >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">
                {data.metal}
            </CardTitle>
            <div
                className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={handleFreezeToggle}
            >
                {isFrozen ? (
                    <PlayIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"/>
                ) : (
                    <PauseIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"/>
                )}
            </div>
        </CardHeader>

        <CardContent className="px-4 pt-0">
            <div
                className="text-xl font-bold mb-1 cursor-text leading-none"
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
                            displayedPrice.toLocaleString("en-IE", {
                                style: "currency",
                                currency: "EUR",
                            })

                        )}
                </div>

                {data.showChange ? (
                    <div className={`flex items-center gap-1.5 text-xs ${changeClass}`}>
                        <span>
                            {data.change! >= 0 ? "+" : ""}
                            {data.change?.toLocaleString("en-IE", {
                                style: "currency", currency: "EUR",
                            })}
                        </span>

                        <span>
                            {data.changePercent! >= 0 ? "+" : ""}
                            {data.changePercent?.toFixed(2)}%
                        </span>

                        {data.direction === "up" && (<ArrowUp className="h-3 w-3"/>)}

                        {data.direction === "down" && (<ArrowDown className="h-3 w-3"/>)}
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground">
                        <p className="font-medium">Manual Override</p>

                        {data.marketPrice !== undefined && (<p>
                                Market Price:{" "}
                                {data.marketPrice.toLocaleString("en-IE", {
                                    style: "currency", currency: "EUR",
                                })}
                            </p>)}
                    </div>)}
            </CardContent>
        </Card>);
}