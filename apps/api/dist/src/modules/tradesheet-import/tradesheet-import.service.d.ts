import { NotificationsService } from '../settings/notifications.service';
import type { TradesheetImportPlan, TradesheetImportRequest, TradesheetImportResult } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ProductNamesService } from '../review/product-names.service';
export declare class TradesheetImportService {
    private readonly prisma;
    private readonly audit;
    private readonly names;
    private readonly notifications?;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditLogService, names: ProductNamesService, notifications?: NotificationsService | undefined);
    preview(dto: TradesheetImportRequest): Promise<TradesheetImportPlan>;
    commit(dto: TradesheetImportRequest, actor: string): Promise<TradesheetImportResult>;
    private registerNames;
    private settleNames;
    private allocate;
    private build;
    private loadProducts;
    private existingTrades;
    private existingLots;
    private tradeData;
    private writeTrades;
    private lotData;
    private writeLots;
    private syncUnits;
}
//# sourceMappingURL=tradesheet-import.service.d.ts.map