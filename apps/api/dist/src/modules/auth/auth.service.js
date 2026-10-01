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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const auth_provider_port_1 = require("./auth-provider.port");
const SAFE_USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    isActive: true,
    admin: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
};
let AuthService = AuthService_1 = class AuthService {
    authProvider;
    prisma;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(authProvider, prisma) {
        this.authProvider = authProvider;
        this.prisma = prisma;
    }
    async login(email, password) {
        const session = await this.authProvider.signInWithPassword(email, password);
        const user = await this.loadActiveUser(session.identity);
        return {
            accessToken: session.accessToken,
            user: this.toSessionUser(user),
        };
    }
    async validateToken(token) {
        const identity = await this.authProvider.verifyToken(token);
        return this.loadActiveUser(identity);
    }
    async createUser(dto) {
        const identity = await this.authProvider.createIdentity(dto.email, dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    id: identity.id,
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    password: '',
                    role: dto.role,
                    admin: dto.admin,
                    isActive: true,
                },
                select: SAFE_USER_SELECT,
            });
            return this.toSessionUser(user);
        }
        catch (error) {
            await this.authProvider
                .deleteIdentity(identity.id)
                .catch((cleanupError) => {
                this.logger.error(`Could not roll back auth identity ${identity.id} after the User row failed — delete it manually`, cleanupError instanceof Error
                    ? cleanupError.stack
                    : String(cleanupError));
            });
            throw error;
        }
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: SAFE_USER_SELECT,
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Account not found or inactive.');
        }
        return this.toSessionUser(user);
    }
    async loadActiveUser(identity) {
        const user = await this.prisma.user.findUnique({
            where: { id: identity.id },
            select: SAFE_USER_SELECT,
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('This account is not set up for this application.');
        }
        return user;
    }
    toSessionUser(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            admin: user.admin,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_provider_port_1.AUTH_PROVIDER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map