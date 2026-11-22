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
var RoadmapScopeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapScopeService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const github_port_1 = require("../../infrastructure/github/github.port");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const ROW_ID = 2;
const DEFAULT_BRANCH = 'main';
const HEADER = /^<!--roadmap-scope repo=(\S+) branch=(\S+) commit=(\S+)-->\n/;
let RoadmapScopeService = RoadmapScopeService_1 = class RoadmapScopeService {
    prisma;
    audit;
    github;
    logger = new common_1.Logger(RoadmapScopeService_1.name);
    constructor(prisma, audit, github) {
        this.prisma = prisma;
        this.audit = audit;
        this.github = github;
    }
    enabled() {
        return process.env.ROADMAP_SOURCE === 'scope';
    }
    target() {
        return {
            repo: process.env.GITHUB_ROADMAP_REPO?.trim() || null,
            branch: process.env.GITHUB_ROADMAP_BRANCH?.trim() || DEFAULT_BRANCH,
        };
    }
    configured() {
        return this.github.isConfigured() && !!this.target().repo;
    }
    async get() {
        const row = await this.prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });
        const { repo, branch } = this.target();
        const base = {
            enabled: this.enabled(),
            configured: this.configured(),
        };
        if (!row) {
            return {
                ...base,
                empty: true,
                repo,
                branch,
                commit: null,
                version: 0,
                syncedAt: null,
                syncedBy: null,
                view: shared_types_1.EMPTY_SCOPE_VIEW,
            };
        }
        const header = HEADER.exec(row.markdown);
        return {
            ...base,
            empty: false,
            repo: header?.[1] ?? repo,
            branch: header?.[2] ?? branch,
            commit: header?.[3] ?? null,
            version: row.version,
            syncedAt: row.updatedAt.toISOString(),
            syncedBy: row.updatedBy,
            view: (0, shared_types_1.parseScopeBundle)(row.markdown),
        };
    }
    async refresh(actor) {
        const { repo, branch } = this.target();
        if (!this.github.isConfigured()) {
            throw new common_1.BadRequestException('Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.');
        }
        if (!repo) {
            throw new common_1.BadRequestException('GITHUB_ROADMAP_REPO is not set on the API.');
        }
        const read = await Promise.all(shared_types_1.ROADMAP_SCOPE_FILES.map(async (f) => {
            try {
                const file = await this.github.readFile(f.path, branch, repo);
                return { ...f, file };
            }
            catch (e) {
                if (!f.required && notFound(e))
                    return { ...f, file: null };
                throw new common_1.BadGatewayException(`${f.path}: ${e instanceof Error ? e.message : 'GitHub could not be read'}`);
            }
        }));
        const found = read.filter((r) => r.file !== null);
        const commits = new Set(found.map((r) => r.file.commit));
        if (commits.size !== 1) {
            throw new common_1.BadGatewayException('The roadmap repository changed while it was being read. Try again.');
        }
        const commit = [...commits][0];
        const body = (0, shared_types_1.bundleScopeFiles)(found.map((r) => ({ path: r.path, content: r.file.content })));
        const view = (0, shared_types_1.parseScopeBundle)(body);
        if (view.items.length === 0) {
            throw new common_1.BadGatewayException('The scope files held no roadmap items; nothing was stored.');
        }
        const markdown = `<!--roadmap-scope repo=${repo} branch=${branch} commit=${commit}-->\n${body}`;
        const current = await this.prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });
        const summary = {
            commit,
            items: view.items.length,
            decisions: view.decisions.filter((d) => !d.settled).length,
        };
        if (current?.markdown === markdown) {
            return { changed: false, version: current.version, ...summary };
        }
        const version = await this.prisma.$transaction(async (tx) => {
            let next;
            if (!current) {
                await tx.roadmapDocument.create({
                    data: {
                        id: ROW_ID,
                        markdown,
                        version: 1,
                        updatedBy: actor,
                    },
                });
                next = 1;
            }
            else {
                const saved = await tx.roadmapDocument.updateMany({
                    where: { id: ROW_ID, version: current.version },
                    data: {
                        markdown,
                        version: { increment: 1 },
                        updatedBy: actor,
                    },
                });
                if (saved.count === 0) {
                    throw new common_1.ConflictException('The stored roadmap changed while saving. Try again.');
                }
                next = current.version + 1;
            }
            await this.audit.record(actor, 'roadmap', `scope pull: ${repo}@${commit.slice(0, 7)}, ${summary.items} item(s)`, tx);
            return next;
        });
        return { changed: true, version, ...summary };
    }
    async autoRefresh(actor) {
        if (!this.enabled() || !this.configured())
            return;
        try {
            await this.refresh(actor);
        }
        catch (e) {
            this.logger.warn(`Roadmap scope pull (${actor}) did not run: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
};
exports.RoadmapScopeService = RoadmapScopeService;
exports.RoadmapScopeService = RoadmapScopeService = RoadmapScopeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(github_port_1.GITHUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService, Object])
], RoadmapScopeService);
function notFound(e) {
    return (typeof e === 'object' &&
        e !== null &&
        e.status === 404);
}
//# sourceMappingURL=roadmap-scope.service.js.map