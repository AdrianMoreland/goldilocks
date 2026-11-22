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
var RoadmapCron_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapCron = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const roadmap_inbox_service_1 = require("./roadmap-inbox.service");
const roadmap_pull_service_1 = require("./roadmap-pull.service");
const roadmap_push_service_1 = require("./roadmap-push.service");
const roadmap_scope_service_1 = require("./roadmap-scope.service");
const ACTOR = 'roadmap-schedule';
let RoadmapCron = RoadmapCron_1 = class RoadmapCron {
    pulls;
    pushes;
    inbox;
    scope;
    logger = new common_1.Logger(RoadmapCron_1.name);
    constructor(pulls, pushes, inbox, scope) {
        this.pulls = pulls;
        this.pushes = pushes;
        this.inbox = inbox;
        this.scope = scope;
    }
    async daily() {
        await this.pulls.autoPull(ACTOR);
        await this.inbox.autoRefresh();
        await this.scope.autoRefresh(ACTOR);
        if (process.env.ROADMAP_DAILY_PUSH !== 'true')
            return;
        try {
            const r = await this.pushes.push(ACTOR);
            this.logger.log(r.mode === 'push'
                ? `Daily push: PR #${r.prNumber}`
                : 'Daily push: nothing to send');
        }
        catch (e) {
            this.logger.warn(`Daily push did not run: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
};
exports.RoadmapCron = RoadmapCron;
__decorate([
    (0, schedule_1.Cron)('15 6 * * *', { timeZone: 'Europe/Dublin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoadmapCron.prototype, "daily", null);
exports.RoadmapCron = RoadmapCron = RoadmapCron_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [roadmap_pull_service_1.RoadmapPullService,
        roadmap_push_service_1.RoadmapPushService,
        roadmap_inbox_service_1.RoadmapInboxService,
        roadmap_scope_service_1.RoadmapScopeService])
], RoadmapCron);
//# sourceMappingURL=roadmap.cron.js.map