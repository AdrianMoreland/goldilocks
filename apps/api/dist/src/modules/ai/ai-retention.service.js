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
var AiRetentionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRetentionService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const ai_settings_1 = require("./ai.settings");
const answer_cache_service_1 = require("./answer-cache.service");
const question_log_service_1 = require("./question-log.service");
const DAY_MS = 24 * 60 * 60 * 1000;
let AiRetentionService = AiRetentionService_1 = class AiRetentionService {
    settings;
    questionLog;
    cache;
    logger = new common_1.Logger(AiRetentionService_1.name);
    constructor(settings, questionLog, cache) {
        this.settings = settings;
        this.questionLog = questionLog;
        this.cache = cache;
    }
    async purge(now = new Date()) {
        try {
            const cutoff = new Date(now.getTime() - this.settings.logRetentionDays * DAY_MS);
            const [logs, cached] = await Promise.all([
                this.questionLog.purgeOlderThan(cutoff),
                this.cache.purgeExpired(now),
            ]);
            if (logs || cached) {
                this.logger.log(`Purged ${logs} question log row(s) older than ${this.settings.logRetentionDays} days and ${cached} expired cached answer(s).`);
            }
        }
        catch (error) {
            this.logger.warn(`Purge failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.AiRetentionService = AiRetentionService;
__decorate([
    (0, schedule_1.Cron)('30 4 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiRetentionService.prototype, "purge", null);
exports.AiRetentionService = AiRetentionService = AiRetentionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_settings_1.AiSettings,
        question_log_service_1.QuestionLogService,
        answer_cache_service_1.AnswerCacheService])
], AiRetentionService);
//# sourceMappingURL=ai-retention.service.js.map