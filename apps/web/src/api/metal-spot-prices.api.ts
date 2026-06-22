// web/src/api/metal-spot-prices.api.ts
import { useApi } from '@/hooks/useApi';

import type {
    SpotPrice,
    MetalType,
} from '../lib/types.ts';


export function useMetalSpotPricesApi() {
    const { request } = useApi();

    return {
        getSpotPrices: () =>
            request<SpotPrice[]>(
                '/metals'
            ),

        getSpotPrice: (
            metal: MetalType
        ) =>
            request<SpotPrice>(
                `/metals/${metal}`
            ),

        refreshSpotPrices: () =>
            request<SpotPrice[]>(
                '/refresh',
                {
                    method: 'POST',
                }
            ),
    };
}