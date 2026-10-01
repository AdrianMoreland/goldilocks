import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import type { AuthenticatedUser } from '../../modules/auth/auth.service';
export interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}
export declare class JwtAuthGuard implements CanActivate {
    private authService;
    private reflector;
    constructor(authService: AuthService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=jwt-auth.guard.d.ts.map