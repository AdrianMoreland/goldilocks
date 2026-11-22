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
var RoadmapPullService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapPullService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const github_port_1 = require("../../infrastructure/github/github.port");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const roadmap_file_1 = require("./roadmap-file");
const roadmap_service_1 = require("./roadmap.service");
const FILE_PATH = 'docs/ROADMAP.md';
const BRANCH = 'master';
const STATE_ID = 1;
const ROW_ID = 1;
const LIST_CAP = 50;
let RoadmapPullService = RoadmapPullService_1 = class RoadmapPullService {
    prisma;
    audit;
    roadmap;
    github;
    logger = new common_1.Logger(RoadmapPullService_1.name);
    constructor(prisma, audit, roadmap, github) {
        this.prisma = prisma;
        this.audit = audit;
        this.roadmap = roadmap;
        this.github = github;
    }
    onApplicationBootstrap() {
        if (process.env.NODE_ENV === 'test')
            return;
        void this.autoPull('startup');
    }
    pull(actor, options = {}) {
        return this.run(actor, options, true);
    }
    async autoPull(actor) {
        try {
            if (!this.github.isConfigured())
                return null;
            return await this.run(actor, {}, false);
        }
        catch (e) {
            this.logger.warn(`Roadmap pull (${actor}) did not run: ${e instanceof Error ? e.message : String(e)}`);
            return null;
        }
    }
    async run(actor, options, mayAdopt) {
        if (!this.github.isConfigured()) {
            throw new common_1.BadRequestException('Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.');
        }
        const [app, file, state] = await Promise.all([
            this.roadmap.get(),
            this.readMaster(),
            this.prisma.roadmapSyncState.findUnique({
                where: { id: STATE_ID },
            }),
        ]);
        if (!state) {
            if (!mayAdopt)
                throw new Error('first pull needs the button');
            return this.adopt(actor, options, app, file);
        }
        return this.merge(actor, options, app, file, state);
    }
    async readMaster() {
        try {
            return await this.github.readFile(FILE_PATH, BRANCH);
        }
        catch (e) {
            throw new common_1.BadGatewayException(e instanceof Error ? e.message : 'GitHub could not be read');
        }
    }
    async adopt(actor, options, app, file) {
        const same = (0, roadmap_file_1.normalizeRoadmap)(file.content) === (0, roadmap_file_1.normalizeRoadmap)(app.markdown);
        const found = same
            ? { appOnly: [], ticksOnlyInApp: [] }
            : (0, shared_types_1.findAppOnlyTasks)(app.markdown, file.content);
        const diff = same
            ? { added: 0, removed: 0 }
            : (0, roadmap_file_1.diffRoadmap)(file.content, app.markdown);
        const preview = {
            mode: 'adopt',
            applied: false,
            commit: file.commit,
            appChanged: !same,
            log: [],
            appOnlyTasks: found.appOnly.slice(0, LIST_CAP),
            appOnlyTaskCount: found.appOnly.length,
            ticksOnlyInApp: found.ticksOnlyInApp.slice(0, LIST_CAP),
            ticksOnlyInAppCount: found.ticksOnlyInApp.length,
            appOnlyLines: diff.added,
            masterOnlyLines: diff.removed,
            snapshotId: null,
            appVersion: app.version,
        };
        if (options.dryRun)
            return preview;
        if (!options.confirmReplace) {
            throw new common_1.BadRequestException("The first pull replaces the app's copy of the roadmap with master's. Confirm it (confirmReplace) after reading the preview.");
        }
        const short = file.commit.slice(0, 7);
        const { snapshotId, version } = await this.prisma.$transaction(async (tx) => {
            let snapshotId = null;
            let version = app.version;
            if (!same) {
                if (app.version > 0) {
                    const snapshot = await tx.roadmapSnapshot.create({
                        data: {
                            markdown: app.markdown,
                            version: app.version,
                            reason: `before the first pull of master ${short}`,
                            createdBy: actor,
                        },
                    });
                    snapshotId = snapshot.id;
                    const saved = await tx.roadmapDocument.updateMany({
                        where: { id: ROW_ID, version: app.version },
                        data: {
                            markdown: file.content,
                            version: { increment: 1 },
                            updatedBy: actor,
                        },
                    });
                    if (saved.count === 0)
                        throw this.raced();
                    version = app.version + 1;
                }
                else {
                    await tx.roadmapDocument.create({
                        data: {
                            id: ROW_ID,
                            markdown: file.content,
                            updatedBy: actor,
                        },
                    });
                    version = 1;
                }
            }
            await this.saveState(tx, file.commit, file.content, actor);
            await this.audit.record(actor, 'roadmap', same
                ? `pull (first run): the app already matched master ${short}`
                : `pull (first run): replaced the app's copy with master ${short}; snapshot ${snapshotId ?? 'none'}`, tx);
            return { snapshotId, version };
        });
        return {
            ...preview,
            applied: true,
            snapshotId,
            appVersion: version,
        };
    }
    async merge(actor, options, app, file, state) {
        const empty = {
            appOnlyTasks: [],
            appOnlyTaskCount: 0,
            ticksOnlyInApp: [],
            ticksOnlyInAppCount: 0,
            appOnlyLines: 0,
            masterOnlyLines: 0,
            snapshotId: null,
        };
        if (state.baseCommit === file.commit) {
            return {
                ...empty,
                mode: 'nothing',
                applied: false,
                commit: file.commit,
                appChanged: false,
                log: [],
                appVersion: app.version,
            };
        }
        if (app.version === 0) {
            throw new common_1.NotFoundException('The app has no roadmap to merge into. Run the first pull again.');
        }
        const merged = (0, shared_types_1.mergeRoadmap)(state.baseMarkdown, file.content, app.markdown);
        const preview = {
            ...empty,
            mode: 'merge',
            applied: false,
            commit: file.commit,
            appChanged: merged.appChanged,
            log: merged.log,
            appVersion: app.version,
        };
        if (options.dryRun)
            return preview;
        const short = file.commit.slice(0, 7);
        const newBase = (0, shared_types_1.absorbFile)(state.baseMarkdown, file.content);
        const { snapshotId, version } = await this.prisma.$transaction(async (tx) => {
            let snapshotId = null;
            let version = app.version;
            if (merged.appChanged) {
                const snapshot = await tx.roadmapSnapshot.create({
                    data: {
                        markdown: app.markdown,
                        version: app.version,
                        reason: `before merging master ${short}`,
                        createdBy: actor,
                    },
                });
                snapshotId = snapshot.id;
                const saved = await tx.roadmapDocument.updateMany({
                    where: { id: ROW_ID, version: app.version },
                    data: {
                        markdown: merged.forApp,
                        version: { increment: 1 },
                        updatedBy: actor,
                    },
                });
                if (saved.count === 0)
                    throw this.raced();
                version = app.version + 1;
            }
            await this.saveState(tx, file.commit, newBase, actor);
            await this.audit.record(actor, 'roadmap', merged.appChanged
                ? `pull: merged master ${short} into the app (${merged.log.length} change(s)); snapshot ${snapshotId}`
                : `pull: master ${short} needed no change in the app`, tx);
            return { snapshotId, version };
        });
        return { ...preview, applied: true, snapshotId, appVersion: version };
    }
    saveState(tx, commit, baseMarkdown, actor) {
        const data = {
            baseCommit: commit,
            baseMarkdown,
            syncedAt: new Date(),
            syncedBy: actor,
        };
        return tx.roadmapSyncState.upsert({
            where: { id: STATE_ID },
            create: { id: STATE_ID, ...data },
            update: data,
        });
    }
    raced() {
        return new common_1.ConflictException('The roadmap changed while pulling. Nothing was changed; try again.');
    }
};
exports.RoadmapPullService = RoadmapPullService;
exports.RoadmapPullService = RoadmapPullService = RoadmapPullService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(github_port_1.GITHUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        roadmap_service_1.RoadmapService, Object])
], RoadmapPullService);
//# sourceMappingURL=roadmap-pull.service.js.map