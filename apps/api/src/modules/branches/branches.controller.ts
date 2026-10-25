import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    BranchResponseDto,
    CreateBranchRequestDto,
} from '../../common/dto/dtos';
import type { Branch } from '@goldilocks/shared-types';

@ApiTags('branches')
@Controller('branches')
export class BranchesController {
    constructor(private readonly service: BranchesService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all branches (admin)' })
    @ApiResponse({ status: 200, type: [BranchResponseDto] })
    async getAll(): Promise<Branch[]> {
        return this.service.getAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new branch (admin)' })
    @ApiResponse({ status: 201, type: BranchResponseDto })
    async create(
        @Body() body: CreateBranchRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<Branch> {
        return this.service.create(body, req.user.email);
    }
}
