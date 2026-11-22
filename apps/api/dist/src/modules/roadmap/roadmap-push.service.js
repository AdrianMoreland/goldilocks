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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapPushService = exports.PUSH_BRANCH = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const github_port_1 = require("../../infrastructure/github/github.port");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const roadmap_file_1 = require("./roadmap-file");
const roadmap_service_1 = require("./roadmap.service");
const FILE_PATH = 'docs/ROADMAP.md';
const BASE_BRANCH = 'master';
exports.PUSH_BRANCH = 'roadmap-sync/app';
const PR_TITLE = '[roadmap-sync] app edits';
const COMMIT_MESSAGE = 'roadmap-sync: app edits';
const STATE_ID = 1;
const PREVIEW_LINES = 40;
const MIN_LENGTH_RATIO = 0.9;
let RoadmapPushService = class RoadmapPushService {
    prisma;
    audit;
    roadmap;
    github;
    busy = false;
    constructor(prisma, audit, roadmap, github) {
        this.prisma = prisma;
        this.audit = audit;
        this.roadmap = roadmap;
        this.github = github;
    }
    async push(actor, options = {}) {
        if (options.dryRun)
            return this.run(actor, true);
        if (this.busy) {
            throw new common_1.ConflictException('A push is already running. Try again in a moment.');
        }
        this.busy = true;
        try {
            return await this.run(actor, false);
        }
        finally {
            this.busy = false;
        }
    }
    async run(actor, dryRun) {
        if (!this.github.isConfigured()) {
            throw new common_1.BadRequestException('Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.');
        }
        const [app, state, file] = await Promise.all([
            this.roadmap.get(),
            this.prisma.roadmapSyncState.findUnique({
                where: { id: STATE_ID },
            }),
            this.readMaster(),
        ]);
        if (!state || app.version === 0) {
            throw new common_1.BadRequestException('Do the first pull from GitHub before sending edits.');
        }
        const merged = (0, shared_types_1.mergeRoadmap)(state.baseMarkdown, file.content, app.markdown);
        const edits = merged.log.filter((e) => e.kind === 'to-file');
        if (!merged.fileChanged) {
            return {
                mode: 'nothing',
                applied: false,
                commit: file.commit,
                edits: [],
                diffPreview: [],
                prNumber: null,
                prUrl: null,
            };
        }
        if ((0, roadmap_file_1.normalizeRoadmap)(merged.forFile).length <
            (0, roadmap_file_1.normalizeRoadmap)(file.content).length * MIN_LENGTH_RATIO) {
            throw new common_1.BadRequestException('This would delete more than 10% of the roadmap on master, so nothing was sent.');
        }
        const diff = (0, roadmap_file_1.diffRoadmap)(file.content, merged.forFile);
        const preview = {
            mode: 'push',
            applied: false,
            commit: file.commit,
            edits,
            diffPreview: diff.lines.slice(0, PREVIEW_LINES),
            prNumber: null,
            prUrl: null,
        };
        if (dryRun)
            return preview;
        const body = this.prBody(actor, edits.length, diff.lines);
        try {
            const open = (await this.github.listOpenPullRequests()).find((p) => p.branch === exports.PUSH_BRANCH);
            await this.github.writeFileOnBranch({
                branch: exports.PUSH_BRANCH,
                baseCommit: file.commit,
                path: FILE_PATH,
                content: merged.forFile,
                message: COMMIT_MESSAGE,
            });
            let pr = open;
            if (open) {
                await this.github.updatePullRequest(open.number, body);
            }
            else {
                pr = await this.github.openPullRequest({
                    title: PR_TITLE,
                    body,
                    head: exports.PUSH_BRANCH,
                    base: BASE_BRANCH,
                });
            }
            const { number, url } = pr;
            await this.audit.record(actor, 'roadmap', `push: ${open ? 'updated' : 'opened'} PR #${number}, ${edits.length} edit(s)`);
            return { ...preview, applied: true, prNumber: number, prUrl: url };
        }
        catch (e) {
            throw new common_1.BadGatewayException(e instanceof Error ? e.message : 'GitHub could not be written');
        }
    }
    async readMaster() {
        try {
            return await this.github.readFile(FILE_PATH, BASE_BRANCH);
        }
        catch (e) {
            throw new common_1.BadGatewayException(e instanceof Error ? e.message : 'GitHub could not be read');
        }
    }
    prBody(actor, edits, diffLines) {
        const changed = diffLines.filter((l) => /^[+-] /.test(l));
        const shown = changed.slice(0, PREVIEW_LINES);
        return [
            'Roadmap: none',
            '',
            `Sent from the app's Project page by ${actor}.`,
            `${edits} edit(s) from the app, ${changed.length} changed line(s).`,
            '',
            '```diff',
            ...shown,
            ...(changed.length > shown.length
                ? [`… and ${changed.length - shown.length} more`]
                : []),
            '```',
        ].join('\n');
    }
};
exports.RoadmapPushService = RoadmapPushService;
exports.RoadmapPushService = RoadmapPushService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(github_port_1.GITHUB)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        roadmap_service_1.RoadmapService, Object])
], RoadmapPushService);
//# sourceMappingURL=roadmap-push.service.js.map