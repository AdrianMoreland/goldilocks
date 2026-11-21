import { Injectable, Logger, Optional } from '@nestjs/common';
import {
    UserPreferencesSchema,
    isMuted,
    type AppNotification,
    type NotificationKind,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';

export interface NewNotification {
    kind: NotificationKind;
    title: string;
    body: string;
    link: string | null;
}

const LIST_SIZE = 30;
const FEED_ALERT_GAP_MS = 60 * 60_000;
const dublinHour = (d: Date) =>
    Number(
        new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            hour12: false,
            timeZone: 'Europe/Dublin',
        }).format(d),
    );

/**
 * In-app notifications (the header bell). For now only admins receive them. Raising one never throws: a
 * notification that cannot be written must not undo the order step, import or change that raised it.
 */
@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Optional() private readonly redis?: RedisService,
    ) {}

    async notifyAdmins(n: NewNotification): Promise<void> {
        try {
            const admins = await this.prisma.user.findMany({
                where: { admin: true, isActive: true },
                select: { id: true, preference: { select: { data: true } } },
            });
            const to = admins.filter((a) => {
                const prefs = UserPreferencesSchema.safeParse(
                    a.preference?.data ?? {},
                );
                return !(
                    prefs.success && isMuted(prefs.data.notifications, n.kind)
                );
            });
            if (to.length === 0) return;
            await this.prisma.notification.createMany({
                data: to.map((a) => ({ userId: a.id, ...n })),
            });
        } catch (error) {
            this.logger.warn(
                `Could not raise a ${n.kind} notification: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * A failed price-feed fetch. The feed has a known nightly gap between 00:00 and 02:00 Dublin time, which
     * is not news; otherwise at most one alert an hour.
     */
    async feedFailed(at: Date, reason: string | null): Promise<void> {
        if (dublinHour(at) < 2) return;
        if (!(await this.claimFeedAlert(at))) return;
        await this.notifyAdmins({
            kind: 'feed_down',
            title: 'Price feed is failing',
            body: `The last spot price fetch failed${reason ? `: ${reason}` : ''}. Prices on screen may be stale.`,
            link: '/admin',
        });
    }

    /**
     * True when this failure may raise the hour's alert. Claimed atomically in Redis, so two failures at the
     * same moment raise one alert; without Redis, it looks for a recent alert in the database instead.
     */
    private async claimFeedAlert(at: Date): Promise<boolean> {
        const count = await this.redis?.increment(
            'notify:feed_down',
            FEED_ALERT_GAP_MS / 1000,
        );
        if (typeof count === 'number') return count === 1;
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
        } catch {
            return false;
        }
    }

    async list(
        userId: string,
    ): Promise<{ items: AppNotification[]; unread: number }> {
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
                kind: r.kind as NotificationKind,
                title: r.title,
                body: r.body,
                link: r.link,
                createdAt: r.createdAt.toISOString(),
                readAt: r.readAt?.toISOString() ?? null,
            })),
            unread,
        };
    }

    /** Marks the given notifications read, or all of them when no ids are given. Only the caller's own. */
    async markRead(userId: string, ids?: number[]): Promise<void> {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                readAt: null,
                ...(ids ? { id: { in: ids } } : {}),
            },
            data: { readAt: new Date() },
        });
    }
}
