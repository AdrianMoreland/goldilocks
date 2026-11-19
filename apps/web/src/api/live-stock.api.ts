import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    LiveBaselinePreviewSchema,
    LiveBaselineResultSchema,
    LiveStockBoardSchema,
    LiveStockBranchesResponseSchema,
    LiveStockBranchSchema,
    LiveStockMovementSchema,
    type AddLiveStockBarRequest,
    type AdjustLiveStockRequest,
    type CreateLiveStockLineRequest,
    type LiveBaselineRequest,
    type LiveStockBoardQuery,
    type SetLiveStockBarStatusRequest,
    type TransferLiveStockRequest,
} from '@goldilocks/shared-types';

/** Live branch stock. Anyone signed in reads; the server decides who edits. */
export function useLiveStockApi() {
    const client = useApiClient();
    const qty = z.object({ qty: z.number().int() });
    return {
        branches: () => client.get('/live-stock/branches', LiveStockBranchesResponseSchema),
        board: (q: Pick<LiveStockBoardQuery, 'branch' | 'metal'>) =>
            client.get(`/live-stock/board?branch=${encodeURIComponent(q.branch)}&metal=${q.metal}`, LiveStockBoardSchema),
        history: (lineId: number) => client.get(`/live-stock/lines/${lineId}/history`, z.array(LiveStockMovementSchema)),
        adjust: (lineId: number, body: AdjustLiveStockRequest) =>
            client.post(`/live-stock/lines/${lineId}/adjust`, body, z.object({ qty: z.number().int(), movementId: z.number().int() })),
        createLine: (body: CreateLiveStockLineRequest) => client.post('/live-stock/lines', body, z.object({ id: z.number().int() })),
        transfer: (lineId: number, body: TransferLiveStockRequest) =>
            client.post(`/live-stock/lines/${lineId}/transfer`, body, z.object({ fromQty: z.number().int(), toQty: z.number().int() })),
        addBar: (lineId: number, body: AddLiveStockBarRequest) =>
            client.post(`/live-stock/lines/${lineId}/bars`, body, z.object({ id: z.number().int(), qty: z.number().int() })),
        barStatus: (barId: number, body: SetLiveStockBarStatusRequest) => client.post(`/live-stock/bars/${barId}/status`, body, qty),
        undo: (movementId: number) => client.post(`/live-stock/movements/${movementId}/undo`, {}, qty),
        link: (code: string, branchId: number | null) => client.put(`/live-stock/branches/${code}/link`, { branchId }, LiveStockBranchSchema),
        previewBaseline: (body: LiveBaselineRequest) => client.post('/live-stock/baseline/preview', body, LiveBaselinePreviewSchema),
        commitBaseline: (body: LiveBaselineRequest) => client.post('/live-stock/baseline', body, LiveBaselineResultSchema),
    };
}
