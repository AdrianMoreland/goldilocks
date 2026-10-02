import {
    HttpException,
    INestApplication,
    ServiceUnavailableException,
} from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { ZodValidationPipe } from 'nestjs-zod';
import type { AskResponse, AskStreamEvent } from '@goldilocks/shared-types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { AiController } from './ai.controller';
import { AskService, type AskEvent } from './ask.service';

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

/** Reads the whole body as text, since superagent does not buffer text/event-stream by default. */
const asText = (
    res: request.Response,
    callback: (error: Error | null, body: string) => void,
) => {
    let data = '';
    res.on('data', (chunk: Buffer) => (data += chunk.toString()));
    res.on('end', () => callback(null, data));
};

describe('POST /ai/ask/stream over real HTTP', () => {
    let app: INestApplication;
    let script: () => AsyncGenerator<AskEvent>;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AiController],
            providers: [
                { provide: APP_GUARD, useClass: JwtAuthGuard },
                { provide: APP_PIPE, useClass: ZodValidationPipe },
                {
                    provide: AuthService,
                    useValue: {
                        validateToken: jest.fn(async () => ({
                            id: 'u1',
                            email: 'boss@example.com',
                            admin: true,
                        })),
                    },
                },
                {
                    provide: AskService,
                    useValue: { askStream: () => script(), status: jest.fn() },
                },
            ],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const post = (body: unknown = { question: 'VAT on silver?' }) =>
        request(app.getHttpServer() as Server)
            .post('/ai/ask/stream')
            .set('Authorization', 'Bearer admin')
            .send(body as object)
            .buffer(true)
            .parse(asText);

    const events = (text: unknown): AskStreamEvent[] =>
        String(text)
            .split('\n\n')
            .filter(Boolean)
            .map(
                (frame) =>
                    JSON.parse(frame.replace(/^data: /, '')) as AskStreamEvent,
            );

    it('answers 200 as an event stream with delta frames and a final done frame', async () => {
        script = async function* () {
            await Promise.resolve();
            yield { type: 'delta', text: 'Yes ' };
            yield { type: 'delta', text: 'it does.' };
            yield { type: 'done', response: RESPONSE };
        };

        const res = await post();

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('text/event-stream');
        expect(res.headers['cache-control']).toContain('no-cache');
        expect(res.headers['x-accel-buffering']).toBe('no');
        expect(events(res.body)).toEqual([
            { type: 'delta', text: 'Yes ' },
            { type: 'delta', text: 'it does.' },
            { type: 'done', response: RESPONSE },
        ]);
    });

    it('answers an up-front refusal (limit reached) as a plain 429, not a stream', async () => {
        script = async function* () {
            await Promise.resolve();
            throw new HttpException('You have used today’s 50 questions.', 429);
            yield { type: 'delta', text: 'never' };
        };

        const res = await request(app.getHttpServer() as Server)
            .post('/ai/ask/stream')
            .set('Authorization', 'Bearer admin')
            .send({ question: 'VAT on silver?' });

        expect(res.status).toBe(429);
        expect(res.headers['content-type']).toContain('application/json');
    });

    it('delivers a failure mid-stream as an error frame on a 200 stream', async () => {
        script = async function* () {
            await Promise.resolve();
            yield { type: 'delta', text: 'Yes ' };
            throw new ServiceUnavailableException('The assistant is busy.');
        };

        const res = await post();

        expect(res.status).toBe(200);
        expect(events(res.body).at(-1)).toEqual({
            type: 'error',
            status: 503,
            message: 'The assistant is busy.',
        });
    });

    it('validates the question before any stream starts', async () => {
        script = async function* () {
            await Promise.resolve();
            yield { type: 'done', response: RESPONSE };
        };

        const res = await request(app.getHttpServer() as Server)
            .post('/ai/ask/stream')
            .set('Authorization', 'Bearer admin')
            .send({ question: 'x'.repeat(501) });

        expect(res.status).toBe(400);
    });
});
