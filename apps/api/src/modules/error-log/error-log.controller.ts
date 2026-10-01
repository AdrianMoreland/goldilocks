import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    JwtAuthGuard,
    type RequestWithUser,
} from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ClientErrorReportBatchDto } from '../../common/dto/dtos';
import { ErrorLogService } from './error-log.service';

@ApiTags('errors')
@Controller('errors')
export class ErrorLogController {
    constructor(private readonly errorLog: ErrorLogService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Recent server and reported client errors, newest first (admin)',
    })
    async getRecent(@Query('limit') limit?: string) {
        const n = Math.min(Math.max(Number(limit) || 100, 1), 500);
        return this.errorLog.getRecent(n);
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Clear the error log (admin)' })
    async clear() {
        await this.errorLog.clear();
        return { message: 'Error log cleared' };
    }

    // Any signed-in user — the failures worth knowing about happen on every
    // clerk's screen, not just admins'. The body schema caps size and count.
    @Post('client')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
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
