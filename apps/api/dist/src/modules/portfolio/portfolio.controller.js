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
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const portfolio_service_1 = require("./portfolio.service");
const dtos_1 = require("../../common/dto/dtos");
let PortfolioController = class PortfolioController {
    portfolioService;
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    async calculateProfitAnalysis(body) {
        return this.portfolioService.calculateProfitAnalysis(body);
    }
    async buildPortfolio(body) {
        return this.portfolioService.buildPortfolio(body);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Post)('profit-analysis'),
    (0, swagger_1.ApiOperation)({
        summary: 'Portfolio P/L — solve purchase spot/premium/price and profit if sold back today',
        description: 'Exactly one of purchaseSpot/purchasePremium/purchasePrice is treated as missing (see missingField) ' +
            'and solved from the other two, then compared against a live buyback to compute profit and the spot ' +
            'move needed to hit a target profit.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.ProfitAnalysisResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ProfitAnalysisRequestDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "calculateProfitAnalysis", null);
__decorate([
    (0, common_1.Post)('build'),
    (0, swagger_1.ApiOperation)({
        summary: 'Portfolio Builder — build and score Maximum Value / Balanced / Maximum Flexibility portfolios',
        description: 'Prices every in-stock product of the requested metal, classifies it as a bar or coin by name, and ' +
            'builds three candidate portfolios for the given budget, optionally weighting one product as a priority.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.PortfolioBuildResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PortfolioBuildRequestDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "buildPortfolio", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('portfolio'),
    (0, common_1.Controller)('portfolio'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map