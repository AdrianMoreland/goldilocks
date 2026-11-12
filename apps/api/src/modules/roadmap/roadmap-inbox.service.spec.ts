import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
    GITHUB,
    type GithubIssue,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { kindOf, RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapService } from './roadmap.service';

const issue = (n: number, extra: Partial<GithubIssue> = {}): GithubIssue => ({
    number: n,
    title: `Idea ${n}`,
    body: '',
    url: `https://github.com/o/r/issues/${n}`,
    labels: ['roadmap'],
    createdAt: '2026-11-05T10:00:00Z',
    ...extra,
});
const row = (id: number, status = 'new') => ({
    id,
    issueNumber: id + 100,
    source: 'github',
    title: `Idea ${id}`,
    body: '',
    kind: null,
    url: 'u',
    status,
    issueCreatedAt: new Date('2026-11-05T10:00:00Z'),
    handledAt: null,
    handledBy: null,
});

describe('kindOf', () => {
    it('reads a kind label, the issue form answer, or nothing', () => {
        expect(kindOf(['roadmap', 'fix'], '')).toBe('Fix');
        expect(kindOf(['roadmap'], '### What\n\nx\n\n### Kind\n\nTask')).toBe(
            'Task',
        );
        expect(kindOf(['roadmap'], '### Kind\n\n_No response_')).toBeNull();
        expect(kindOf(['roadmap'], 'plain text')).toBeNull();
    });
});

describe('RoadmapInboxService', () => {
    let service: RoadmapInboxService;
    const tx = { roadmapInbox: { update: jest.fn() } };
    const prisma = {
        roadmapInbox: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            createMany: jest.fn(),
            updateMany: jest.fn(),
        },
        $transaction: jest.fn(),
    };
    const audit = { record: jest.fn() };
    const roadmap = { edit: jest.fn() };
    const github = {
        isConfigured: jest.fn(),
        listOpenIssues: jest.fn(),
        closeIssue: jest.fn(),
    };

    beforeEach(async () => {
        jest.resetAllMocks();
        github.isConfigured.mockReturnValue(true);
        github.listOpenIssues.mockResolvedValue([]);
        github.closeIssue.mockResolvedValue(undefined);
        prisma.roadmapInbox.findMany.mockResolvedValue([]);
        prisma.roadmapInbox.updateMany.mockResolvedValue({ count: 0 });
        prisma.$transaction.mockImplementation((fn: (t: unknown) => unknown) =>
            fn(tx),
        );
        tx.roadmapInbox.update.mockImplementation(
            ({ where, data }: { where: { id: number }; data: object }) => ({
                ...row(where.id),
                ...data,
            }),
        );
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoadmapInboxService,
                { provide: PrismaService, useValue: prisma },
                { provide: AuditLogService, useValue: audit },
                { provide: RoadmapService, useValue: roadmap },
                { provide: GITHUB, useValue: github },
            ],
        }).compile();
        service = moduleRef.get(RoadmapInboxService);
    });

    it('lists new items before handled ones', async () => {
        prisma.roadmapInbox.findMany.mockResolvedValue([
            row(2, 'dismissed'),
            row(1),
        ]);
        const { items, configured } = await service.list();
        expect(items.map((i) => i.id)).toEqual([1, 2]);
        expect(configured).toBe(true);
    });

    it('refresh adds only issues it has not seen', async () => {
        github.listOpenIssues.mockResolvedValue([
            issue(5),
            issue(6, { labels: ['roadmap', 'idea'] }),
        ]);
        prisma.roadmapInbox.findMany.mockResolvedValue([
            { issueNumber: 5, status: 'new' },
        ]);
        const result = await service.refresh();
        expect(result).toEqual({ added: 1, closedOnGithub: 0 });
        const data = prisma.roadmapInbox.createMany.mock.calls[0][0].data;
        expect(data).toHaveLength(1);
        expect(data[0]).toMatchObject({ issueNumber: 6, kind: 'Idea' });
    });

    it('refresh dismisses new items whose issue was closed on GitHub, and leaves handled ones alone', async () => {
        github.listOpenIssues.mockResolvedValue([issue(5)]);
        prisma.roadmapInbox.findMany.mockResolvedValue([
            { issueNumber: 5, status: 'new' },
            { issueNumber: 7, status: 'new' },
            { issueNumber: 8, status: 'promoted' },
        ]);
        prisma.roadmapInbox.updateMany.mockResolvedValue({ count: 1 });
        const result = await service.refresh();
        expect(result.closedOnGithub).toBe(1);
        expect(prisma.roadmapInbox.updateMany.mock.calls[0][0].where).toEqual({
            issueNumber: { in: [7] },
            status: 'new',
        });
    });

    it('refresh does not trust a full page of 100 issues to be the whole list', async () => {
        github.listOpenIssues.mockResolvedValue(
            Array.from({ length: 100 }, (_, i) => issue(i + 1000)),
        );
        prisma.roadmapInbox.findMany.mockResolvedValue([
            { issueNumber: 7, status: 'new' },
        ]);
        const result = await service.refresh();
        expect(result.closedOnGithub).toBe(0);
        expect(prisma.roadmapInbox.updateMany).not.toHaveBeenCalled();
    });

    it('refresh refuses without a token, and autoRefresh swallows failures', async () => {
        github.isConfigured.mockReturnValue(false);
        await expect(service.refresh()).rejects.toThrow(BadRequestException);
        expect(await service.autoRefresh()).toBeNull();
        github.isConfigured.mockReturnValue(true);
        github.listOpenIssues.mockRejectedValue(new Error('down'));
        expect(await service.autoRefresh()).toBeNull();
    });

    it('promote adds the task, marks the item, audits it and closes the issue as completed', async () => {
        prisma.roadmapInbox.findUnique.mockResolvedValue(row(1));
        const item = await service.promote(
            1,
            { sectionLine: 10, text: 'Do the thing', version: 4 },
            'a@b.c',
        );
        expect(roadmap.edit).toHaveBeenCalledWith(
            {
                version: 4,
                edit: { type: 'add', sectionLine: 10, text: 'Do the thing' },
            },
            { email: 'a@b.c' },
        );
        expect(item.status).toBe('promoted');
        expect(audit.record).toHaveBeenCalledWith(
            'a@b.c',
            'roadmap-inbox',
            expect.stringContaining('promote #101'),
            tx,
        );
        expect(github.closeIssue).toHaveBeenCalledWith(
            101,
            expect.any(String),
            'completed',
        );
    });

    it('promote marks nothing when the roadmap edit is refused', async () => {
        prisma.roadmapInbox.findUnique.mockResolvedValue(row(1));
        roadmap.edit.mockRejectedValue(new Error('stale'));
        await expect(
            service.promote(1, { sectionLine: 1, text: 'x', version: 1 }, 'a'),
        ).rejects.toThrow('stale');
        expect(prisma.$transaction).not.toHaveBeenCalled();
        expect(github.closeIssue).not.toHaveBeenCalled();
    });

    it('dismiss closes the issue as not planned, and still succeeds when GitHub refuses the close', async () => {
        prisma.roadmapInbox.findUnique.mockResolvedValue(row(2));
        github.closeIssue.mockRejectedValue(new Error('403'));
        const item = await service.dismiss(2, 'a@b.c');
        expect(item.status).toBe('dismissed');
        expect(github.closeIssue).toHaveBeenCalledWith(
            102,
            expect.any(String),
            'not_planned',
        );
    });

    it('refuses an unknown or already handled item', async () => {
        prisma.roadmapInbox.findUnique.mockResolvedValue(null);
        await expect(service.dismiss(9, 'a')).rejects.toThrow(
            NotFoundException,
        );
        prisma.roadmapInbox.findUnique.mockResolvedValue(row(1, 'promoted'));
        await expect(service.dismiss(1, 'a')).rejects.toThrow(
            BadRequestException,
        );
    });
});
