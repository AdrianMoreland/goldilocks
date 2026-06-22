// src/supabase/supabase.module.ts
import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import {ConfigModule} from "@nestjs/config";

@Global()
@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [SupabaseService],
    exports: [SupabaseService],
})
export class SupabaseModule {}
