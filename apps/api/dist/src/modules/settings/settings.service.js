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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const QUOTE_TEMPLATE_KEY = 'quote-template';
const NO_TEMPLATE = { opening: null, closingNote: null };
let SettingsService = class SettingsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async preferences(userId) {
        const row = await this.prisma.userPreference.findUnique({
            where: { userId },
            select: { data: true },
        });
        const parsed = shared_types_1.UserPreferencesSchema.safeParse(row?.data ?? {});
        return parsed.success ? parsed.data : shared_types_1.UserPreferencesSchema.parse({});
    }
    async savePreferences(userId, prefs) {
        await this.prisma.userPreference.upsert({
            where: { userId },
            create: { userId, data: prefs },
            update: { data: prefs },
        });
        return prefs;
    }
    async quoteTemplate() {
        const row = await this.prisma.companySetting.findUnique({
            where: { key: QUOTE_TEMPLATE_KEY },
            select: { value: true },
        });
        const parsed = shared_types_1.CompanyQuoteTemplateSchema.safeParse(row?.value);
        return parsed.success ? parsed.data : NO_TEMPLATE;
    }
    async saveQuoteTemplate(template, actor) {
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
            await this.audit.record(actor, 'settings', 'quote template changed', tx);
        });
        return template;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map