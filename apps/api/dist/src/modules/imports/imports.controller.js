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
exports.ItemTraceController = exports.BcHistoryController = exports.BcAwaitingController = exports.ImportsController = void 0;
const permission_decorator_1 = require("../../common/decorators/permission.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workbook_import_service_1 = require("./workbook-import.service");
const bc_awaiting_import_service_1 = require("./bc-awaiting-import.service");
const bc_history_import_service_1 = require("./bc-history-import.service");
const item_trace_service_1 = require("./item-trace.service");
const shipped_not_collected_service_1 = require("./shipped-not-collected.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const dtos_1 = require("../../common/dto/dtos");
let ImportsController = class ImportsController {
    workbook;
    constructor(workbook) {
        this.workbook = workbook;
    }
    batches() {
        return this.workbook.recentBatches();
    }
    preview(body) {
        return this.workbook.preview(body);
    }
    commit(body, req) {
        return this.workbook.commit(body, req.user.email);
    }
};
exports.ImportsController = ImportsController;
__decorate([
    (0, common_1.Get)('batches'),
    (0, swagger_1.ApiOperation)({ summary: 'The last workbook imports, newest first.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImportsController.prototype, "batches", null);
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'What this chunk would add, change or leave alone. Writes nothing.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.WorkbookChunkRequestDto]),
    __metadata("design:returntype", Promise)
], ImportsController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('commit'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Import this chunk. Rows are upserted by key, so sending a file twice changes nothing.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.WorkbookChunkRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ImportsController.prototype, "commit", null);
exports.ImportsController = ImportsController = __decorate([
    (0, swagger_1.ApiTags)('imports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('imports/workbook'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.import'),
    __metadata("design:paramtypes", [workbook_import_service_1.WorkbookImportService])
], ImportsController);
let BcAwaitingController = class BcAwaitingController {
    bc;
    constructor(bc) {
        this.bc = bc;
    }
    preview(body) {
        return this.bc.preview(body);
    }
    commit(body, req) {
        return this.bc.commit(body, req.user.email);
    }
};
exports.BcAwaitingController = BcAwaitingController;
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Which orders would be posted by this report. Writes nothing.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BcAwaitingRequestDto]),
    __metadata("design:returntype", Promise)
], BcAwaitingController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('commit'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Import the whole report; orders no longer in it get a POSTED step.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BcAwaitingRequestDto, Object]),
    __metadata("design:returntype", Promise)
], BcAwaitingController.prototype, "commit", null);
exports.BcAwaitingController = BcAwaitingController = __decorate([
    (0, swagger_1.ApiTags)('imports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('imports/bc-awaiting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.import'),
    __metadata("design:paramtypes", [bc_awaiting_import_service_1.BcAwaitingImportService])
], BcAwaitingController);
let BcHistoryController = class BcHistoryController {
    bc;
    shipped;
    constructor(bc, shipped) {
        this.bc = bc;
        this.shipped = shipped;
    }
    shippedNotCollected() {
        return this.shipped.list();
    }
    shippedNotCollectedTasks(req) {
        return this.shipped.createTasks(req.user.email);
    }
    preview(body) {
        return this.bc.preview(body);
    }
    commit(body, req) {
        return this.bc.commit(body, req.user.email);
    }
};
exports.BcHistoryController = BcHistoryController;
__decorate([
    (0, common_1.Get)('shipped-not-collected'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sales a posted BC shipment links to that the tradesheet does not show as collected.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BcHistoryController.prototype, "shippedNotCollected", null);
__decorate([
    (0, common_1.Post)('shipped-not-collected/tasks'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a "tick Collected" sheet task for each listed sale that has none open.',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BcHistoryController.prototype, "shippedNotCollectedTasks", null);
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'What these BC lists would add or change, and how many bars and events they give. Writes nothing.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BcHistoryRequestDto]),
    __metadata("design:returntype", Promise)
], BcHistoryController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('commit'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Import the lists. Rows are upserted by their BC number, so sending them twice changes nothing.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BcHistoryRequestDto, Object]),
    __metadata("design:returntype", Promise)
], BcHistoryController.prototype, "commit", null);
exports.BcHistoryController = BcHistoryController = __decorate([
    (0, swagger_1.ApiTags)('imports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('imports/bc-history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.import'),
    __metadata("design:paramtypes", [bc_history_import_service_1.BcHistoryImportService,
        shipped_not_collected_service_1.ShippedNotCollectedService])
], BcHistoryController);
let ItemTraceController = class ItemTraceController {
    trace;
    constructor(trace) {
        this.trace = trace;
    }
    get({ serial }) {
        return this.trace.trace(serial);
    }
};
exports.ItemTraceController = ItemTraceController;
__decorate([
    (0, common_1.Get)('trace'),
    (0, swagger_1.ApiOperation)({ summary: 'A bar and its events, oldest first.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ItemTraceQueryDto]),
    __metadata("design:returntype", Promise)
], ItemTraceController.prototype, "get", null);
exports.ItemTraceController = ItemTraceController = __decorate([
    (0, swagger_1.ApiTags)('items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, permission_decorator_1.RequiresPermission)('page.stocktake'),
    __metadata("design:paramtypes", [item_trace_service_1.ItemTraceService])
], ItemTraceController);
//# sourceMappingURL=imports.controller.js.map