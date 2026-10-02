import { HttpException, Injectable, Logger } from '@nestjs/common';
import type { Response } from 'express';
import type { AskStreamEvent } from '@goldilocks/shared-types';

/** Writes the assistant's answer to the browser as server-sent events (AskStreamEvent). */
@Injectable()
export class AskStreamResponder {
    private readonly logger = new Logger(AskStreamResponder.name);

    async pipe(
        stream: AsyncIterable<AskStreamEvent>,
        response: Response,
    ): Promise<void> {
        const events = stream[Symbol.asyncIterator]();

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
