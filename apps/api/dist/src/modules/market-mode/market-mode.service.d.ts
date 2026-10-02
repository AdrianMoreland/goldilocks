import type { MarketModeState, UpdateMarketModeRequest } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
export declare class MarketModeService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    get(): Promise<MarketModeState>;
    set(next: UpdateMarketModeRequest, actor: {
        firstName: string;
        lastName: string;
        email: string;
    }): Promise<MarketModeState>;
}
//# sourceMappingURL=market-mode.service.d.ts.map