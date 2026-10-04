import {
    CircuitOpenError,
    TimeoutError,
} from '../../common/resilience/circuit-breaker';
import type { MetalPriceApiClient } from './metal-price-api.client';
import { ResilientMetalPriceApi } from './resilient-metal-price-api';

const live = { success: true, base: 'EUR', timestamp: 1, rates: {} };

function build() {
    const client = {
        livePrices: jest.fn(),
        timeframePrices: jest.fn(),
        ohlcPrices: jest.fn(),
    };
    const api = new ResilientMetalPriceApi(
        client as unknown as MetalPriceApiClient,
    );
    return { api, client };
}

describe('ResilientMetalPriceApi', () => {
    afterEach(() => jest.useRealTimers());

    it('passes arguments and results straight through while the vendor is healthy', async () => {
        const { api, client } = build();
        client.livePrices.mockResolvedValue(live);
        client.timeframePrices.mockResolvedValue({ success: true });
        client.ohlcPrices.mockResolvedValue({ success: true });

        await expect(api.livePrices()).resolves.toBe(live);
        await api.timeframePrices('2026-01-01', '2026-02-01', 'GBP');
        await api.ohlcPrices('2026-01-01', 'EUR', 'XAU');

        expect(client.timeframePrices).toHaveBeenCalledWith(
            '2026-01-01',
            '2026-02-01',
            'GBP',
        );
        expect(client.ohlcPrices).toHaveBeenCalledWith(
            '2026-01-01',
            'EUR',
            'XAU',
        );
    });

    it('stops calling the vendor after three failures in a row, across all three calls', async () => {
        const { api, client } = build();
        client.livePrices.mockRejectedValue(new Error('ECONNRESET'));
        client.timeframePrices.mockRejectedValue(new Error('ECONNRESET'));
        client.ohlcPrices.mockRejectedValue(new Error('ECONNRESET'));

        await expect(api.livePrices()).rejects.toThrow('ECONNRESET');
        await expect(api.livePrices()).rejects.toThrow('ECONNRESET');
        await expect(api.timeframePrices('a', 'b')).rejects.toThrow(
            'ECONNRESET',
        );

        await expect(api.livePrices()).rejects.toBeInstanceOf(CircuitOpenError);
        await expect(api.ohlcPrices('a')).rejects.toBeInstanceOf(
            CircuitOpenError,
        );
        expect(client.livePrices).toHaveBeenCalledTimes(2);
        expect(client.ohlcPrices).not.toHaveBeenCalled();
    });

    it('counts a success=false body (quota exhausted) as a failure but still returns it', async () => {
        const { api, client } = build();
        const quota = { success: false, error: 'quota' };
        client.livePrices.mockResolvedValue(quota);

        for (let i = 0; i < 3; i++) {
            await expect(api.livePrices()).resolves.toBe(quota);
        }
        await expect(api.livePrices()).rejects.toBeInstanceOf(CircuitOpenError);
        expect(client.livePrices).toHaveBeenCalledTimes(3);
    });

    it('does not open the circuit on success=false from calls with caller-chosen parameters', async () => {
        const { api, client } = build();
        const refused = { success: false, error: 'bad date' };
        client.timeframePrices.mockResolvedValue(refused);
        client.ohlcPrices.mockResolvedValue(refused);

        for (let i = 0; i < 5; i++) {
            await expect(api.timeframePrices('x', 'y')).resolves.toBe(refused);
            await expect(api.ohlcPrices('x')).resolves.toBe(refused);
        }
        client.livePrices.mockResolvedValue({ success: true });
        await expect(api.livePrices()).resolves.toEqual({ success: true });
    });

    it('rejects a request that takes longer than ten seconds', async () => {
        jest.useFakeTimers();
        const { api, client } = build();
        client.livePrices.mockReturnValue(new Promise(() => undefined));

        const result = api.livePrices();
        const assertion = expect(result).rejects.toBeInstanceOf(TimeoutError);
        await jest.advanceTimersByTimeAsync(10_000);
        await assertion;
    });
});
