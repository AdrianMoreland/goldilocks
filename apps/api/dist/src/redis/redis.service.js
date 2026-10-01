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
const INCREMENT_SCRIPT = `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count`;
const DECREMENT_SCRIPT = `local count = tonumber(redis.call('GET', KEYS[1]))
if count and count > 0 then return redis.call('DECR', KEYS[1]) end
return 0`;
let RedisService = RedisService_1 = class RedisService {
    config;
    logger = new common_1.Logger(RedisService_1.name);
    client = null;
    isConnected = false;
    constructor(config) {
        this.config = config;
    }
    onModuleInit() {
        const url = this.config.get('REDIS_URL');
        if (!url) {
            this.logger.warn('REDIS_URL not set → running without Redis');
            return;
        }
        this.client = new ioredis_1.default(url, {
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => Math.min(times * 200, 5000),
        });
        this.client.on('ready', () => {
            this.isConnected = true;
            this.logger.log('✅ Redis connected');
        });
        this.client.on('close', () => {
            this.isConnected = false;
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
    async increment(key, ttlSeconds) {
        if (!this.client || !this.isConnected)
            return null;
        try {
            return Number(await this.client.eval(INCREMENT_SCRIPT, 1, key, ttlSeconds));
        }
        catch (err) {
            this.logger.warn(`Redis INCR failed: ${key}`);
            return null;
        }
    }
    async decrement(key) {
        if (!this.client || !this.isConnected)
            return;
        try {
            await this.client.eval(DECREMENT_SCRIPT, 1, key);
        }
        catch (err) {
            this.logger.warn(`Redis DECR failed: ${key}`);
        }
    }
    async pushCapped(key, value, maxLength) {
        if (!this.client || !this.isConnected)
            return false;
        try {
            await this.client
                .multi()
                .lpush(key, JSON.stringify(value))
                .ltrim(key, 0, maxLength - 1)
                .exec();
            return true;
        }
        catch (err) {
            this.logger.warn(`Redis LPUSH failed: ${key}`);
            return false;
        }
    }
    async listRange(key, count) {
        if (!this.client || !this.isConnected)
            return null;
        try {
            const rows = await this.client.lrange(key, 0, count - 1);
            return rows.map((row) => JSON.parse(row));
        }
        catch (err) {
            this.logger.warn(`Redis LRANGE failed: ${key}`);
            return null;
        }
    }
    async hashIncrementMany(key, fields, ttlSeconds) {
        if (!this.client || !this.isConnected)
            return;
        try {
            const tx = this.client.multi();
            for (const [field, by] of Object.entries(fields)) {
                tx.hincrbyfloat(key, field, by);
            }
            await tx.expire(key, ttlSeconds).exec();
        }
        catch {
            this.logger.warn(`Redis HINCRBY failed: ${key}`);
        }
    }
    async hashGetAllNumbers(key) {
        if (!this.client || !this.isConnected)
            return null;
        try {
            const raw = await this.client.hgetall(key);
            return Object.fromEntries(Object.entries(raw).map(([field, value]) => [
                field,
                Number(value),
            ]));
        }
        catch {
            this.logger.warn(`Redis HGETALL failed: ${key}`);
            return null;
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