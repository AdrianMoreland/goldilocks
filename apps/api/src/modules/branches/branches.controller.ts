import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { BranchResponseDto, CreateBranchRequestDto } from '../../common/dto/dtos';
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
    async create(@Body() body: CreateBranchRequestDto): Promise<Branch> {
        return this.service.create(body);
    }
}
