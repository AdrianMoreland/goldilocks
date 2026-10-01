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
var AnswerCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerCacheService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const DAY_MS = 24 * 60 * 60 * 1000;
let AnswerCacheService = AnswerCacheService_1 = class AnswerCacheService {
    prisma;
    logger = new common_1.Logger(AnswerCacheService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(questionKey, corpusHash, now = new Date()) {
        try {
            const row = await this.prisma.aiAnswerCache.findUnique({
                where: { questionKey_corpusHash: { questionKey, corpusHash } },
            });
            if (!row || row.expiresAt <= now)
                return null;
            await this.prisma.aiAnswerCache.update({
                where: { id: row.id },
                data: { hits: { increment: 1 } },
            });
            return {
                answer: row.answer,
                status: row.status,
                citations: row.citations,
                model: row.model,
            };
        }
        catch (error) {
            this.warn('read', error);
            return null;
        }
    }
    async put(questionKey, corpusHash, value, ttlDays, now = new Date()) {
        const data = {
            answer: value.answer,
            status: value.status,
            citations: value.citations,
            model: value.model,
            expiresAt: new Date(now.getTime() + ttlDays * DAY_MS),
        };
        try {
            await this.prisma.aiAnswerCache.upsert({
                where: { questionKey_corpusHash: { questionKey, corpusHash } },
                create: { questionKey, corpusHash, ...data },
                update: { ...data, hits: 0, createdAt: now },
            });
        }
        catch (error) {
            this.warn('write', error);
        }
    }
    async purgeExpired(now = new Date()) {
        const { count } = await this.prisma.aiAnswerCache.deleteMany({
            where: { expiresAt: { lt: now } },
        });
        return count;
    }
    warn(action, error) {
        this.logger.warn(`Answer cache ${action} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.AnswerCacheService = AnswerCacheService;
exports.AnswerCacheService = AnswerCacheService = AnswerCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnswerCacheService);
//# sourceMappingURL=answer-cache.service.js.map