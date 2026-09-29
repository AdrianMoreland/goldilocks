import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '../../../prisma/generated/internal/prismaNamespace';
import type { RequestWithUser } from '../guards/jwt-auth.guard';
import { ErrorLogService, type RecordErrorInput } from '../../modules/error-log/error-log.service';

// Prisma codes that mean "can't reach / can't talk to the database" rather
// than "this query was wrong" — answered as 503 so the client can say so.
const CONNECTIVITY_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

function truncate(value: string, max = 2000): string {
    return value.length > max ? `${value.slice(0, max)}…` : value;
}

/**
 * The single app-wide exception filter. Replaces the old Prisma-only filter
 * (which answered "Unexpected database error." and recorded nothing):
 *  - 4xx HttpExceptions pass through unchanged — they're answers, not faults.
 *  - Prisma P2002/P2025 still become clean 409/404.
 *  - Everything else is recorded in the error log with method, path, user,
 *    Prisma code and stack, and the response carries a short `reference`
 *    that the web app shows in its toast, so staff can quote it and admins
 *    can find the exact entry in the Admin panel's Error log.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly errorLog: ErrorLogService) {}

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        if (host.getType() !== 'http') {
            await this.errorLog.record({ kind: 'crash', message: 'Unhandled error outside an HTTP request', error: exception });
            return;
        }

        const ctx = host.switchToHttp();
        const request = ctx.getRequest<RequestWithUser>();
        const response = ctx.getResponse<Response>();
        const context: Pick<RecordErrorInput, 'method' | 'path' | 'user' | 'userAgent'> = {
            method: request.method,
            path: request.originalUrl ?? request.url,
            user: request.user?.email ?? null,
            userAgent: request.headers['user-agent'] ?? null,
        };

        const send = (status: number, body: Record<string, unknown>) => {
            if (!response.headersSent) response.status(status).json({ statusCode: status, ...body });
        };

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();
            if (status < 500) {
                send(status, typeof body === 'string' ? { message: body } : (body as Record<string, unknown>));
                return;
            }
            const reference = await this.errorLog.record({
                ...context,
                kind: 'http',
                statusCode: status,
                message: exception.message,
                detail: typeof body === 'string' ? body : truncate(JSON.stringify(body)),
                error: exception,
            });
            send(status, { message: exception.message, reference });
            return;
        }

        if (exception instanceof PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                const target = Array.isArray(exception.meta?.target) ? exception.meta.target.join(', ') : 'field';
                send(HttpStatus.CONFLICT, { message: `A record with this ${target} already exists.` });
                return;
            }
            if (exception.code === 'P2025') {
                send(HttpStatus.NOT_FOUND, { message: 'Record not found.' });
                return;
            }
            const unavailable = CONNECTIVITY_CODES.has(exception.code);
            const status = unavailable ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.INTERNAL_SERVER_ERROR;
            const message = unavailable ? 'The database is unreachable right now.' : 'The database rejected the request.';
            const reference = await this.errorLog.record({
                ...context,
                kind: 'database',
                statusCode: status,
                code: exception.code,
                message,
                detail: truncate(`${exception.message}${exception.meta ? `\nmeta: ${JSON.stringify(exception.meta)}` : ''}`),
                error: exception,
            });
            send(status, { message, reference });
            return;
        }

        if (
            exception instanceof PrismaClientInitializationError ||
            exception instanceof PrismaClientUnknownRequestError ||
            exception instanceof PrismaClientRustPanicError ||
            exception instanceof PrismaClientValidationError
        ) {
            const unavailable = exception instanceof PrismaClientInitializationError;
            const status = unavailable ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.INTERNAL_SERVER_ERROR;
            const message = unavailable ? 'The database is unreachable right now.' : 'The database request failed.';
            const reference = await this.errorLog.record({
                ...context,
                kind: 'database',
                statusCode: status,
                code: 'errorCode' in exception ? (exception.errorCode ?? null) : null,
                message,
                detail: truncate(exception.message),
                error: exception,
            });
            send(status, { message, reference });
            return;
        }

        const reference = await this.errorLog.record({
            ...context,
            kind: 'crash',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception instanceof Error ? exception.message : 'Unexpected server error',
            detail: exception instanceof Error ? exception.name : truncate(String(exception)),
            error: exception,
        });
        send(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'Something went wrong on the server.', reference });
    }
}
