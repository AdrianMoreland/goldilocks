export type BreakerState = 'closed' | 'open' | 'half-open';

export class CircuitOpenError extends Error {
    constructor(
        readonly retryInMs: number,
        what: string,
    ) {
        super(
            `${what} is paused after repeated failures; trying again in ${Math.ceil(retryInMs / 1000)}s.`,
        );
        this.name = 'CircuitOpenError';
    }
}

export class TimeoutError extends Error {
    constructor(what: string, ms: number) {
        super(`${what} did not answer within ${Math.round(ms / 1000)}s.`);
        this.name = 'TimeoutError';
    }
}

/**
 * Rejects if `work` has not settled after `ms`. The underlying request is not cancelled (the vendor SDK
 * offers no abort handle), so a late answer is simply ignored.
 */
export function withTimeout<T>(
    work: Promise<T>,
    ms: number,
    what: string,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new TimeoutError(what, ms)), ms);
        work.then(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error: unknown) => {
                clearTimeout(timer);
                reject(
                    error instanceof Error ? error : new Error(String(error)),
                );
            },
        );
    });
}

export interface CircuitBreakerOptions {
    /** Consecutive failures that open the circuit. */
    failureThreshold: number;
    /** How long calls are refused before one trial call is allowed. */
    cooldownMs: number;
    /** Called when the state changes; used for logging. */
    onStateChange?: (state: BreakerState) => void;
    /** Injectable clock for tests. */
    now?: () => number;
}

/**
 * Stops calling a failing dependency. After `failureThreshold` consecutive failures calls fail fast for
 * `cooldownMs`, then a single trial call decides whether to close again or wait another cooldown.
 */
export class CircuitBreaker {
    private failures = 0;
    private openedAt: number | null = null;
    private trialInFlight = false;
    private lastReported: BreakerState = 'closed';

    constructor(
        private readonly what: string,
        private readonly options: CircuitBreakerOptions,
    ) {}

    private now(): number {
        return (this.options.now ?? Date.now)();
    }

    get state(): BreakerState {
        if (this.openedAt === null) return 'closed';
        return this.now() - this.openedAt < this.options.cooldownMs
            ? 'open'
            : 'half-open';
    }

    /**
     * Runs `call`. A thrown error always counts as a failure; `isFailure` lets a resolved value count
     * too (the vendor reports quota exhaustion in a 200 response body).
     */
    async run<T>(
        call: () => Promise<T>,
        isFailure: (result: T) => boolean = () => false,
    ): Promise<T> {
        const before = this.state;
        // Only the trial call (or any call while closed) may change the state; see settle().
        let isTrial = false;
        if (before === 'open') {
            throw new CircuitOpenError(
                this.options.cooldownMs - (this.now() - (this.openedAt ?? 0)),
                this.what,
            );
        }
        if (before === 'half-open') {
            if (this.trialInFlight) {
                throw new CircuitOpenError(this.options.cooldownMs, this.what);
            }
            this.trialInFlight = true;
            isTrial = true;
            this.report('half-open');
        }

        try {
            const result = await call();
            this.settle(isFailure(result), before, isTrial);
            return result;
        } catch (error) {
            this.settle(true, before, isTrial);
            throw error;
        } finally {
            // Only the trial owns this flag: a call that began while closed and finishes later must
            // not clear it, or a second trial would be let through while the first is still running.
            if (isTrial) this.trialInFlight = false;
        }
    }

    /**
     * A call that started before the circuit opened can finish at any time. Its outcome describes the
     * dependency as it was then, so it is ignored unless the circuit is closed now; otherwise a late
     * success would close an open circuit, or a late failure would restart the cooldown. The trial
     * call is the one result that is always allowed to decide.
     */
    private settle(failed: boolean, before: BreakerState, isTrial: boolean) {
        if (!isTrial && this.openedAt !== null) return;
        if (failed) this.recordFailure(before);
        else this.recordSuccess();
    }

    private recordSuccess(): void {
        this.failures = 0;
        this.openedAt = null;
        this.report('closed');
    }

    private recordFailure(stateBeforeCall: BreakerState): void {
        this.failures += 1;
        if (
            stateBeforeCall === 'half-open' ||
            this.failures >= this.options.failureThreshold
        ) {
            this.openedAt = this.now();
            this.report('open');
        }
    }

    private report(state: BreakerState): void {
        if (state === this.lastReported) return;
        this.lastReported = state;
        this.options.onStateChange?.(state);
    }
}
