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
exports.RoadmapController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
const roadmap_service_1 = require("./roadmap.service");
const roadmap_inbox_service_1 = require("./roadmap-inbox.service");
const roadmap_pull_service_1 = require("./roadmap-pull.service");
const roadmap_push_service_1 = require("./roadmap-push.service");
const roadmap_queue_service_1 = require("./roadmap-queue.service");
const roadmap_writer_1 = require("./roadmap-writer");
const roadmap_scope_service_1 = require("./roadmap-scope.service");
const roadmap_sync_service_1 = require("./roadmap-sync.service");
let RoadmapController = class RoadmapController {
    service;
    sync;
    pulls;
    pushes;
    inbox;
    scope;
    queue;
    writer;
    constructor(service, sync, pulls, pushes, inbox, scope, queue, writer) {
        this.service = service;
        this.sync = sync;
        this.pulls = pulls;
        this.pushes = pushes;
        this.inbox = inbox;
        this.scope = scope;
        this.queue = queue;
        this.writer = writer;
    }
    queueList() {
        return this.queue.list();
    }
    queueAppend(body) {
        return this.writer.append({ text: body.text, source: 'web' });
    }
    scopeGet() {
        return this.scope.get();
    }
    scopeRefresh(req) {
        return this.scope.refresh(req.user.email);
    }
    get() {
        return this.service.get();
    }
    syncStatus() {
        return this.sync.status();
    }
    pull(body, req) {
        return this.pulls.pull(req.user.email, body);
    }
    push(body, req) {
        return this.pushes.push(req.user.email, body);
    }
    edit(body, req) {
        return this.service.edit(body, req.user);
    }
    inboxList() {
        return this.inbox.list();
    }
    inboxRefresh() {
        return this.inbox.refresh();
    }
    inboxPromote(id, body, req) {
        return this.inbox.promote(id, body, req.user.email);
    }
    inboxDismiss(id, req) {
        return this.inbox.dismiss(id, req.user.email);
    }
};
exports.RoadmapController = RoadmapController;
__decorate([
    (0, common_1.Get)('queue'),
    (0, swagger_1.ApiOperation)({
        summary: 'Notes queued from the app or the phone, waiting for a laptop session to file them (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RoadmapQueueListDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "queueList", null);
__decorate([
    (0, common_1.Post)('queue'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Queue a note. It becomes a dated line in the roadmap inbox at the next laptop session (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapQueueAppendedDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RoadmapQueueRequestDto]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "queueAppend", null);
__decorate([
    (0, common_1.Get)('scope'),
    (0, swagger_1.ApiOperation)({
        summary: 'The roadmap kept as scope files in the roadmap repository, as last pulled (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RoadmapScopeDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "scopeGet", null);
__decorate([
    (0, common_1.Post)('scope/refresh'),
    (0, throttler_1.Throttle)({ default: { limit: 6, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Pull the scope files from the roadmap repository and store them (admin, read only on GitHub)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapScopeRefreshDto }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "scopeRefresh", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'The roadmap Markdown and its version (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RoadmapDocumentDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('sync'),
    (0, swagger_1.ApiOperation)({
        summary: 'How the app roadmap compares with docs/ROADMAP.md on master (admin, read only)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RoadmapSyncStatusDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "syncStatus", null);
__decorate([
    (0, common_1.Post)('sync/pull'),
    (0, throttler_1.Throttle)({ default: { limit: 6, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: "Bring master's roadmap into the app (admin). dryRun previews; the first run needs confirmReplace",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapPullResultDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RoadmapPullRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "pull", null);
__decorate([
    (0, common_1.Post)('sync/push'),
    (0, throttler_1.Throttle)({ default: { limit: 6, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({
        summary: "Send the app's roadmap edits to GitHub as a pull request (admin). dryRun previews and writes nothing",
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapPushResultDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RoadmapPushRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "push", null);
__decorate([
    (0, common_1.Post)('edit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check, add, edit or delete one roadmap task (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapDocumentDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RoadmapEditRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "edit", null);
__decorate([
    (0, common_1.Get)('inbox'),
    (0, swagger_1.ApiOperation)({
        summary: 'Captured ideas (GitHub issues labelled roadmap) to triage (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RoadmapInboxDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "inboxList", null);
__decorate([
    (0, common_1.Post)('inbox/refresh'),
    (0, throttler_1.Throttle)({ default: { limit: 6, ttl: 60_000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch new roadmap issues from GitHub (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapInboxRefreshDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "inboxRefresh", null);
__decorate([
    (0, common_1.Post)('inbox/:id/promote'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add an inbox item to the roadmap as a task (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapInboxItemDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.RoadmapInboxPromoteDto, Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "inboxPromote", null);
__decorate([
    (0, common_1.Post)('inbox/:id/dismiss'),
    (0, swagger_1.ApiOperation)({ summary: 'Dismiss an inbox item (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapInboxItemDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "inboxDismiss", null);
exports.RoadmapController = RoadmapController = __decorate([
    (0, swagger_1.ApiTags)('roadmap'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('roadmap'),
    __param(7, (0, common_1.Inject)(roadmap_writer_1.ROADMAP_WRITER)),
    __metadata("design:paramtypes", [roadmap_service_1.RoadmapService,
        roadmap_sync_service_1.RoadmapSyncService,
        roadmap_pull_service_1.RoadmapPullService,
        roadmap_push_service_1.RoadmapPushService,
        roadmap_inbox_service_1.RoadmapInboxService,
        roadmap_scope_service_1.RoadmapScopeService,
        roadmap_queue_service_1.RoadmapQueueService, Object])
], RoadmapController);
//# sourceMappingURL=roadmap.controller.js.map