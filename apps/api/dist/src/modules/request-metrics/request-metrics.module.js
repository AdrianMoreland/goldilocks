"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMetricsModule = void 0;
const common_1 = require("@nestjs/common");
const redis_module_1 = require("../../infrastructure/redis/redis.module");
const request_metrics_service_1 = require("./request-metrics.service");
let RequestMetricsModule = class RequestMetricsModule {
};
exports.RequestMetricsModule = RequestMetricsModule;
exports.RequestMetricsModule = RequestMetricsModule = __decorate([
    (0, common_1.Module)({
        imports: [redis_module_1.RedisModule],
        providers: [request_metrics_service_1.RequestMetricsService],
        exports: [request_metrics_service_1.RequestMetricsService],
    })
], RequestMetricsModule);
//# sourceMappingURL=request-metrics.module.js.map