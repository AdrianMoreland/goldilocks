import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Patch,
    Put,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AdminUser, PermissionMatrix } from '@goldilocks/shared-types';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    SetOverridesRequestDto,
    UpdatePermissionMatrixRequestDto,
    UpdateUserRequestDto,
} from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { PeopleService } from './people.service';

/** Admin → People and Roles & permissions. Admins only; every write needs a reason and is audit-logged. */
@ApiTags('people')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class PeopleController {
    constructor(private readonly people: PeopleService) {}

    @Get('users')
    @ApiOperation({ summary: 'Staff directory with each person’s permissions' })
    list(): Promise<AdminUser[]> {
        return this.people.list();
    }

    @Patch('users/:id')
    @HttpCode(204)
    @ApiOperation({
        summary: 'Change role, admin, active or branch (reason required)',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateUserRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<void> {
        await this.people.update(id, body, req.user);
    }

    @Put('users/:id/overrides')
    @HttpCode(204)
    @ApiOperation({
        summary: 'Replace a person’s permission overrides (reason required)',
    })
    async setOverrides(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: SetOverridesRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<void> {
        await this.people.setOverrides(id, body, req.user);
    }

    @Get('permissions')
    @ApiOperation({ summary: 'Roles × permissions matrix' })
    matrix(): Promise<PermissionMatrix> {
        return this.people.matrix();
    }

    @Put('permissions')
    @HttpCode(204)
    @ApiOperation({
        summary: 'Save the roles × permissions matrix (reason required)',
    })
    async setMatrix(
        @Body() body: UpdatePermissionMatrixRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<void> {
        await this.people.setMatrix(body, req.user);
    }
}
