import {
    Body,
    Controller,
    Get,
    HttpCode,
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
import { AskStreamResponder } from './ask-stream.responder';

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
    constructor(
        private readonly ask: AskService,
        private readonly streams: AskStreamResponder,
    ) {}

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
        return this.streams.pipe(
            this.ask.askStream(body, actorOf(request), cancelOnClose(response)),
            response,
        );
    }
}
