"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalPriceApiModule = void 0;
const common_1 = require("@nestjs/common");
const metal_price_api_client_1 = require("./metal-price-api.client");
const metal_price_api_port_1 = require("./metal-price-api.port");
let MetalPriceApiModule = class MetalPriceApiModule {
};
exports.MetalPriceApiModule = MetalPriceApiModule;
exports.MetalPriceApiModule = MetalPriceApiModule = __decorate([
    (0, common_1.Module)({
        providers: [{ provide: metal_price_api_port_1.METAL_PRICE_API, useClass: metal_price_api_client_1.MetalPriceApiClient }],
        exports: [metal_price_api_port_1.METAL_PRICE_API],
    })
], MetalPriceApiModule);
//# sourceMappingURL=metal-price-api.module.js.map