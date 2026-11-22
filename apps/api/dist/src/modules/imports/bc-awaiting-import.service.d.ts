import type { BcAwaitingRequest, BcAwaitingResult } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { WorkbookImportService } from './workbook-import.service';
export declare class BcAwaitingImportService {
    private readonly prisma;
    private readonly workbook;
    constructor(prisma: PrismaService, workbook: WorkbookImportService);
    preview(dto: BcAwaitingRequest): Promise<BcAwaitingResult>;
    commit(dto: BcAwaitingRequest, actor: string): Promise<BcAwaitingResult>;
    private run;
}
//# sourceMappingURL=bc-awaiting-import.service.d.ts.map