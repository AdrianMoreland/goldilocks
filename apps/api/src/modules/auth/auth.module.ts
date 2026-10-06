import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { RequestMetricsModule } from '../request-metrics/request-metrics.module';

import { SupabaseModule } from '../../infrastructure/supabase/supabase.module';
import { AUTH_PROVIDER } from './auth-provider.port';
import { SupabaseAuthProvider } from './providers/supabase-auth.provider';

@Module({
    imports: [
        ConfigModule,
        PrismaModule,
        AuditLogModule,
        RequestMetricsModule,
        SupabaseModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        // Swap identity providers by changing this one binding — nothing
        // else in the app references Supabase directly for auth.
        { provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider },
    ],
    exports: [AuthService],
})
export class AuthModule {}
