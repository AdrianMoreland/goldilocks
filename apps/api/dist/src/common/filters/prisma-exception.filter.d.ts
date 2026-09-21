import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '../../../prisma/generated/internal/prismaNamespace';
export declare class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void;
}
//# sourceMappingURL=prisma-exception.filter.d.ts.map