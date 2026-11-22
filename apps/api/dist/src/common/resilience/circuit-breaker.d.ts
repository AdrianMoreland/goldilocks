export type BreakerState = 'closed' | 'open' | 'half-open';
export declare class CircuitOpenError extends Error {
    readonly retryInMs: number;
    constructor(retryInMs: number, what: string);
}
export declare class TimeoutError extends Error {
    constructor(what: string, ms: number);
}
export declare function withTimeout<T>(work: Promise<T>, ms: number, what: string): Promise<T>;
export interface CircuitBreakerOptions {
    failureThreshold: number;
    cooldownMs: number;
    onStateChange?: (state: BreakerState) => void;
    now?: () => number;
}
export declare class CircuitBreaker {
    private readonly what;
    private readonly options;
    private failures;
    private openedAt;
    private trialInFlight;
    private lastReported;
    constructor(what: string, options: CircuitBreakerOptions);
    private now;
    get state(): BreakerState;
    run<T>(call: () => Promise<T>, isFailure?: (result: T) => boolean): Promise<T>;
    private settle;
    private recordSuccess;
    private recordFailure;
    private report;
}
//# sourceMappingURL=circuit-breaker.d.ts.map