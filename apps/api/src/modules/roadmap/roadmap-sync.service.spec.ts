import { Test } from '@nestjs/testing';
import {
    GITHUB,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RoadmapService } from './roadmap.service';
import { RoadmapSyncService } from './roadmap-sync.service';

const MASTER = '## 0.1 Core 🔴\n\n- [ ] First task\n- [x] Second task\n';
const APP_DOC = (markdown: string) => ({
    markdown,
    version: 7,
    updatedBy: 'a@b.c',
    updatedAt: '2026-10-19T10:00:00.000Z',
});

describe('RoadmapSyncService', () => {
    let service: RoadmapSyncService;
    const roadmap = { get: jest.fn() };
    const prisma = { roadmapSyncState: { findUnique: jest.fn() } };
    const github = {
        repo: 'owner/repo',
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
        github.tokenExpiresAt.mockReturnValue(new Date('2027-01-30T00:00:00Z'));
        github.readFile.mockResolvedValue({
            content: MASTER,
            commit: 'abc123',
        });
        github.listOpenPullRequests.mockResolvedValue([]);
        roadmap.get.mockResolvedValue(APP_DOC(MASTER));
        prisma.roadmapSyncState.findUnique.mockResolvedValue({
            baseMarkdown: MASTER,
        });
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoadmapSyncService,
                { provide: RoadmapService, useValue: roadmap },
                { provide: PrismaService, useValue: prisma },
                { provide: GITHUB, useValue: github },
            ],
        }).compile();
        service = moduleRef.get(RoadmapSyncService);
    });

    it('reports not configured without calling GitHub when there is no token', async () => {
        github.isConfigured.mockReturnValue(false);
        const status = await service.status();
        expect(status.state).toBe('unconfigured');
        expect(status.appVersion).toBe(7);
        expect(github.readFile).not.toHaveBeenCalled();
    });

    it('is in sync when the texts match, ignoring line endings and a trailing newline', async () => {
        roadmap.get.mockResolvedValue(
            APP_DOC(MASTER.replace(/\n/g, '\r\n') + '\n'),
        );
        const status = await service.status();
        expect(status.state).toBe('in-sync');
        expect(status.masterCommit).toBe('abc123');
        expect(status.appOnlyLines).toBe(0);
        expect(status.masterOnlyLines).toBe(0);
        expect(status.tokenExpiresAt).toBe('2027-01-30T00:00:00.000Z');
    });

    it('counts and previews the difference when they disagree', async () => {
        roadmap.get.mockResolvedValue(
            APP_DOC(
                MASTER.replace('- [ ] First task', '- [x] First task (app)'),
            ),
        );
        const status = await service.status();
        expect(status.state).toBe('differs');
        expect(status.appOnlyLines).toBe(1);
        expect(status.masterOnlyLines).toBe(1);
        expect(status.preview.join('\n')).toContain('First task');
    });

    it('counts the app edits a push would send', async () => {
        roadmap.get.mockResolvedValue(
            APP_DOC(MASTER.replace('- [ ] First task', '- [x] First task')),
        );
        const status = await service.status();
        expect(status.appEditsToPush).toBe(1);
    });

    it('counts none when the app matches the base', async () => {
        const status = await service.status();
        expect(status.appEditsToPush).toBe(0);
    });

    it('reports null edits to push when sync has no base yet', async () => {
        prisma.roadmapSyncState.findUnique.mockResolvedValue(null);
        const status = await service.status();
        expect(status.appEditsToPush).toBeNull();
    });

    it('finds the open roadmap-sync pull request', async () => {
        github.listOpenPullRequests.mockResolvedValue([
            {
                number: 3,
                title: 'Something else',
                url: 'u3',
                branch: 'feature/x',
            },
            {
                number: 9,
                title: '[roadmap-sync] tick finished tasks',
                url: 'u9',
                branch: 'roadmap-sync/auto',
            },
        ]);
        const status = await service.status();
        expect(status.openSyncPr).toEqual({
            number: 9,
            title: '[roadmap-sync] tick finished tasks',
            url: 'u9',
        });
    });

    it('turns a GitHub failure into the unavailable state instead of throwing', async () => {
        github.readFile.mockRejectedValue(
            new Error(
                'GitHub refused the token (expired or missing a permission)',
            ),
        );
        const status = await service.status();
        expect(status.state).toBe('unavailable');
        expect(status.error).toContain('refused the token');
        expect(status.appVersion).toBe(7);
    });
});
