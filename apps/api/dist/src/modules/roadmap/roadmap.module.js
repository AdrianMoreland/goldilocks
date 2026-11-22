"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const audit_log_module_1 = require("../audit-log/audit-log.module");
const github_module_1 = require("../../infrastructure/github/github.module");
const roadmap_controller_1 = require("./roadmap.controller");
const roadmap_inbox_service_1 = require("./roadmap-inbox.service");
const roadmap_pull_service_1 = require("./roadmap-pull.service");
const roadmap_push_service_1 = require("./roadmap-push.service");
const roadmap_queue_service_1 = require("./roadmap-queue.service");
const roadmap_queue_token_controller_1 = require("./roadmap-queue-token.controller");
const roadmap_writer_1 = require("./roadmap-writer");
const roadmap_scope_service_1 = require("./roadmap-scope.service");
const roadmap_cron_1 = require("./roadmap.cron");
const roadmap_webhook_controller_1 = require("./roadmap-webhook.controller");
const roadmap_service_1 = require("./roadmap.service");
const roadmap_sync_service_1 = require("./roadmap-sync.service");
let RoadmapModule = class RoadmapModule {
};
exports.RoadmapModule = RoadmapModule;
exports.RoadmapModule = RoadmapModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            audit_log_module_1.AuditLogModule,
            github_module_1.GithubModule,
        ],
        controllers: [
            roadmap_controller_1.RoadmapController,
            roadmap_webhook_controller_1.RoadmapWebhookController,
            roadmap_queue_token_controller_1.RoadmapQueueTokenController,
        ],
        providers: [
            roadmap_service_1.RoadmapService,
            roadmap_sync_service_1.RoadmapSyncService,
            roadmap_pull_service_1.RoadmapPullService,
            roadmap_push_service_1.RoadmapPushService,
            roadmap_scope_service_1.RoadmapScopeService,
            roadmap_queue_service_1.RoadmapQueueService,
            { provide: roadmap_writer_1.ROADMAP_WRITER, useExisting: roadmap_queue_service_1.RoadmapQueueService },
            roadmap_inbox_service_1.RoadmapInboxService,
            roadmap_cron_1.RoadmapCron,
        ],
    })
], RoadmapModule);
//# sourceMappingURL=roadmap.module.js.map