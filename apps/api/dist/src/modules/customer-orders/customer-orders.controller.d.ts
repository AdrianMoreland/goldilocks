import { type CustomerOrder, type ExpectedCustomerStockResponse, type ImportCustomerOrdersResult } from '@goldilocks/shared-types';
import { CustomerOrdersService } from './customer-orders.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { AddEvidenceRequestDto, CreateCustomerOrderRequestDto, ImportCustomerOrdersRequestDto, UpdateCustomerOrderRequestDto } from '../../common/dto/dtos';
export declare class CustomerOrdersController {
    private readonly service;
    constructor(service: CustomerOrdersService);
    list(status?: string, locationCode?: string): Promise<CustomerOrder[]>;
    expectedStock(): Promise<ExpectedCustomerStockResponse>;
    previewImport(body: ImportCustomerOrdersRequestDto): Promise<ImportCustomerOrdersResult>;
    importSheet(body: ImportCustomerOrdersRequestDto, req: RequestWithUser): Promise<ImportCustomerOrdersResult>;
    create(body: CreateCustomerOrderRequestDto, req: RequestWithUser): Promise<CustomerOrder>;
    update(id: number, body: UpdateCustomerOrderRequestDto, req: RequestWithUser): Promise<CustomerOrder>;
    addEvidence(id: number, body: AddEvidenceRequestDto, req: RequestWithUser): Promise<CustomerOrder>;
}
//# sourceMappingURL=customer-orders.controller.d.ts.map