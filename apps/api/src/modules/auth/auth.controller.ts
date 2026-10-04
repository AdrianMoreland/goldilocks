import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RequestMetricsService } from '../admin/request-metrics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
    CreateUserRequestDto,
    LoginRequestDto,
    LoginResponseDto,
    RefreshRequestDto,
    SessionUserDto,
} from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly metrics: RequestMetricsService,
    ) {}

    // The only public write endpoint: tight, per IP, to make password guessing impractical.
    @Public()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email & password' })
    async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
        try {
            const result = await this.authService.login(
                body.email,
                body.password,
            );
            this.metrics.recordLogin(true);
            return result;
        } catch (error) {
            this.metrics.recordLogin(false);
            throw error;
        }
    }

    // Public because it is called when the access token has already expired; the refresh token is the credential.
    @Public()
    @Throttle({ default: { limit: 30, ttl: 60_000 } })
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Exchange a refresh token for a new session' })
    async refresh(@Body() body: RefreshRequestDto): Promise<LoginResponseDto> {
        return this.authService.refresh(body.refreshToken);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Current session user' })
    async me(@Req() req: RequestWithUser): Promise<SessionUserDto> {
        return this.authService.me(req.user.id);
    }

    @Post('admin/users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new staff account (admin)' })
    async createUser(
        @Body() body: CreateUserRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<SessionUserDto> {
        return this.authService.createUser(body, req.user.email);
    }
}
