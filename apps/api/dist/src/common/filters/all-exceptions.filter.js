"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const prismaNamespace_1 = require("../../../prisma/generated/internal/prismaNamespace");
const error_log_service_1 = require("../../modules/error-log/error-log.service");
const CONNECTIVITY_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);
function truncate(value, max = 2000) {
    return value.length > max ? `${value.slice(0, max)}…` : value;
}
let AllExceptionsFilter = class AllExceptionsFilter {
    errorLog;
    constructor(errorLog) {
        this.errorLog = errorLog;
    }
    async catch(exception, host) {
        if (host.getType() !== 'http') {
            await this.errorLog.record({ kind: 'crash', message: 'Unhandled error outside an HTTP request', error: exception });
            return;
        }
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const context = {
            method: request.method,
            path: request.originalUrl ?? request.url,
            user: request.user?.email ?? null,
            userAgent: request.headers['user-agent'] ?? null,
        };
        const send = (status, body) => {
            if (!response.headersSent)
                response.status(status).json({ statusCode: status, ...body });
        };
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();
            if (status < 500) {
                send(status, typeof body === 'string' ? { message: body } : body);
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
        if (exception instanceof prismaNamespace_1.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                const target = Array.isArray(exception.meta?.target) ? exception.meta.target.join(', ') : 'field';
                send(common_1.HttpStatus.CONFLICT, { message: `A record with this ${target} already exists.` });
                return;
            }
            if (exception.code === 'P2025') {
                send(common_1.HttpStatus.NOT_FOUND, { message: 'Record not found.' });
                return;
            }
            const unavailable = CONNECTIVITY_CODES.has(exception.code);
            const status = unavailable ? common_1.HttpStatus.SERVICE_UNAVAILABLE : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
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
        if (exception instanceof prismaNamespace_1.PrismaClientInitializationError ||
            exception instanceof prismaNamespace_1.PrismaClientUnknownRequestError ||
            exception instanceof prismaNamespace_1.PrismaClientRustPanicError ||
            exception instanceof prismaNamespace_1.PrismaClientValidationError) {
            const unavailable = exception instanceof prismaNamespace_1.PrismaClientInitializationError;
            const status = unavailable ? common_1.HttpStatus.SERVICE_UNAVAILABLE : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
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
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception instanceof Error ? exception.message : 'Unexpected server error',
            detail: exception instanceof Error ? exception.name : truncate(String(exception)),
            error: exception,
        });
        send(common_1.HttpStatus.INTERNAL_SERVER_ERROR, { message: 'Something went wrong on the server.', reference });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [error_log_service_1.ErrorLogService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map