import type { PermissionKey } from '@goldilocks/shared-types';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissions;
    constructor(permissions: PermissionsService);
    me(req: RequestWithUser): Promise<PermissionKey[]>;
}
//# sourceMappingURL=permissions.controller.d.ts.map