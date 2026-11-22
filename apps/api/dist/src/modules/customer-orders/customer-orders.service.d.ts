import { planCustomerOrderImport, type AddEvidenceRequest, type CreateCustomerOrderRequest, type CustomerOrderImportRow, type CustomerOrderPlanOptions, type CustomerOrder, type CustomerOrderStatus, type ExpectedCustomerStockResponse, type ImportCustomerOrdersRequest, type ImportCustomerOrdersResult, type StockMetal, type UpdateCustomerOrderRequest } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
type Db = Prisma.TransactionClient | PrismaService;
type OrderImportPlan = ReturnType<typeof planCustomerOrderImport>;
export declare class CustomerOrdersService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    list(filter: {
        status?: CustomerOrderStatus;
        locationCode?: string;
    }): Promise<CustomerOrder[]>;
    create(dto: CreateCustomerOrderRequest, actor: string): Promise<CustomerOrder>;
    update(id: number, dto: UpdateCustomerOrderRequest, actor: string): Promise<CustomerOrder>;
    addEvidence(id: number, dto: AddEvidenceRequest, actor: string): Promise<CustomerOrder>;
    planRows(db: Db, rows: CustomerOrderImportRow[], options?: CustomerOrderPlanOptions): Promise<{
        toAdd: CustomerOrderImportRow[];
        toUpdate: {
            id: number;
            changes: import("@goldilocks/shared-types").CustomerOrderChanges;
        }[];
        unchanged: number;
    }>;
    writePlan(tx: Prisma.TransactionClient, plan: OrderImportPlan, metalFor: (row: CustomerOrderImportRow) => StockMetal, actor: string): Promise<void>;
    private planImport;
    previewImport(dto: ImportCustomerOrdersRequest): Promise<ImportCustomerOrdersResult>;
    importSheet(dto: ImportCustomerOrdersRequest, actor: string): Promise<ImportCustomerOrdersResult>;
    expectedStock(): Promise<ExpectedCustomerStockResponse>;
    private require;
}
export {};
//# sourceMappingURL=customer-orders.service.d.ts.map