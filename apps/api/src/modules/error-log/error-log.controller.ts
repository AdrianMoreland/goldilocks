import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import {
    AnySignedInUser,
    Roles,
} from '../../common/decorators/roles.decorator';
import {
    ClientErrorReportBatchDto,
    ErrorLogQueryDto,
} from '../../common/dto/dtos';
import { ErrorLogService } from './error-log.service';

@ApiTags('errors')
@Controller('errors')
@Roles('admin')
@ApiBearerAuth()
export class ErrorLogController {
    constructor(private readonly errorLog: ErrorLogService) {}

    @Get()
    @ApiOperation({
        summary:
            'Recent server and reported client errors, newest first (admin)',
    })
    async getRecent(@Query() { limit }: ErrorLogQueryDto) {
        return this.errorLog.getRecent(limit);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear the error log (admin)' })
    async clear() {
        await this.errorLog.clear();
        return { message: 'Error log cleared' };
    }

    // Any signed-in user — the failures worth knowing about happen on every
    // clerk's screen, not just admins'. The body schema caps size and count.
    @Post('client')
    @AnySignedInUser()
    @ApiOperation({
        summary: 'Report browser-side errors (any signed-in user)',
    })
    async reportClient(
        @Body() body: ClientErrorReportBatchDto,
        @Req() request: RequestWithUser,
    ) {
        await this.errorLog.recordClientReports(
            body.reports,
            request.user?.email ?? null,
            request.headers['user-agent'] ?? null,
        );
        return { message: 'Reported' };
    }
}
