import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    BcItemsResponseSchema,
    CarryForwardResultSchema,
    ImportPhysicalResultSchema,
    PhysicalRegisterSchema,
    StocktakeBarSchema,
    StocktakeCoinSchema,
    DiscrepancySchema,
    ImportJournalResultSchema,
    StocktakeDetailSchema,
    StocktakeLineSchema,
    StocktakeSchema,
    type AddBarRequest,
    type AddCoinRequest,
    type CreateDiscrepancyRequest,
    type StockMetal,
    type UpdateBarRequest,
    type UpdateCoinRequest,
    type CreateStocktakeRequest,
    type UpdateDiscrepancyRequest,
    type UpdateStocktakeLineRequest,
    type UpdateStocktakeRequest,
} from '@goldilocks/shared-types';

/** Month-end stocktake. Admin and manager only on the server. */
export function useStocktakeApi() {
    const client = useApiClient();
    const base = (id: number) => `/stocktake/${id}`;
    // 204 responses have no body; the client hands back an empty string.
    const empty = z.unknown();

    return {
        list: () => client.get('/stocktake', z.array(StocktakeSchema)),
        get: (id: number) => client.get(base(id), StocktakeDetailSchema),
        create: (body: CreateStocktakeRequest) => client.post('/stocktake', body, StocktakeSchema),
        update: (id: number, body: UpdateStocktakeRequest) => client.patch(base(id), body, StocktakeSchema),
        finalise: (id: number) => client.post(`${base(id)}/finalise`, {}, StocktakeSchema),
        importJournal: (id: number, text: string) =>
            client.post(`${base(id)}/import-journal`, { text }, ImportJournalResultSchema),
        updateLine: (id: number, lineId: number, body: UpdateStocktakeLineRequest) =>
            client.patch(`${base(id)}/lines/${lineId}`, body, StocktakeLineSchema),
        addDiscrepancy: (id: number, body: CreateDiscrepancyRequest) =>
            client.post(`${base(id)}/discrepancies`, body, DiscrepancySchema),
        updateDiscrepancy: (id: number, discrepancyId: number, body: UpdateDiscrepancyRequest) =>
            client.patch(`${base(id)}/discrepancies/${discrepancyId}`, body, DiscrepancySchema),
        deleteDiscrepancy: (id: number, discrepancyId: number) =>
            client.del(`${base(id)}/discrepancies/${discrepancyId}`, empty),
        register: (id: number) => client.get(`${base(id)}/register`, PhysicalRegisterSchema),
        carryForward: (id: number, fromStocktakeId?: number) =>
            client.post(`${base(id)}/carry-forward`, { fromStocktakeId }, CarryForwardResultSchema),
        importBars: (id: number, metal: StockMetal, text: string) =>
            client.post(`${base(id)}/bars/import`, { metal, text }, ImportPhysicalResultSchema),
        addBar: (id: number, body: AddBarRequest) => client.post(`${base(id)}/bars`, body, StocktakeBarSchema),
        updateBar: (id: number, barId: number, body: UpdateBarRequest) =>
            client.patch(`${base(id)}/bars/${barId}`, body, StocktakeBarSchema),
        deleteBar: (id: number, barId: number) => client.del(`${base(id)}/bars/${barId}`, empty),
        importCoins: (id: number, metal: StockMetal, text: string) =>
            client.post(`${base(id)}/coins/import`, { metal, text }, ImportPhysicalResultSchema),
        addCoin: (id: number, body: AddCoinRequest) => client.post(`${base(id)}/coins`, body, StocktakeCoinSchema),
        updateCoin: (id: number, coinId: number, body: UpdateCoinRequest) =>
            client.patch(`${base(id)}/coins/${coinId}`, body, StocktakeCoinSchema),
        bcItems: () => client.get('/stocktake/bc-items', BcItemsResponseSchema),
        linkBcItem: (itemNo: string, productId: number | null) =>
            client.put(`/stocktake/bc-items/${encodeURIComponent(itemNo)}/product`, { productId }, empty),
    };
}
