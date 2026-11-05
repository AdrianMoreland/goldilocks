import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
    GITHUB,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoadmapPushService } from './roadmap-push.service';
import { RoadmapService } from './roadmap.service';

const BASE =
    '## 1.1 A\n\n- [ ] one\n- [ ] two\n- [ ] three\n- [ ] four\n- [ ] five\n- [ ] six\n- [ ] seven\n- [ ] eight\n- [ ] nine\n- [ ] ten\n';
/** The app ticked "two". */
const APP = BASE.replace('- [ ] two', '- [x] two');
const doc = (markdown: string, version = 12) => ({
    markdown,
    version,
    updatedBy: 'a@b.c',
    updatedAt: '2026-11-01T10:00:00.000Z',
});

describe('RoadmapPushService', () => {
    let service: RoadmapPushService;
    const prisma = { roadmapSyncState: { findUnique: jest.fn() } };
    const audit = { record: jest.fn() };
    const roadmap = { get: jest.fn() };
    const github = {
        repo: 'o/r',
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

    beforeEach(async () => {
        jest.resetAllMocks();
        github.isConfigured.mockReturnValue(true);
        github.readFile.mockResolvedValue({ content: BASE, commit: 'm1' });
        github.listOpenPullRequests.mockResolvedValue([]);
        github.writeFileOnBranch.mockResolvedValue({ commit: 'c1' });
        github.openPullRequest.mockResolvedValue({
            number: 31,
            title: '[roadmap-sync] app edits',
            url: 'https://github.com/o/r/pull/31',
            branch: 'roadmap-sync/app',
        });
        roadmap.get.mockResolvedValue(doc(APP));
        prisma.roadmapSyncState.findUnique.mockResolvedValue({
            baseCommit: 'm1',
            baseMarkdown: BASE,
        });
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoadmapPushService,
                { provide: PrismaService, useValue: prisma },
                { provide: AuditLogService, useValue: audit },
                { provide: RoadmapService, useValue: roadmap },
                { provide: GITHUB, useValue: github },
            ],
        }).compile();
        service = moduleRef.get(RoadmapPushService);
    });

    it('refuses without sync state', async () => {
        prisma.roadmapSyncState.findUnique.mockResolvedValue(null);
        await expect(service.push('boss')).rejects.toBeInstanceOf(
            BadRequestException,
        );
        expect(github.writeFileOnBranch).not.toHaveBeenCalled();
    });

    it('refuses when the app has no roadmap', async () => {
        roadmap.get.mockResolvedValue(doc('', 0));
        await expect(service.push('boss')).rejects.toBeInstanceOf(
            BadRequestException,
        );
    });

    it('refuses when GitHub is not configured', async () => {
        github.isConfigured.mockReturnValue(false);
        await expect(service.push('boss')).rejects.toBeInstanceOf(
            BadRequestException,
        );
    });

    it('has nothing to push when the app matches the base', async () => {
        roadmap.get.mockResolvedValue(doc(BASE));
        const r = await service.push('boss');
        expect(r).toMatchObject({ mode: 'nothing', applied: false });
        expect(github.writeFileOnBranch).not.toHaveBeenCalled();
        expect(audit.record).not.toHaveBeenCalled();
    });

    it('creates the branch commit and the pull request, then audits', async () => {
        const r = await service.push('boss@x.ie');

        expect(github.writeFileOnBranch).toHaveBeenCalledWith({
            branch: 'roadmap-sync/app',
            baseCommit: 'm1',
            path: 'docs/ROADMAP.md',
            content: APP,
            message: 'roadmap-sync: app edits',
        });
        expect(github.openPullRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                title: '[roadmap-sync] app edits',
                head: 'roadmap-sync/app',
                base: 'master',
                body: expect.stringMatching(/^Roadmap: none\n/),
            }),
        );
        expect(r).toMatchObject({
            mode: 'push',
            applied: true,
            commit: 'm1',
            prNumber: 31,
            prUrl: 'https://github.com/o/r/pull/31',
        });
        expect(r.edits).toHaveLength(1);
        expect(r.diffPreview.join('\n')).toContain('- [x] two');
        expect(audit.record).toHaveBeenCalledWith(
            'boss@x.ie',
            'roadmap',
            'push: opened PR #31, 1 edit(s)',
        );
    });

    it('puts master’s newer lines into the file too, so nothing is reverted', async () => {
        const master = BASE + '- [ ] eleven\n';
        github.readFile.mockResolvedValue({ content: master, commit: 'm2' });
        await service.push('boss');
        expect(github.writeFileOnBranch).toHaveBeenCalledWith(
            expect.objectContaining({
                baseCommit: 'm2',
                content: APP + '- [ ] eleven\n',
            }),
        );
    });

    it('updates the open pull request instead of opening a second one', async () => {
        github.listOpenPullRequests.mockResolvedValue([
            { number: 3, title: 'x', url: 'u3', branch: 'feature/x' },
            {
                number: 20,
                title: '[roadmap-sync] app edits',
                url: 'u20',
                branch: 'roadmap-sync/app',
            },
        ]);
        const r = await service.push('boss');
        expect(github.writeFileOnBranch).toHaveBeenCalledTimes(1);
        expect(github.openPullRequest).not.toHaveBeenCalled();
        expect(github.updatePullRequest).toHaveBeenCalledWith(
            20,
            expect.stringContaining('Roadmap: none'),
        );
        expect(r).toMatchObject({ prNumber: 20, prUrl: 'u20' });
        expect(audit.record).toHaveBeenCalledWith(
            'boss',
            'roadmap',
            'push: updated PR #20, 1 edit(s)',
        );
    });

    it('refuses a file under 90% of master’s length', async () => {
        const big = BASE + '- [ ] filler line to make master long\n'.repeat(30);
        github.readFile.mockResolvedValue({ content: big, commit: 'm3' });
        // base == big, the app dropped the filler: the push would delete most of the file
        prisma.roadmapSyncState.findUnique.mockResolvedValue({
            baseCommit: 'm3',
            baseMarkdown: big,
        });
        roadmap.get.mockResolvedValue(doc(BASE));
        await expect(service.push('boss')).rejects.toThrow(
            /more than 10% of the roadmap/,
        );
        expect(github.writeFileOnBranch).not.toHaveBeenCalled();
    });

    it('writes nothing on a dry run, even while another push runs', async () => {
        const r = await service.push('boss', { dryRun: true });
        expect(r).toMatchObject({
            mode: 'push',
            applied: false,
            prNumber: null,
            prUrl: null,
        });
        expect(r.edits).toHaveLength(1);
        expect(github.listOpenPullRequests).not.toHaveBeenCalled();
        expect(github.writeFileOnBranch).not.toHaveBeenCalled();
        expect(audit.record).not.toHaveBeenCalled();
    });

    it('answers 409 while a push is running, then frees the lock', async () => {
        let release!: () => void;
        github.writeFileOnBranch.mockReturnValue(
            new Promise((resolve) => {
                release = () => resolve({ commit: 'c1' });
            }),
        );
        const first = service.push('boss');
        await new Promise((r) => setImmediate(r));
        await expect(service.push('boss')).rejects.toBeInstanceOf(
            ConflictException,
        );
        release();
        await first;
        await expect(service.push('boss')).resolves.toBeDefined();
    });

    it('frees the lock and reports a bad gateway when GitHub fails', async () => {
        github.writeFileOnBranch.mockRejectedValueOnce(
            new Error('GitHub rejected the change: nope'),
        );
        await expect(service.push('boss')).rejects.toBeInstanceOf(
            BadGatewayException,
        );
        expect(audit.record).not.toHaveBeenCalled();
        await expect(service.push('boss')).resolves.toMatchObject({
            applied: true,
        });
    });

    it('turns an unreadable master into a bad gateway', async () => {
        github.readFile.mockRejectedValue(new Error('GitHub answered 502'));
        await expect(service.push('boss')).rejects.toBeInstanceOf(
            BadGatewayException,
        );
    });
});
