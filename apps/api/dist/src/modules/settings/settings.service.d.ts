import { type CompanyQuoteTemplate, type UserPreferences } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class SettingsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    preferences(userId: string): Promise<UserPreferences>;
    savePreferences(userId: string, prefs: UserPreferences): Promise<UserPreferences>;
    quoteTemplate(): Promise<CompanyQuoteTemplate>;
    saveQuoteTemplate(template: CompanyQuoteTemplate, actor: string): Promise<CompanyQuoteTemplate>;
}
//# sourceMappingURL=settings.service.d.ts.map