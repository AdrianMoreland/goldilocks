import { ConfigService } from '@nestjs/config';
import type { ModelPrice } from './cost.calculator';
export declare class AiSettings {
    private readonly config;
    constructor(config: ConfigService);
    get enabled(): boolean;
    get maxOutputTokens(): number;
    get dailyQuotaPerUser(): number;
    get perMinuteLimit(): number;
    get dailyBudgetUsd(): number;
    get logRetentionDays(): number;
    get cacheTtlDays(): number;
    get priceOverride(): ModelPrice | undefined;
    private positiveInt;
}
//# sourceMappingURL=ai.settings.d.ts.map