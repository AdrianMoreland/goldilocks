import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RoadmapQueueTokenController } from './roadmap-queue-token.controller';
import { RoadmapQueueService, cleanQueueText } from './roadmap-queue.service';

const row = (over: Record<string, unknown> = {}) => ({
    id: 1,
    title: 'buy a thing',
    source: 'phone',
    status: 'new',
    issueCreatedAt: new Date('2026-11-09T23:30:00Z'),
    handledAt: null,
    ...over,
});

describe('RoadmapQueueService', () => {
    const prisma = {
        roadmapInbox: {
            create: jest.fn(),
            findMany: jest.fn(),
            updateMany: jest.fn(),
        },
    };
    let service: RoadmapQueueService;

    beforeEach(() => {
        jest.resetAllMocks();
        service = new RoadmapQueueService(prisma as unknown as PrismaService);
    });

    it('cleans a note to one capped line and refuses an empty one', () => {
        expect(cleanQueueText('  a \n\n b\t c  ')).toBe('a b c');
        expect(cleanQueueText('x'.repeat(900))).toHaveLength(500);
        expect(() => cleanQueueText(' \n ')).toThrow(BadRequestException);
    });

    it('appends a queue row with no issue number and returns the INBOX line in Dublin time', async () => {
        prisma.roadmapInbox.create.mockResolvedValue({ id: 7 });
        const r = await service.append({
            text: 'idea:\nfoo',
            source: 'phone',
        });
        expect(prisma.roadmapInbox.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                title: 'idea: foo',
                url: '',
                source: 'phone',
                status: 'new',
            }),
        });
        const data = prisma.roadmapInbox.create.mock.calls[0][0].data;
        expect(data).not.toHaveProperty('issueNumber');
        expect(r.id).toBe(7);
        expect(r.line).toMatch(/^- \d{4}-\d{2}-\d{2} \(phone\): idea: foo$/);
    });

    it('lists only queue rows, new first', async () => {
        prisma.roadmapInbox.findMany.mockResolvedValue([
            row({ id: 2, status: 'filed', handledAt: new Date() }),
            row({ id: 3 }),
        ]);
        const { entries } = await service.list();
        expect(prisma.roadmapInbox.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { source: { in: ['phone', 'web'] } },
            }),
        );
        expect(entries.map((e) => [e.id, e.status])).toEqual([
            [3, 'new'],
            [2, 'filed'],
        ]);
    });

    it('gives pending notes oldest first with their INBOX line (Dublin date)', async () => {
        prisma.roadmapInbox.findMany.mockResolvedValue([row()]);
        const { entries } = await service.pending();
        expect(prisma.roadmapInbox.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { source: { in: ['phone', 'web'] }, status: 'new' },
                orderBy: { id: 'asc' },
            }),
        );
        // 23:30 UTC on 9 November is still 9 November in Dublin (winter time, UTC+0)
        expect(entries[0].line).toBe('- 2026-11-09 (phone): buy a thing');
    });

    it('marks only new queue rows as filed', async () => {
        prisma.roadmapInbox.updateMany.mockResolvedValue({ count: 2 });
        expect(await service.markFiled([1, 2, 99], 'laptop')).toEqual({
            filed: 2,
        });
        expect(prisma.roadmapInbox.updateMany).toHaveBeenCalledWith({
            where: {
                id: { in: [1, 2, 99] },
                source: { in: ['phone', 'web'] },
                status: 'new',
            },
            data: expect.objectContaining({
                status: 'filed',
                handledBy: 'laptop',
            }),
        });
    });
});

describe('RoadmapQueueTokenController', () => {
    const writer = { append: jest.fn() };
    const queue = { pending: jest.fn(), markFiled: jest.fn() };
    const env: Record<string, string | undefined> = {
        ROADMAP_INTAKE_TOKEN: 'intake-secret',
        ROADMAP_DRAIN_TOKEN: 'drain-secret',
    };
    const controller = () =>
        new RoadmapQueueTokenController(
            { get: (k: string) => env[k] } as unknown as ConfigService,
            queue as unknown as RoadmapQueueService,
            writer,
        );

    beforeEach(() => {
        jest.resetAllMocks();
        env.ROADMAP_INTAKE_TOKEN = 'intake-secret';
        env.ROADMAP_DRAIN_TOKEN = 'drain-secret';
    });

    it('intake queues a phone note with the intake token', async () => {
        writer.append.mockResolvedValue({ id: 1, line: 'l' });
        await controller().intake('intake-secret', { text: 'hi' });
        expect(writer.append).toHaveBeenCalledWith({
            text: 'hi',
            source: 'phone',
        });
    });

    it('intake refuses a missing, wrong or drain token and writes nothing', async () => {
        for (const token of [undefined, 'nope', 'drain-secret']) {
            await expect(
                Promise.resolve().then(() =>
                    controller().intake(token, { text: 'hi' }),
                ),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        }
        expect(writer.append).not.toHaveBeenCalled();
    });

    it('drain routes need the drain token, not the intake token', () => {
        queue.pending.mockResolvedValue({ entries: [] });
        queue.markFiled.mockResolvedValue({ filed: 1 });
        expect(() => controller().pending('intake-secret')).toThrow(
            UnauthorizedException,
        );
        expect(() => controller().filed('intake-secret', { ids: [1] })).toThrow(
            UnauthorizedException,
        );
        void controller().pending('drain-secret');
        void controller().filed('drain-secret', { ids: [1] });
        expect(queue.markFiled).toHaveBeenCalledWith([1], 'laptop');
    });

    it('refuses everything while a token variable is unset', () => {
        delete env.ROADMAP_INTAKE_TOKEN;
        expect(() => controller().intake('', { text: 'hi' })).toThrow(
            UnauthorizedException,
        );
        expect(() => controller().intake(undefined, { text: 'hi' })).toThrow(
            UnauthorizedException,
        );
    });
});
