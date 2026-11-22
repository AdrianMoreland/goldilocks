import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { ClientErrorReportBatchDto, ErrorLogQueryDto } from '../../common/dto/dtos';
import { ErrorLogService } from './error-log.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class ErrorLogController {
    private readonly errorLog;
    private readonly audit;
    constructor(errorLog: ErrorLogService, audit: AuditLogService);
    getRecent({ limit }: ErrorLogQueryDto): Promise<{
        entries: import("@goldilocks/shared-types").ErrorLogEntry[];
        persisted: boolean;
    }>;
    clear(request: RequestWithUser): Promise<{
        message: string;
    }>;
    reportClient(body: ClientErrorReportBatchDto, request: RequestWithUser): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=error-log.controller.d.ts.map