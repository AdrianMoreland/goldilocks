import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RequestWithUser } from './jwt-auth.guard';
export declare function capabilitiesOf(user: RequestWithUser['user']): import("@goldilocks/shared-types").Capabilities;
export declare class CapabilityGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=capability.guard.d.ts.map