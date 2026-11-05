import { useApiClient } from '@/api/api-client';
import {
    BcAwaitingResultSchema,
    ImportBatchListSchema,
    WorkbookChunkResultSchema,
    type BcAwaitingRequest,
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
    };
}
