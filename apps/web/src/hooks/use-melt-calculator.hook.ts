import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTradeApi } from '@/api/trade.api';
import { queryKeys } from '@/lib/query-keys';
import type { MeltCategoryKey } from '@goldilocks/shared-types';
import { GRAMS_PER_TROY_OUNCE } from '@goldilocks/shared-types';

const DEBOUNCE_MS = 150;

/**
 * Melt/scrap calculator — split out of useTradeTools so it can be reasoned
 * about (and tested) independently of the buy/sell cart, which it shares no
 * state with beyond "is the melt panel currently showing". Ported from the
 * Merrion Gold Apps Script tool's Api.Melt.gs.
 *
 * `enabled` gates the debounced calculation — the Trade tab only shows this
 * panel while selling, and only actually queries while it's visible.
 */
export function useMeltCalculator(enabled: boolean) {
    const api = useTradeApi();

    const [meltCategory, setMeltCategory] = useState<MeltCategoryKey>('24ct');
    const [meltWeight, setMeltWeight] = useState(GRAMS_PER_TROY_OUNCE);
    const [meltPayload, setMeltPayload] = useState<{ category: MeltCategoryKey; weight: number } | null>(null);

    useEffect(() => {
        if (!enabled || !meltWeight || meltWeight <= 0) {
            setMeltPayload(null);
            return;
        }
        const handle = setTimeout(() => setMeltPayload({ category: meltCategory, weight: meltWeight }), DEBOUNCE_MS);
        return () => clearTimeout(handle);
    }, [enabled, meltCategory, meltWeight]);

    const meltQuery = useQuery({
        queryKey: queryKeys.trade.melt(meltPayload),
        queryFn: () => api.calculateMelt(meltPayload as { category: MeltCategoryKey; weight: number }),
        enabled: meltPayload !== null,
        placeholderData: (prev) => prev,
    });

    return {
        meltCategory,
        setMeltCategory,
        meltWeight,
        setMeltWeight,
        meltResult: meltQuery.data,
        meltLoading: meltQuery.isFetching,
        meltError: meltQuery.error as Error | null,
    };
}
