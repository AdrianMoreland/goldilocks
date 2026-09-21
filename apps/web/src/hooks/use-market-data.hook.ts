// src/hooks/use-market-data.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useMarketDataApi, type SpotOverrideRequest } from '@/api/market-data.api';
import { queryKeys } from '@/lib/query-keys';
import type { MarketDataResponse } from '../lib/types.ts';

function getMinutesAgoText(fetchedAt?: string | null) {
    if (!fetchedAt) return null;

    const diffMs = Date.now() - new Date(fetchedAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'less than 1 minute ago';

    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
}

/** To-the-second timestamp for the "prices fetched at" toast — deliberately more precise than lastUpdatedRelative's rounded minutes-ago text. */
function formatFetchedAtTime(fetchedAt?: string | null): string | null {
    if (!fetchedAt) return null;

    return new Date(fetchedAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/**
 * Replaces the old useMetalSpotPrices + the read half of useProducts.
 * One query, one snapshot — spotPrices and products always agree with
 * each other because they came from the same backend response.
 */
export function useMarketData() {
    const { getMarketData, recalculate, refreshMarketData } = useMarketDataApi();
    const queryClient = useQueryClient();

    const query = useQuery<MarketDataResponse>({
        queryKey: queryKeys.marketData.all,
        queryFn: getMarketData,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { data, isLoading, isFetching, error } = query;

    // The backend sets this when a metal fell all the way through
    // cache → DB → the live API without finding a usable price (still
    // 0.00 on screen) — surfaced once per distinct message, not on every
    // refetch that happens to repeat the same warning.
    const lastWarningShown = useRef<string | null>(null);
    useEffect(() => {
        const warning = data?.priceWarning ?? null;
        if (warning && warning !== lastWarningShown.current) {
            toast.warning(warning);
        }
        lastWarningShown.current = warning;
    }, [data?.priceWarning]);

    // Bottom-right "prices fetched at" toast on initial page load — fires
    // once for the first snapshot the query resolves with. The equivalent
    // toast for a manual refresh lives in refreshMutation's onSuccess below,
    // since that's a separate fetch outside this query's own lifecycle.
    const hasShownInitialFetchToast = useRef(false);
    useEffect(() => {
        if (!data?.fetchedAt || hasShownInitialFetchToast.current) return;
        hasShownInitialFetchToast.current = true;
        const time = formatFetchedAtTime(data.fetchedAt);
        if (time) toast(`Prices fetched at ${time}`);
    }, [data?.fetchedAt]);

    const lastUpdatedRelative = useMemo(() => {
        if (isLoading) return 'Loading…';
        if (error) return 'unavailable';

        return getMinutesAgoText(data?.fetchedAt) ?? 'unknown';
    }, [isLoading, error, data?.fetchedAt]);

    const lastUpdatedLabel = `Last Updated: ${lastUpdatedRelative}`;

    // ── Manual recalculation (UI spot overrides) ───────────────────────────
    const recalcMutation = useMutation({
        mutationFn: (overrides: SpotOverrideRequest) => recalculate(overrides),

        onSuccess: (pricedProducts) => {
            // The backend's /recalculate only returns the new products —
            // spotPrices/historicSpot/fetchedAt are untouched (overrides are
            // ephemeral UI state, never persisted), so patch just that slice.
            queryClient.setQueryData<MarketDataResponse>(queryKeys.marketData.all, (old) =>
                old ? { ...old, products: pricedProducts } : old,
            );
        },
    });

    // ── Manual refresh (fetch latest spot + products snapshot) ───────────────
    const refreshMutation = useMutation({
        mutationFn: refreshMarketData,
        onSuccess: (marketData) => {
            queryClient.setQueryData<MarketDataResponse>(
                queryKeys.marketData.all,
                marketData,
            );

            const time = formatFetchedAtTime(marketData.fetchedAt);
            if (time) toast(`Prices fetched at ${time}`);

            if (marketData.priceWarning) {
                toast.warning(marketData.priceWarning);
                lastWarningShown.current = marketData.priceWarning;
            } else {
                toast.success('Spot prices updated');
            }
        },

        onError: (error) => {
            console.error('Failed to refresh market data', error);
        },
    });

    return {
        spotPrices: data?.spotPrices ?? [],
        historicSpot: data?.historicSpot ?? [],
        products: data?.products ?? [],
        fetchedAt: data?.fetchedAt,

        loading: isLoading || isFetching,
        error,
        lastUpdatedLabel,
        lastUpdatedRelative,

        recalc: recalcMutation.mutate,

        refresh: refreshMutation.mutate,
        refreshing: refreshMutation.isPending,
    };
}
