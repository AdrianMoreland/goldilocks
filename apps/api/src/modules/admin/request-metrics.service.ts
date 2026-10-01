import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { HourlyStats, RouteStats } from '@goldilocks/shared-types';
import { RedisService } from '../../redis/redis.service';

const HOURS_KEPT = 24;
const KEY_TTL_SECONDS = 30 * 24 * 60 * 60;
const ROUTE_FIELD_PREFIX = 'r|';

// Admin-console polling and uptime pings would otherwise dominate every chart.
const UNCOUNTED_PREFIXES = ['/admin', '/health', '/docs'];

function hourStart(at: Date): Date {
    const d = new Date(at);
    d.setUTCMinutes(0, 0, 0);
    return d;
}

function hourKey(hour: Date): string {
    return `metrics:hour:${hour.toISOString().slice(0, 13)}`;
}

/**
 * Hourly traffic counters in Redis (one hash per UTC hour, kept 30 days):
 * requests, error classes, summed latency, per-route counts and logins.
 * Chosen over a Postgres table so history needs no migration; the cost is
 * that it disappears if Redis is wiped, which is acceptable for charts.
 */
@Injectable()
export class RequestMetricsService {
    constructor(private readonly redis: RedisService) {}

    /** Express middleware — counts each finished request. Never delays or fails the request. */
    middleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            const startedAt = process.hrtime.bigint();
            res.on('finish', () => {
                const path = req.originalUrl.split('?')[0];
                // CORS preflights carry no information and would double every browser call.
                if (req.method === 'OPTIONS') return;
                if (UNCOUNTED_PREFIXES.some((p) => path.startsWith(p))) return;

                const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
                const route = req.route
                    ? `${req.baseUrl}${(req.route as { path: string }).path}`
                    : 'unmatched';
                const label = `${req.method} ${route}`;
                const isServerError = res.statusCode >= 500;
                const isError = res.statusCode >= 400;

                void this.redis.hashIncrementMany(
                    hourKey(hourStart(new Date())),
                    {
                        n: 1,
                        ms,
                        s4: res.statusCode >= 400 && !isServerError ? 1 : 0,
                        s5: isServerError ? 1 : 0,
                        [`${ROUTE_FIELD_PREFIX}${label}|n`]: 1,
                        [`${ROUTE_FIELD_PREFIX}${label}|ms`]: ms,
                        [`${ROUTE_FIELD_PREFIX}${label}|e`]: isError ? 1 : 0,
                    },
                    KEY_TTL_SECONDS,
                );
            });
            next();
        };
    }

    recordLogin(succeeded: boolean): void {
        void this.redis.hashIncrementMany(
            hourKey(hourStart(new Date())),
            { [succeeded ? 'logins' : 'loginsFailed']: 1 },
            KEY_TTL_SECONDS,
        );
    }

    /** The last 24 hours, oldest first, plus the busiest routes over the same window. null when Redis is unavailable. */
    async getLastDay(): Promise<{
        hours: HourlyStats[];
        topRoutes: RouteStats[];
    } | null> {
        const current = hourStart(new Date());
        const hours: Date[] = Array.from(
            { length: HOURS_KEPT },
            (_, i) =>
                new Date(current.getTime() - (HOURS_KEPT - 1 - i) * 3_600_000),
        );
        const buckets = await Promise.all(
            hours.map((h) => this.redis.hashGetAllNumbers(hourKey(h))),
        );
        if (buckets.some((b) => b === null)) return null;

        const routes = new Map<
            string,
            { count: number; errors: number; ms: number }
        >();
        const stats = hours.map((hour, i): HourlyStats => {
            const b = buckets[i] ?? {};
            for (const [field, value] of Object.entries(b)) {
                if (!field.startsWith(ROUTE_FIELD_PREFIX)) continue;
                const [, label, metric] = field.split('|');
                const r = routes.get(label) ?? { count: 0, errors: 0, ms: 0 };
                if (metric === 'n') r.count += value;
                else if (metric === 'e') r.errors += value;
                else if (metric === 'ms') r.ms += value;
                routes.set(label, r);
            }
            const requests = b.n ?? 0;
            return {
                hour: hour.toISOString(),
                requests,
                clientErrors: b.s4 ?? 0,
                serverErrors: b.s5 ?? 0,
                avgLatencyMs:
                    requests > 0 ? Math.round((b.ms ?? 0) / requests) : 0,
                logins: b.logins ?? 0,
                failedLogins: b.loginsFailed ?? 0,
            };
        });

        const topRoutes = [...routes.entries()]
            .map(([route, r]) => ({
                route,
                count: r.count,
                errors: r.errors,
                avgLatencyMs: r.count > 0 ? Math.round(r.ms / r.count) : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        return { hours: stats, topRoutes };
    }
}
