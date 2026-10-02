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
exports.MarketModeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../admin/audit-log.service");
const ROW_ID = 1;
const STANDARD = {
    weekend: false,
    volatile: false,
    shortage: false,
    updatedBy: null,
    updatedAt: null,
};
function label(state) {
    const on = ['weekend', 'volatile', 'shortage'].filter((mode) => state[mode]);
    return on.length === 0 ? 'standard' : on.join(' + ');
}
let MarketModeService = class MarketModeService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async get() {
        const row = await this.prisma.marketModeState.findUnique({
            where: { id: ROW_ID },
        });
        if (!row)
            return STANDARD;
        return {
            weekend: row.weekend,
            volatile: row.volatile,
            shortage: row.shortage,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt.toISOString(),
        };
    }
    async set(next, actor) {
        const before = await this.get();
        const name = `${actor.firstName} ${actor.lastName}`.trim() || actor.email;
        const data = {
            weekend: next.weekend,
            volatile: next.volatile,
            shortage: next.shortage,
            updatedBy: name,
        };
        const row = await this.prisma.marketModeState.upsert({
            where: { id: ROW_ID },
            create: { id: ROW_ID, ...data },
            update: data,
        });
        await this.audit.record(actor.email, 'market-mode', `${label(before)} → ${label(next)}`);
        return {
            weekend: row.weekend,
            volatile: row.volatile,
            shortage: row.shortage,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt.toISOString(),
        };
    }
};
exports.MarketModeService = MarketModeService;
exports.MarketModeService = MarketModeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], MarketModeService);
//# sourceMappingURL=market-mode.service.js.map