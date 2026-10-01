import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    Logger,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { AskStreamEvent } from '@goldilocks/shared-types';
import {
    JwtAuthGuard,
    type RequestWithUser,
} from '../../common/guards/jwt-auth.guard';
import {
    AiStatusDto,
    AskRequestDto,
    AskResponseDto,
} from '../../common/dto/dtos';
import { AskService, type Actor } from './ask.service';

const actorOf = (request: RequestWithUser): Actor => ({
    id: request.user.id,
    email: request.user.email,
});

/** If the browser goes away before the answer is ready, stop the model call: it still bills tokens. */
function cancelOnClose(response: Response): AbortSignal {
    const cancel = new AbortController();
    response.on('close', () => {
        if (!response.writableFinished) cancel.abort();
    });
    return cancel.signal;
}

// Open to every signed-in user. The per-user daily and per-minute limits, the cost log and the
// company-wide daily spend breaker (docs/AI-AGENT-PLAN.md, phase 2) are what bound the cost.
@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
    private readonly logger = new Logger(AiController.name);

    constructor(private readonly ask: AskService) {}

    @Get('status')
    @ApiOperation({
        summary:
            'Whether the assistant is switched on, and which model it uses',
    })
    @ApiResponse({ status: 200, type: AiStatusDto })
    getStatus(): AiStatusDto {
        return this.ask.status();
    }

    @Post('ask')
    @ApiOperation({
        summary: 'Ask the assistant a question',
        description:
            'Answers only from approved SOPs and cites the sections it used. One question in, one answer out — no conversation history. Subject to a per-user rate and daily allowance (429) and a company-wide daily spend limit (503).',
    })
    @ApiResponse({ status: 201, type: AskResponseDto })
    async askQuestion(
        @Body() body: AskRequestDto,
        @Req() request: RequestWithUser,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AskResponseDto> {
        return this.ask.ask(body, actorOf(request), cancelOnClose(response));
    }

    @Post('ask/stream')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Ask the assistant, streaming the answer as it is written',
        description:
            'Server-sent events (AskStreamEvent): `delta` pieces, then `done` with the validated answer, which replaces what was streamed. Problems found before the first byte (limits, switched off, out of credit) are ordinary HTTP errors; later ones arrive as an `error` event. Read it with fetch — EventSource cannot POST or send the Authorization header.',
    })
    async askQuestionStream(
        @Body() body: AskRequestDto,
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ): Promise<void> {
        const events = this.ask
            .askStream(body, actorOf(request), cancelOnClose(response))
            [Symbol.asyncIterator]();

        // Nothing is written until the first event is ready, so a refusal up front (quota, off,
        // paused, out of credit) is a normal HTTP error that the app-wide filter formats, not a stream.
        let step = await events.next();

        response.status(200).set({
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no', // stop proxies (nginx, Railway's edge) from holding the stream back
        });
        response.flushHeaders();

        try {
            while (!step.done) {
                this.send(response, step.value);
                step = await events.next();
            }
        } catch (error) {
            this.send(response, this.errorEvent(error));
        } finally {
            await events.return?.(undefined);
            response.end();
        }
    }

    private send(response: Response, event: AskStreamEvent): void {
        response.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    private errorEvent(error: unknown): AskStreamEvent {
        if (error instanceof HttpException) {
            return {
                type: 'error',
                status: error.getStatus(),
                message: error.message,
            };
        }
        this.logger.error(
            `Streaming answer failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
        );
        return {
            type: 'error',
            status: 500,
            message: 'The assistant failed unexpectedly.',
        };
    }
}
