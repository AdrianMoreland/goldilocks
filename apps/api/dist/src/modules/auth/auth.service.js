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
const audit_log_service_1 = require("../audit-log/audit-log.service");
const auth_provider_port_1 = require("./auth-provider.port");
const shared_types_1 = require("@goldilocks/shared-types");
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
    branchId: true,
    uiSettings: true,
    branch: { select: { id: true, name: true, region: true } },
};
let AuthService = AuthService_1 = class AuthService {
    authProvider;
    prisma;
    audit;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(authProvider, prisma, audit) {
        this.authProvider = authProvider;
        this.prisma = prisma;
        this.audit = audit;
    }
    async login(email, password) {
        const session = await this.authProvider.signInWithPassword(email, password);
        const user = await this.loadActiveUser(session.identity);
        await this.prisma.user
            .update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
            select: { id: true },
        })
            .catch((error) => this.logger.warn(`Could not record the sign-in time: ${error instanceof Error ? error.message : String(error)}`));
        return {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user: this.toSessionUser(user),
        };
    }
    async refresh(refreshToken) {
        const session = await this.authProvider.refreshSession(refreshToken);
        const user = await this.loadActiveUser(session.identity);
        return {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user: this.toSessionUser(user),
        };
    }
    async validateToken(token) {
        const identity = await this.authProvider.verifyToken(token);
        return this.loadActiveUser(identity);
    }
    async createUser(dto, actor) {
        if (dto.branchId !== null)
            await this.requireBranch(dto.branchId);
        const identity = await this.authProvider.createIdentity(dto.email, dto.password);
        return this.provisionUser(identity, dto, actor, 'created');
    }
    async inviteUser(dto, actor) {
        if (dto.branchId !== null)
            await this.requireBranch(dto.branchId);
        const existing = await this.prisma.user.findFirst({
            where: { email: { equals: dto.email, mode: 'insensitive' } },
            select: { id: true },
        });
        if (existing)
            throw new common_1.ConflictException('A user with this email already exists.');
        const identity = await this.authProvider.inviteIdentity(dto.email);
        return this.provisionUser(identity, dto, actor, 'invited');
    }
    async provisionUser(identity, dto, actor, verb) {
        try {
            const user = await this.prisma.$transaction(async (tx) => {
                const created = await tx.user.create({
                    data: {
                        id: identity.id,
                        email: dto.email,
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        password: '',
                        role: dto.role,
                        admin: dto.admin,
                        branchId: dto.branchId,
                        isActive: true,
                    },
                    select: SAFE_USER_SELECT,
                });
                await this.audit.record(actor, 'user', `${verb} ${dto.email} (${dto.role}${dto.admin ? ', admin' : ''})`, tx);
                return created;
            });
            return this.toSessionUser(user);
        }
        catch (error) {
            let owned = null;
            try {
                owned = await this.prisma.user.findUnique({
                    where: { id: identity.id },
                    select: { id: true },
                });
            }
            catch {
                owned = null;
            }
            if (owned)
                throw error;
            await this.authProvider
                .deleteIdentity(identity.id)
                .catch((cleanupError) => {
                this.logger.error(`Could not roll back auth identity ${identity.id} after the User row failed - delete it manually`, cleanupError instanceof Error
                    ? cleanupError.stack
                    : String(cleanupError));
            });
            throw error;
        }
    }
    async setUserBranch(userId, branchId, actor) {
        const existing = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('User not found.');
        if (branchId !== null)
            await this.requireBranch(branchId);
        const user = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id: userId },
                data: { branchId },
                select: SAFE_USER_SELECT,
            });
            await this.audit.record(actor, 'user', `moved ${existing.email} to ${updated.branch ? `${updated.branch.name} (${updated.branch.region})` : 'no branch'}`, tx);
            return updated;
        });
        return this.toSessionUser(user);
    }
    async requireBranch(branchId) {
        const branch = await this.prisma.branch.findUnique({
            where: { id: branchId },
            select: { id: true },
        });
        if (!branch)
            throw new common_1.BadRequestException('That branch does not exist.');
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
            branch: user.branch,
            uiSettings: readUiSettings(user.uiSettings),
            canViewAs: user.admin,
            viewAs: null,
        };
    }
    async saveUiSettings(userId, settings) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { uiSettings: settings },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_provider_port_1.AUTH_PROVIDER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], AuthService);
function readUiSettings(raw) {
    const parsed = shared_types_1.UiSettingsSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
}
//# sourceMappingURL=auth.service.js.map