import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useMarketData } from '@/hooks/use-market-data.hook';
import type { MetalType } from '../lib/types.ts';

export const METALS = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] as const;
export type Metal = (typeof METALS)[number];

const DEBOUNCE_MS = 300;

// ── Internal: debounced recalc ────────────────────────────────────────────────
function useDebouncedRecalc(
    spotOverrides: Partial<Record<MetalType, number>>,
    recalc: (overrides: Partial<Record<MetalType, number>>) => void,
) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (Object.keys(spotOverrides).length === 0) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            recalc(spotOverrides);
        }, DEBOUNCE_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [spotOverrides, recalc]);
}

// ── Public hook ───────────────────────────────────────────────────────────────

export function usePricingWorkbook() {
    const [selectedMetal, setSelectedMetal] = useState<Metal | null>(null);
    const [spotOverrides, setSpotOverrides] = useState<Partial<Record<MetalType, number>>>({});

    const {
        products,
        spotPrices,
        loading,
        error,
        lastUpdatedLabel,
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
            ) as Record<Metal, number>,
        [spotPrices, spotOverrides],
    );

    // ── Callbacks ─────────────────────────────────────────────────────────────
    const handleSpotOverride = useCallback((metal: MetalType, value: number) => {
        setSpotOverrides((prev) => ({
            ...prev,
            [metal]: value,
        }));
    }, []);

    const toggleSelectedMetal = useCallback((metal: Metal) => {
        setSelectedMetal((prev) => (prev === metal ? null : metal));
    }, []);

    return {
        // products (already priced, from the combined snapshot)
        products,
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

        // selection & overrides
        selectedMetal,
        toggleSelectedMetal,
        handleSpotOverride,
    };
}