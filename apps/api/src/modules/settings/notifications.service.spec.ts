import { NotificationsService } from './notifications.service';

function setup(
    opts: {
        admins?: { id: string; prefs: unknown }[];
        recentFeedDown?: boolean;
    } = {},
) {
    const admins = opts.admins ?? [
        { id: 'a1', prefs: null },
        { id: 'a2', prefs: { notifications: { muted: ['order_step'] } } },
    ];
    const prisma = {
        user: {
            findMany: jest.fn().mockResolvedValue(
                admins.map((a) => ({
                    id: a.id,
                    preference: a.prefs === null ? null : { data: a.prefs },
                })),
            ),
        },
        notification: {
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
            findFirst: jest
                .fn()
                .mockResolvedValue(opts.recentFeedDown ? { id: 1 } : null),
            findMany: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(0),
            updateMany: jest.fn().mockResolvedValue({ count: 2 }),
        },
    };
    return { service: new NotificationsService(prisma as never), prisma };
}

function withRedis(count: number) {
    const base = setup();
    const redis = { increment: jest.fn().mockResolvedValue(count) };
    return {
        ...base,
        redis,
        service: new NotificationsService(base.prisma as never, redis as never),
    };
}

describe('NotificationsService.notifyAdmins', () => {
    it('writes one notification per active admin who has not muted the kind', async () => {
        const { service, prisma } = setup();
        await service.notifyAdmins({
            kind: 'order_step',
            title: 'GD-1 arrived',
            body: 'Ready to allocate',
            link: '/orders',
        });
        expect(prisma.user.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { admin: true, isActive: true } }),
        );
        expect(prisma.notification.createMany).toHaveBeenCalledWith({
            data: [
                {
                    userId: 'a1',
                    kind: 'order_step',
                    title: 'GD-1 arrived',
                    body: 'Ready to allocate',
                    link: '/orders',
                },
            ],
        });
    });

    it('never throws: a notification must not break the action that raised it', async () => {
        const { service, prisma } = setup();
        prisma.user.findMany.mockRejectedValue(new Error('db down'));
        await expect(
            service.notifyAdmins({
                kind: 'feed_down',
                title: 't',
                body: 'b',
                link: null,
            }),
        ).resolves.toBeUndefined();
    });
});

describe('NotificationsService.feedFailed', () => {
    it('stays quiet during the known overnight gap (00:00 to 02:00 Dublin)', async () => {
        const { service, prisma } = setup();
        await service.feedFailed(new Date('2026-11-21T01:15:00Z'), 'timeout');
        expect(prisma.notification.createMany).not.toHaveBeenCalled();
    });

    it('raises at most one feed alert an hour', async () => {
        const { service, prisma } = setup({ recentFeedDown: true });
        await service.feedFailed(new Date('2026-11-21T14:00:00Z'), 'timeout');
        expect(prisma.notification.createMany).not.toHaveBeenCalled();
    });

    it('raises one in working hours when none was raised recently', async () => {
        const { service, prisma } = setup();
        await service.feedFailed(new Date('2026-11-21T14:00:00Z'), 'timeout');
        expect(prisma.notification.createMany).toHaveBeenCalledTimes(1);
    });
});

describe('NotificationsService.feedFailed with Redis', () => {
    it('raises the alert only for the first failure of the hour', async () => {
        const first = withRedis(1);
        await first.service.feedFailed(
            new Date('2026-11-21T14:00:00Z'),
            'timeout',
        );
        expect(first.prisma.notification.createMany).toHaveBeenCalledTimes(1);
        expect(first.prisma.notification.findFirst).not.toHaveBeenCalled();

        const second = withRedis(2);
        await second.service.feedFailed(
            new Date('2026-11-21T14:00:00Z'),
            'timeout',
        );
        expect(second.prisma.notification.createMany).not.toHaveBeenCalled();
    });
});

describe('NotificationsService.markRead', () => {
    it('only touches the caller’s own notifications', async () => {
        const { service, prisma } = setup();
        await service.markRead('u1', [4, 5]);
        expect(prisma.notification.updateMany).toHaveBeenCalledWith({
            where: { userId: 'u1', readAt: null, id: { in: [4, 5] } },
            data: { readAt: expect.any(Date) },
        });
    });
});
