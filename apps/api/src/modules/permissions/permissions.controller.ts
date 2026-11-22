import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PermissionKey } from '@goldilocks/shared-types';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissions: PermissionsService) {}

    /** What the signed-in person may see. The web app only uses it to hide what the server would refuse anyway. */
    @Get('me')
    @ApiOperation({ summary: "The signed-in person's permissions" })
    me(@Req() req: RequestWithUser): Promise<PermissionKey[]> {
        return this.permissions.forUser(req.user);
    }
}
