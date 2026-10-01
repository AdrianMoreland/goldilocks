import { AuthService } from './auth.service';
import { RequestMetricsService } from '../admin/request-metrics.service';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto, SessionUserDto } from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
export declare class AuthController {
    private readonly authService;
    private readonly metrics;
    constructor(authService: AuthService, metrics: RequestMetricsService);
    login(body: LoginRequestDto): Promise<LoginResponseDto>;
    me(req: RequestWithUser): Promise<SessionUserDto>;
    createUser(body: CreateUserRequestDto): Promise<SessionUserDto>;
}
//# sourceMappingURL=auth.controller.d.ts.map