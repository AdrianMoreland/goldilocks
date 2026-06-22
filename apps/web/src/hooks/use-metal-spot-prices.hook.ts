// src/hooks/use-metal-spot-prices.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMetalSpotPricesApi } from '@/api/metal-spot-prices.api';
import { toast } from 'sonner';
import type {SpotPrice} from "../lib/types.ts";

const QUERY_KEY = ['metal-spot-prices'] as const;

function getMinutesAgoLabel(updatedAt?: string | null) {
    if (!updatedAt) return null;

    const diffMs = Date.now() - new Date(updatedAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Last Updated: less than 1 minute ago';

    return `Last Updated: ${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
}

export function useMetalSpotPrices() {
    const { getSpotPrices, refreshSpotPrices } = useMetalSpotPricesApi();
    const queryClient = useQueryClient();

    const query = useQuery<SpotPrice[]>({
        queryKey: QUERY_KEY,
        queryFn: getSpotPrices,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const {
        data = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = query;

    // ── READ ──────────────────────────────────────────────────────────────────
/*    const {
        data = [],
        isLoading,
        isFetching,
        error,
    } = useQuery<SpotPriceDTO[]>({
        queryKey: QUERY_KEY,
        queryFn: getSpotPrices,
        staleTime: 5 * 60 * 1000,   // 5 min browser-side cache
        refetchOnWindowFocus: false,
    });*/

    const lastUpdated = useMemo(() => {
        if (!data.length) return null;

        let latest = data[0];

        for (const item of data) {
            if (
                new Date(item.updatedAt).getTime() >
                new Date(latest.updatedAt).getTime()
            ) {
                latest = item;
            }
        }

        return latest.updatedAt;
    }, [data]);

    const lastUpdatedLabel = useMemo(() => {
        if (isLoading) return 'Loading spot prices…';
        if (error) return 'Could not load spot prices';

        return (
            getMinutesAgoLabel(lastUpdated) ??
            'Last Updated: unknown'
        );
    }, [isLoading, error, lastUpdated]);

    // ── REFRESH (mutation) ────────────────────────────────────────────────────
    const { mutate: refreshPrices, isPending: isRefreshing } = useMutation({
        mutationFn: refreshSpotPrices,

        onSuccess: (freshPrices) => {
            // Directly populate the query cache with the fresh data the backend
            // already returned — no second GET needed.
            queryClient.setQueryData<SpotPrice[]>(QUERY_KEY, freshPrices);
            toast.success('Spot prices updated');
        },

        onError: (err) => {
            toast.error('Failed to refresh spot prices');
            console.error(err);
        },
    });

    return {
        prices: data,
        loadingSpot: isLoading || isFetching,
        errorSpot: error,
        isRefreshing: isFetching,
        refreshPrices,   // () => void  — call on button click
        lastUpdatedLabel,
    };
}