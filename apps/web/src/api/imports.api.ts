import { useApiClient } from '@/api/api-client';
import {
    BcAwaitingResultSchema,
    BcHistoryResultSchema,
    ItemTraceSchema,
    ShippedNotCollectedListSchema,
    ShippedNotCollectedTasksResultSchema,
    ImportBatchListSchema,
    WorkbookChunkResultSchema,
    type BcAwaitingRequest,
    type BcHistoryRequest,
    type WorkbookChunkRequest,
} from '@goldilocks/shared-types';

/** The assembled workbook and the Business Central report. Admin only on the server. */
export function useImportsApi() {
    const client = useApiClient();
    return {
        batches: () => client.get('/imports/workbook/batches', ImportBatchListSchema),
        previewChunk: (body: WorkbookChunkRequest) => client.post('/imports/workbook/preview', body, WorkbookChunkResultSchema),
        commitChunk: (body: WorkbookChunkRequest) => client.post('/imports/workbook/commit', body, WorkbookChunkResultSchema),
        previewBc: (body: BcAwaitingRequest) => client.post('/imports/bc-awaiting/preview', body, BcAwaitingResultSchema),
        commitBc: (body: BcAwaitingRequest) => client.post('/imports/bc-awaiting/commit', body, BcAwaitingResultSchema),
        previewBcHistory: (body: BcHistoryRequest) => client.post('/imports/bc-history/preview', body, BcHistoryResultSchema),
        commitBcHistory: (body: BcHistoryRequest) => client.post('/imports/bc-history/commit', body, BcHistoryResultSchema),
        shippedNotCollected: () => client.get('/imports/bc-history/shipped-not-collected', ShippedNotCollectedListSchema),
        createCollectedTasks: () => client.post('/imports/bc-history/shipped-not-collected/tasks', {}, ShippedNotCollectedTasksResultSchema),
        traceItem: (serial: string) => client.get(`/items/trace?serial=${encodeURIComponent(serial)}`, ItemTraceSchema),
    };
}
