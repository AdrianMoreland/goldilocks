import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ErrorLogService } from '../../modules/error-log/error-log.service';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly errorLog;
    constructor(errorLog: ErrorLogService);
    catch(exception: unknown, host: ArgumentsHost): Promise<void>;
}
//# sourceMappingURL=all-exceptions.filter.d.ts.map