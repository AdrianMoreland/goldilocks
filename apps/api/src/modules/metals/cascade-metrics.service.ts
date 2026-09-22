import { Injectable } from '@nestjs/common';

/**
 * In-memory cache hit/miss counters for the launch read cascade
 * (MetalsProvider.getAllLatestForLaunch — the one that runs on every
 * dashboard page load). Deliberately not persisted: this is a live gauge
 * ("how warm is the cache right now"), not a historical record, and it's
 * fine for it to reset on every deploy/restart — unlike FetchAttemptService,
 * which tracks the external API calls that actually matter to keep.
 */
@Injectable()
export class CascadeMetricsService {
    private cacheHits = 0;
    private cacheMisses = 0;

    recordCacheHit(): void {
        this.cacheHits += 1;
    }

    recordCacheMiss(): void {
        this.cacheMisses += 1;
    }

    /** 1 (fully warm) when nothing has been recorded yet, so an idle app doesn't show a misleading 0%. */
    getCacheHitRatio(): number {
        const total = this.cacheHits + this.cacheMisses;
        return total === 0 ? 1 : this.cacheHits / total;
    }
}
