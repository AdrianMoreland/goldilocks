// src/hooks/use-market-data.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMarketDataApi, type SpotOverrideRequest } from '@/api/market-data.api';
import { queryKeys } from '@/lib/query-keys';
import type { MarketDataResponse } from '../lib/types.ts';

function getMinutesAgoLabel(fetchedAt?: string | null) {
    if (!fetchedAt) return null;

    const diffMs = Date.now() - new Date(fetchedAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Last Updated: less than 1 minute ago';

    return `Last Updated: ${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
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

    const lastUpdatedLabel = useMemo(() => {
        if (isLoading) return 'Loading spot prices…';
        if (error) return 'Could not load spot prices';

        return getMinutesAgoLabel(data?.fetchedAt) ?? 'Last Updated: unknown';
    }, [isLoading, error, data?.fetchedAt]);

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

        recalc: recalcMutation.mutate,

        refresh: refreshMutation.mutate,
        refreshing: refreshMutation.isPending,
    };
}
