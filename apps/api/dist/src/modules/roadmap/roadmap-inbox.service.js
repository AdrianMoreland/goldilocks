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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoadmapInboxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapInboxService = exports.INBOX_LABEL = void 0;
exports.kindOf = kindOf;
const common_1 = require("@nestjs/common");
const github_port_1 = require("../../infrastructure/github/github.port");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const roadmap_service_1 = require("./roadmap.service");
exports.INBOX_LABEL = 'roadmap';
const KINDS = ['idea', 'task', 'fix', 'bug'];
function kindOf(labels, body) {
    const label = labels.find((l) => KINDS.includes(l.toLowerCase()));
    if (label)
        return capitalise(label);
    const form = /###\s*Kind\s*\r?\n+\s*([^\r\n]+)/i.exec(body)?.[1]?.trim();
    if (form && KINDS.includes(form.toLowerCase()))
        return capitalise(form);
    return null;
}
function capitalise(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function toItem(r) {
    return {
        id: r.id,
        issueNumber: r.issueNumber ?? 0,
        title: r.title,
        body: r.body,
        kind: r.kind,
        url: r.url,
        status: r.status,
        issueCreatedAt: r.issueCreatedAt.toISOString(),
        handledAt: r.handledAt?.toISOString() ?? null,
        handledBy: r.handledBy,
    };
}
let RoadmapInboxService = RoadmapInboxService_1 = class RoadmapInboxService {
    prisma;
    audit;
    roadmap;
    github;
    logger = new common_1.Logger(RoadmapInboxService_1.name);
    refreshing = null;
    constructor(prisma, audit, roadmap, github) {
        this.prisma = prisma;
        this.audit = audit;
        this.roadmap = roadmap;
        this.github = github;
    }
    async list() {
        const rows = await this.prisma.roadmapInbox.findMany({
            where: { source: 'github' },
            orderBy: [{ issueCreatedAt: 'desc' }],
            take: 200,
        });
        const items = rows.map(toItem);
        items.sort((a, b) => Number(a.status !== 'new') - Number(b.status !== 'new') ||
            b.issueCreatedAt.localeCompare(a.issueCreatedAt));
        return { items, configured: this.github.isConfigured() };
    }
    refresh() {
        this.refreshing ??= this.doRefresh().finally(() => {
            this.refreshing = null;
        });
        return this.refreshing;
    }
    async autoRefresh() {
        if (!this.github.isConfigured())
            return null;
        try {
            return await this.refresh();
        }
        catch (e) {
            this.logger.warn(`Inbox refresh did not run: ${e instanceof Error ? e.message : String(e)}`);
            return null;
        }
    }
    async doRefresh() {
        if (!this.github.isConfigured()) {
            throw new common_1.BadRequestException('Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.');
        }
        let issues;
        try {
            issues = await this.github.listOpenIssues(exports.INBOX_LABEL);
        }
        catch (e) {
            throw new common_1.BadGatewayException(e instanceof Error ? e.message : 'GitHub could not be read');
        }
        const known = (await this.prisma.roadmapInbox.findMany({
            where: { source: 'github' },
            select: { issueNumber: true, status: true },
        })).flatMap((k) => k.issueNumber === null
            ? []
            : [{ issueNumber: k.issueNumber, status: k.status }]);
        const knownNumbers = new Set(known.map((k) => k.issueNumber));
        const fresh = issues.filter((i) => !knownNumbers.has(i.number));
        if (fresh.length > 0) {
            await this.prisma.roadmapInbox.createMany({
                data: fresh.map((i) => ({
                    issueNumber: i.number,
                    title: i.title.slice(0, 500),
                    body: i.body.slice(0, 10_000),
                    kind: kindOf(i.labels, i.body),
                    url: i.url,
                    issueCreatedAt: new Date(i.createdAt),
                })),
                skipDuplicates: true,
            });
        }
        let closedOnGithub = 0;
        if (issues.length < 100) {
            const open = new Set(issues.map((i) => i.number));
            const gone = known
                .filter((k) => k.status === 'new' && !open.has(k.issueNumber))
                .map((k) => k.issueNumber);
            if (gone.length > 0) {
                const res = await this.prisma.roadmapInbox.updateMany({
                    where: { issueNumber: { in: gone }, status: 'new' },
                    data: {
                        status: 'dismissed',
                        handledAt: new Date(),
                        handledBy: 'github',
                    },
                });
                closedOnGithub = res.count;
            }
        }
        return { added: fresh.length, closedOnGithub };
    }
    async promote(id, input, actor) {
        const item = await this.mustBeNew(id);
        await this.roadmap.edit({
            version: input.version,
            edit: {
                type: 'add',
                sectionLine: input.sectionLine,
                text: input.text,
            },
        }, { email: actor });
        return this.finish(item, 'promoted', actor, `promote #${item.issueNumber}: ${input.text}`, 'Added to the roadmap.', 'completed');
    }
    async dismiss(id, actor) {
        const item = await this.mustBeNew(id);
        return this.finish(item, 'dismissed', actor, `dismiss #${item.issueNumber}: ${item.title}`, 'Not added to the roadmap.', 'not_planned');
    }
    async mustBeNew(id) {
        const item = await this.prisma.roadmapInbox.findUnique({
            where: { id },
        });
        if (!item || item.source !== 'github' || item.issueNumber === null) {
            throw new common_1.NotFoundException('Inbox item not found');
        }
        if (item.status !== 'new') {
            throw new common_1.BadRequestException('That item was already handled');
        }
        return item;
    }
    async finish(item, status, actor, detail, comment, reason) {
        const saved = await this.prisma.$transaction(async (tx) => {
            const row = await tx.roadmapInbox.update({
                where: { id: item.id },
                data: { status, handledAt: new Date(), handledBy: actor },
            });
            await this.audit.record(actor, 'roadmap-inbox', detail, tx);
            return row;
        });
        if (this.github.isConfigured() && item.issueNumber !== null) {
            try {
                await this.github.closeIssue(item.issueNumber, comment, reason);
            }
            catch (e) {
                this.logger.warn(`Issue #${item.issueNumber} was not closed: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
        return toItem(saved);
    }
};
exports.RoadmapInboxService = RoadmapInboxService;
exports.RoadmapInboxService = RoadmapInboxService = RoadmapInboxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(github_port_1.GITHUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        roadmap_service_1.RoadmapService, Object])
], RoadmapInboxService);
//# sourceMappingURL=roadmap-inbox.service.js.map