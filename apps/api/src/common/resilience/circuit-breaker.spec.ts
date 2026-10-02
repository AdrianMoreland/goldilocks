import {
    CircuitBreaker,
    CircuitOpenError,
    TimeoutError,
    withTimeout,
} from './circuit-breaker';

function build() {
    let clock = 0;
    const changes: string[] = [];
    const breaker = new CircuitBreaker('The vendor', {
        failureThreshold: 3,
        cooldownMs: 60_000,
        now: () => clock,
        onStateChange: (state) => changes.push(state),
    });
    return {
        breaker,
        changes,
        advance: (ms: number) => {
            clock += ms;
        },
    };
}

const fail = () => Promise.reject(new Error('vendor down'));
const succeed = () => Promise.resolve({ success: true });

describe('CircuitBreaker', () => {
    it('stays closed and passes results through while calls succeed', async () => {
        const { breaker } = build();
        await expect(breaker.run(succeed)).resolves.toEqual({ success: true });
        expect(breaker.state).toBe('closed');
    });

    it('opens after the threshold of consecutive failures and then fails fast without calling', async () => {
        const { breaker, changes } = build();
        for (let i = 0; i < 3; i++) {
            await expect(breaker.run(fail)).rejects.toThrow('vendor down');
        }
        expect(breaker.state).toBe('open');
        expect(changes).toEqual(['open']);

        const call = jest.fn(succeed);
        await expect(breaker.run(call)).rejects.toBeInstanceOf(
            CircuitOpenError,
        );
        expect(call).not.toHaveBeenCalled();
    });

    it('does not open on failures that are interrupted by a success', async () => {
        const { breaker } = build();
        await expect(breaker.run(fail)).rejects.toThrow();
        await expect(breaker.run(fail)).rejects.toThrow();
        await breaker.run(succeed);
        await expect(breaker.run(fail)).rejects.toThrow();
        await expect(breaker.run(fail)).rejects.toThrow();
        expect(breaker.state).toBe('closed');
    });

    it('counts a resolved value as a failure when isFailure says so (quota exhausted)', async () => {
        const { breaker } = build();
        const quota = () => Promise.resolve({ success: false });
        for (let i = 0; i < 3; i++) {
            await breaker.run(quota, (r) => !r.success);
        }
        expect(breaker.state).toBe('open');
    });

    it('allows one trial call after the cooldown and closes again when it succeeds', async () => {
        const { breaker, advance, changes } = build();
        for (let i = 0; i < 3; i++)
            await expect(breaker.run(fail)).rejects.toThrow();

        advance(60_000);
        expect(breaker.state).toBe('half-open');
        await expect(breaker.run(succeed)).resolves.toEqual({ success: true });
        expect(breaker.state).toBe('closed');
        expect(changes).toEqual(['open', 'half-open', 'closed']);
    });

    it('reopens for another full cooldown when the trial call fails', async () => {
        const { breaker, advance } = build();
        for (let i = 0; i < 3; i++)
            await expect(breaker.run(fail)).rejects.toThrow();

        advance(60_000);
        await expect(breaker.run(fail)).rejects.toThrow('vendor down');
        expect(breaker.state).toBe('open');

        advance(59_999);
        expect(breaker.state).toBe('open');
        advance(1);
        expect(breaker.state).toBe('half-open');
    });

    it('lets only one trial call through while it is in flight', async () => {
        const { breaker, advance } = build();
        for (let i = 0; i < 3; i++)
            await expect(breaker.run(fail)).rejects.toThrow();
        advance(60_000);

        let release: (value: { success: boolean }) => void = () => undefined;
        const slow = new Promise<{ success: boolean }>((resolve) => {
            release = resolve;
        });
        const trial = breaker.run(() => slow);
        await expect(breaker.run(succeed)).rejects.toBeInstanceOf(
            CircuitOpenError,
        );

        release({ success: true });
        await trial;
        expect(breaker.state).toBe('closed');
    });
});

describe('withTimeout', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('resolves with the value when the work finishes in time', async () => {
        await expect(
            withTimeout(Promise.resolve('ok'), 1000, 'Request'),
        ).resolves.toBe('ok');
    });

    it('rejects with a TimeoutError when the work is too slow', async () => {
        const never = new Promise<string>(() => undefined);
        const result = withTimeout(never, 10_000, 'The live prices request');
        const assertion = expect(result).rejects.toBeInstanceOf(TimeoutError);
        await jest.advanceTimersByTimeAsync(10_000);
        await assertion;
    });

    it('passes the original error through when the work fails first', async () => {
        await expect(
            withTimeout(Promise.reject(new Error('boom')), 1000, 'Request'),
        ).rejects.toThrow('boom');
    });
});
