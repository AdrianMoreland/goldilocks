import { SetMetadata } from '@nestjs/common';
import type { PermissionKey } from '@goldilocks/shared-types';

export const PERMISSION_KEY = 'requiredPermission';

/**
 * Marks a route or whole controller as needing one permission (role preset plus the person's own overrides,
 * see permissions.ts in shared-types). Enforced by PermissionGuard on every request; it adds to @Roles and
 * @RequiresCapability, it does not replace them.
 */
export const RequiresPermission = (permission: PermissionKey) =>
    SetMetadata(PERMISSION_KEY, permission);
