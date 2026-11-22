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
var ResilientMetalPriceApi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResilientMetalPriceApi = void 0;
const common_1 = require("@nestjs/common");
const circuit_breaker_1 = require("../../common/resilience/circuit-breaker");
const metal_price_api_client_1 = require("./metal-price-api.client");
const REQUEST_TIMEOUT_MS = 10_000;
const FAILURE_THRESHOLD = 3;
const COOLDOWN_MS = 60_000;
let ResilientMetalPriceApi = ResilientMetalPriceApi_1 = class ResilientMetalPriceApi {
    client;
    logger = new common_1.Logger(ResilientMetalPriceApi_1.name);
    breaker = new circuit_breaker_1.CircuitBreaker('The metal price API', {
        failureThreshold: FAILURE_THRESHOLD,
        cooldownMs: COOLDOWN_MS,
        onStateChange: (state) => this.logger.warn(`Metal price API circuit is now ${state}`),
    });
    constructor(client) {
        this.client = client;
    }
    livePrices() {
        return this.guard('live prices', () => this.client.livePrices());
    }
    timeframePrices(startDate, endDate, currency) {
        return this.guard('timeframe prices', () => this.client.timeframePrices(startDate, endDate, currency), false);
    }
    ohlcPrices(date, currency, metal) {
        return this.guard('OHLC prices', () => this.client.ohlcPrices(date, currency, metal), false);
    }
    guard(what, call, softFailureCounts = true) {
        return this.breaker.run(() => (0, circuit_breaker_1.withTimeout)(call(), REQUEST_TIMEOUT_MS, `The ${what} request`), (result) => softFailureCounts && result.success === false);
    }
};
exports.ResilientMetalPriceApi = ResilientMetalPriceApi;
exports.ResilientMetalPriceApi = ResilientMetalPriceApi = ResilientMetalPriceApi_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(metal_price_api_client_1.MetalPriceApiClient)),
    __metadata("design:paramtypes", [metal_price_api_client_1.MetalPriceApiClient])
], ResilientMetalPriceApi);
//# sourceMappingURL=resilient-metal-price-api.js.map