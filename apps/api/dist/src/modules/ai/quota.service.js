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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotaService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../redis/redis.service");
const ai_settings_1 = require("./ai.settings");
const dublin_day_1 = require("./dublin-day");
const OPEN_SLOT_TTL_SECONDS = 90;
const MINUTE_TTL_SECONDS = 120;
const DAY_TTL_SECONDS = 2 * 24 * 60 * 60;
let QuotaService = class QuotaService {
    redis;
    settings;
    constructor(redis, settings) {
        this.redis = redis;
        this.settings = settings;
    }
    async acquire(userId, now = new Date()) {
        const openKey = `ai:open:${userId}`;
        const open = await this.redis.increment(openKey, OPEN_SLOT_TTL_SECONDS);
        if (open === null)
            throw this.limitsUnavailable();
        let released = false;
        const slot = {
            release: async () => {
                if (released)
                    return;
                released = true;
                await this.redis.decrement(openKey);
            },
        };
        try {
            if (open > 1) {
                throw this.tooMany('You already have a question in progress. Wait for its answer first.');
            }
            const minute = await this.redis.increment(`ai:min:${userId}:${Math.floor(now.getTime() / 60_000)}`, MINUTE_TTL_SECONDS);
            if (minute === null)
                throw this.limitsUnavailable();
            if (minute > this.settings.perMinuteLimit) {
                throw this.tooMany(`That's more than ${this.settings.perMinuteLimit} questions a minute. Wait a moment and try again.`);
            }
            const day = await this.redis.increment(`ai:day:${userId}:${(0, dublin_day_1.dublinDate)(now)}`, DAY_TTL_SECONDS);
            if (day === null)
                throw this.limitsUnavailable();
            if (day > this.settings.dailyQuotaPerUser) {
                throw this.tooMany(`You've used today's ${this.settings.dailyQuotaPerUser} questions. The allowance resets tomorrow.`);
            }
        }
        catch (error) {
            await slot.release();
            throw error;
        }
        return slot;
    }
    tooMany(message) {
        return new common_1.HttpException(message, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
    limitsUnavailable() {
        return new common_1.ServiceUnavailableException("The assistant is unavailable right now: its usage limits can't be checked. Try again shortly.");
    }
};
exports.QuotaService = QuotaService;
exports.QuotaService = QuotaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        ai_settings_1.AiSettings])
], QuotaService);
//# sourceMappingURL=quota.service.js.map