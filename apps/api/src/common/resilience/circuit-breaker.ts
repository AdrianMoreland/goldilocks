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
            this.report('half-open');
        }

        try {
            const result = await call();
            if (isFailure(result)) this.recordFailure(before);
            else this.recordSuccess();
            return result;
        } catch (error) {
            this.recordFailure(before);
            throw error;
        } finally {
            this.trialInFlight = false;
        }
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
