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
var RoadmapWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapWebhookController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const github_signature_1 = require("./github-signature");
const roadmap_inbox_service_1 = require("./roadmap-inbox.service");
const roadmap_pull_service_1 = require("./roadmap-pull.service");
let RoadmapWebhookController = RoadmapWebhookController_1 = class RoadmapWebhookController {
    pulls;
    inbox;
    config;
    logger = new common_1.Logger(RoadmapWebhookController_1.name);
    constructor(pulls, inbox, config) {
        this.pulls = pulls;
        this.inbox = inbox;
        this.config = config;
    }
    handle(req, signature, event) {
        const secret = this.config.get('GITHUB_WEBHOOK_SECRET');
        if (!(0, github_signature_1.isValidGithubSignature)(secret, req.rawBody, signature)) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        if (event === 'ping')
            return { ok: true };
        if (event === 'issues') {
            void this.inbox.autoRefresh();
            return { accepted: true };
        }
        const body = req.body;
        if (event !== 'push' || body?.ref !== 'refs/heads/master') {
            return { ignored: true };
        }
        void this.pulls.autoPull('github-webhook').then((result) => {
            if (result?.applied) {
                this.logger.log(`Pulled master ${result.commit.slice(0, 7)} after a push (${result.mode})`);
            }
        });
        return { accepted: true };
    }
};
exports.RoadmapWebhookController = RoadmapWebhookController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(202),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-hub-signature-256')),
    __param(2, (0, common_1.Headers)('x-github-event')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], RoadmapWebhookController.prototype, "handle", null);
exports.RoadmapWebhookController = RoadmapWebhookController = RoadmapWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('roadmap'),
    (0, common_1.Controller)('roadmap/sync'),
    __metadata("design:paramtypes", [roadmap_pull_service_1.RoadmapPullService,
        roadmap_inbox_service_1.RoadmapInboxService,
        config_1.ConfigService])
], RoadmapWebhookController);
//# sourceMappingURL=roadmap-webhook.controller.js.map