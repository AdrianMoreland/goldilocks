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
var QuestionLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let QuestionLogService = QuestionLogService_1 = class QuestionLogService {
    prisma;
    logger = new common_1.Logger(QuestionLogService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async record(entry) {
        try {
            const row = await this.prisma.aiQuestionLog.create({
                data: entry,
                select: { id: true },
            });
            return row.id;
        }
        catch (error) {
            this.logger.warn(`Could not write the question log: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
    async rate(questionId, userId, helpful) {
        const question = await this.prisma.aiQuestionLog.findFirst({
            where: { id: questionId, userId },
            select: { id: true },
        });
        if (!question)
            return false;
        await this.prisma.aiFeedback.upsert({
            where: { questionId_userId: { questionId, userId } },
            create: { questionId, userId, helpful },
            update: { helpful },
        });
        return true;
    }
    async spentSince(start) {
        const total = await this.prisma.aiQuestionLog.aggregate({
            _sum: { costMicros: true },
            where: { createdAt: { gte: start } },
        });
        return total._sum.costMicros ?? 0;
    }
    async purgeOlderThan(cutoff) {
        const { count } = await this.prisma.aiQuestionLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
        return count;
    }
};
exports.QuestionLogService = QuestionLogService;
exports.QuestionLogService = QuestionLogService = QuestionLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionLogService);
//# sourceMappingURL=question-log.service.js.map