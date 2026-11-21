import { Injectable } from '@nestjs/common';
import {
    CompanyQuoteTemplateSchema,
    UserPreferencesSchema,
    type CompanyQuoteTemplate,
    type UserPreferences,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

const QUOTE_TEMPLATE_KEY = 'quote-template';
const NO_TEMPLATE: CompanyQuoteTemplate = { opening: null, closingNote: null };

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    /** A person's Settings, with the defaults for anything never saved (or saved by an older shape). */
    async preferences(userId: string): Promise<UserPreferences> {
        const row = await this.prisma.userPreference.findUnique({
            where: { userId },
            select: { data: true },
        });
        const parsed = UserPreferencesSchema.safeParse(row?.data ?? {});
        return parsed.success ? parsed.data : UserPreferencesSchema.parse({});
    }

    async savePreferences(
        userId: string,
        prefs: UserPreferences,
    ): Promise<UserPreferences> {
        await this.prisma.userPreference.upsert({
            where: { userId },
            create: { userId, data: prefs },
            update: { data: prefs },
        });
        return prefs;
    }

    async quoteTemplate(): Promise<CompanyQuoteTemplate> {
        const row = await this.prisma.companySetting.findUnique({
            where: { key: QUOTE_TEMPLATE_KEY },
            select: { value: true },
        });
        const parsed = CompanyQuoteTemplateSchema.safeParse(row?.value);
        return parsed.success ? parsed.data : NO_TEMPLATE;
    }

    async saveQuoteTemplate(
        template: CompanyQuoteTemplate,
        actor: string,
    ): Promise<CompanyQuoteTemplate> {
        await this.prisma.$transaction(async (tx) => {
            await tx.companySetting.upsert({
                where: { key: QUOTE_TEMPLATE_KEY },
                create: {
                    key: QUOTE_TEMPLATE_KEY,
                    value: template,
                    updatedBy: actor,
                },
                update: { value: template, updatedBy: actor },
            });
            await this.audit.record(
                actor,
                'settings',
                'quote template changed',
                tx,
            );
        });
        return template;
    }
}
