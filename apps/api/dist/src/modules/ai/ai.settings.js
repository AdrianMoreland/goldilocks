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
exports.AiSettings = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const DEFAULT_MAX_OUTPUT_TOKENS = 600;
const DEFAULT_DAILY_QUOTA = 50;
const DEFAULT_PER_MINUTE_LIMIT = 5;
const DEFAULT_DAILY_BUDGET_USD = 2;
const DEFAULT_LOG_RETENTION_DAYS = 90;
const DEFAULT_CACHE_TTL_DAYS = 7;
let AiSettings = class AiSettings {
    config;
    constructor(config) {
        this.config = config;
    }
    get enabled() {
        return this.config.get('AI_ENABLED') === 'true';
    }
    get maxOutputTokens() {
        return this.positiveInt('AI_MAX_OUTPUT_TOKENS', DEFAULT_MAX_OUTPUT_TOKENS);
    }
    get dailyQuotaPerUser() {
        return this.positiveInt('AI_DAILY_QUOTA_PER_USER', DEFAULT_DAILY_QUOTA);
    }
    get perMinuteLimit() {
        return this.positiveInt('AI_PER_MINUTE_LIMIT', DEFAULT_PER_MINUTE_LIMIT);
    }
    get dailyBudgetUsd() {
        const value = Number(this.config.get('AI_DAILY_BUDGET_USD'));
        return Number.isFinite(value) && value > 0
            ? value
            : DEFAULT_DAILY_BUDGET_USD;
    }
    get logRetentionDays() {
        return this.positiveInt('AI_LOG_RETENTION_DAYS', DEFAULT_LOG_RETENTION_DAYS);
    }
    get cacheTtlDays() {
        return this.positiveInt('AI_CACHE_TTL_DAYS', DEFAULT_CACHE_TTL_DAYS);
    }
    get priceOverride() {
        const raw = this.config.get('AI_PRICE_PER_MILLION');
        if (!raw)
            return undefined;
        const [input, cachedInput, output] = raw.split(',').map(Number);
        return [input, cachedInput, output].every((n) => Number.isFinite(n) && n >= 0)
            ? { input, cachedInput, output }
            : undefined;
    }
    positiveInt(name, fallback) {
        const value = Number(this.config.get(name));
        return Number.isInteger(value) && value > 0 ? value : fallback;
    }
};
exports.AiSettings = AiSettings;
exports.AiSettings = AiSettings = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiSettings);
//# sourceMappingURL=ai.settings.js.map