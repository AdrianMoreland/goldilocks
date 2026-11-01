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
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapService } from './roadmap.service';

const MASTER = '## 1.1 A\n\n- [ ] one\n- [x] two\n- [ ] three\n';
const APP_OLD = '## 1.1 A\n\n- [ ] one\n- [ ] two\n- [ ] only in app\n';
const doc = (markdown: string, version = 28) => ({
    markdown,
    version,
    updatedBy: 'a@b.c',
    updatedAt: '2026-10-19T10:00:00.000Z',
});

describe('RoadmapPullService', () => {
    let service: RoadmapPullService;
    const tx = {
        roadmapSnapshot: { create: jest.fn() },
        roadmapDocument: { updateMany: jest.fn(), create: jest.fn() },
        roadmapSyncState: { upsert: jest.fn() },
    };
    const prisma = {
        roadmapSyncState: { findUnique: jest.fn() },
        $transaction: jest.fn(),
    };
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
    } satisfies GithubPort & Record<string, unknown>;

    beforeEach(async () => {
        jest.resetAllMocks();
        github.isConfigured.mockReturnValue(true);
        github.readFile.mockResolvedValue({
            content: MASTER,
            commit: 'abcdef1234',
        });
        roadmap.get.mockResolvedValue(doc(APP_OLD));
        prisma.roadmapSyncState.findUnique.mockResolvedValue(null);
        prisma.$transaction.mockImplementation(
            (fn: (t: typeof tx) => unknown) => fn(tx),
        );
        tx.roadmapSnapshot.create.mockResolvedValue({ id: 5 });
        tx.roadmapDocument.updateMany.mockResolvedValue({ count: 1 });
        tx.roadmapDocument.create.mockResolvedValue({});
        tx.roadmapSyncState.upsert.mockResolvedValue({});
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoadmapPullService,
                { provide: PrismaService, useValue: prisma },
                { provide: AuditLogService, useValue: audit },
                { provide: RoadmapService, useValue: roadmap },
                { provide: GITHUB, useValue: github },
            ],
        }).compile();
        service = moduleRef.get(RoadmapPullService);
    });

    describe('first run (adopt)', () => {
        it('previews without writing anything, listing the app-only tasks', async () => {
            const r = await service.pull('boss', { dryRun: true });
            expect(r).toMatchObject({
                mode: 'adopt',
                applied: false,
                appChanged: true,
                snapshotId: null,
                appVersion: 28,
            });
            expect(r.appOnlyTasks).toEqual([
                { section: '1.1', title: 'only in app', checked: false },
            ]);
            expect(r.appOnlyTaskCount).toBe(1);
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('is refused without confirmReplace and writes nothing', async () => {
            await expect(service.pull('boss', {})).rejects.toBeInstanceOf(
                BadRequestException,
            );
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('snapshots the old text, replaces it, stores the base and audits, in one transaction', async () => {
            const r = await service.pull('boss', { confirmReplace: true });
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(tx.roadmapSnapshot.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    markdown: APP_OLD,
                    version: 28,
                    createdBy: 'boss',
                }),
            });
            expect(tx.roadmapDocument.updateMany).toHaveBeenCalledWith({
                where: { id: 1, version: 28 },
                data: expect.objectContaining({
                    markdown: MASTER,
                    updatedBy: 'boss',
                }),
            });
            expect(tx.roadmapSyncState.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    create: expect.objectContaining({
                        id: 1,
                        baseCommit: 'abcdef1234',
                        baseMarkdown: MASTER,
                    }),
                }),
            );
            expect(audit.record).toHaveBeenCalledWith(
                'boss',
                'roadmap',
                expect.stringContaining('abcdef1'),
                tx,
            );
            expect(r).toMatchObject({
                applied: true,
                snapshotId: 5,
                appVersion: 29,
            });
        });

        it('loses cleanly when the roadmap was edited meanwhile', async () => {
            tx.roadmapDocument.updateMany.mockResolvedValue({ count: 0 });
            await expect(
                service.pull('boss', { confirmReplace: true }),
            ).rejects.toBeInstanceOf(ConflictException);
        });

        it('takes no snapshot and bumps nothing when the app already matches master', async () => {
            roadmap.get.mockResolvedValue(doc(MASTER));
            const r = await service.pull('boss', { confirmReplace: true });
            expect(tx.roadmapSnapshot.create).not.toHaveBeenCalled();
            expect(tx.roadmapDocument.updateMany).not.toHaveBeenCalled();
            expect(tx.roadmapSyncState.upsert).toHaveBeenCalled();
            expect(r).toMatchObject({
                applied: true,
                appChanged: false,
                appVersion: 28,
            });
        });

        it('creates the row when the app has no roadmap yet', async () => {
            roadmap.get.mockResolvedValue(doc('', 0));
            await service.pull('boss', { confirmReplace: true });
            expect(tx.roadmapDocument.create).toHaveBeenCalled();
            expect(tx.roadmapSnapshot.create).not.toHaveBeenCalled();
        });

        it('reports a GitHub failure as a bad gateway and writes nothing', async () => {
            github.readFile.mockRejectedValue(
                new Error('GitHub refused the token'),
            );
            await expect(
                service.pull('boss', { confirmReplace: true }),
            ).rejects.toBeInstanceOf(BadGatewayException);
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('refuses when no token is configured', async () => {
            github.isConfigured.mockReturnValue(false);
            await expect(
                service.pull('boss', { dryRun: true }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('later runs (merge)', () => {
        const BASE = '## 1.1 A\n\n- [ ] one\n- [ ] two\n';
        const state = { baseCommit: 'old0000', baseMarkdown: BASE };
        const file = '## 1.1 A\n\n- [x] one\n- [ ] two\n- [ ] from master\n';

        beforeEach(() => {
            prisma.roadmapSyncState.findUnique.mockResolvedValue(state);
            github.readFile.mockResolvedValue({
                content: file,
                commit: 'new1111111',
            });
        });

        it('does nothing when master has not moved since the last pull', async () => {
            github.readFile.mockResolvedValue({
                content: file,
                commit: 'old0000',
            });
            const r = await service.pull('boss', {});
            expect(r.mode).toBe('nothing');
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it("merges master into the app and keeps the app's own edit", async () => {
            roadmap.get.mockResolvedValue(
                doc(BASE.replace('- [ ] two', '- [x] two'), 3),
            );
            const r = await service.pull('boss', {});
            const written = tx.roadmapDocument.updateMany.mock.calls[0]![0].data
                .markdown as string;
            expect(written).toContain('- [x] one');
            expect(written).toContain('- [x] two');
            expect(written).toContain('from master');
            expect(tx.roadmapSnapshot.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    markdown: BASE.replace('- [ ] two', '- [x] two'),
                    version: 3,
                }),
            });
            expect(tx.roadmapSyncState.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    update: expect.objectContaining({
                        baseCommit: 'new1111111',
                        baseMarkdown: file,
                    }),
                }),
            );
            expect(r).toMatchObject({
                mode: 'merge',
                applied: true,
                appChanged: true,
                snapshotId: 5,
                appVersion: 4,
            });
            expect(r.log.map((e) => e.kind)).toContain('to-app');
        });

        it('previews a merge without writing', async () => {
            roadmap.get.mockResolvedValue(doc(BASE, 3));
            const r = await service.pull('boss', { dryRun: true });
            expect(r).toMatchObject({
                mode: 'merge',
                applied: false,
                appChanged: true,
            });
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('moves the base without touching the app when master changed nothing the app lacks', async () => {
            roadmap.get.mockResolvedValue(doc(file, 3));
            const r = await service.pull('boss', {});
            expect(tx.roadmapDocument.updateMany).not.toHaveBeenCalled();
            expect(tx.roadmapSnapshot.create).not.toHaveBeenCalled();
            expect(tx.roadmapSyncState.upsert).toHaveBeenCalled();
            expect(r).toMatchObject({
                applied: true,
                appChanged: false,
                appVersion: 3,
            });
        });

        it('keeps a task master deleted in the app, and the base keeps it too', async () => {
            const deleted = '## 1.1 A\n\n- [ ] one\n';
            github.readFile.mockResolvedValue({
                content: deleted,
                commit: 'new2222222',
            });
            roadmap.get.mockResolvedValue(doc(BASE, 3));
            const r = await service.pull('boss', {});
            expect(r.appChanged).toBe(false);
            expect(r.log.map((e) => e.kind)).toEqual(['missing-from-file']);
            expect(tx.roadmapSyncState.upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    update: expect.objectContaining({ baseMarkdown: BASE }),
                }),
            );
        });

        it('loses cleanly when the roadmap was edited meanwhile', async () => {
            roadmap.get.mockResolvedValue(doc(BASE, 3));
            tx.roadmapDocument.updateMany.mockResolvedValue({ count: 0 });
            await expect(service.pull('boss', {})).rejects.toBeInstanceOf(
                ConflictException,
            );
        });
    });

    describe('autoPull (webhook and start-up)', () => {
        it("never replaces the app's copy: with no sync state it does nothing and does not throw", async () => {
            expect(await service.autoPull('github-webhook')).toBeNull();
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('does nothing without a token', async () => {
            github.isConfigured.mockReturnValue(false);
            expect(await service.autoPull('startup')).toBeNull();
            expect(github.readFile).not.toHaveBeenCalled();
        });

        it('swallows GitHub failures', async () => {
            prisma.roadmapSyncState.findUnique.mockResolvedValue({
                baseCommit: 'x',
                baseMarkdown: MASTER,
            });
            github.readFile.mockRejectedValue(new Error('down'));
            expect(await service.autoPull('startup')).toBeNull();
        });

        it('merges once sync is set up', async () => {
            prisma.roadmapSyncState.findUnique.mockResolvedValue({
                baseCommit: 'old',
                baseMarkdown: APP_OLD,
            });
            roadmap.get.mockResolvedValue(doc(APP_OLD, 3));
            const r = await service.autoPull('github-webhook');
            expect(r?.mode).toBe('merge');
            expect(r?.applied).toBe(true);
        });
    });
});
