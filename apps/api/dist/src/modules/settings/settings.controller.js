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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
const notifications_service_1 = require("./notifications.service");
const sessions_service_1 = require("./sessions.service");
const settings_service_1 = require("./settings.service");
let SettingsController = class SettingsController {
    settings;
    sessions;
    notifications;
    constructor(settings, sessions, notifications) {
        this.settings = settings;
        this.sessions = sessions;
        this.notifications = notifications;
    }
    preferences(req) {
        return this.settings.preferences(req.user.id);
    }
    savePreferences(req, body) {
        return this.settings.savePreferences(req.user.id, body);
    }
    quoteTemplate() {
        return this.settings.quoteTemplate();
    }
    saveQuoteTemplate(req, body) {
        return this.settings.saveQuoteTemplate(body, req.user.email);
    }
    listSessions(req) {
        return this.sessions.list(req.user.id, (0, sessions_service_1.sessionIdOf)(req.headers.authorization));
    }
    async signOut(req, id) {
        if (!(await this.sessions.signOut(req.user.id, id))) {
            throw new common_1.NotFoundException('Session not found');
        }
    }
    async signOutOthers(req) {
        const current = (0, sessions_service_1.sessionIdOf)(req.headers.authorization);
        if (!current) {
            throw new common_1.BadRequestException('This sign-in does not say which device it is; sign out the others one by one.');
        }
        await this.sessions.signOutOthers(req.user.id, current);
    }
    listNotifications(req) {
        return this.notifications.list(req.user.id);
    }
    async markRead(req, body) {
        await this.notifications.markRead(req.user.id, body.ids);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)('settings/me'),
    (0, swagger_1.ApiOperation)({
        summary: 'My settings (defaults for anything never saved)',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "preferences", null);
__decorate([
    (0, common_1.Put)('settings/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Save my settings' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.UserPreferencesDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "savePreferences", null);
__decorate([
    (0, common_1.Get)('settings/quote-template'),
    (0, swagger_1.ApiOperation)({ summary: 'The company wording around quoted prices' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "quoteTemplate", null);
__decorate([
    (0, common_1.Put)('settings/quote-template'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Change the company quote wording (admin)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CompanyQuoteTemplateDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "saveQuoteTemplate", null);
__decorate([
    (0, common_1.Get)('settings/sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'My signed-in devices' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listSessions", null);
__decorate([
    (0, common_1.Delete)('settings/sessions/:id'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Sign out one of my devices' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "signOut", null);
__decorate([
    (0, common_1.Post)('settings/sessions/sign-out-others'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Sign out everywhere except this device' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "signOutOthers", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'My latest notifications and the unread count' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "listNotifications", null);
__decorate([
    (0, common_1.Post)('notifications/read'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Mark my notifications read (all when no ids)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.MarkNotificationsReadDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "markRead", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        sessions_service_1.SessionsService,
        notifications_service_1.NotificationsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map