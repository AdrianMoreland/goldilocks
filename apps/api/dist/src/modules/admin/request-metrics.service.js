"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMetricsService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../redis/redis.service");
const HOURS_KEPT = 24;
const KEY_TTL_SECONDS = 30 * 24 * 60 * 60;
const ROUTE_FIELD_PREFIX = 'r|';
const UNCOUNTED_PREFIXES = ['/admin', '/health', '/docs'];
function hourStart(at) {
    const d = new Date(at);
    d.setUTCMinutes(0, 0, 0);
    return d;
}
function hourKey(hour) {
    return `metrics:hour:${hour.toISOString().slice(0, 13)}`;
}
let RequestMetricsService = class RequestMetricsService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    middleware() {
        return (req, res, next) => {
            const startedAt = process.hrtime.bigint();
            res.on('finish', () => {
                const path = req.originalUrl.split('?')[0];
                if (req.method === 'OPTIONS')
                    return;
                if (UNCOUNTED_PREFIXES.some((p) => path.startsWith(p)))
                    return;
                const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
                const route = req.route
                    ? `${req.baseUrl}${req.route.path}`
                    : 'unmatched';
                const label = `${req.method} ${route}`;
                const isServerError = res.statusCode >= 500;
                const isError = res.statusCode >= 400;
                void this.redis.hashIncrementMany(hourKey(hourStart(new Date())), {
                    n: 1,
                    ms,
                    s4: res.statusCode >= 400 && !isServerError ? 1 : 0,
                    s5: isServerError ? 1 : 0,
                    [`${ROUTE_FIELD_PREFIX}${label}|n`]: 1,
                    [`${ROUTE_FIELD_PREFIX}${label}|ms`]: ms,
                    [`${ROUTE_FIELD_PREFIX}${label}|e`]: isError ? 1 : 0,
                }, KEY_TTL_SECONDS);
            });
            next();
        };
    }
    recordLogin(succeeded) {
        void this.redis.hashIncrementMany(hourKey(hourStart(new Date())), { [succeeded ? 'logins' : 'loginsFailed']: 1 }, KEY_TTL_SECONDS);
    }
    async getLastDay() {
        const current = hourStart(new Date());
        const hours = Array.from({ length: HOURS_KEPT }, (_, i) => new Date(current.getTime() - (HOURS_KEPT - 1 - i) * 3_600_000));
        const buckets = await Promise.all(hours.map((h) => this.redis.hashGetAllNumbers(hourKey(h))));
        if (buckets.some((b) => b === null))
            return null;
        const routes = new Map();
        const stats = hours.map((hour, i) => {
            const b = buckets[i] ?? {};
            for (const [field, value] of Object.entries(b)) {
                if (!field.startsWith(ROUTE_FIELD_PREFIX))
                    continue;
                const [, label, metric] = field.split('|');
                const r = routes.get(label) ?? { count: 0, errors: 0, ms: 0 };
                if (metric === 'n')
                    r.count += value;
                else if (metric === 'e')
                    r.errors += value;
                else if (metric === 'ms')
                    r.ms += value;
                routes.set(label, r);
            }
            const requests = b.n ?? 0;
            return {
                hour: hour.toISOString(),
                requests,
                clientErrors: b.s4 ?? 0,
                serverErrors: b.s5 ?? 0,
                avgLatencyMs: requests > 0 ? Math.round((b.ms ?? 0) / requests) : 0,
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
};
exports.RequestMetricsService = RequestMetricsService;
exports.RequestMetricsService = RequestMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RequestMetricsService);
//# sourceMappingURL=request-metrics.service.js.map