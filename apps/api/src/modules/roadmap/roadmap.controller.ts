import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    JwtAuthGuard,
    type RequestWithUser,
} from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    RoadmapDocumentDto,
    RoadmapEditRequestDto,
    RoadmapInboxDto,
    RoadmapInboxItemDto,
    RoadmapInboxPromoteDto,
    RoadmapInboxRefreshDto,
    RoadmapPullRequestDto,
    RoadmapPullResultDto,
    RoadmapPushRequestDto,
    RoadmapPushResultDto,
    RoadmapSyncStatusDto,
} from '../../common/dto/dtos';
import { RoadmapService } from './roadmap.service';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapPushService } from './roadmap-push.service';
import { RoadmapSyncService } from './roadmap-sync.service';

@ApiTags('roadmap')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('roadmap')
export class RoadmapController {
    constructor(
        private readonly service: RoadmapService,
        private readonly sync: RoadmapSyncService,
        private readonly pulls: RoadmapPullService,
        private readonly pushes: RoadmapPushService,
        private readonly inbox: RoadmapInboxService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'The roadmap Markdown and its version (admin)' })
    @ApiResponse({ status: 200, type: RoadmapDocumentDto })
    get() {
        return this.service.get();
    }

    @Get('sync')
    @ApiOperation({
        summary:
            'How the app roadmap compares with docs/ROADMAP.md on master (admin, read only)',
    })
    @ApiResponse({ status: 200, type: RoadmapSyncStatusDto })
    syncStatus() {
        return this.sync.status();
    }

    @Post('sync/pull')
    @Throttle({ default: { limit: 6, ttl: 60_000 } })
    @ApiOperation({
        summary:
            "Bring master's roadmap into the app (admin). dryRun previews; the first run needs confirmReplace",
    })
    @ApiResponse({ status: 201, type: RoadmapPullResultDto })
    pull(@Body() body: RoadmapPullRequestDto, @Req() req: RequestWithUser) {
        return this.pulls.pull(req.user.email, body);
    }

    @Post('sync/push')
    @Throttle({ default: { limit: 6, ttl: 60_000 } })
    @ApiOperation({
        summary:
            "Send the app's roadmap edits to GitHub as a pull request (admin). dryRun previews and writes nothing",
    })
    @ApiResponse({ status: 201, type: RoadmapPushResultDto })
    push(@Body() body: RoadmapPushRequestDto, @Req() req: RequestWithUser) {
        return this.pushes.push(req.user.email, body);
    }

    @Post('edit')
    @ApiOperation({
        summary: 'Check, add, edit or delete one roadmap task (admin)',
    })
    @ApiResponse({ status: 201, type: RoadmapDocumentDto })
    edit(@Body() body: RoadmapEditRequestDto, @Req() req: RequestWithUser) {
        return this.service.edit(body, req.user);
    }

    @Get('inbox')
    @ApiOperation({
        summary:
            'Captured ideas (GitHub issues labelled roadmap) to triage (admin)',
    })
    @ApiResponse({ status: 200, type: RoadmapInboxDto })
    inboxList() {
        return this.inbox.list();
    }

    @Post('inbox/refresh')
    @Throttle({ default: { limit: 6, ttl: 60_000 } })
    @ApiOperation({ summary: 'Fetch new roadmap issues from GitHub (admin)' })
    @ApiResponse({ status: 201, type: RoadmapInboxRefreshDto })
    inboxRefresh() {
        return this.inbox.refresh();
    }

    @Post('inbox/:id/promote')
    @ApiOperation({
        summary: 'Add an inbox item to the roadmap as a task (admin)',
    })
    @ApiResponse({ status: 201, type: RoadmapInboxItemDto })
    inboxPromote(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: RoadmapInboxPromoteDto,
        @Req() req: RequestWithUser,
    ) {
        return this.inbox.promote(id, body, req.user.email);
    }

    @Post('inbox/:id/dismiss')
    @ApiOperation({ summary: 'Dismiss an inbox item (admin)' })
    @ApiResponse({ status: 201, type: RoadmapInboxItemDto })
    inboxDismiss(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestWithUser,
    ) {
        return this.inbox.dismiss(id, req.user.email);
    }
}
