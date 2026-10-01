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
var ErrorLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const redis_service_1 = require("../../redis/redis.service");
const REDIS_KEY = 'error-log:entries';
const MAX_ENTRIES = 500;
const MAX_STACK = 4000;
let ErrorLogService = ErrorLogService_1 = class ErrorLogService {
    redis;
    logger = new common_1.Logger(ErrorLogService_1.name);
    memory = [];
    constructor(redis) {
        this.redis = redis;
    }
    async record(input) {
        const reference = input.reference ?? (0, shared_types_1.createErrorReference)();
        const error = input.error instanceof Error ? input.error : null;
        const entry = {
            id: (0, node_crypto_1.randomUUID)(),
            reference,
            at: new Date().toISOString(),
            source: 'server',
            severity: input.severity ?? 'error',
            kind: input.kind,
            message: input.message,
            detail: input.detail ??
                (error && error.message !== input.message
                    ? error.message
                    : null),
            statusCode: input.statusCode ?? null,
            method: input.method ?? null,
            path: input.path ?? null,
            code: input.code ?? null,
            stack: error?.stack?.slice(0, MAX_STACK) ?? null,
            user: input.user ?? null,
            userAgent: input.userAgent ?? null,
        };
        await this.store(entry);
        this.logger.error(`[${reference}] ${entry.kind}: ${entry.message}${entry.detail ? ` — ${entry.detail}` : ''}`);
        return reference;
    }
    async recordClientReports(reports, user, userAgent) {
        for (const report of reports) {
            await this.store({
                id: (0, node_crypto_1.randomUUID)(),
                reference: report.reference,
                at: report.occurredAt,
                source: 'client',
                severity: report.severity,
                kind: report.kind,
                message: report.message,
                detail: report.detail ?? null,
                statusCode: report.statusCode ?? null,
                method: report.method ?? null,
                path: report.path ?? null,
                code: null,
                stack: report.stack ?? null,
                user,
                userAgent,
            });
        }
    }
    async getRecent(limit) {
        const fromRedis = await this.redis.listRange(REDIS_KEY, limit);
        if (fromRedis)
            return { entries: fromRedis, persisted: true };
        return { entries: this.memory.slice(0, limit), persisted: false };
    }
    async clear() {
        this.memory.length = 0;
        await this.redis.del(REDIS_KEY);
    }
    async store(entry) {
        this.memory.unshift(entry);
        if (this.memory.length > MAX_ENTRIES)
            this.memory.length = MAX_ENTRIES;
        await this.redis.pushCapped(REDIS_KEY, entry, MAX_ENTRIES);
    }
};
exports.ErrorLogService = ErrorLogService;
exports.ErrorLogService = ErrorLogService = ErrorLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], ErrorLogService);
//# sourceMappingURL=error-log.service.js.map