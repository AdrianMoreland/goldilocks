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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let BranchesService = class BranchesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async getAll() {
        const rows = await this.prisma.branch.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            address: row.address,
            region: row.region,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        }));
    }
    async create(dto, actorEmail) {
        const row = await this.prisma.$transaction(async (tx) => {
            const created = await tx.branch.create({
                data: {
                    name: dto.name,
                    address: dto.address,
                    region: dto.region,
                    currency: dto.currency,
                },
            });
            await this.audit.record(actorEmail, 'branch-create', `${created.name} (${created.region}, ${created.currency})`, tx);
            return created;
        });
        return {
            id: row.id,
            name: row.name,
            address: row.address,
            region: row.region,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        };
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], BranchesService);
//# sourceMappingURL=branches.service.js.map