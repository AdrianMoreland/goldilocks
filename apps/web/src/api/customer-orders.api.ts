import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    CustomerOrderSchema,
    ExpectedCustomerStockSchema,
    ImportCustomerOrdersResultSchema,
    type AddEvidenceRequest,
    type CreateCustomerOrderRequest,
    type ImportCustomerOrdersRequest,
    type UpdateCustomerOrderRequest,
} from '@goldilocks/shared-types';

/** Goods held for customers. Admin and manager only on the server. */
export function useCustomerOrdersApi() {
    const client = useApiClient();
    return {
        list: () => client.get('/customer-orders', z.array(CustomerOrderSchema)),
        expectedStock: () => client.get('/customer-orders/expected-stock', ExpectedCustomerStockSchema),
        create: (body: CreateCustomerOrderRequest) => client.post('/customer-orders', body, CustomerOrderSchema),
        update: (id: number, body: UpdateCustomerOrderRequest) => client.patch(`/customer-orders/${id}`, body, CustomerOrderSchema),
        addEvidence: (id: number, body: AddEvidenceRequest) => client.post(`/customer-orders/${id}/evidence`, body, CustomerOrderSchema),
        importSheet: (body: ImportCustomerOrdersRequest) => client.post('/customer-orders/import', body, ImportCustomerOrdersResultSchema),
    };
}
