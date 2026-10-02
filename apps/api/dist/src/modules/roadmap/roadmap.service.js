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
exports.RoadmapService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../admin/audit-log.service");
const roadmap_file_1 = require("./roadmap-file");
const ROW_ID = 1;
const EMPTY = {
    markdown: '',
    version: 0,
    updatedBy: null,
    updatedAt: null,
};
let RoadmapService = class RoadmapService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    toDocument(row) {
        return {
            markdown: row.markdown,
            version: row.version,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt.toISOString(),
        };
    }
    async get() {
        const row = await this.prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });
        if (row)
            return this.toDocument(row);
        const file = (0, roadmap_file_1.roadmapFilePath)();
        if (!file)
            return EMPTY;
        const created = await this.prisma.roadmapDocument.create({
            data: {
                id: ROW_ID,
                markdown: (0, roadmap_file_1.readRoadmapFile)(file),
                updatedBy: 'import',
            },
        });
        return this.toDocument(created);
    }
    async edit(request, actor) {
        const current = await this.get();
        if (current.version === 0) {
            throw new common_1.NotFoundException('The roadmap has not been imported yet. Run `pnpm --filter api roadmap:import`.');
        }
        if (request.version !== current.version) {
            throw new common_1.ConflictException('The roadmap changed since you loaded it. Reload and try again.');
        }
        const file = process.env.NODE_ENV === 'production' ? null : (0, roadmap_file_1.roadmapFilePath)();
        if (file &&
            (0, roadmap_file_1.normalizeRoadmap)((0, roadmap_file_1.readRoadmapFile)(file)) !==
                (0, roadmap_file_1.normalizeRoadmap)(current.markdown)) {
            throw new common_1.ConflictException('docs/ROADMAP.md differs from the database. Run `pnpm --filter api roadmap:import` (the file wins) or `roadmap:export` (the database wins), then retry.');
        }
        let markdown;
        try {
            markdown = (0, shared_types_1.applyRoadmapEdit)(current.markdown, request.edit);
        }
        catch (error) {
            if (error instanceof shared_types_1.RoadmapEditError)
                throw new common_1.BadRequestException(error.message);
            throw error;
        }
        const saved = await this.prisma.roadmapDocument.updateMany({
            where: { id: ROW_ID, version: current.version },
            data: {
                markdown,
                version: { increment: 1 },
                updatedBy: actor.email,
            },
        });
        if (saved.count === 0) {
            throw new common_1.ConflictException('The roadmap changed while saving. Reload and try again.');
        }
        if (file)
            (0, roadmap_file_1.writeRoadmapFile)(file, markdown);
        await this.audit.record(actor.email, 'roadmap', describeEdit(request.edit));
        return this.get();
    }
};
exports.RoadmapService = RoadmapService;
exports.RoadmapService = RoadmapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], RoadmapService);
function describeEdit(edit) {
    switch (edit.type) {
        case 'add':
            return `add: ${edit.text}`;
        case 'edit':
            return `edit: ${edit.text} → ${edit.newText}`;
        case 'toggle':
            return `${edit.checked ? 'check' : 'uncheck'}: ${edit.text}`;
        case 'delete':
            return `delete: ${edit.text}`;
    }
}
//# sourceMappingURL=roadmap.service.js.map