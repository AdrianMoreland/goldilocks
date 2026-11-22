import { type ItemTrace } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class ItemTraceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    trace(serial: string): Promise<ItemTrace>;
}
//# sourceMappingURL=item-trace.service.d.ts.map