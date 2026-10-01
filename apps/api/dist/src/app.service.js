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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./infrastructure/prisma/prisma.service");
const redis_service_1 = require("./redis/redis.service");
const fetch_attempt_service_1 = require("./modules/metals/fetch-attempt.service");
let AppService = class AppService {
    prisma;
    redis;
    fetchAttempts;
    constructor(prisma, redis, fetchAttempts) {
        this.prisma = prisma;
        this.redis = redis;
        this.fetchAttempts = fetchAttempts;
    }
    getStatus() {
        return {
            name: 'Merrion Gold API',
            status: 'ok',
        };
    }
    async getHealth() {
        const db = await this.prisma.$queryRaw `SELECT 1`
            .then(() => true)
            .catch(() => false);
        const redis = this.redis.isHealthy();
        const lastSuccessfulMetalsApiCall = await this.fetchAttempts
            .getLastSuccessfulAt()
            .catch(() => null);
        return {
            status: db && redis ? 'ok' : 'degraded',
            db: db ? 'ok' : 'unreachable',
            redis: redis ? 'ok' : 'unreachable',
            lastSuccessfulMetalsApiCall,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        fetch_attempt_service_1.FetchAttemptService])
], AppService);
//# sourceMappingURL=app.service.js.map