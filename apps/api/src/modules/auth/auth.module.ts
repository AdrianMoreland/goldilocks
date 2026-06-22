import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "../../infrastructure/prisma/prisma.module";
import {SupabaseModule} from "../../supabase/supabase.module";

@Module({
    imports: [ConfigModule, PrismaModule, SupabaseModule], // <-- import the module providing SupabaseService
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }