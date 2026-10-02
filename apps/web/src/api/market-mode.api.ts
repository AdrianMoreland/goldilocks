import { useApiClient } from '@/api/api-client';
import {
    MarketModeStateSchema,
    type UpdateMarketModeRequest,
} from '@goldilocks/shared-types';

/** The company-wide market mode: everyone reads it, an admin or manager sets it. */
export function useMarketModeApi() {
    const client = useApiClient();

    return {
        getMarketMode: () => client.get('/market-mode', MarketModeStateSchema),
        setMarketMode: (body: UpdateMarketModeRequest) => client.put('/market-mode', body, MarketModeStateSchema),
    };
}
