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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const dtos_1 = require("../../common/dto/dtos");
const ask_service_1 = require("./ask.service");
const actorOf = (request) => ({
    id: request.user.id,
    email: request.user.email,
});
function cancelOnClose(response) {
    const cancel = new AbortController();
    response.on('close', () => {
        if (!response.writableFinished)
            cancel.abort();
    });
    return cancel.signal;
}
let AiController = AiController_1 = class AiController {
    ask;
    logger = new common_1.Logger(AiController_1.name);
    constructor(ask) {
        this.ask = ask;
    }
    getStatus() {
        return this.ask.status();
    }
    async askQuestion(body, request, response) {
        return this.ask.ask(body, actorOf(request), cancelOnClose(response));
    }
    async askQuestionStream(body, request, response) {
        const events = this.ask
            .askStream(body, actorOf(request), cancelOnClose(response))[Symbol.asyncIterator]();
        let step = await events.next();
        response.status(200).set({
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        response.flushHeaders();
        try {
            while (!step.done) {
                this.send(response, step.value);
                step = await events.next();
            }
        }
        catch (error) {
            this.send(response, this.errorEvent(error));
        }
        finally {
            await events.return?.(undefined);
            response.end();
        }
    }
    send(response, event) {
        response.write(`data: ${JSON.stringify(event)}\n\n`);
    }
    errorEvent(error) {
        if (error instanceof common_1.HttpException) {
            return {
                type: 'error',
                status: error.getStatus(),
                message: error.message,
            };
        }
        this.logger.error(`Streaming answer failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`);
        return {
            type: 'error',
            status: 500,
            message: 'The assistant failed unexpectedly.',
        };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Whether the assistant is switched on, and which model it uses',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dtos_1.AiStatusDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", dtos_1.AiStatusDto)
], AiController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('ask'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ask the assistant a question',
        description: 'Answers only from approved SOPs and cites the sections it used. One question in, one answer out — no conversation history. Subject to a per-user rate and daily allowance (429) and a company-wide daily spend limit (503).',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: dtos_1.AskResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AskRequestDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "askQuestion", null);
__decorate([
    (0, common_1.Post)('ask/stream'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Ask the assistant, streaming the answer as it is written',
        description: 'Server-sent events (AskStreamEvent): `delta` pieces, then `done` with the validated answer, which replaces what was streamed. Problems found before the first byte (limits, switched off, out of credit) are ordinary HTTP errors; later ones arrive as an `error` event. Read it with fetch — EventSource cannot POST or send the Authorization header.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.AskRequestDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "askQuestionStream", null);
exports.AiController = AiController = AiController_1 = __decorate([
    (0, swagger_1.ApiTags)('ai'),
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ask_service_1.AskService])
], AiController);
//# sourceMappingURL=ai.controller.js.map