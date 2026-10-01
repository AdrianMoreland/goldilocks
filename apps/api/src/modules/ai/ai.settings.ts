import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ModelPrice } from './cost.calculator';

const DEFAULT_MAX_OUTPUT_TOKENS = 600;
const DEFAULT_DAILY_QUOTA = 50;
const DEFAULT_PER_MINUTE_LIMIT = 5;
const DEFAULT_DAILY_BUDGET_USD = 2;
const DEFAULT_LOG_RETENTION_DAYS = 90;
const DEFAULT_CACHE_TTL_DAYS = 7;

/** The assistant's on/off switch and limits, read once from configuration (see docs/AI-AGENT-PLAN.md §10). */
@Injectable()
export class AiSettings {
    constructor(private readonly config: ConfigService) {}

    /** Off unless AI_ENABLED is exactly "true": a missing or mistyped value must never switch on spending. */
    get enabled(): boolean {
        return this.config.get<string>('AI_ENABLED') === 'true';
    }

    get maxOutputTokens(): number {
        return this.positiveInt(
            'AI_MAX_OUTPUT_TOKENS',
            DEFAULT_MAX_OUTPUT_TOKENS,
        );
    }

    get dailyQuotaPerUser(): number {
        return this.positiveInt('AI_DAILY_QUOTA_PER_USER', DEFAULT_DAILY_QUOTA);
    }

    get perMinuteLimit(): number {
        return this.positiveInt(
            'AI_PER_MINUTE_LIMIT',
            DEFAULT_PER_MINUTE_LIMIT,
        );
    }

    /** Whole-company spend ceiling per day, in USD; reaching it pauses the assistant (not the app) until tomorrow. */
    get dailyBudgetUsd(): number {
        const value = Number(this.config.get<string>('AI_DAILY_BUDGET_USD'));
        return Number.isFinite(value) && value > 0
            ? value
            : DEFAULT_DAILY_BUDGET_USD;
    }

    get logRetentionDays(): number {
        return this.positiveInt(
            'AI_LOG_RETENTION_DAYS',
            DEFAULT_LOG_RETENTION_DAYS,
        );
    }

    get cacheTtlDays(): number {
        return this.positiveInt('AI_CACHE_TTL_DAYS', DEFAULT_CACHE_TTL_DAYS);
    }

    /** Optional "input,cachedInput,output" USD per million tokens, for a model the built-in price table doesn't know. */
    get priceOverride(): ModelPrice | undefined {
        const raw = this.config.get<string>('AI_PRICE_PER_MILLION');
        if (!raw) return undefined;
        const [input, cachedInput, output] = raw.split(',').map(Number);
        return [input, cachedInput, output].every(
            (n) => Number.isFinite(n) && n >= 0,
        )
            ? { input, cachedInput, output }
            : undefined;
    }

    private positiveInt(name: string, fallback: number): number {
        const value = Number(this.config.get<string>(name));
        return Number.isInteger(value) && value > 0 ? value : fallback;
    }
}
