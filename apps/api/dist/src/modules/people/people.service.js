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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleService = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../settings/notifications.service");
const shared_types_1 = require("@goldilocks/shared-types");
const client_1 = require("../../../prisma/generated/client");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../infrastructure/redis/redis.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const permissions_service_1 = require("../permissions/permissions.service");
const ROLES = [
    'ADMIN',
    'MANAGER',
    'SALES',
    'ACCOUNTING',
    'AUDITOR',
];
const USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    admin: true,
    isActive: true,
    branchId: true,
    lastLoginAt: true,
    branch: { select: { id: true, name: true, region: true } },
    permissionOverrides: {
        select: {
            key: true,
            granted: true,
            expiresAt: true,
            reason: true,
            createdBy: true,
            createdAt: true,
        },
        orderBy: { key: 'asc' },
    },
};
const show = (v) => v === null ? 'none' : String(v);
let PeopleService = class PeopleService {
    prisma;
    audit;
    redis;
    permissions;
    notifications;
    constructor(prisma, audit, redis, permissions, notifications) {
        this.prisma = prisma;
        this.audit = audit;
        this.redis = redis;
        this.permissions = permissions;
        this.notifications = notifications;
    }
    changed(subject, what, reason, actor) {
        return this.notifications?.notifyAdmins({
            kind: 'permission_changed',
            title: `${subject}: ${what}`,
            body: `Changed by ${actor.email}. Reason: ${reason}`,
            link: '/admin?tab=people',
        });
    }
    async list() {
        const [users, presets] = await Promise.all([
            this.prisma.user.findMany({
                select: USER_SELECT,
                orderBy: [
                    { isActive: 'desc' },
                    { firstName: 'asc' },
                    { lastName: 'asc' },
                ],
            }),
            this.permissions.presets(),
        ]);
        const now = new Date();
        return users.map((u) => ({
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            admin: u.admin,
            isActive: u.isActive,
            branch: u.branch,
            lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
            overrides: u.permissionOverrides.map((o) => ({
                key: o.key,
                granted: o.granted,
                expiresAt: o.expiresAt?.toISOString() ?? null,
                reason: o.reason,
                createdBy: o.createdBy,
                createdAt: o.createdAt.toISOString(),
            })),
            permissions: (0, shared_types_1.effectivePermissions)(u, presets, u.permissionOverrides, now),
        }));
    }
    async update(id, body, actor) {
        const { reason, ...patch } = body;
        const done = await this.prisma.$transaction(async (tx) => {
            const before = await tx.user.findUnique({
                where: { id },
                select: USER_SELECT,
            });
            if (!before)
                throw new common_1.NotFoundException('Person not found');
            const losesAdmin = (patch.admin === false || patch.isActive === false) &&
                before.admin &&
                before.isActive;
            if (losesAdmin && id === actor.id) {
                throw new common_1.BadRequestException("You can't remove your own admin access or disable your own account.");
            }
            if (losesAdmin) {
                const others = await tx.user.count({
                    where: { admin: true, isActive: true, id: { not: id } },
                });
                if (others === 0) {
                    throw new common_1.BadRequestException('This is the last active admin; make someone else an admin first.');
                }
            }
            if (patch.branchId !== undefined && patch.branchId !== null) {
                const branch = await tx.branch.findUnique({
                    where: { id: patch.branchId },
                    select: { id: true },
                });
                if (!branch)
                    throw new common_1.BadRequestException('That branch does not exist.');
            }
            const changes = (0, shared_types_1.diffUserChanges)(before, patch);
            if (changes.length === 0)
                return null;
            await tx.user.update({
                where: { id },
                data: Object.fromEntries(changes.map((c) => [c.field, c.to])),
            });
            for (const c of changes) {
                await this.audit.record(actor.email, 'user', `${before.email}: ${c.field} ${show(c.from)} → ${show(c.to)} (reason: ${reason})`, tx);
            }
            return {
                email: before.email,
                what: changes
                    .map((c) => `${c.field} ${show(c.from)} → ${show(c.to)}`)
                    .join(', '),
            };
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
        if (done)
            await this.changed(done.email, done.what, reason, actor);
    }
    async setOverrides(id, body, actor) {
        const done = await this.prisma.$transaction(async (tx) => {
            const before = await tx.user.findUnique({
                where: { id },
                select: USER_SELECT,
            });
            if (!before)
                throw new common_1.NotFoundException('Person not found');
            const changes = (0, shared_types_1.diffOverrides)(before.permissionOverrides.map((o) => ({
                key: o.key,
                granted: o.granted,
                expiresAt: o.expiresAt?.toISOString() ?? null,
            })), body.overrides);
            if (changes.length === 0)
                return null;
            const next = new Map(body.overrides.map((o) => [o.key, o]));
            for (const c of changes) {
                const o = next.get(c.key);
                if (!o) {
                    await tx.userPermissionOverride.deleteMany({
                        where: { userId: id, key: c.key },
                    });
                    continue;
                }
                const data = {
                    granted: o.granted,
                    expiresAt: o.expiresAt ? new Date(o.expiresAt) : null,
                    reason: body.reason,
                    createdBy: actor.email,
                    createdAt: new Date(),
                };
                await tx.userPermissionOverride.upsert({
                    where: { userId_key: { userId: id, key: c.key } },
                    create: { userId: id, key: c.key, ...data },
                    update: data,
                });
            }
            for (const c of changes) {
                await this.audit.record(actor.email, 'permission', `${before.email}: ${c.key} ${c.from ?? 'none'} → ${c.to ?? 'none'} (reason: ${body.reason})`, tx);
            }
            return {
                email: before.email,
                what: changes
                    .map((c) => `${c.key} ${c.from ?? 'none'} → ${c.to ?? 'none'}`)
                    .join(', '),
            };
        });
        if (done)
            await this.changed(done.email, done.what, body.reason, actor);
    }
    async matrix() {
        return this.toMatrix(await this.permissions.presets());
    }
    async setMatrix(body, actor) {
        const changes = body.changes.filter((c) => c.role !== 'ADMIN');
        const applied = await this.prisma.$transaction(async (tx) => {
            const made = [];
            for (const c of changes) {
                const existing = await tx.rolePermission.findUnique({
                    where: { role_key: { role: c.role, key: c.key } },
                    select: { role: true },
                });
                if (c.granted === !!existing)
                    continue;
                if (c.granted) {
                    await tx.rolePermission.create({
                        data: { role: c.role, key: c.key },
                    });
                }
                else {
                    await tx.rolePermission.delete({
                        where: { role_key: { role: c.role, key: c.key } },
                    });
                }
                await this.audit.record(actor.email, 'permission', `${c.role}: ${c.key} ${c.granted ? 'granted' : 'removed'} (reason: ${body.reason})`, tx);
                made.push(`${c.role} ${c.key} ${c.granted ? 'granted' : 'removed'}`);
            }
            return made;
        });
        await this.redis.del(permissions_service_1.ROLE_PRESETS_CACHE_KEY);
        if (applied.length)
            await this.changed('Role presets', applied.join(', '), body.reason, actor);
    }
    toMatrix(rows) {
        const known = new Set(shared_types_1.PERMISSION_KEYS);
        return Object.fromEntries(ROLES.map((role) => [
            role,
            rows
                .filter((r) => r.role === role && known.has(r.key))
                .map((r) => r.key),
        ]));
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService,
        redis_service_1.RedisService,
        permissions_service_1.PermissionsService,
        notifications_service_1.NotificationsService])
], PeopleService);
//# sourceMappingURL=people.service.js.map