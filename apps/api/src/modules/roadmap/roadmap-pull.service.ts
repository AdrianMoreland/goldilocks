import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    OnApplicationBootstrap,
} from '@nestjs/common';
import {
    absorbFile,
    findAppOnlyTasks,
    mergeRoadmap,
    type RoadmapPullRequest,
    type RoadmapPullResult,
} from '@goldilocks/shared-types';
import {
    GITHUB,
    type GithubFile,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { diffRoadmap, normalizeRoadmap } from './roadmap-file';
import { RoadmapService } from './roadmap.service';

const FILE_PATH = 'docs/ROADMAP.md';
const BRANCH = 'master';
const STATE_ID = 1;
const ROW_ID = 1;
const LIST_CAP = 50;

type Document = Awaited<ReturnType<RoadmapService['get']>>;

/**
 * Brings `docs/ROADMAP.md` on master into the app's roadmap (roadmap 1.20, slice 2;
 * docs/ROADMAP-SYNC-PULL-DESIGN.md). Nothing the app has that master lacks is lost: later pulls are a
 * three-way merge against the text both last agreed on; the first one replaces the app's copy, only
 * after a confirmation and with the old text kept as a snapshot. Every write, its snapshot and its audit
 * entry share one transaction, and the version guard makes a race with an edit lose cleanly.
 */
@Injectable()
export class RoadmapPullService implements OnApplicationBootstrap {
    private readonly logger = new Logger(RoadmapPullService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly roadmap: RoadmapService,
        @Inject(GITHUB) private readonly github: GithubPort,
    ) {}

    /** Pull once when the API starts, in the background, so a deploy never serves a stale roadmap. */
    onApplicationBootstrap() {
        if (process.env.NODE_ENV === 'test') return;
        void this.autoPull('startup');
    }

    /** The button: preview with `dryRun`, then apply. The first run needs `confirmReplace`. */
    pull(
        actor: string,
        options: RoadmapPullRequest = {},
    ): Promise<RoadmapPullResult> {
        return this.run(actor, options, true);
    }

    /**
     * For the webhook and start-up: merges only. Never replaces the app's copy (that stays a deliberate
     * click), never throws, and does nothing when sync is not set up. Returns null if it did not run.
     */
    async autoPull(actor: string): Promise<RoadmapPullResult | null> {
        try {
            if (!this.github.isConfigured()) return null;
            return await this.run(actor, {}, false);
        } catch (e) {
            this.logger.warn(
                `Roadmap pull (${actor}) did not run: ${e instanceof Error ? e.message : String(e)}`,
            );
            return null;
        }
    }

    private async run(
        actor: string,
        options: RoadmapPullRequest,
        mayAdopt: boolean,
    ): Promise<RoadmapPullResult> {
        if (!this.github.isConfigured()) {
            throw new BadRequestException(
                'Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.',
            );
        }
        const [app, file, state] = await Promise.all([
            this.roadmap.get(),
            this.readMaster(),
            this.prisma.roadmapSyncState.findUnique({
                where: { id: STATE_ID },
            }),
        ]);

        if (!state) {
            if (!mayAdopt) throw new Error('first pull needs the button');
            return this.adopt(actor, options, app, file);
        }
        return this.merge(actor, options, app, file, state);
    }

    private async readMaster(): Promise<GithubFile> {
        try {
            return await this.github.readFile(FILE_PATH, BRANCH);
        } catch (e) {
            throw new BadGatewayException(
                e instanceof Error ? e.message : 'GitHub could not be read',
            );
        }
    }

    /** First run: the app's copy becomes master's. Preview, confirmation, snapshot, then write. */
    private async adopt(
        actor: string,
        options: RoadmapPullRequest,
        app: Document,
        file: GithubFile,
    ): Promise<RoadmapPullResult> {
        const same =
            normalizeRoadmap(file.content) === normalizeRoadmap(app.markdown);
        const found = same
            ? { appOnly: [], ticksOnlyInApp: [] }
            : findAppOnlyTasks(app.markdown, file.content);
        const diff = same
            ? { added: 0, removed: 0 }
            : diffRoadmap(file.content, app.markdown);
        const preview: RoadmapPullResult = {
            mode: 'adopt',
            applied: false,
            commit: file.commit,
            appChanged: !same,
            log: [],
            appOnlyTasks: found.appOnly.slice(0, LIST_CAP),
            appOnlyTaskCount: found.appOnly.length,
            ticksOnlyInApp: found.ticksOnlyInApp.slice(0, LIST_CAP),
            ticksOnlyInAppCount: found.ticksOnlyInApp.length,
            appOnlyLines: diff.added,
            masterOnlyLines: diff.removed,
            snapshotId: null,
            appVersion: app.version,
        };
        if (options.dryRun) return preview;
        if (!options.confirmReplace) {
            throw new BadRequestException(
                "The first pull replaces the app's copy of the roadmap with master's. Confirm it (confirmReplace) after reading the preview.",
            );
        }

        const short = file.commit.slice(0, 7);
        const { snapshotId, version } = await this.prisma.$transaction(
            async (tx) => {
                let snapshotId: number | null = null;
                let version = app.version;
                if (!same) {
                    if (app.version > 0) {
                        const snapshot = await tx.roadmapSnapshot.create({
                            data: {
                                markdown: app.markdown,
                                version: app.version,
                                reason: `before the first pull of master ${short}`,
                                createdBy: actor,
                            },
                        });
                        snapshotId = snapshot.id;
                        const saved = await tx.roadmapDocument.updateMany({
                            where: { id: ROW_ID, version: app.version },
                            data: {
                                markdown: file.content,
                                version: { increment: 1 },
                                updatedBy: actor,
                            },
                        });
                        if (saved.count === 0) throw this.raced();
                        version = app.version + 1;
                    } else {
                        await tx.roadmapDocument.create({
                            data: {
                                id: ROW_ID,
                                markdown: file.content,
                                updatedBy: actor,
                            },
                        });
                        version = 1;
                    }
                }
                await this.saveState(tx, file.commit, file.content, actor);
                await this.audit.record(
                    actor,
                    'roadmap',
                    same
                        ? `pull (first run): the app already matched master ${short}`
                        : `pull (first run): replaced the app's copy with master ${short}; snapshot ${snapshotId ?? 'none'}`,
                    tx,
                );
                return { snapshotId, version };
            },
        );
        return {
            ...preview,
            applied: true,
            snapshotId,
            appVersion: version,
        };
    }

    /** Later runs: three-way merge against the text both sides last agreed on. */
    private async merge(
        actor: string,
        options: RoadmapPullRequest,
        app: Document,
        file: GithubFile,
        state: { baseCommit: string; baseMarkdown: string },
    ): Promise<RoadmapPullResult> {
        const empty = {
            appOnlyTasks: [],
            appOnlyTaskCount: 0,
            ticksOnlyInApp: [],
            ticksOnlyInAppCount: 0,
            appOnlyLines: 0,
            masterOnlyLines: 0,
            snapshotId: null,
        };
        if (state.baseCommit === file.commit) {
            return {
                ...empty,
                mode: 'nothing',
                applied: false,
                commit: file.commit,
                appChanged: false,
                log: [],
                appVersion: app.version,
            };
        }
        if (app.version === 0) {
            throw new NotFoundException(
                'The app has no roadmap to merge into. Run the first pull again.',
            );
        }

        const merged = mergeRoadmap(
            state.baseMarkdown,
            file.content,
            app.markdown,
        );
        const preview: RoadmapPullResult = {
            ...empty,
            mode: 'merge',
            applied: false,
            commit: file.commit,
            appChanged: merged.appChanged,
            log: merged.log,
            appVersion: app.version,
        };
        if (options.dryRun) return preview;

        const short = file.commit.slice(0, 7);
        const newBase = absorbFile(state.baseMarkdown, file.content);
        const { snapshotId, version } = await this.prisma.$transaction(
            async (tx) => {
                let snapshotId: number | null = null;
                let version = app.version;
                if (merged.appChanged) {
                    const snapshot = await tx.roadmapSnapshot.create({
                        data: {
                            markdown: app.markdown,
                            version: app.version,
                            reason: `before merging master ${short}`,
                            createdBy: actor,
                        },
                    });
                    snapshotId = snapshot.id;
                    const saved = await tx.roadmapDocument.updateMany({
                        where: { id: ROW_ID, version: app.version },
                        data: {
                            markdown: merged.forApp,
                            version: { increment: 1 },
                            updatedBy: actor,
                        },
                    });
                    if (saved.count === 0) throw this.raced();
                    version = app.version + 1;
                }
                await this.saveState(tx, file.commit, newBase, actor);
                await this.audit.record(
                    actor,
                    'roadmap',
                    merged.appChanged
                        ? `pull: merged master ${short} into the app (${merged.log.length} change(s)); snapshot ${snapshotId}`
                        : `pull: master ${short} needed no change in the app`,
                    tx,
                );
                return { snapshotId, version };
            },
        );
        return { ...preview, applied: true, snapshotId, appVersion: version };
    }

    private saveState(
        tx: Pick<PrismaService, 'roadmapSyncState'>,
        commit: string,
        baseMarkdown: string,
        actor: string,
    ) {
        const data = {
            baseCommit: commit,
            baseMarkdown,
            syncedAt: new Date(),
            syncedBy: actor,
        };
        return tx.roadmapSyncState.upsert({
            where: { id: STATE_ID },
            create: { id: STATE_ID, ...data },
            update: data,
        });
    }

    private raced() {
        return new ConflictException(
            'The roadmap changed while pulling. Nothing was changed; try again.',
        );
    }
}
