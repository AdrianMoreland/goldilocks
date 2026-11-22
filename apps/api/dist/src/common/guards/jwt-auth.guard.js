"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
exports.applyViewAs = applyViewAs;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const shared_types_1 = require("@goldilocks/shared-types");
const auth_service_1 = require("../../modules/auth/auth.service");
const public_decorator_1 = require("../decorators/public.decorator");
const BEARER = /^Bearer (\S+)$/;
function applyViewAs(user, header) {
    const option = user.admin ? (0, shared_types_1.parseViewAs)(header) : null;
    if (!option)
        return { user };
    return {
        user: {
            ...user,
            admin: false,
            role: option.role,
            branch: { id: 0, name: option.label, region: option.region },
        },
        viewAs: option.value,
    };
}
let JwtAuthGuard = class JwtAuthGuard {
    authService;
    reflector;
    constructor(authService, reflector) {
        this.authService = authService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        if (request.user)
            return true;
        const match = BEARER.exec(request.headers.authorization ?? '');
        if (!match) {
            throw new common_1.UnauthorizedException('Missing or invalid authorization header');
        }
        const real = await this.authService.validateToken(match[1]);
        const seen = applyViewAs(real, request.headers[shared_types_1.VIEW_AS_HEADER]);
        request.user = seen.user;
        if (seen.viewAs) {
            request.realUser = real;
            request.viewAs = seen.viewAs;
        }
        return true;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map