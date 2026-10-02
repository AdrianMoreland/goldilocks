import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Marks a route inside an admin-only controller as open to every signed-in user. An explicit empty
 * list overrides the class-level @Roles, so "no roles" is always a decision someone wrote down.
 */
export const AnySignedInUser = () => SetMetadata('roles', []);
