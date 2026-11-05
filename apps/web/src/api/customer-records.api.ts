import { useApiClient } from '@/api/api-client';
import {
    CustomerListResponseSchema,
    CustomerProfileSchema,
    InvoiceDetailSchema,
    InvoiceListResponseSchema,
    type RecordSearchRequest,
} from '@goldilocks/shared-types';

/**
 * Customer and invoice history. Admin only on the server, read only. Searches are POST bodies and pages are opened
 * by number, so a customer name is never in a URL.
 */
export function useCustomerRecordsApi() {
    const client = useApiClient();
    return {
        customers: (body: Partial<RecordSearchRequest>) => client.post('/customers/search', body, CustomerListResponseSchema),
        customer: (id: number) => client.get(`/customers/${id}`, CustomerProfileSchema),
        invoices: (body: Partial<RecordSearchRequest>) => client.post('/invoices/search', body, InvoiceListResponseSchema),
        invoice: (id: number) => client.get(`/invoices/${id}`, InvoiceDetailSchema),
    };
}
