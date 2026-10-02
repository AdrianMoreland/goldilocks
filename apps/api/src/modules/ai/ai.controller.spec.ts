import { EventEmitter } from 'node:events';
import {
    HttpException,
    Logger,
    ServiceUnavailableException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { AskResponse } from '@goldilocks/shared-types';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { AiController } from './ai.controller';
import { AskStreamResponder } from './ask-stream.responder';
import type { AskEvent, AskService } from './ask.service';

const RESPONSE: AskResponse = {
    answer: 'Yes [[pricing#vat]].',
    mode: 'procedures',
    notes: null,
    warnings: [],
    spotNote: null,
    toolsUsed: [],
    status: 'answered',
    citations: [],
    model: 'm',
    usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1 },
    latencyMs: 5,
    corpus: { documents: 1, hash: 'abc' },
    cached: false,
};

const request = {
    user: { id: 'user-1', email: 'boss@example.com' },
} as unknown as RequestWithUser;

/** An Express response reduced to what the controller touches, recording what is written and in what order. */
function fakeResponse() {
    const emitter = new EventEmitter();
    const order: string[] = [];
    const written: string[] = [];
    const response = Object.assign(emitter, {
        writableFinished: false,
        status: jest.fn(function (this: unknown) {
            order.push('status');
            return this;
        }),
        set: jest.fn(function (this: unknown) {
            order.push('set');
            return this;
        }),
        flushHeaders: jest.fn(() => void order.push('flushHeaders')),
        write: jest.fn((chunk: string) => {
            order.push('write');
            written.push(chunk);
            return true;
        }),
        end: jest.fn(() => void order.push('end')),
    });
    return {
        response: response as unknown as Response,
        raw: response,
        order,
        written,
    };
}

function build(events: () => AsyncGenerator<AskEvent>) {
    const askStream = jest.fn(events);
    const controller = new AiController(
        { askStream } as unknown as AskService,
        new AskStreamResponder(),
    );
    return { controller, askStream };
}

const parse = (written: string[]) =>
    written.map(
        (chunk) => JSON.parse(chunk.replace(/^data: /, '').trim()) as unknown,
    );

describe('AiController.askQuestionStream', () => {
    afterEach(() => jest.restoreAllMocks());

    it('writes each event as server-sent data, with stream headers, then ends', async () => {
        const { controller, askStream } = build(async function* () {
            await Promise.resolve();
            yield { type: 'delta', text: 'Yes ' };
            yield { type: 'done', response: RESPONSE };
        });
        const { response, raw, written } = fakeResponse();

        await controller.askQuestionStream(
            { question: 'VAT?', mode: 'procedures' as const },
            request,
            response,
        );

        expect(askStream).toHaveBeenCalledWith(
            { question: 'VAT?', mode: 'procedures' },
            { id: 'user-1', email: 'boss@example.com' },
            expect.any(AbortSignal),
        );
        expect(raw.set).toHaveBeenCalledWith(
            expect.objectContaining({
                'Content-Type': expect.stringContaining(
                    'text/event-stream',
                ) as string,
                'X-Accel-Buffering': 'no',
            }),
        );
        expect(
            written.every(
                (chunk) => chunk.startsWith('data: ') && chunk.endsWith('\n\n'),
            ),
        ).toBe(true);
        expect(parse(written)).toEqual([
            { type: 'delta', text: 'Yes ' },
            { type: 'done', response: RESPONSE },
        ]);
        expect(raw.end).toHaveBeenCalledTimes(1);
    });

    it('lets a failure before the first event be an ordinary HTTP error: nothing is written', async () => {
        const { controller } = build(async function* () {
            await Promise.resolve();
            throw new HttpException(
                'You already have a question in progress.',
                429,
            );
            yield { type: 'delta', text: 'never' };
        });
        const { response, raw, written } = fakeResponse();

        await expect(
            controller.askQuestionStream(
                { question: 'VAT?', mode: 'procedures' as const },
                request,
                response,
            ),
        ).rejects.toMatchObject({ status: 429 });

        expect(written).toHaveLength(0);
        expect(raw.status).not.toHaveBeenCalled();
        expect(raw.flushHeaders).not.toHaveBeenCalled();
        expect(raw.end).not.toHaveBeenCalled();
    });

    it('reports a failure after the stream has started as an error event, then ends', async () => {
        const { controller } = build(async function* () {
            await Promise.resolve();
            yield { type: 'delta', text: 'Yes ' };
            throw new ServiceUnavailableException(
                'The assistant is busy or unreachable right now.',
            );
        });
        const { response, raw, written } = fakeResponse();

        await controller.askQuestionStream(
            { question: 'VAT?', mode: 'procedures' as const },
            request,
            response,
        );

        expect(parse(written)).toEqual([
            { type: 'delta', text: 'Yes ' },
            {
                type: 'error',
                status: 503,
                message: 'The assistant is busy or unreachable right now.',
            },
        ]);
        expect(raw.end).toHaveBeenCalledTimes(1);
    });

    it('hides the detail of an unexpected failure from the reader, and logs it', async () => {
        const error = jest
            .spyOn(Logger.prototype, 'error')
            .mockImplementation(() => undefined);
        const { controller } = build(async function* () {
            await Promise.resolve();
            yield { type: 'delta', text: 'Yes ' };
            throw new TypeError('secret internal detail');
        });
        const { response, written } = fakeResponse();

        await controller.askQuestionStream(
            { question: 'VAT?', mode: 'procedures' as const },
            request,
            response,
        );

        const last = parse(written).at(-1) as {
            type: string;
            status: number;
            message: string;
        };
        expect(last).toMatchObject({ type: 'error', status: 500 });
        expect(last.message).not.toContain('secret');
        expect(error).toHaveBeenCalled();
    });

    it('cancels the model call when the browser goes away before the answer is finished', async () => {
        let signal: AbortSignal | undefined;
        const askStream = jest.fn(
            (_question: string, _actor: unknown, cancel: AbortSignal) => {
                signal = cancel;
                return (async function* (): AsyncGenerator<AskEvent> {
                    await Promise.resolve();
                    yield { type: 'delta', text: 'Yes ' };
                })();
            },
        );
        const controller = new AiController(
            { askStream } as unknown as AskService,
            new AskStreamResponder(),
        );
        const { response, raw } = fakeResponse();

        await controller.askQuestionStream(
            { question: 'VAT?', mode: 'procedures' as const },
            request,
            response,
        );
        expect(signal?.aborted).toBe(false);

        // The close event fires while writableFinished is still false: the client left early.
        raw.emit('close');
        expect(signal?.aborted).toBe(true);
    });

    it('does not cancel when the connection closes after a finished response', async () => {
        let signal: AbortSignal | undefined;
        const askStream = jest.fn(
            (_question: string, _actor: unknown, cancel: AbortSignal) => {
                signal = cancel;
                return (async function* (): AsyncGenerator<AskEvent> {
                    await Promise.resolve();
                    yield { type: 'done', response: RESPONSE };
                })();
            },
        );
        const controller = new AiController(
            { askStream } as unknown as AskService,
            new AskStreamResponder(),
        );
        const { response, raw } = fakeResponse();

        await controller.askQuestionStream(
            { question: 'VAT?', mode: 'procedures' as const },
            request,
            response,
        );
        raw.writableFinished = true;
        raw.emit('close');

        expect(signal?.aborted).toBe(false);
    });
});
