import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto, SessionUserDto } from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email & password' })
    async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(body.email, body.password);
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
    async createUser(@Body() body: CreateUserRequestDto): Promise<SessionUserDto> {
        return this.authService.createUser(body);
    }
}
