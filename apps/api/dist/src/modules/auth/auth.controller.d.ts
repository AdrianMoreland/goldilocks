import { AuthService } from './auth.service';
import { CreateUserRequestDto, LoginRequestDto, LoginResponseDto, SessionUserDto } from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginRequestDto): Promise<LoginResponseDto>;
    me(req: RequestWithUser): Promise<SessionUserDto>;
    createUser(body: CreateUserRequestDto): Promise<SessionUserDto>;
}
//# sourceMappingURL=auth.controller.d.ts.map