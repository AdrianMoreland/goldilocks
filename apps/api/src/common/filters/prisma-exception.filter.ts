import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '../../../prisma/generated/internal/prismaNamespace';

/**
 * Translates Prisma's known-request error codes into the same HTTP
 * exceptions the rest of the app already throws by hand, so a raw DB
 * constraint violation (e.g. a duplicate SKU on admin product create)
 * surfaces as a clean 409/404 instead of an unhandled 500. See CLAUDE.md's
 * "Custom Exception Filters" guidance.
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002': {
                const target = Array.isArray(exception.meta?.target) ? exception.meta.target.join(', ') : 'field';
                response.status(409).json({
                    statusCode: 409,
                    message: `A record with this ${target} already exists.`,
                });
                return;
            }
            case 'P2025':
                response.status(404).json({
                    statusCode: 404,
                    message: 'Record not found.',
                });
                return;
            default:
                // Anything else stays a 500 — this filter only knows how to
                // translate the handful of codes above into a clean status.
                response.status(500).json({
                    statusCode: 500,
                    message: 'Unexpected database error.',
                });
        }
    }
}
