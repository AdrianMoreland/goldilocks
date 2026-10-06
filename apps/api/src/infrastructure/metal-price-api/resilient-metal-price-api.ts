import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    CircuitBreaker,
    withTimeout,
} from '../../common/resilience/circuit-breaker';
import { MetalPriceApiClient } from './metal-price-api.client';
import type {
    LiveResponse,
    OHLCResponse,
    TimeframeResponse,
} from './metal-price-api.client';
import type { MetalPriceApiPort } from './metal-price-api.port';

const REQUEST_TIMEOUT_MS = 10_000;
const FAILURE_THRESHOLD = 3;
// Short on purpose: it exists to stop bursts of cache-miss requests from each re-calling a dead vendor.
// The 10-minute cron outlasts it, so a recovered vendor is picked up on the next scheduled run.
const COOLDOWN_MS = 60_000;

/**
 * The vendor client plus a timeout and a circuit breaker. A slow vendor can no longer hold a request
 * open indefinitely, and a failing one stops being called (and billed) while it is down. Failures
 * surface as ordinary errors, so MetalsProvider's existing fallback to the last stored price serves
 * the last known good value; there are no automatic retries because each call spends paid quota.
 */
@Injectable()
export class ResilientMetalPriceApi implements MetalPriceApiPort {
    private readonly logger = new Logger(ResilientMetalPriceApi.name);
    private readonly breaker = new CircuitBreaker('The metal price API', {
        failureThreshold: FAILURE_THRESHOLD,
        cooldownMs: COOLDOWN_MS,
        onStateChange: (state) =>
            this.logger.warn(`Metal price API circuit is now ${state}`),
    });

    constructor(
        @Inject(MetalPriceApiClient)
        private readonly client: MetalPriceApiClient,
    ) {}

    livePrices(): Promise<LiveResponse> {
        return this.guard('live prices', () => this.client.livePrices());
    }

    timeframePrices(
        startDate: string,
        endDate: string,
        currency?: string,
    ): Promise<TimeframeResponse> {
        return this.guard(
            'timeframe prices',
            () => this.client.timeframePrices(startDate, endDate, currency),
            false,
        );
    }

    ohlcPrices(
        date: string,
        currency?: string,
        metal?: string,
    ): Promise<OHLCResponse> {
        return this.guard(
            'OHLC prices',
            () => this.client.ohlcPrices(date, currency, metal),
            false,
        );
    }

    /**
     * `softFailureCounts` is false for calls that carry caller-chosen parameters (dates, currency,
     * metal): there `success: false` usually means the caller asked for something the vendor
     * refuses, which says nothing about the vendor being down, so it must not open the circuit.
     * Thrown errors and timeouts still count. Quota exhaustion is caught by `livePrices`, which has
     * no parameters to get wrong.
     */
    private guard<T extends { success: boolean }>(
        what: string,
        call: () => Promise<T>,
        softFailureCounts = true,
    ): Promise<T> {
        return this.breaker.run(
            () =>
                withTimeout(call(), REQUEST_TIMEOUT_MS, `The ${what} request`),
            // The vendor reports quota exhaustion and bad requests as 200 with success=false.
            (result) => softFailureCounts && result.success === false,
        );
    }
}
