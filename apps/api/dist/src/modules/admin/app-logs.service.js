"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogsService = void 0;
const common_1 = require("@nestjs/common");
const log_buffer_1 = require("./log-buffer");
const LEVEL_ORDER = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
];
let AppLogsService = class AppLogsService {
    search({ limit, level, q }) {
        const min = LEVEL_ORDER.indexOf(level);
        const term = q?.trim().toLowerCase();
        const entries = log_buffer_1.logBuffer
            .recent(log_buffer_1.logBuffer.capacity)
            .filter((e) => LEVEL_ORDER.indexOf(e.level) >= min)
            .filter((e) => !term ||
            [e.message, e.context, e.url, e.method].some((v) => v?.toLowerCase().includes(term)))
            .slice(0, limit);
        return { entries, capacity: log_buffer_1.logBuffer.capacity };
    }
};
exports.AppLogsService = AppLogsService;
exports.AppLogsService = AppLogsService = __decorate([
    (0, common_1.Injectable)()
], AppLogsService);
//# sourceMappingURL=app-logs.service.js.map