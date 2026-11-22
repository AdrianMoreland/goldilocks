import { type CustomerListResponse, type CustomerProfile, type InvoiceDetail, type InvoiceListResponse } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class CustomerRecordsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private search;
    customers(body: unknown): Promise<CustomerListResponse>;
    customer(id: number): Promise<CustomerProfile>;
    invoices(body: unknown): Promise<InvoiceListResponse>;
    invoice(id: number): Promise<InvoiceDetail>;
}
//# sourceMappingURL=customer-records.service.d.ts.map