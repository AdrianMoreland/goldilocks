import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    AppNotification,
    CompanyQuoteTemplate,
    SignedInSession,
    UserPreferences,
} from '@goldilocks/shared-types';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    CompanyQuoteTemplateDto,
    MarkNotificationsReadDto,
    UserPreferencesDto,
} from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { SessionsService, sessionIdOf } from './sessions.service';
import { SettingsService } from './settings.service';

/** Settings: every route reads or writes only the signed-in person's own records, except the admin-only template. */
@ApiTags('settings')
@ApiBearerAuth()
@Controller()
export class SettingsController {
    constructor(
        private readonly settings: SettingsService,
        private readonly sessions: SessionsService,
        private readonly notifications: NotificationsService,
    ) {}

    @Get('settings/me')
    @ApiOperation({
        summary: 'My settings (defaults for anything never saved)',
    })
    preferences(@Req() req: RequestWithUser): Promise<UserPreferences> {
        return this.settings.preferences(req.user.id);
    }

    @Put('settings/me')
    @ApiOperation({ summary: 'Save my settings' })
    savePreferences(
        @Req() req: RequestWithUser,
        @Body() body: UserPreferencesDto,
    ): Promise<UserPreferences> {
        return this.settings.savePreferences(req.user.id, body);
    }

    @Get('settings/quote-template')
    @ApiOperation({ summary: 'The company wording around quoted prices' })
    quoteTemplate(): Promise<CompanyQuoteTemplate> {
        return this.settings.quoteTemplate();
    }

    @Put('settings/quote-template')
    @Roles('admin')
    @ApiOperation({ summary: 'Change the company quote wording (admin)' })
    saveQuoteTemplate(
        @Req() req: RequestWithUser,
        @Body() body: CompanyQuoteTemplateDto,
    ): Promise<CompanyQuoteTemplate> {
        return this.settings.saveQuoteTemplate(body, req.user.email);
    }

    @Get('settings/sessions')
    @ApiOperation({ summary: 'My signed-in devices' })
    listSessions(@Req() req: RequestWithUser): Promise<SignedInSession[]> {
        return this.sessions.list(
            req.user.id,
            sessionIdOf(req.headers.authorization),
        );
    }

    @Delete('settings/sessions/:id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Sign out one of my devices' })
    async signOut(
        @Req() req: RequestWithUser,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<void> {
        if (!(await this.sessions.signOut(req.user.id, id))) {
            throw new NotFoundException('Session not found');
        }
    }

    @Post('settings/sessions/sign-out-others')
    @HttpCode(204)
    @ApiOperation({ summary: 'Sign out everywhere except this device' })
    async signOutOthers(@Req() req: RequestWithUser): Promise<void> {
        const current = sessionIdOf(req.headers.authorization);
        // Without knowing which session is this one, "everywhere else" would include it.
        if (!current) {
            throw new BadRequestException(
                'This sign-in does not say which device it is; sign out the others one by one.',
            );
        }
        await this.sessions.signOutOthers(req.user.id, current);
    }

    @Get('notifications')
    @ApiOperation({ summary: 'My latest notifications and the unread count' })
    listNotifications(
        @Req() req: RequestWithUser,
    ): Promise<{ items: AppNotification[]; unread: number }> {
        return this.notifications.list(req.user.id);
    }

    @Post('notifications/read')
    @HttpCode(204)
    @ApiOperation({ summary: 'Mark my notifications read (all when no ids)' })
    async markRead(
        @Req() req: RequestWithUser,
        @Body() body: MarkNotificationsReadDto,
    ): Promise<void> {
        await this.notifications.markRead(req.user.id, body.ids);
    }
}
