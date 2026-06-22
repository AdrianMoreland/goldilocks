import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private config: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ForbiddenException('No user found on request');

        const supabase = createClient(
            this.config.getOrThrow<string>('SUPABASE_URL'),
            this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !requiredRoles.includes(profile.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}