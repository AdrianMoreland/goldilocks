import { useApiClient } from '@/api/api-client';
import {
    InventoryBarsResponseSchema,
    InventoryCoinsResponseSchema,
    InventoryPositionSchema,
} from '@goldilocks/shared-types';

export interface BarsFilter {
    stocktakeId?: number;
    metal?: string;
    branch?: string;
    where?: string;
    q?: string;
    limit: number;
    offset: number;
}

const qs = (params: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : '';
};

/** Stock position from the stocktake models. Admin only on the server. Search is by serial, never by a name. */
export function useInventoryApi() {
    const client = useApiClient();
    return {
        position: (stocktakeId?: number) => client.get(`/inventory/position${qs({ stocktakeId })}`, InventoryPositionSchema),
        bars: (f: BarsFilter) => client.get(`/inventory/bars${qs({ ...f })}`, InventoryBarsResponseSchema),
        coins: (f: { stocktakeId?: number; metal?: string; branch?: string }) => client.get(`/inventory/coins${qs({ ...f })}`, InventoryCoinsResponseSchema),
    };
}
