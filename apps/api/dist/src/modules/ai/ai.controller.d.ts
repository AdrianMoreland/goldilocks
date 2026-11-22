import type { Response } from 'express';
import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { AiFeedbackRequestDto, AiStatusDto, AskRequestDto, AskResponseDto } from '../../common/dto/dtos';
import { AskService } from './ask.service';
import { QuestionLogService } from './question-log.service';
import { AskStreamResponder } from './ask-stream.responder';
export declare class AiController {
    private readonly ask;
    private readonly streams;
    private readonly questionLog;
    constructor(ask: AskService, streams: AskStreamResponder, questionLog: QuestionLogService);
    rate(id: number, body: AiFeedbackRequestDto, request: RequestWithUser): Promise<void>;
    getStatus(): AiStatusDto;
    askQuestion(body: AskRequestDto, request: RequestWithUser, response: Response): Promise<AskResponseDto>;
    askQuestionStream(body: AskRequestDto, request: RequestWithUser, response: Response): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map