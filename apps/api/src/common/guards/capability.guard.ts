import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { capabilitiesFor } from '@goldilocks/shared-types';
import {
    CAPABILITY_KEY,
    type RequirableCapability,
} from '../decorators/capability.decorator';
import type { RequestWithUser } from './jwt-auth.guard';

/** Request-side counterpart of capabilitiesFor(): the single place a signed-in user's branch is turned into rules. */
export function capabilitiesOf(user: RequestWithUser['user']) {
    return capabilitiesFor({
        branchRegion: user.branch?.region ?? null,
        admin: user.admin,
    });
}

/** Registered globally after JwtAuthGuard, so the user is already on the request. */
@Injectable()
export class CapabilityGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<
            RequirableCapability | undefined
        >(CAPABILITY_KEY, [context.getHandler(), context.getClass()]);
        if (!required) return true;

        const { user } = context.switchToHttp().getRequest<RequestWithUser>();
        // No user means a @Public() route; a capability on one is a mistake, so fail closed.
        if (!user || !capabilitiesOf(user)[required]) {
            throw new ForbiddenException(
                'Your branch does not have access to this.',
            );
        }
        return true;
    }
}
