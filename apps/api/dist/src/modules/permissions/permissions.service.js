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
exports.PermissionsService = exports.ROLE_PRESETS_CACHE_KEY = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../infrastructure/redis/redis.service");
exports.ROLE_PRESETS_CACHE_KEY = 'permissions:role-presets';
const PRESETS_TTL_SECONDS = 300;
let PermissionsService = class PermissionsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async presets() {
        const cached = await this.redis.get(exports.ROLE_PRESETS_CACHE_KEY);
        if (cached)
            return cached;
        const rows = await this.prisma.rolePermission.findMany({
            select: { role: true, key: true },
        });
        await this.redis.set(exports.ROLE_PRESETS_CACHE_KEY, rows, PRESETS_TTL_SECONDS);
        return rows;
    }
    async forUser(user) {
        if (user.admin)
            return (0, shared_types_1.effectivePermissions)(user, [], [], new Date());
        const [presets, overrides] = await Promise.all([
            this.presets(),
            this.prisma.userPermissionOverride.findMany({
                where: { userId: user.id },
                select: { key: true, granted: true, expiresAt: true },
            }),
        ]);
        return (0, shared_types_1.effectivePermissions)(user, presets, overrides, new Date());
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map