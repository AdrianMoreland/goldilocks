import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { ClientErrorReportBatchDto } from '../../common/dto/dtos';
import { ErrorLogService } from './error-log.service';
export declare class ErrorLogController {
    private readonly errorLog;
    constructor(errorLog: ErrorLogService);
    getRecent(limit?: string): Promise<{
        entries: import("@goldilocks/shared-types").ErrorLogEntry[];
        persisted: boolean;
    }>;
    clear(): Promise<{
        message: string;
    }>;
    reportClient(body: ClientErrorReportBatchDto, request: RequestWithUser): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=error-log.controller.d.ts.map