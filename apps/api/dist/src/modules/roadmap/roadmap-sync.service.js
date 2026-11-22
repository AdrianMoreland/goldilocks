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
var RoadmapSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapSyncService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const github_port_1 = require("../../infrastructure/github/github.port");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const roadmap_file_1 = require("./roadmap-file");
const roadmap_service_1 = require("./roadmap.service");
const FILE_PATH = 'docs/ROADMAP.md';
const BRANCH = 'master';
const PREVIEW_LINES = 40;
let RoadmapSyncService = RoadmapSyncService_1 = class RoadmapSyncService {
    roadmap;
    prisma;
    github;
    logger = new common_1.Logger(RoadmapSyncService_1.name);
    constructor(roadmap, prisma, github) {
        this.roadmap = roadmap;
        this.prisma = prisma;
        this.github = github;
    }
    async status() {
        const app = await this.roadmap.get();
        const base = {
            state: 'unconfigured',
            repo: this.github.repo,
            branch: BRANCH,
            masterCommit: null,
            appVersion: app.version,
            appUpdatedAt: app.updatedAt,
            appOnlyLines: 0,
            masterOnlyLines: 0,
            preview: [],
            openSyncPr: null,
            tokenExpiresAt: null,
            error: null,
            appEditsToPush: null,
        };
        if (!this.github.isConfigured())
            return base;
        try {
            const [file, prs, state] = await Promise.all([
                this.github.readFile(FILE_PATH, BRANCH),
                this.github.listOpenPullRequests(),
                this.prisma.roadmapSyncState.findUnique({ where: { id: 1 } }),
            ]);
            const syncPr = prs.find((p) => p.title.startsWith('[roadmap-sync]') ||
                p.branch.startsWith('roadmap-sync/'));
            const same = (0, roadmap_file_1.normalizeRoadmap)(file.content) ===
                (0, roadmap_file_1.normalizeRoadmap)(app.markdown);
            const diff = same
                ? { added: 0, removed: 0, lines: [] }
                : (0, roadmap_file_1.diffRoadmap)(file.content, app.markdown);
            return {
                ...base,
                state: same ? 'in-sync' : 'differs',
                masterCommit: file.commit,
                appOnlyLines: diff.added,
                masterOnlyLines: diff.removed,
                preview: diff.lines.slice(0, PREVIEW_LINES),
                openSyncPr: syncPr
                    ? {
                        number: syncPr.number,
                        title: syncPr.title,
                        url: syncPr.url,
                    }
                    : null,
                tokenExpiresAt: this.github.tokenExpiresAt()?.toISOString() ?? null,
                appEditsToPush: state && app.version > 0
                    ? (0, shared_types_1.mergeRoadmap)(state.baseMarkdown, file.content, app.markdown).log.filter((e) => e.kind === 'to-file').length
                    : null,
            };
        }
        catch (e) {
            const message = e instanceof Error ? e.message : 'GitHub could not be read';
            this.logger.warn(`Roadmap sync status: ${message}`);
            return {
                ...base,
                state: 'unavailable',
                tokenExpiresAt: this.github.tokenExpiresAt()?.toISOString() ?? null,
                error: message,
            };
        }
    }
};
exports.RoadmapSyncService = RoadmapSyncService;
exports.RoadmapSyncService = RoadmapSyncService = RoadmapSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(github_port_1.GITHUB)),
    __metadata("design:paramtypes", [roadmap_service_1.RoadmapService,
        prisma_service_1.PrismaService, Object])
], RoadmapSyncService);
//# sourceMappingURL=roadmap-sync.service.js.map