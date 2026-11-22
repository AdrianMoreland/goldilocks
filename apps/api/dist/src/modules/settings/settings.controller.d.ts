import type { AppNotification, CompanyQuoteTemplate, SignedInSession, UserPreferences } from '@goldilocks/shared-types';
import { CompanyQuoteTemplateDto, MarkNotificationsReadDto, UserPreferencesDto } from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { SessionsService } from './sessions.service';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settings;
    private readonly sessions;
    private readonly notifications;
    constructor(settings: SettingsService, sessions: SessionsService, notifications: NotificationsService);
    preferences(req: RequestWithUser): Promise<UserPreferences>;
    savePreferences(req: RequestWithUser, body: UserPreferencesDto): Promise<UserPreferences>;
    quoteTemplate(): Promise<CompanyQuoteTemplate>;
    saveQuoteTemplate(req: RequestWithUser, body: CompanyQuoteTemplateDto): Promise<CompanyQuoteTemplate>;
    listSessions(req: RequestWithUser): Promise<SignedInSession[]>;
    signOut(req: RequestWithUser, id: string): Promise<void>;
    signOutOthers(req: RequestWithUser): Promise<void>;
    listNotifications(req: RequestWithUser): Promise<{
        items: AppNotification[];
        unread: number;
    }>;
    markRead(req: RequestWithUser, body: MarkNotificationsReadDto): Promise<void>;
}
//# sourceMappingURL=settings.controller.d.ts.map