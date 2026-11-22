import { AuthService } from './auth.service';
import { RequestMetricsService } from '../request-metrics/request-metrics.service';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto, RefreshRequestDto, SessionUserDto, InviteUserRequestDto, SetUserBranchRequestDto, UiSettingsRequestDto } from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
export declare class AuthController {
    private readonly authService;
    private readonly metrics;
    constructor(authService: AuthService, metrics: RequestMetricsService);
    login(body: LoginRequestDto): Promise<LoginResponseDto>;
    refresh(body: RefreshRequestDto): Promise<LoginResponseDto>;
    me(req: RequestWithUser): Promise<SessionUserDto>;
    saveUiSettings(req: RequestWithUser, body: UiSettingsRequestDto): Promise<void>;
    createUser(body: CreateUserRequestDto, req: RequestWithUser): Promise<SessionUserDto>;
    inviteUser(body: InviteUserRequestDto, req: RequestWithUser): Promise<SessionUserDto>;
    setUserBranch(id: string, body: SetUserBranchRequestDto, req: RequestWithUser): Promise<SessionUserDto>;
}
//# sourceMappingURL=auth.controller.d.ts.map