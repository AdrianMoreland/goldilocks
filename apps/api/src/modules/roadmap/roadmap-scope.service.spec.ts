import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
    GITHUB,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoadmapScopeService } from './roadmap-scope.service';

const ITEM = (id: string) =>
    `### ${id} · Thing\n\`P1 · M · planned · after: none · flags: none\`\nEvidence: none yet\n- [ ] a\n`;
const FILES: Record<string, string> = {
    'docs/roadmap/features.md': `# Features\n\n## Open\n\n${ITEM('F-01')}\n## Done\n`,
    'docs/roadmap/fixes.md': `# Fixes\n\n## Open\n\n${ITEM('B-01')}\n## Done\n`,
    'docs/roadmap/ops.md': `# Ops\n\n## Open\n\n## Done\n`,
    'docs/roadmap/decisions.md': `# Decisions\n\n## Open\n\n### D-20 · Q\nDefault: none. Blocks: F-01.\n\n## Settled\n\n- D-01 · Rule: x\n`,
    'docs/NOW.md': '# Now\n',
};

describe('RoadmapScopeService', () => {
    let service: RoadmapScopeService;
    const tx = {
        roadmapDocument: { create: jest.fn(), updateMany: jest.fn() },
    };
    const prisma = {
        roadmapDocument: { findUnique: jest.fn() },
        $transaction: jest.fn(),
    };
    const audit = { record: jest.fn() };
    const github = {
        repo: 'o/public',
        isConfigured: jest.fn(),
        tokenExpiresAt: jest.fn(),
        readFile: jest.fn(),
        listOpenPullRequests: jest.fn(),
        writeFileOnBranch: jest.fn(),
        openPullRequest: jest.fn(),
        updatePullRequest: jest.fn(),
        listOpenIssues: jest.fn(),
        closeIssue: jest.fn(),
    } satisfies GithubPort & Record<string, unknown>;
    const env = { ...process.env };

    beforeEach(async () => {
        jest.resetAllMocks();
        process.env = { ...env };
        process.env.ROADMAP_SOURCE = 'scope';
        process.env.GITHUB_ROADMAP_REPO = 'o/private';
        delete process.env.GITHUB_ROADMAP_BRANCH;
        github.isConfigured.mockReturnValue(true);
        github.readFile.mockImplementation((path: string) =>
            path in FILES
                ? Promise.resolve({
                      content: FILES[path],
                      commit: 'c0ffee1234',
                  })
                : Promise.reject(
                      Object.assign(new Error('x'), { status: 404 }),
                  ),
        );
        prisma.roadmapDocument.findUnique.mockResolvedValue(null);
        prisma.$transaction.mockImplementation(
            (fn: (t: typeof tx) => unknown) => fn(tx),
        );
        tx.roadmapDocument.create.mockResolvedValue({});
        tx.roadmapDocument.updateMany.mockResolvedValue({ count: 1 });
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoadmapScopeService,
                { provide: PrismaService, useValue: prisma },
                { provide: AuditLogService, useValue: audit },
                { provide: GITHUB, useValue: github },
            ],
        }).compile();
        service = moduleRef.get(RoadmapScopeService);
    });

    afterAll(() => {
        process.env = env;
    });

    it('reads every file from the roadmap repository and stores row 2', async () => {
        const r = await service.refresh('boss');
        expect(r).toEqual({
            changed: true,
            commit: 'c0ffee1234',
            version: 1,
            items: 2,
            decisions: 1,
        });
        expect(github.readFile).toHaveBeenCalledWith(
            'docs/roadmap/features.md',
            'main',
            'o/private',
        );
        const data = tx.roadmapDocument.create.mock.calls[0][0].data;
        expect(data.id).toBe(2);
        expect(data.markdown).toContain(
            '<!--roadmap-scope repo=o/private branch=main commit=c0ffee1234-->',
        );
        expect(audit.record).toHaveBeenCalledWith(
            'boss',
            'roadmap',
            expect.stringContaining('o/private@c0ffee1'),
            tx,
        );
    });

    it('stores nothing when the repository already matches', async () => {
        await service.refresh('boss');
        const stored = tx.roadmapDocument.create.mock.calls[0][0].data.markdown;
        prisma.roadmapDocument.findUnique.mockResolvedValue({
            markdown: stored,
            version: 4,
        });
        const r = await service.refresh('boss');
        expect(r).toMatchObject({ changed: false, version: 4 });
        expect(tx.roadmapDocument.updateMany).not.toHaveBeenCalled();
    });

    it('replaces the stored copy under a version guard', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue({
            markdown: 'old',
            version: 4,
        });
        const r = await service.refresh('boss');
        expect(r).toMatchObject({ changed: true, version: 5 });
        expect(tx.roadmapDocument.updateMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: 2, version: 4 } }),
        );
    });

    it('works without NOW.md', async () => {
        delete FILES['docs/NOW.md'];
        try {
            const r = await service.refresh('boss');
            expect(r.changed).toBe(true);
        } finally {
            FILES['docs/NOW.md'] = '# Now\n';
        }
    });

    it('refuses without a token or a repository', async () => {
        github.isConfigured.mockReturnValue(false);
        await expect(service.refresh('boss')).rejects.toBeInstanceOf(
            BadRequestException,
        );
        github.isConfigured.mockReturnValue(true);
        delete process.env.GITHUB_ROADMAP_REPO;
        await expect(service.refresh('boss')).rejects.toBeInstanceOf(
            BadRequestException,
        );
        expect(tx.roadmapDocument.create).not.toHaveBeenCalled();
    });

    it('writes nothing when a required file cannot be read', async () => {
        github.readFile.mockImplementation((path: string) =>
            path.endsWith('ops.md')
                ? Promise.reject(new Error('GitHub answered 404'))
                : Promise.resolve({
                      content: FILES[path] ?? '',
                      commit: 'c0ffee1234',
                  }),
        );
        await expect(service.refresh('boss')).rejects.toBeInstanceOf(
            BadGatewayException,
        );
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('writes nothing when the files were read at different commits', async () => {
        let n = 0;
        github.readFile.mockImplementation((path: string) =>
            Promise.resolve({
                content: FILES[path] ?? '',
                commit: `c${n++ % 2}`,
            }),
        );
        await expect(service.refresh('boss')).rejects.toBeInstanceOf(
            BadGatewayException,
        );
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('writes nothing when the files hold no items', async () => {
        github.readFile.mockResolvedValue({
            content: '# empty\n',
            commit: 'c1',
        });
        await expect(service.refresh('boss')).rejects.toBeInstanceOf(
            BadGatewayException,
        );
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('autoRefresh does nothing unless switched on, and never throws', async () => {
        delete process.env.ROADMAP_SOURCE;
        await service.autoRefresh('cron');
        expect(github.readFile).not.toHaveBeenCalled();
        process.env.ROADMAP_SOURCE = 'scope';
        github.readFile.mockRejectedValue(new Error('down'));
        await expect(service.autoRefresh('cron')).resolves.toBeUndefined();
    });

    it('get returns an empty view before the first pull, then the stored one', async () => {
        const empty = await service.get();
        expect(empty).toMatchObject({
            enabled: true,
            configured: true,
            empty: true,
            version: 0,
            commit: null,
        });
        await service.refresh('boss');
        prisma.roadmapDocument.findUnique.mockResolvedValue({
            markdown: tx.roadmapDocument.create.mock.calls[0][0].data.markdown,
            version: 1,
            updatedBy: 'boss',
            updatedAt: new Date('2026-11-10T08:00:00Z'),
        });
        const got = await service.get();
        expect(got).toMatchObject({
            empty: false,
            repo: 'o/private',
            commit: 'c0ffee1234',
            syncedBy: 'boss',
            syncedAt: '2026-11-10T08:00:00.000Z',
        });
        expect(got.view.items.map((i) => i.id)).toEqual(['F-01', 'B-01']);
        expect(got.view.now).toBe('# Now\n');
    });
});
