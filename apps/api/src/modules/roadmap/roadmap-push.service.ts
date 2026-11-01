import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common';
import {
    mergeRoadmap,
    type RoadmapPushRequest,
    type RoadmapPushResult,
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
const BASE_BRANCH = 'master';
export const PUSH_BRANCH = 'roadmap-sync/app';
const PR_TITLE = '[roadmap-sync] app edits';
const COMMIT_MESSAGE = 'roadmap-sync: app edits';
const STATE_ID = 1;
const PREVIEW_LINES = 40;
/** A push may not shrink master's file by more than 10%: the one automatic sanity check. */
const MIN_LENGTH_RATIO = 0.9;

/**
 * Sends the app's roadmap edits to GitHub as a pull request that changes only `docs/ROADMAP.md`
 * (roadmap 1.20, slice 3; docs/ROADMAP-SYNC-PUSH-DESIGN.md). The file is `mergeRoadmap(base, master, app).forFile`,
 * so master's own newer changes ride along and nothing is reverted. The app's text and the base are never
 * touched here: after the owner merges the PR, the webhook pull brings everything level. Nothing merges.
 */
@Injectable()
export class RoadmapPushService {
    /** One push at a time per API process. */
    private busy = false;

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly roadmap: RoadmapService,
        @Inject(GITHUB) private readonly github: GithubPort,
    ) {}

    /** The button: preview with `dryRun`, then apply. */
    async push(
        actor: string,
        options: RoadmapPushRequest = {},
    ): Promise<RoadmapPushResult> {
        if (options.dryRun) return this.run(actor, true);
        if (this.busy) {
            throw new ConflictException(
                'A push is already running. Try again in a moment.',
            );
        }
        this.busy = true;
        try {
            return await this.run(actor, false);
        } finally {
            this.busy = false;
        }
    }

    private async run(
        actor: string,
        dryRun: boolean,
    ): Promise<RoadmapPushResult> {
        if (!this.github.isConfigured()) {
            throw new BadRequestException(
                'Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.',
            );
        }
        const [app, state, file] = await Promise.all([
            this.roadmap.get(),
            this.prisma.roadmapSyncState.findUnique({
                where: { id: STATE_ID },
            }),
            this.readMaster(),
        ]);
        if (!state || app.version === 0) {
            throw new BadRequestException(
                'Do the first pull from GitHub before sending edits.',
            );
        }

        const merged = mergeRoadmap(
            state.baseMarkdown,
            file.content,
            app.markdown,
        );
        const edits = merged.log.filter((e) => e.kind === 'to-file');
        if (!merged.fileChanged) {
            return {
                mode: 'nothing',
                applied: false,
                commit: file.commit,
                edits: [],
                diffPreview: [],
                prNumber: null,
                prUrl: null,
            };
        }
        if (
            normalizeRoadmap(merged.forFile).length <
            normalizeRoadmap(file.content).length * MIN_LENGTH_RATIO
        ) {
            throw new BadRequestException(
                'This would delete more than 10% of the roadmap on master, so nothing was sent.',
            );
        }

        const diff = diffRoadmap(file.content, merged.forFile);
        const preview: RoadmapPushResult = {
            mode: 'push',
            applied: false,
            commit: file.commit,
            edits,
            diffPreview: diff.lines.slice(0, PREVIEW_LINES),
            prNumber: null,
            prUrl: null,
        };
        if (dryRun) return preview;

        const body = this.prBody(actor, edits.length, diff.lines);
        try {
            const open = (await this.github.listOpenPullRequests()).find(
                (p) => p.branch === PUSH_BRANCH,
            );
            await this.github.writeFileOnBranch({
                branch: PUSH_BRANCH,
                baseCommit: file.commit,
                path: FILE_PATH,
                content: merged.forFile,
                message: COMMIT_MESSAGE,
            });
            let pr = open;
            if (open) {
                await this.github.updatePullRequest(open.number, body);
            } else {
                pr = await this.github.openPullRequest({
                    title: PR_TITLE,
                    body,
                    head: PUSH_BRANCH,
                    base: BASE_BRANCH,
                });
            }
            const { number, url } = pr!;
            await this.audit.record(
                actor,
                'roadmap',
                `push: ${open ? 'updated' : 'opened'} PR #${number}, ${edits.length} edit(s)`,
            );
            return { ...preview, applied: true, prNumber: number, prUrl: url };
        } catch (e) {
            throw new BadGatewayException(
                e instanceof Error ? e.message : 'GitHub could not be written',
            );
        }
    }

    private async readMaster(): Promise<GithubFile> {
        try {
            return await this.github.readFile(FILE_PATH, BASE_BRANCH);
        } catch (e) {
            throw new BadGatewayException(
                e instanceof Error ? e.message : 'GitHub could not be read',
            );
        }
    }

    private prBody(actor: string, edits: number, diffLines: string[]) {
        const changed = diffLines.filter((l) => /^[+-] /.test(l));
        const shown = changed.slice(0, PREVIEW_LINES);
        return [
            'Roadmap: none',
            '',
            `Sent from the app's Project page by ${actor}.`,
            `${edits} edit(s) from the app, ${changed.length} changed line(s).`,
            '',
            '```diff',
            ...shown,
            ...(changed.length > shown.length
                ? [`… and ${changed.length - shown.length} more`]
                : []),
            '```',
        ].join('\n');
    }
}
