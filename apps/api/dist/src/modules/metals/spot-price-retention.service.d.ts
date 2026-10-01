import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ErrorLogService } from '../error-log/error-log.service';
export declare class SpotPriceRetentionService implements OnModuleInit {
    private readonly prisma;
    private readonly errorLog;
    private readonly logger;
    private readonly retentionDays;
    constructor(prisma: PrismaService, errorLog: ErrorLogService, config: ConfigService);
    onModuleInit(): void;
    prune(): Promise<number>;
}
//# sourceMappingURL=spot-price-retention.service.d.ts.map