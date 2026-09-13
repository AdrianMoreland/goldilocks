// src/api/market-data.api.ts
import { useApiClient } from '@/api/api-client';
import { MarketDataResponseSchema, ProductArraySchema } from '@goldilocks/shared-types';
import type { MetalType } from '../lib/types.ts';

export type SpotOverrideRequest = Partial<Record<MetalType, number>>;

/**
 * The single source of truth for the dashboard: spot prices, historic
 * spot prices, and products are always fetched together so the priced
 * products on screen are guaranteed to match the spot prices shown next
 * to them — never two independently-stale snapshots.
 */
export function useMarketDataApi() {
    const client = useApiClient();

    return {
        getMarketData: () => client.get('/market-data', MarketDataResponseSchema),

        recalculate: (overrides: SpotOverrideRequest) =>
            client.post('/market-data/recalculate', overrides, ProductArraySchema),

        refreshMarketData: () =>
            client.post(
                '/market-data/refresh',
                undefined,
                MarketDataResponseSchema
            ),
    };
}
