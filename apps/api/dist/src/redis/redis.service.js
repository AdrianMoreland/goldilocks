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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = RedisService_1 = class RedisService {
    config;
    logger = new common_1.Logger(RedisService_1.name);
    client = null;
    isConnected = false;
    constructor(config) {
        this.config = config;
    }
    async onModuleInit() {
        const url = this.config.get('REDIS_URL');
        if (!url) {
            this.logger.warn('REDIS_URL not set → running without Redis');
            return;
        }
        this.client = new ioredis_1.default(url, {
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => {
                if (times > 3) {
                    this.logger.error('Redis retry limit reached');
                    return null;
                }
                return Math.min(times * 100, 2000);
            },
        });
        this.client.on('connect', () => {
            this.isConnected = true;
            this.logger.log('✅ Redis connected');
        });
        this.client.on('error', (err) => {
            this.isConnected = false;
            this.logger.warn(`Redis error: ${err.message}`);
        });
    }
    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
        }
    }
    async get(key) {
        if (!this.client || !this.isConnected)
            return null;
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (err) {
            this.logger.warn(`Redis GET failed: ${key}`);
            return null;
        }
    }
    async set(key, value, ttl = 3600) {
        if (!this.client || !this.isConnected)
            return;
        try {
            await this.client.set(key, JSON.stringify(value), 'EX', ttl);
        }
        catch (err) {
            this.logger.warn(`Redis SET failed: ${key}`);
        }
    }
    async del(...keys) {
        if (!this.client || !this.isConnected || keys.length === 0)
            return;
        try {
            await this.client.del(...keys);
        }
        catch (err) {
            this.logger.warn(`Redis DEL failed: ${keys.join(', ')}`);
        }
    }
    isHealthy() {
        return this.isConnected;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map