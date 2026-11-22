import type { Response } from 'express';
import type { AskStreamEvent } from '@goldilocks/shared-types';
export declare class AskStreamResponder {
    private readonly logger;
    pipe(stream: AsyncIterable<AskStreamEvent>, response: Response): Promise<void>;
    private send;
    private errorEvent;
}
//# sourceMappingURL=ask-stream.responder.d.ts.map