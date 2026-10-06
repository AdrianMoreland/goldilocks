// src/supabase/supabase.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

// Deliberately not @Global: AuthModule is the only consumer, so a second
// module can't start calling Supabase directly and bypass AuthProviderPort.
@Module({
    imports: [ConfigModule],
    providers: [SupabaseService],
    exports: [SupabaseService],
})
export class SupabaseModule {}
