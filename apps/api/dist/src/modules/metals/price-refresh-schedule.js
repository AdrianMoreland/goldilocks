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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceRefreshSchedule = exports.PRICE_REFRESH_JOB = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
exports.PRICE_REFRESH_JOB = 'updateMetals';
let PriceRefreshSchedule = class PriceRefreshSchedule {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    isRunning() {
        try {
            return this.registry.getCronJob(exports.PRICE_REFRESH_JOB).isActive;
        }
        catch {
            return false;
        }
    }
};
exports.PriceRefreshSchedule = PriceRefreshSchedule;
exports.PriceRefreshSchedule = PriceRefreshSchedule = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry])
], PriceRefreshSchedule);
//# sourceMappingURL=price-refresh-schedule.js.map