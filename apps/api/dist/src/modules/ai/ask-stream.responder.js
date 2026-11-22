"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AskStreamResponder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskStreamResponder = void 0;
const common_1 = require("@nestjs/common");
let AskStreamResponder = AskStreamResponder_1 = class AskStreamResponder {
    logger = new common_1.Logger(AskStreamResponder_1.name);
    async pipe(stream, response) {
        const events = stream[Symbol.asyncIterator]();
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
exports.AskStreamResponder = AskStreamResponder;
exports.AskStreamResponder = AskStreamResponder = AskStreamResponder_1 = __decorate([
    (0, common_1.Injectable)()
], AskStreamResponder);
//# sourceMappingURL=ask-stream.responder.js.map