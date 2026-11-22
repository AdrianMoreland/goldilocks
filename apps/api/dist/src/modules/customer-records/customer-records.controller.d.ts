import type { CustomerListResponse, CustomerProfile, InvoiceDetail, InvoiceListResponse } from '@goldilocks/shared-types';
import { CustomerRecordsService } from './customer-records.service';
import { RecordSearchRequestDto } from '../../common/dto/dtos';
export declare class CustomersController {
    private readonly records;
    constructor(records: CustomerRecordsService);
    search(body: RecordSearchRequestDto): Promise<CustomerListResponse>;
    one(id: number): Promise<CustomerProfile>;
}
export declare class InvoicesController {
    private readonly records;
    constructor(records: CustomerRecordsService);
    search(body: RecordSearchRequestDto): Promise<InvoiceListResponse>;
    one(id: number): Promise<InvoiceDetail>;
}
//# sourceMappingURL=customer-records.controller.d.ts.map