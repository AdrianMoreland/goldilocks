import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {SupabaseAuthGuard} from "./supabase-auth.guard";

@ApiTags('auth')
@Controller('auth')
@UseGuards(SupabaseAuthGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() body: { email: string; password: string; full_name: string; phone?: string }) {
        return this.authService.register(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email & password' })
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body);
    }

    @Post('otp/send')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP to phone number' })
    async sendOtp(@Body() body: { phone: string }) {
        return this.authService.sendOtp(body.phone);
    }

    @Post('otp/verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP and authenticate' })
    async verifyOtp(@Body() body: { phone: string; token: string }) {
        return this.authService.verifyOtp(body.phone, body.token);
    }
}