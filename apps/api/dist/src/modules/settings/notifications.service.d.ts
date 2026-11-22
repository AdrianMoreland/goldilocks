import { type AppNotification, type NotificationKind } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
export interface NewNotification {
    kind: NotificationKind;
    title: string;
    body: string;
    link: string | null;
}
export declare class NotificationsService {
    private readonly prisma;
    private readonly redis?;
    private readonly logger;
    constructor(prisma: PrismaService, redis?: RedisService | undefined);
    notifyAdmins(n: NewNotification): Promise<void>;
    feedFailed(at: Date, reason: string | null): Promise<void>;
    private claimFeedAlert;
    list(userId: string): Promise<{
        items: AppNotification[];
        unread: number;
    }>;
    markRead(userId: string, ids?: number[]): Promise<void>;
}
//# sourceMappingURL=notifications.service.d.ts.map