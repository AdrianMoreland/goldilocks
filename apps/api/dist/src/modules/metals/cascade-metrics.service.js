"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeMetricsService = void 0;
const common_1 = require("@nestjs/common");
let CascadeMetricsService = class CascadeMetricsService {
    cacheHits = 0;
    cacheMisses = 0;
    recordCacheHit() {
        this.cacheHits += 1;
    }
    recordCacheMiss() {
        this.cacheMisses += 1;
    }
    getCacheHitRatio() {
        const total = this.cacheHits + this.cacheMisses;
        return total === 0 ? 1 : this.cacheHits / total;
    }
};
exports.CascadeMetricsService = CascadeMetricsService;
exports.CascadeMetricsService = CascadeMetricsService = __decorate([
    (0, common_1.Injectable)()
], CascadeMetricsService);
//# sourceMappingURL=cascade-metrics.service.js.map