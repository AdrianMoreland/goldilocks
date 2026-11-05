import { UnauthorizedException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import type { Request } from 'express';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapWebhookController } from './roadmap-webhook.controller';

const SECRET = 'whsec';
const sign = (raw: Buffer) =>
    `sha256=${createHmac('sha256', SECRET).update(raw).digest('hex')}`;

describe('RoadmapWebhookController', () => {
    const autoPull = jest.fn();
    const autoRefresh = jest.fn();
    let controller: RoadmapWebhookController;

    const call = (payload: object, event: string, secret = SECRET) => {
        const raw = Buffer.from(JSON.stringify(payload));
        const req = {
            rawBody: raw,
            body: payload,
        } as unknown as RawBodyRequest<Request>;
        const header =
            secret === SECRET
                ? sign(raw)
                : `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`;
        return controller.handle(req, header, event);
    };

    beforeEach(() => {
        jest.resetAllMocks();
        autoPull.mockResolvedValue(null);
        autoRefresh.mockResolvedValue(null);
        controller = new RoadmapWebhookController(
            { autoPull } as unknown as RoadmapPullService,
            { autoRefresh } as unknown as RoadmapInboxService,
            { get: () => SECRET } as unknown as ConfigService,
        );
    });

    it('answers a ping without pulling', () => {
        expect(call({ zen: 'x' }, 'ping')).toEqual({ ok: true });
        expect(autoPull).not.toHaveBeenCalled();
    });

    it('starts a background pull for a push to master', () => {
        expect(call({ ref: 'refs/heads/master' }, 'push')).toEqual({
            accepted: true,
        });
        expect(autoPull).toHaveBeenCalledWith('github-webhook');
    });

    it('ignores pushes to other branches and other events', () => {
        expect(call({ ref: 'refs/heads/feature/x' }, 'push')).toEqual({
            ignored: true,
        });
        expect(call({}, 'star')).toEqual({ ignored: true });
        expect(autoPull).not.toHaveBeenCalled();
    });

    it('refreshes the inbox for an issues event and does not pull', () => {
        expect(call({ action: 'opened' }, 'issues')).toEqual({
            accepted: true,
        });
        expect(autoRefresh).toHaveBeenCalledTimes(1);
        expect(autoPull).not.toHaveBeenCalled();
    });

    it('refuses a bad signature, a missing signature and a missing secret, and never pulls', () => {
        expect(() =>
            call({ ref: 'refs/heads/master' }, 'push', 'wrong'),
        ).toThrow(UnauthorizedException);
        const raw = Buffer.from('{}');
        const req = {
            rawBody: raw,
            body: {},
        } as unknown as RawBodyRequest<Request>;
        expect(() => controller.handle(req, undefined, 'push')).toThrow(
            UnauthorizedException,
        );
        const noSecret = new RoadmapWebhookController(
            { autoPull } as unknown as RoadmapPullService,
            { autoRefresh } as unknown as RoadmapInboxService,
            { get: () => undefined } as unknown as ConfigService,
        );
        expect(() => noSecret.handle(req, sign(raw), 'push')).toThrow(
            UnauthorizedException,
        );
        expect(autoPull).not.toHaveBeenCalled();
    });
});
