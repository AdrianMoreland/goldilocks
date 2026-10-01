import type { Response } from 'express';
import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { AiStatusDto, AskRequestDto, AskResponseDto } from '../../common/dto/dtos';
import { AskService } from './ask.service';
export declare class AiController {
    private readonly ask;
    private readonly logger;
    constructor(ask: AskService);
    getStatus(): AiStatusDto;
    askQuestion(body: AskRequestDto, request: RequestWithUser, response: Response): Promise<AskResponseDto>;
    askQuestionStream(body: AskRequestDto, request: RequestWithUser, response: Response): Promise<void>;
    private send;
    private errorEvent;
}
//# sourceMappingURL=ai.controller.d.ts.map