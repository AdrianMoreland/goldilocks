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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const review_service_1 = require("./review.service");
const bc_sales_products_service_1 = require("./bc-sales-products.service");
const product_names_service_1 = require("./product-names.service");
const product_relink_service_1 = require("./product-relink.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const dtos_1 = require("../../common/dto/dtos");
let ReviewController = class ReviewController {
    review;
    bcProducts;
    names;
    relinkRows;
    constructor(review, bcProducts, names, relinkRows) {
        this.review = review;
        this.bcProducts = bcProducts;
        this.names = names;
        this.relinkRows = relinkRows;
    }
    summary() {
        return this.review.summary();
    }
    links(query) {
        return this.review.links(query);
    }
    decide(body, req) {
        return this.review.decide(body, req.user.email);
    }
    settle(req) {
        return this.review.settle(req.user.email);
    }
    overAllocated(query) {
        return this.review.overAllocated(query);
    }
    unresolvedLots(query) {
        return this.review.unresolvedLots(query);
    }
    duplicates(query) {
        return this.review.duplicates(query);
    }
    aliases(query) {
        return this.names.list(query);
    }
    aliasUsage(id) {
        return this.names.usage(id);
    }
    applyPerMetal(id, body, req) {
        return this.names.applyPerMetal(id, body, req.user.email);
    }
    settleNames(body, req) {
        return this.names.rescan(body.dryRun, req.user.email);
    }
    relink(body, req) {
        return this.relinkRows.relink(body, req.user.email);
    }
    acceptNames(body, req) {
        return this.names.accept(body.items, req.user.email);
    }
    rejectNames(body, req) {
        return this.names.reject(body.ids, req.user.email);
    }
    salesProducts() {
        return this.review.salesProducts();
    }
    pricingProducts() {
        return this.review.pricingProducts();
    }
    createSalesProduct(body, req) {
        return this.review.createSalesProduct(body, req.user.email);
    }
    bcSalesProductsPreview() {
        return this.bcProducts.preview();
    }
    bcSalesProductsApply(body, req) {
        return this.bcProducts.apply(body, req.user.email);
    }
    mapAlias(id, body, req) {
        return this.review.mapAlias(id, body, req.user.email);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'How many items wait in each review queue.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('links'),
    (0, swagger_1.ApiOperation)({ summary: 'Pending links, optionally of one type.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "links", null);
__decorate([
    (0, common_1.Post)('links/decide'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm or reject pending links.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LinkDecisionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "decide", null);
__decorate([
    (0, common_1.Post)('links/settle'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm the pending links that make sense, leaving the rest to ask about.',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "settle", null);
__decorate([
    (0, common_1.Get)('over-allocated'),
    (0, swagger_1.ApiOperation)({
        summary: 'Purchase lines with more sold from them than was bought.',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "overAllocated", null);
__decorate([
    (0, common_1.Get)('unresolved-lots'),
    (0, swagger_1.ApiOperation)({ summary: 'Sales whose purchase line is not loaded.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "unresolvedLots", null);
__decorate([
    (0, common_1.Get)('duplicates'),
    (0, swagger_1.ApiOperation)({ summary: 'Trades that repeat an earlier reference.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "duplicates", null);
__decorate([
    (0, common_1.Get)('aliases'),
    (0, swagger_1.ApiOperation)({
        summary: 'Product names to confirm, to decide, or settled by rule, most used first.',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "aliases", null);
__decorate([
    (0, common_1.Get)('aliases/:id/usage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Up to five example rows of where a product name is used (no customer or vendor names).',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "aliasUsage", null);
__decorate([
    (0, common_1.Post)('aliases/:id/per-metal'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Give the unresolved sales and purchases of a name, per metal, their product. The name stays undecided.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.ApplyPerMetalRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "applyPerMetal", null);
__decorate([
    (0, common_1.Post)('product-names/settle'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Rescan product names with the rules (dryRun only counts). Names a person decided are never touched.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SettleNamesRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "settleNames", null);
__decorate([
    (0, common_1.Post)('product-names/relink'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: "Give existing rows their product from the settled names (dryRun only counts). Fills empty fields; correct also follows a person's decisions. Never clears a product.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RelinkRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "relink", null);
__decorate([
    (0, common_1.Post)('product-names/accept'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Accept the suggestions for these product names, each only if it is still the one the person saw.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.NameSuggestionAcceptRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "acceptNames", null);
__decorate([
    (0, common_1.Post)('product-names/reject'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Turn down the suggestions for these product names.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.NameSuggestionDecisionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "rejectNames", null);
__decorate([
    (0, common_1.Get)('sales-products'),
    (0, swagger_1.ApiOperation)({ summary: 'The specific sales products.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "salesProducts", null);
__decorate([
    (0, common_1.Get)('pricing-products'),
    (0, swagger_1.ApiOperation)({
        summary: 'The pricing products a sales product can be tied to.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "pricingProducts", null);
__decorate([
    (0, common_1.Post)('sales-products'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Add a sales product.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateSalesProductRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "createSalesProduct", null);
__decorate([
    (0, common_1.Get)('sales-products/from-bc'),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview the specific products the BC items would become.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "bcSalesProductsPreview", null);
__decorate([
    (0, common_1.Post)('sales-products/from-bc'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Create specific products from the BC items that are ready.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BcSalesProductsApplyRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "bcSalesProductsApply", null);
__decorate([
    (0, common_1.Post)('aliases/:id/map'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Tie a product text to a sales product.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.MapAliasRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "mapAlias", null);
exports.ReviewController = ReviewController = __decorate([
    (0, swagger_1.ApiTags)('review'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [review_service_1.ReviewService,
        bc_sales_products_service_1.BcSalesProductsService,
        product_names_service_1.ProductNamesService,
        product_relink_service_1.ProductRelinkService])
], ReviewController);
//# sourceMappingURL=review.controller.js.map