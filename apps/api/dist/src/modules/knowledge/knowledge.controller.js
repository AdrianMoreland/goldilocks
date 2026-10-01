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
exports.KnowledgeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const shared_types_1 = require("@goldilocks/shared-types");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
const knowledge_service_1 = require("./knowledge.service");
let KnowledgeController = class KnowledgeController {
    knowledge;
    constructor(knowledge) {
        this.knowledge = knowledge;
    }
    async listDocuments(request) {
        return {
            documents: await this.knowledge.listDocuments(request.user.admin),
        };
    }
    async updateDocument(slug, body, request) {
        return this.knowledge.updateDocument(slug, body, request.user.email);
    }
    async setStatus(slug, body, request) {
        return this.knowledge.setStatus(slug, body.status, request.user.email);
    }
};
exports.KnowledgeController = KnowledgeController;
__decorate([
    (0, common_1.Get)('documents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'All SOPs the caller may read, with their Markdown',
        description: 'Drafts are included (the reader badges them). Retired SOPs are returned to admins only. ' +
            'The set is small, so the web app loads it once and searches it locally.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.KbDocumentListResponseDto }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "listDocuments", null);
__decorate([
    (0, common_1.Patch)('documents/:slug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Edit a SOP's title, owner and text (admin)",
        description: 'Changing the text or title sends an approved SOP back to draft. Refuses edits that would break a link to or from another SOP.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.KbDocumentDto }),
    __param(0, (0, common_1.Param)('slug', new nestjs_zod_1.ZodValidationPipe(shared_types_1.KbSlugSchema))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateKbDocumentRequestDto, Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "updateDocument", null);
__decorate([
    (0, common_1.Post)('documents/:slug/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve, return to draft, or retire a SOP (admin)',
        description: 'Approving bumps the version and dates the SOP, and is refused while any [TODO] remains.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.KbDocumentDto }),
    __param(0, (0, common_1.Param)('slug', new nestjs_zod_1.ZodValidationPipe(shared_types_1.KbSlugSchema))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SetKbStatusRequestDto, Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "setStatus", null);
exports.KnowledgeController = KnowledgeController = __decorate([
    (0, swagger_1.ApiTags)('knowledge'),
    (0, common_1.Controller)('knowledge'),
    __metadata("design:paramtypes", [knowledge_service_1.KnowledgeService])
], KnowledgeController);
//# sourceMappingURL=knowledge.controller.js.map