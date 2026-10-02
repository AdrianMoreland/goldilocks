import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
} from '../../common/dto/dtos';
import { RoadmapService } from './roadmap.service';

@ApiTags('roadmap')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly service: RoadmapService) {}

    @Get()
    @ApiOperation({ summary: 'The roadmap Markdown and its version (admin)' })
    @ApiResponse({ status: 200, type: RoadmapDocumentDto })
    get() {
        return this.service.get();
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
