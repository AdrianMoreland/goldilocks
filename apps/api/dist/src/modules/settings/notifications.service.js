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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../infrastructure/redis/redis.service");
const LIST_SIZE = 30;
const FEED_ALERT_GAP_MS = 60 * 60_000;
const dublinHour = (d) => Number(new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    timeZone: 'Europe/Dublin',
}).format(d));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    redis;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async notifyAdmins(n) {
        try {
            const admins = await this.prisma.user.findMany({
                where: { admin: true, isActive: true },
                select: { id: true, preference: { select: { data: true } } },
            });
            const to = admins.filter((a) => {
                const prefs = shared_types_1.UserPreferencesSchema.safeParse(a.preference?.data ?? {});
                return !(prefs.success && (0, shared_types_1.isMuted)(prefs.data.notifications, n.kind));
            });
            if (to.length === 0)
                return;
            await this.prisma.notification.createMany({
                data: to.map((a) => ({ userId: a.id, ...n })),
            });
        }
        catch (error) {
            this.logger.warn(`Could not raise a ${n.kind} notification: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async feedFailed(at, reason) {
        if (dublinHour(at) < 2)
            return;
        if (!(await this.claimFeedAlert(at)))
            return;
        await this.notifyAdmins({
            kind: 'feed_down',
            title: 'Price feed is failing',
            body: `The last spot price fetch failed${reason ? `: ${reason}` : ''}. Prices on screen may be stale.`,
            link: '/admin',
        });
    }
    async claimFeedAlert(at) {
        const count = await this.redis?.increment('notify:feed_down', FEED_ALERT_GAP_MS / 1000);
        if (typeof count === 'number')
            return count === 1;
        try {
            const recent = await this.prisma.notification.findFirst({
                where: {
                    kind: 'feed_down',
                    createdAt: {
                        gte: new Date(at.getTime() - FEED_ALERT_GAP_MS),
                    },
                },
                select: { id: true },
            });
            return !recent;
        }
        catch {
            return false;
        }
    }
    async list(userId) {
        const [rows, unread] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: LIST_SIZE,
            }),
            this.prisma.notification.count({ where: { userId, readAt: null } }),
        ]);
        return {
            items: rows.map((r) => ({
                id: r.id,
                kind: r.kind,
                title: r.title,
                body: r.body,
                link: r.link,
                createdAt: r.createdAt.toISOString(),
                readAt: r.readAt?.toISOString() ?? null,
            })),
            unread,
        };
    }
    async markRead(userId, ids) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                readAt: null,
                ...(ids ? { id: { in: ids } } : {}),
            },
            data: { readAt: new Date() },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map