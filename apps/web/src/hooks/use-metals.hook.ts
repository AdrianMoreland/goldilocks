// src/hooks/use-metals.hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import {useMetalSpotPricesApi} from "@/api/metal-spot-prices.api.ts";
import {useMarketDataApi} from "@/api/market-data.api.ts";

export function useRefreshSpotPrices() {
    const { refreshMarketData } = useMarketDataApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refreshMarketData,

        onSuccess: () => {
            // The refresh endpoint only updates spot prices in the DB/cache —
            // it does NOT return priced products. Invalidate the combined
            // market-data query rather than patching a spot-price slice in
            // isolation, so products get recalculated against fresh prices too.
            queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all });
            toast.success('Spot prices updated');
        },

        onError: (err) => {
            toast.error('Failed to refresh spot prices');
            console.error(err);
        },
    });
}
