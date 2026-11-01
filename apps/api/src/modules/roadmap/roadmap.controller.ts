import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
    RoadmapPullRequestDto,
    RoadmapPullResultDto,
    RoadmapSyncStatusDto,
} from '../../common/dto/dtos';
import { RoadmapService } from './roadmap.service';
import { RoadmapPullService } from './roadmap-pull.service';
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

    @Post('edit')
    @ApiOperation({
        summary: 'Check, add, edit or delete one roadmap task (admin)',
    })
    @ApiResponse({ status: 201, type: RoadmapDocumentDto })
    edit(@Body() body: RoadmapEditRequestDto, @Req() req: RequestWithUser) {
        return this.service.edit(body, req.user);
    }
}
