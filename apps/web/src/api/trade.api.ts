// src/api/trade.api.ts
import { useApiClient } from '@/api/api-client';
import {
    TradeBootstrapResponseSchema,
    TradeCartResponseSchema,
    MeltCalculatorResponseSchema,
    type TradeCartRequest,
    type MeltCalculatorRequest,
} from '@goldilocks/shared-types';
import type { MetalType } from '@/lib/types';

/**
 * Trade tab — buy/sell cart pricing + the melt/scrap calculator.
 * Mirrors the Apps Script tool's Api.Trade.gs / Api.Melt.gs endpoints.
 */
export function useTradeApi() {
    const client = useApiClient();

    return {
        getBootstrap: (metal: MetalType) =>
            client.get(`/trade/${metal}/bootstrap`, TradeBootstrapResponseSchema),

        calculateCart: (body: TradeCartRequest) =>
            client.post('/trade/cart', body, TradeCartResponseSchema),

        calculateMelt: (body: MeltCalculatorRequest) =>
            client.post('/trade/melt', body, MeltCalculatorResponseSchema),
    };
}
