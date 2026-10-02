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
exports.RoadmapController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
const roadmap_service_1 = require("./roadmap.service");
let RoadmapController = class RoadmapController {
    service;
    constructor(service) {
        this.service = service;
    }
    get() {
        return this.service.get();
    }
    edit(body, req) {
        return this.service.edit(body, req.user);
    }
};
exports.RoadmapController = RoadmapController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'The roadmap Markdown and its version (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.RoadmapDocumentDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('edit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check, add, edit or delete one roadmap task (admin)',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.RoadmapDocumentDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RoadmapEditRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RoadmapController.prototype, "edit", null);
exports.RoadmapController = RoadmapController = __decorate([
    (0, swagger_1.ApiTags)('roadmap'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('roadmap'),
    __metadata("design:paramtypes", [roadmap_service_1.RoadmapService])
], RoadmapController);
//# sourceMappingURL=roadmap.controller.js.map