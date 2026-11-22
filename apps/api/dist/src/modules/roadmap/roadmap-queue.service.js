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
exports.RoadmapQueueService = exports.queueLine = void 0;
exports.cleanQueueText = cleanQueueText;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const SOURCES = ['phone', 'web'];
const LIST_CAP = 100;
const PENDING_CAP = 200;
const dublinDate = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Dublin' }).format(d);
const queueLine = (at, source, text) => `- ${dublinDate(at)} (${source}): ${text}`;
exports.queueLine = queueLine;
function cleanQueueText(raw) {
    const text = raw
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, shared_types_1.ROADMAP_QUEUE_MAX_TEXT);
    if (!text)
        throw new common_1.BadRequestException('Note is empty');
    return text;
}
function toEntry(r) {
    return {
        id: r.id,
        text: r.title,
        source: r.source,
        status: r.status === 'filed' ? 'filed' : 'new',
        line: (0, exports.queueLine)(r.issueCreatedAt, r.source, r.title),
        createdAt: r.issueCreatedAt.toISOString(),
        filedAt: r.handledAt?.toISOString() ?? null,
    };
}
let RoadmapQueueService = class RoadmapQueueService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async append(entry) {
        const text = cleanQueueText(entry.text);
        const at = new Date();
        const row = await this.prisma.roadmapInbox.create({
            data: {
                title: text,
                url: '',
                source: entry.source,
                status: 'new',
                issueCreatedAt: at,
            },
        });
        return { id: row.id, line: (0, exports.queueLine)(at, entry.source, text) };
    }
    async list() {
        const rows = await this.prisma.roadmapInbox.findMany({
            where: { source: { in: SOURCES } },
            orderBy: { issueCreatedAt: 'desc' },
            take: LIST_CAP,
        });
        const entries = rows.map(toEntry);
        entries.sort((a, b) => Number(a.status !== 'new') - Number(b.status !== 'new') ||
            b.createdAt.localeCompare(a.createdAt));
        return { entries };
    }
    async pending() {
        const rows = await this.prisma.roadmapInbox.findMany({
            where: { source: { in: SOURCES }, status: 'new' },
            orderBy: { id: 'asc' },
            take: PENDING_CAP,
        });
        return { entries: rows.map(toEntry) };
    }
    async markFiled(ids, actor) {
        const res = await this.prisma.roadmapInbox.updateMany({
            where: { id: { in: ids }, source: { in: SOURCES }, status: 'new' },
            data: { status: 'filed', handledAt: new Date(), handledBy: actor },
        });
        return { filed: res.count };
    }
};
exports.RoadmapQueueService = RoadmapQueueService;
exports.RoadmapQueueService = RoadmapQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoadmapQueueService);
//# sourceMappingURL=roadmap-queue.service.js.map