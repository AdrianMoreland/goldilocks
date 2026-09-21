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
exports.TradeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const trade_service_1 = require("./trade.service");
const dtos_1 = require("../../common/dto/dtos");
let TradeController = class TradeController {
    tradeService;
    constructor(tradeService) {
        this.tradeService = tradeService;
    }
    async getBootstrap(metal) {
        return this.tradeService.getBootstrap(metal);
    }
    async calculateCart(body) {
        return this.tradeService.calculateCart(body);
    }
    async calculateMelt(body) {
        return this.tradeService.calculateMelt(body);
    }
};
exports.TradeController = TradeController;
__decorate([
    (0, common_1.Get)(':metal/bootstrap'),
    (0, swagger_1.ApiParam)({ name: 'metal', enum: ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] }),
    (0, swagger_1.ApiOperation)({
        summary: 'Load Trade tab bootstrap data for a metal',
        description: 'Live spot price, slider bounds, and the tradeable product list for the given metal mode.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.TradeBootstrapResponseDto }),
    __param(0, (0, common_1.Param)('metal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TradeController.prototype, "getBootstrap", null);
__decorate([
    (0, common_1.Post)('cart'),
    (0, swagger_1.ApiOperation)({
        summary: 'Price a Trade tab buy/sell cart',
        description: 'Prices every item in the cart against a shared spot price (live or a custom override), applying each item\'s own premium/discount.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.TradeCartResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.TradeCartRequestDto]),
    __metadata("design:returntype", Promise)
], TradeController.prototype, "calculateCart", null);
__decorate([
    (0, common_1.Post)('melt'),
    (0, swagger_1.ApiOperation)({
        summary: 'Calculate melt/scrap value',
        description: 'Gold and silver only — Merrion Gold does not melt-buy platinum/palladium.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.MeltCalculatorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.MeltCalculatorRequestDto]),
    __metadata("design:returntype", Promise)
], TradeController.prototype, "calculateMelt", null);
exports.TradeController = TradeController = __decorate([
    (0, swagger_1.ApiTags)('trade'),
    (0, common_1.Controller)('trade'),
    __metadata("design:paramtypes", [trade_service_1.TradeService])
], TradeController);
//# sourceMappingURL=trade.controller.js.map