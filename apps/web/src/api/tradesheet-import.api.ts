import { useApiClient } from '@/api/api-client';
import {
    TradesheetImportPlanSchema,
    TradesheetImportResultSchema,
    type TradesheetImportRequest,
} from '@goldilocks/shared-types';

/** Monthly trade-sheet import (roadmap 1.19). Admin only on the server. */
export function useTradesheetImportApi() {
    const client = useApiClient();
    return {
        preview: (body: TradesheetImportRequest) => client.post('/tradesheet-import/preview', body, TradesheetImportPlanSchema),
        commit: (body: TradesheetImportRequest) => client.post('/tradesheet-import/commit', body, TradesheetImportResultSchema),
    };
}
