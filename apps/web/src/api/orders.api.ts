import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    LatestHandoverSchema,
    OrderDetailSchema,
    OrderListResponseSchema,
    ReconcileResultSchema,
    SheetTaskSchema,
    type OrderListQuery,
    type OrderStep,
    type RecordStepRequest,
} from '@goldilocks/shared-types';

/** Orders, sheet tasks and the handover note. Admin only on the server for now. */
export function useOrdersApi() {
    const client = useApiClient();
    return {
        list: (query: OrderListQuery) => {
            const p = new URLSearchParams();
            if (query.queue && query.queue !== 'all') p.set('queue', query.queue);
            if (query.q) p.set('q', query.q);
            const qs = p.toString();
            return client.get(`/orders${qs ? `?${qs}` : ''}`, OrderListResponseSchema);
        },
        get: (id: number) => client.get(`/orders/${id}`, OrderDetailSchema),
        recordStep: (id: number, step: OrderStep, body: RecordStepRequest) => client.post(`/orders/${id}/steps/${step}`, body, OrderDetailSchema),
        tasks: (status: 'OPEN' | 'DONE') => client.get(`/sheet-tasks?status=${status}`, z.array(SheetTaskSchema)),
        completeTask: (id: number) => client.post(`/sheet-tasks/${id}/done`, {}, SheetTaskSchema),
        reconcile: () => client.post('/sheet-tasks/reconcile', {}, ReconcileResultSchema),
        handover: () => client.get('/handover', LatestHandoverSchema),
        saveHandover: (note: string) => client.post('/handover', { note }, LatestHandoverSchema.shape.handover.unwrap()),
    };
}
