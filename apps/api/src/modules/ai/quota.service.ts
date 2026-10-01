import {
    HttpException,
    HttpStatus,
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { AiSettings } from './ai.settings';
import { dublinDate } from './dublin-day';

/** A safety net only: if a request dies without releasing its slot, the slot frees itself. */
const OPEN_SLOT_TTL_SECONDS = 90;
const MINUTE_TTL_SECONDS = 120;
const DAY_TTL_SECONDS = 2 * 24 * 60 * 60;

export interface QuotaSlot {
    /** Frees the user's "one question at a time" slot. Safe to call more than once. */
    release(): Promise<void>;
}

/**
 * Per-user limits for the assistant: one question at a time, a per-minute
 * rate and a daily allowance (docs/AI-AGENT-PLAN.md §8). Counters live in
 * Redis so they are shared by every API replica. If Redis is down the limits
 * cannot be checked, so the assistant refuses rather than run unmetered.
 */
@Injectable()
export class QuotaService {
    constructor(
        private readonly redis: RedisService,
        private readonly settings: AiSettings,
    ) {}

    async acquire(userId: string, now = new Date()): Promise<QuotaSlot> {
        const openKey = `ai:open:${userId}`;
        const open = await this.redis.increment(openKey, OPEN_SLOT_TTL_SECONDS);
        if (open === null) throw this.limitsUnavailable();

        let released = false;
        const slot: QuotaSlot = {
            release: async () => {
                if (released) return;
                released = true;
                await this.redis.decrement(openKey);
            },
        };

        try {
            if (open > 1) {
                throw this.tooMany(
                    'You already have a question in progress. Wait for its answer first.',
                );
            }

            const minute = await this.redis.increment(
                `ai:min:${userId}:${Math.floor(now.getTime() / 60_000)}`,
                MINUTE_TTL_SECONDS,
            );
            if (minute === null) throw this.limitsUnavailable();
            if (minute > this.settings.perMinuteLimit) {
                throw this.tooMany(
                    `That's more than ${this.settings.perMinuteLimit} questions a minute. Wait a moment and try again.`,
                );
            }

            const day = await this.redis.increment(
                `ai:day:${userId}:${dublinDate(now)}`,
                DAY_TTL_SECONDS,
            );
            if (day === null) throw this.limitsUnavailable();
            if (day > this.settings.dailyQuotaPerUser) {
                throw this.tooMany(
                    `You've used today's ${this.settings.dailyQuotaPerUser} questions. The allowance resets tomorrow.`,
                );
            }
        } catch (error) {
            await slot.release();
            throw error;
        }

        return slot;
    }

    private tooMany(message: string): HttpException {
        return new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
    }

    private limitsUnavailable(): ServiceUnavailableException {
        return new ServiceUnavailableException(
            "The assistant is unavailable right now: its usage limits can't be checked. Try again shortly.",
        );
    }
}
