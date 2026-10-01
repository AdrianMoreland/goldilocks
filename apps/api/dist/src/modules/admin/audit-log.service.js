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
var AuditLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../redis/redis.service");
const REDIS_KEY = 'admin:audit';
const MAX_ENTRIES = 500;
let AuditLogService = AuditLogService_1 = class AuditLogService {
    redis;
    logger = new common_1.Logger(AuditLogService_1.name);
    memory = [];
    constructor(redis) {
        this.redis = redis;
    }
    async record(user, action, detail) {
        const entry = {
            at: new Date().toISOString(),
            user,
            action,
            detail,
        };
        this.memory.unshift(entry);
        if (this.memory.length > MAX_ENTRIES)
            this.memory.length = MAX_ENTRIES;
        this.logger.log(`[audit] ${user} ${action}: ${detail}`);
        await this.redis.pushCapped(REDIS_KEY, entry, MAX_ENTRIES);
    }
    async getRecent(limit) {
        const fromRedis = await this.redis.listRange(REDIS_KEY, limit);
        if (fromRedis)
            return { entries: fromRedis, persisted: true };
        return { entries: this.memory.slice(0, limit), persisted: false };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = AuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map