// src/hooks/use-market-data.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/hooks/useApi';
import { useMarketDataApi, type SpotOverrideRequest } from '@/api/market-data.api';
import { queryKeys } from '@/lib/query-keys';
import { formatMinutesAgo } from '@/app/dashboard/utils/formatters';
import type { MarketDataResponse } from '../lib/types.ts';

/** How old the vendor's price snapshot can be before we tell the user prices might be wrong. Set to 5 minutes by the owner — note the cron only refreshes every 10, so a healthy snapshot can read stale for up to half of each cycle. */
export const STALE_THRESHOLD_MS = 5 * 60 * 1000;

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

    // Fetch FAILURE (the request itself errored) is a different kind of
    // problem than stale-but-successful data (see isStale below) — surfaced
    // as its own toast so "the feed is down" doesn't get lost inside "the
    // feed is just old". Only fires on the transition into an error, not on
    // every re-render while it stays errored.
    const hasShownErrorToast = useRef(false);
    useEffect(() => {
        if (error && !hasShownErrorToast.current) {
            hasShownErrorToast.current = true;
            // An ApiError already produced its own, more specific toast (with
            // a reference) and an error-log entry — don't stack a second one.
            if (!(error instanceof ApiError)) {
                toast.error('Could not fetch spot prices — check your connection or try refreshing.');
            }
        }
        if (!error) hasShownErrorToast.current = false;
    }, [error]);

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

    // Ages are computed from Date.now(), so without a tick they'd freeze at
    // whatever they were when the snapshot last changed — and with a 5-minute
    // stale threshold, that would leave a price looking fresh long after it isn't.
    const [nowTick, setNowTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setNowTick((n) => n + 1), 30_000);
        return () => clearInterval(id);
    }, []);

    const lastUpdatedRelative = useMemo(() => {
        if (isLoading) return 'Loading…';
        if (error) return 'unavailable';

        return formatMinutesAgo(data?.fetchedAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, error, data?.fetchedAt, nowTick]);

    const lastUpdatedLabel = `Last Updated: ${lastUpdatedRelative}`;

    const isStale = useMemo(() => {
        if (!data?.fetchedAt) return false;
        return Date.now() - new Date(data.fetchedAt).getTime() > STALE_THRESHOLD_MS;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.fetchedAt, nowTick]);

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

            // The HTTP call succeeding just means the backend responded —
            // it can still mean "the live fetch failed and this is the
            // last-known-good DB price" (isFallback) or "no usable price
            // anywhere" (priceWarning). Neither of those is "updated", so
            // don't say so — and skip the "fetched at" toast too, since
            // touting a specific fetch time makes a failure read as a
            // success. See CardFreshnessEnum's 'fallback' state for the
            // matching per-card indicator.
            const anyFallback = marketData.spotPrices.some((spot) => spot.isFallback);

            if (marketData.priceWarning) {
                toast.warning(marketData.priceWarning);
                lastWarningShown.current = marketData.priceWarning;
            } else if (anyFallback) {
                toast.error('Live price fetch failed — showing the last known prices from the database.');
            } else {
                const time = formatFetchedAtTime(marketData.fetchedAt);
                if (time) toast(`Prices fetched at ${time}`);
                toast.success('Spot prices updated');
            }
        },

        onError: (error) => {
            console.error('Failed to refresh market data', error);
            toast.error('Price refresh failed — showing the last known prices.');
        },
    });

    return {
        spotPrices: data?.spotPrices ?? [],
        historicSpot: data?.historicSpot ?? [],
        products: data?.products ?? [],
        fetchedAt: data?.fetchedAt,
        degradedMetals: data?.degradedMetals ?? [],

        loading: isLoading || isFetching,
        error,
        lastUpdatedLabel,
        lastUpdatedRelative,
        isStale,

        recalc: recalcMutation.mutate,

        refresh: refreshMutation.mutate,
        refreshing: refreshMutation.isPending,
    };
}
