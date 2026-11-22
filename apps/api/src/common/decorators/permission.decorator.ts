import { SetMetadata } from '@nestjs/common';
import type { PermissionKey } from '@goldilocks/shared-types';

export const PERMISSION_KEY = 'requiredPermission';

/**
 * Marks a route or whole controller as needing a permission (role preset plus the person's own overrides, see
 * permissions.ts in shared-types). Enforced by PermissionGuard on every request. A controller's key and a route's own
 * key both count, so a route must hold every key set on it and on its class. It adds to @Roles and
 * @RequiresCapability, it does not replace them.
 */
export const RequiresPermission = (permission: PermissionKey) =>
    SetMetadata(PERMISSION_KEY, permission);
