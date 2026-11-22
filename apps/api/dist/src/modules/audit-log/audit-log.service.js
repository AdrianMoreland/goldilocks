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
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let AuditLogService = AuditLogService_1 = class AuditLogService {
    prisma;
    logger = new common_1.Logger(AuditLogService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async record(actor, action, detail, tx) {
        await (tx ?? this.prisma).auditLog.create({
            data: { actor, action, detail },
        });
        this.logger.log(`[audit] ${actor} ${action}: ${detail}`);
    }
    async getRecent(limit) {
        const rows = await this.prisma.auditLog.findMany({
            orderBy: [{ at: 'desc' }, { id: 'desc' }],
            take: limit,
        });
        return {
            entries: rows.map((row) => ({
                at: row.at.toISOString(),
                user: row.actor,
                action: row.action,
                detail: row.detail,
            })),
            persisted: true,
        };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = AuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map