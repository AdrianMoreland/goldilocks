import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useMarketData } from '@/hooks/use-market-data.hook';
import type { MetalType } from '@/lib/types';
import {MetalCardData} from "@/app/dashboard/schemas/card-data.schema.ts";

export const METALS = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] as const;
export type Metal = (typeof METALS)[number];

const DEBOUNCE_MS = 300;



export function createMetalCard({
                                    metal,
                                    price,
                                    marketPrice,
                                    change,
                                    changePercent,
                                    isCustomPrice,
                                }: {
    metal: MetalType;
    price: number;
    marketPrice?: number;
    change?: number;
    changePercent?: number;
    isCustomPrice: boolean;
}): MetalCardData {

    return {
        metal,
        price,
        isCustomPrice,
        marketPrice,
        showChange: !isCustomPrice,
        change: isCustomPrice ? undefined : change,
        changePercent: isCustomPrice ? undefined : changePercent,
        direction: isCustomPrice ? undefined : getDirection(change ?? 0),
    };
}


function getDirection(
    change: number,
): "up" | "down" | "neutral" {

    if (change > 0) return "up";
    if (change < 0) return "down";

    return "neutral";
}

// ── Internal: debounced recalc ────────────────────────────────────────────────
function useDebouncedRecalc(
    spotOverrides: Partial<Record<MetalType, number>>,
    recalc: (overrides: Partial<Record<MetalType, number>>) => void,
) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            recalc(spotOverrides);
        }, DEBOUNCE_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [spotOverrides, recalc]);
}

// ── Public hook ───────────────────────────────────────────────────────────────

export function usePricingWorkbook() {
    // Gold selected by default on launch, matching the chart's default
    // "selected metal only" view — see ChartAreaInteractive's chartMode.
    const [selectedMetal, setSelectedMetal] = useState<MetalType | null>('GOLD');
    const [spotOverrides, setSpotOverrides] = useState<Partial<Record<MetalType, number>>>({});

    const {
        products,
        spotPrices,
        historicSpot,
        loading,
        error,
        lastUpdatedLabel,
        lastUpdatedRelative,
        recalc,
        refresh,
        refreshing
    } = useMarketData();

    useDebouncedRecalc(spotOverrides, recalc);

    // ── Derived: display price per metal (override beats live) ────────────────
    const displayPrices = useMemo(
        () =>
            Object.fromEntries(
                METALS.map((metal) => {
                    const livePrice = spotPrices.find((p) => p.metalType === metal)?.priceEur ?? 0;
                    return [metal, spotOverrides[metal] ?? livePrice];
                }),
            ) as Record<MetalType, number>,
        [spotPrices, spotOverrides],
    );

    // ── Callbacks ─────────────────────────────────────────────────────────────
    const handleSpotOverride = useCallback((metal: MetalType, value: number) => {
        setSpotOverrides((prev) => ({
            ...prev,
            [metal]: value,
        }));
    }, []);

    const clearSpotOverride = useCallback((metal: MetalType) => {
        setSpotOverrides(prev => {
            const next = {...prev};
            delete next[metal];
            return next;
        });
    }, []);

    const metalCards = useMemo(
        () =>
            METALS.map((metal) => {
                const spot = spotPrices.find(
                    (item) => item.metalType === metal
                );

                return createMetalCard({
                    metal,
                    price: displayPrices[metal],
                    marketPrice: spot?.priceEur,
                    change: spot?.change,
                    changePercent: spot?.changePercent,
                    isCustomPrice: spotOverrides[metal] !== undefined,
                });
            }),
        [
            spotPrices,
            displayPrices,
            spotOverrides,
        ]
    );

    const toggleSelectedMetal = useCallback((metal: MetalType) => {
        setSelectedMetal((prev) => (prev === metal ? null : metal));
    }, []);

    return {
        metalCards,
        // products (already priced, from the combined snapshot)
        products,
        // historic chart data
        historicSpot,
        loading,
        error,

        // spot prices
        prices: spotPrices,
        displayPrices,

        loadingSpot: loading,
        errorSpot: error,

        refresh,
        refreshing,

        spotStatusLabel: lastUpdatedLabel,
        lastUpdatedRelative,

        // selection & overrides
        selectedMetal,
        toggleSelectedMetal,
        handleSpotOverride,
        clearSpotOverride,
    };
}