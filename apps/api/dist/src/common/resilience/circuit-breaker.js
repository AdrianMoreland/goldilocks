"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.TimeoutError = exports.CircuitOpenError = void 0;
exports.withTimeout = withTimeout;
class CircuitOpenError extends Error {
    retryInMs;
    constructor(retryInMs, what) {
        super(`${what} is paused after repeated failures; trying again in ${Math.ceil(retryInMs / 1000)}s.`);
        this.retryInMs = retryInMs;
        this.name = 'CircuitOpenError';
    }
}
exports.CircuitOpenError = CircuitOpenError;
class TimeoutError extends Error {
    constructor(what, ms) {
        super(`${what} did not answer within ${Math.round(ms / 1000)}s.`);
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
function withTimeout(work, ms, what) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new TimeoutError(what, ms)), ms);
        work.then((value) => {
            clearTimeout(timer);
            resolve(value);
        }, (error) => {
            clearTimeout(timer);
            reject(error instanceof Error ? error : new Error(String(error)));
        });
    });
}
class CircuitBreaker {
    what;
    options;
    failures = 0;
    openedAt = null;
    trialInFlight = false;
    lastReported = 'closed';
    constructor(what, options) {
        this.what = what;
        this.options = options;
    }
    now() {
        return (this.options.now ?? Date.now)();
    }
    get state() {
        if (this.openedAt === null)
            return 'closed';
        return this.now() - this.openedAt < this.options.cooldownMs
            ? 'open'
            : 'half-open';
    }
    async run(call, isFailure = () => false) {
        const before = this.state;
        let isTrial = false;
        if (before === 'open') {
            throw new CircuitOpenError(this.options.cooldownMs - (this.now() - (this.openedAt ?? 0)), this.what);
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
        }
        catch (error) {
            this.settle(true, before, isTrial);
            throw error;
        }
        finally {
            if (isTrial)
                this.trialInFlight = false;
        }
    }
    settle(failed, before, isTrial) {
        if (!isTrial && this.openedAt !== null)
            return;
        if (failed)
            this.recordFailure(before);
        else
            this.recordSuccess();
    }
    recordSuccess() {
        this.failures = 0;
        this.openedAt = null;
        this.report('closed');
    }
    recordFailure(stateBeforeCall) {
        this.failures += 1;
        if (stateBeforeCall === 'half-open' ||
            this.failures >= this.options.failureThreshold) {
            this.openedAt = this.now();
            this.report('open');
        }
    }
    report(state) {
        if (state === this.lastReported)
            return;
        this.lastReported = state;
        this.options.onStateChange?.(state);
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=circuit-breaker.js.map