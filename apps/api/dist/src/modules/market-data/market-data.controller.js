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
exports.MarketDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const market_data_service_1 = require("./market-data.service");
const dtos_1 = require("../../common/dto/dtos");
const date_utils_1 = require("../../common/utils/date.utils");
let MarketDataController = class MarketDataController {
    marketDataService;
    constructor(marketDataService) {
        this.marketDataService = marketDataService;
    }
    async getMarketData() {
        return this.marketDataService.getMarketData();
    }
    async recalculate(overrides) {
        return this.marketDataService.recalculate(overrides);
    }
    async refresh() {
        return this.marketDataService.refresh();
    }
    async debugHistoricClose(date) {
        const targetDate = date ?? (0, date_utils_1.getYesterday)();
        await this.marketDataService.fetchHistoricClose(targetDate);
        return {
            success: true,
            date: targetDate,
        };
    }
    async seedHistory() {
        await this.marketDataService.seedHistoricPrices();
    }
};
exports.MarketDataController = MarketDataController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get application market data',
        description: 'Loads spot prices, historic spot prices (for charting), and products priced against current spot.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Market data retrieved successfully',
        type: dtos_1.MarketDataResponseDto,
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "getMarketData", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Recalculate product prices with manual spot overrides',
        description: 'Lets the UI preview "what if" pricing using user-supplied spot prices ' +
            'for one or more metals. Falls back to live spot prices for any metal not ' +
            'overridden. Does not persist anything.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Products recalculated successfully',
        type: [dtos_1.ProductResponseDto],
    }),
    (0, common_1.Post)('recalculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "recalculate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh market data',
        description: 'Fetches latest EUR and GBP metal spot prices, updates cache/database, ' +
            'and returns the refreshed market snapshot.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Market data refreshed successfully',
        type: dtos_1.MarketDataResponseDto,
    }),
    (0, common_1.Post)('refresh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Debug: fetch one day\'s historic close',
        description: 'Fetches and stores the historic close for a single date (defaults to yesterday). For manual/debug use, not the regular seeding flow.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historic close fetched successfully' }),
    (0, common_1.Get)('historic-close/debug'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "debugHistoricClose", null);
__decorate([
    (0, common_1.Post)('seed-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Seed historic metal prices',
        description: 'Fetches the last year of historic metal prices from MetalPriceAPI and stores them in the database.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Historic prices seeded successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketDataController.prototype, "seedHistory", null);
exports.MarketDataController = MarketDataController = __decorate([
    (0, swagger_1.ApiTags)('market-data'),
    (0, common_1.Controller)('market-data'),
    __metadata("design:paramtypes", [market_data_service_1.MarketDataService])
], MarketDataController);
//# sourceMappingURL=market-data.controller.js.map