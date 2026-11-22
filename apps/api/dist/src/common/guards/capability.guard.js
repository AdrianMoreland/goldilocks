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
exports.CapabilityGuard = void 0;
exports.capabilitiesOf = capabilitiesOf;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const shared_types_1 = require("@goldilocks/shared-types");
const capability_decorator_1 = require("../decorators/capability.decorator");
function capabilitiesOf(user) {
    return (0, shared_types_1.capabilitiesFor)({
        branchRegion: user.branch?.region ?? null,
        admin: user.admin,
    });
}
let CapabilityGuard = class CapabilityGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const required = this.reflector.getAllAndOverride(capability_decorator_1.CAPABILITY_KEY, [context.getHandler(), context.getClass()]);
        if (!required)
            return true;
        const { user } = context.switchToHttp().getRequest();
        if (!user || !capabilitiesOf(user)[required]) {
            throw new common_1.ForbiddenException('Your branch does not have access to this.');
        }
        return true;
    }
};
exports.CapabilityGuard = CapabilityGuard;
exports.CapabilityGuard = CapabilityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], CapabilityGuard);
//# sourceMappingURL=capability.guard.js.map