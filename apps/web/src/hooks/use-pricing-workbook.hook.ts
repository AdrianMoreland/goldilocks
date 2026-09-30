import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useMarketData, STALE_THRESHOLD_MS } from '@/hooks/use-market-data.hook';
import { useUserPreference, useUserSessionState } from '@/hooks/use-user-preference.hook';
import type { MetalType, SpotPrice } from '@/lib/types';
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
                                    freshness,
                                    lastFetchedAt,
                                    fetchSource,
                                }: {
    metal: MetalType;
    price: number;
    marketPrice?: number;
    change?: number;
    changePercent?: number;
    isCustomPrice: boolean;
    freshness: MetalCardData['freshness'];
    lastFetchedAt?: string;
    fetchSource?: MetalCardData['fetchSource'];
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
        freshness,
        lastFetchedAt,
        fetchSource,
    };
}

/**
 * A metal reads as "failed" if the backend couldn't get a usable price for
 * it anywhere (still degraded even after cache→DB→live); "fallback" if a
 * live fetch was just attempted and failed but a last-known-good DB price
 * exists (checked before the age-based "stale" check — a fallback price
 * might technically still be within the staleness window but the fact a
 * fetch just failed is the more important thing to surface); "stale" if
 * its snapshot is older than the cron's normal cadence allows; otherwise
 * "fresh".
 */
function getCardFreshness(spot: SpotPrice | undefined, isDegraded: boolean): MetalCardData['freshness'] {
    if (isDegraded || !spot) return 'failed';
    if (spot.isFallback) return 'fallback';
    const age = Date.now() - new Date(spot.timestamp).getTime();
    return age > STALE_THRESHOLD_MS ? 'stale' : 'fresh';
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
    // Gold selected by default on first launch, matching the chart's default
    // "selected metal only" view — see ChartAreaInteractive's chartMode.
    // Remembered per user afterwards.
    const [selectedMetal, setSelectedMetal] = useUserPreference<MetalType | null>('selected-metal', 'GOLD');
    // Overrides (a frozen or hand-typed spot) survive a page refresh but not a
    // closed tab, and belong to the signed-in user — a clerk's manual quote
    // shouldn't leak into the next person's session at a shared counter PC.
    const [spotOverrides, setSpotOverrides] = useUserSessionState<Partial<Record<MetalType, number>>>('spot-overrides', {});

    const {
        products,
        spotPrices,
        historicSpot,
        loading,
        error,
        lastUpdatedLabel,
        lastUpdatedRelative,
        fetchedAt,
        isStale,
        degradedMetals,
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
    }, [setSpotOverrides]);

    /** Pins a metal at whatever it reads right now, so live updates stop moving the quote. */
    const freezeSpot = useCallback((metal: MetalType) => {
        const live = spotPrices.find((p) => p.metalType === metal)?.priceEur;
        if (live === undefined) return;
        setSpotOverrides((prev) => (prev[metal] === undefined ? { ...prev, [metal]: live } : prev));
    }, [spotPrices, setSpotOverrides]);

    const clearAllSpotOverrides = useCallback(() => setSpotOverrides({}), [setSpotOverrides]);

    const clearSpotOverride = useCallback((metal: MetalType) => {
        setSpotOverrides(prev => {
            const next = {...prev};
            delete next[metal];
            return next;
        });
    }, [setSpotOverrides]);

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
                    freshness: getCardFreshness(spot, degradedMetals.includes(metal)),
                    lastFetchedAt: spot?.timestamp,
                    fetchSource: spot?.fetchSource,
                });
            }),
        [
            spotPrices,
            displayPrices,
            spotOverrides,
            degradedMetals,
            // Freshness is age-based, so re-derive as the minute-granular label ticks over.
            lastUpdatedRelative,
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
        fetchedAt,
        isStale,
        degradedMetals,

        // selection & overrides
        selectedMetal,
        setSelectedMetal,
        toggleSelectedMetal,
        handleSpotOverride,
        clearSpotOverride,
        clearAllSpotOverrides,
        freezeSpot,
        spotOverrides,
    };
}