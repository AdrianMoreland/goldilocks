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
exports.SessionsService = void 0;
exports.sessionIdOf = sessionIdOf;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const auth_provider_port_1 = require("../auth/auth-provider.port");
function sessionIdOf(authorization) {
    const token = authorization?.replace(/^Bearer\s+/i, '');
    const payload = token?.split('.')[1];
    if (!payload)
        return null;
    try {
        const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        return typeof claims.session_id === 'string' ? claims.session_id : null;
    }
    catch {
        return null;
    }
}
let SessionsService = class SessionsService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async list(userId, currentId) {
        const rows = await this.provider.listSessions(userId);
        return rows.map((r) => ({
            id: r.id,
            device: (0, shared_types_1.parseUserAgent)(r.userAgent),
            ip: r.ip,
            createdAt: r.createdAt.toISOString(),
            lastActiveAt: r.lastActiveAt.toISOString(),
            current: r.id === currentId,
        }));
    }
    signOut(userId, sessionId) {
        return this.provider.revokeSession(userId, sessionId);
    }
    signOutOthers(userId, currentId) {
        return this.provider.revokeOtherSessions(userId, currentId);
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_provider_port_1.AUTH_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map