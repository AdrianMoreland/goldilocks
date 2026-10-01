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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalPriceApiClient = void 0;
const metalpriceapi_ts_1 = __importDefault(require("metalpriceapi-ts"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MetalPriceApiClient = class MetalPriceApiClient {
    api;
    metals = ['XAU', 'XAG', 'XPT', 'XPD'];
    constructor(config) {
        this.api = new metalpriceapi_ts_1.default(config.get('METALPRICE_API_KEY'));
    }
    async livePrices() {
        const { data } = await this.api.fetchLive('EUR', [
            'GBP',
            ...this.metals,
        ]);
        return data;
    }
    async timeframePrices(startDate, endDate, currency = 'EUR') {
        const { data } = await this.api.timeframe(startDate, endDate, currency, this.metals, 'troy_oz');
        return data;
    }
    async ohlcPrices(date, currency = 'EUR', metal = 'XAU') {
        const { data } = await this.api.ohlc(currency, metal, date, 'troy_oz');
        return data;
    }
};
exports.MetalPriceApiClient = MetalPriceApiClient;
exports.MetalPriceApiClient = MetalPriceApiClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MetalPriceApiClient);
//# sourceMappingURL=metal-price-api.client.js.map