import { NotificationsService } from '../settings/notifications.service';
import { type OrderDetail, type OrderListQuery, type OrderListResponse, type OrderStep, type RecordStepRequest, type SheetTask } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
declare const tradeInclude: {
    events: {
        orderBy: {
            id: "asc";
        };
    };
    tasks: {
        orderBy: {
            id: "asc";
        };
    };
};
type TradeWithSteps = Prisma.TradeGetPayload<{
    include: typeof tradeInclude;
}>;
export declare const toSheetTask: (t: TradeWithSteps["tasks"][number]) => SheetTask;
export declare class OrdersService {
    private readonly prisma;
    private readonly audit;
    private readonly notifications?;
    constructor(prisma: PrismaService, audit: AuditLogService, notifications?: NotificationsService | undefined);
    private facts;
    private toRow;
    list(query: OrderListQuery): Promise<OrderListResponse>;
    get(id: number): Promise<OrderDetail>;
    private toDetail;
    recordStep(id: number, step: OrderStep, body: RecordStepRequest, actor: string): Promise<OrderDetail>;
}
export {};
//# sourceMappingURL=orders.service.d.ts.map