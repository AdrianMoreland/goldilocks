// src/hooks/use-market-data.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/hooks/useApi';
import { useMarketDataApi, type SpotOverrideRequest } from '@/api/market-data.api';
import { useAdminApi } from '@/api/admin.api';
import { queryKeys } from '@/lib/query-keys';
import { formatAge, formatSnapshotTime } from '@/app/dashboard/utils/formatters';
import type { MarketDataResponse, MetalType } from '../lib/types.ts';
import { spotFreshness } from '@goldilocks/shared-types';

/** How often the dashboard checks for a newer price snapshot. */
const SPOT_STATUS_POLL_MS = 2 * 60 * 1000;

/** "Prices as of 17:55 (12 min ago)" - the market time of the prices, never the time we fetched them. */
function pricesAsOfMessage(snapshotAt?: string | null): string | null {
    if (!snapshotAt) return null;
    return `Prices as of ${formatSnapshotTime(snapshotAt)} (${formatAge(Date.now() - new Date(snapshotAt).getTime())})`;
}

/**
 * Replaces the old useMetalSpotPrices + the read half of useProducts.
 * One query, one snapshot - spotPrices and products always agree with
 * each other because they came from the same backend response.
 */
export function useMarketData() {
    const { getMarketData, getSpotStatus, recalculate, refreshMarketData } = useMarketDataApi();
    const queryClient = useQueryClient();

    const query = useQuery<MarketDataResponse>({
        queryKey: queryKeys.marketData.all,
        queryFn: getMarketData,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { data, isLoading, isFetching, error } = query;

    // Every 2 minutes, a light check of the price times (it reads our cache
    // and never calls the vendor while auto-refresh is paused). A new market
    // snapshot refetches the full data so the table reprices; otherwise only
    // the fetch time and pause state are patched in.
    const { data: status } = useQuery({
        queryKey: queryKeys.spotStatus,
        queryFn: getSpotStatus,
        enabled: data !== undefined,
        refetchInterval: SPOT_STATUS_POLL_MS,
        refetchOnWindowFocus: true,
    });
    useEffect(() => {
        if (!status || !data) return;
        if (status.snapshotAt !== data.snapshotAt) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all, exact: true });
            return;
        }
        if (status.lastFetchAt !== data.lastFetchAt || status.autoRefreshPaused !== data.autoRefreshPaused) {
            queryClient.setQueryData<MarketDataResponse>(queryKeys.marketData.all, (old) =>
                old ? { ...old, lastFetchAt: status.lastFetchAt, autoRefreshPaused: status.autoRefreshPaused } : old,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // Fetch FAILURE (the request itself errored) is a different kind of
    // problem than stale-but-successful data (see isStale below) - surfaced
    // as its own toast so "the feed is down" doesn't get lost inside "the
    // feed is just old". Only fires on the transition into an error, not on
    // every re-render while it stays errored.
    const hasShownErrorToast = useRef(false);
    useEffect(() => {
        if (error && !hasShownErrorToast.current) {
            hasShownErrorToast.current = true;
            // An ApiError already produced its own, more specific toast (with
            // a reference) and an error-log entry - don't stack a second one.
            if (!(error instanceof ApiError)) {
                toast.error('Could not fetch spot prices - check your connection or try refreshing.');
            }
        }
        if (!error) hasShownErrorToast.current = false;
    }, [error]);

    // The backend sets this when a metal fell all the way through
    // cache → DB → the live API without finding a usable price (still
    // 0.00 on screen) - surfaced once per distinct message, not on every
    // refetch that happens to repeat the same warning.
    const lastWarningShown = useRef<string | null>(null);
    useEffect(() => {
        const warning = data?.priceWarning ?? null;
        if (warning && warning !== lastWarningShown.current) {
            toast.warning(warning);
        }
        lastWarningShown.current = warning;
    }, [data?.priceWarning]);

    // Bottom-right "prices as of" toast on initial page load - fires
    // once for the first snapshot the query resolves with. The equivalent
    // toast for a manual refresh lives in refreshMutation's onSuccess below,
    // since that's a separate fetch outside this query's own lifecycle.
    const hasShownInitialFetchToast = useRef(false);
    useEffect(() => {
        if (!data?.snapshotAt || hasShownInitialFetchToast.current) return;
        hasShownInitialFetchToast.current = true;
        const message = pricesAsOfMessage(data.snapshotAt);
        if (message) toast(message);
    }, [data?.snapshotAt]);

    // Ages are computed from Date.now(), so without a tick they'd freeze at
    // whatever they were when the snapshot last changed - and with a short
    // stale threshold, that would leave a price looking fresh long after it isn't.
    const [nowTick, setNowTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setNowTick((n) => n + 1), 30_000);
        return () => clearInterval(id);
    }, []);

    // Green/amber/red/closed from when we last fetched; the text says how old the market price itself is.
    const freshness = useMemo(
        () => spotFreshness({ snapshotAt: data?.snapshotAt, lastFetchAt: data?.lastFetchAt, now: new Date() }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data?.snapshotAt, data?.lastFetchAt, nowTick],
    );

    const lastUpdatedRelative = isLoading ? 'Loading…' : error ? 'unavailable' : formatAge(freshness.priceAgeMs);

    const lastUpdatedLabel = `Prices as of: ${lastUpdatedRelative}`;

    const isStale = freshness.state === 'late' || freshness.state === 'stale';

    // ── Manual recalculation (UI spot overrides) ───────────────────────────
    const recalcMutation = useMutation({
        mutationFn: (overrides: SpotOverrideRequest) => recalculate(overrides),

        onSuccess: (pricedProducts) => {
            // The backend's /recalculate only returns the new products -
            // spotPrices/historicSpot/snapshotAt are untouched (overrides are
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

            // The HTTP call succeeding just means the backend responded -
            // it can still mean "the live fetch failed and this is the
            // last-known-good DB price" (isFallback) or "no usable price
            // anywhere" (priceWarning). Neither of those is "updated", so
            // don't say so - and skip the "prices as of" line too, since
            // touting a specific price time makes a failure read as a
            // success. See CardFreshnessEnum's 'fallback' state for the
            // matching per-card indicator.
            const anyFallback = marketData.spotPrices.some((spot) => spot.isFallback);

            if (marketData.priceWarning) {
                toast.warning(marketData.priceWarning);
                lastWarningShown.current = marketData.priceWarning;
            } else if (anyFallback) {
                toast.error('Live price fetch failed - showing the last known prices from the database.');
            } else {
                toast.success('Spot prices updated', { description: pricesAsOfMessage(marketData.snapshotAt) ?? undefined });
            }
        },

        onError: (error) => {
            console.error('Failed to refresh market data', error);
            toast.error('Price refresh failed - showing the last known prices.');
        },
    });

    return {
        spotPrices: data?.spotPrices ?? [],
        historicSpot: data?.historicSpot ?? [],
        products: data?.products ?? [],
        snapshotAt: data?.snapshotAt ?? null,
        lastFetchAt: data?.lastFetchAt ?? null,
        autoRefreshPaused: data?.autoRefreshPaused ?? false,
        freshness,
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

/** Admin Retry on a failed metal card: one live vendor call, then reload the prices so the card and table agree. */
export function useRetryMetalSpot() {
    const { retryMetal } = useAdminApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (metal: MetalType) => retryMetal(metal),
        onSuccess: async (_spot, metal) => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all, exact: true });
            await queryClient.invalidateQueries({ queryKey: queryKeys.spotStatus });
            toast.success(`${metal.charAt(0)}${metal.slice(1).toLowerCase()} price fetched`);
        },
        onError: (_error, metal) => {
            toast.error(`Retry failed for ${metal.toLowerCase()} - still showing the last known price.`);
        },
    });
}
