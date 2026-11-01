import { Inject, Injectable, Logger } from '@nestjs/common';
import type { RoadmapSyncStatus } from '@goldilocks/shared-types';
import {
    GITHUB,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { diffRoadmap, normalizeRoadmap } from './roadmap-file';
import { RoadmapService } from './roadmap.service';

const FILE_PATH = 'docs/ROADMAP.md';
const BRANCH = 'master';
const PREVIEW_LINES = 40;

/**
 * Read-only: how the app's roadmap compares with `docs/ROADMAP.md` on master (roadmap 1.20, slice 1).
 * It never throws for a GitHub problem: the page shows the state `unavailable` and the reason instead.
 */
@Injectable()
export class RoadmapSyncService {
    private readonly logger = new Logger(RoadmapSyncService.name);

    constructor(
        private readonly roadmap: RoadmapService,
        @Inject(GITHUB) private readonly github: GithubPort,
    ) {}

    async status(): Promise<RoadmapSyncStatus> {
        const app = await this.roadmap.get();
        const base: RoadmapSyncStatus = {
            state: 'unconfigured',
            repo: this.github.repo,
            branch: BRANCH,
            masterCommit: null,
            appVersion: app.version,
            appUpdatedAt: app.updatedAt,
            appOnlyLines: 0,
            masterOnlyLines: 0,
            preview: [],
            openSyncPr: null,
            tokenExpiresAt: null,
            error: null,
        };
        if (!this.github.isConfigured()) return base;

        try {
            const [file, prs] = await Promise.all([
                this.github.readFile(FILE_PATH, BRANCH),
                this.github.listOpenPullRequests(),
            ]);
            const syncPr = prs.find(
                (p) =>
                    p.title.startsWith('[roadmap-sync]') ||
                    p.branch.startsWith('roadmap-sync/'),
            );
            const same =
                normalizeRoadmap(file.content) ===
                normalizeRoadmap(app.markdown);
            // diffRoadmap(from, to): `removed` are lines only in `from`, `added` lines only in `to`.
            const diff = same
                ? { added: 0, removed: 0, lines: [] as string[] }
                : diffRoadmap(file.content, app.markdown);
            return {
                ...base,
                state: same ? 'in-sync' : 'differs',
                masterCommit: file.commit,
                appOnlyLines: diff.added,
                masterOnlyLines: diff.removed,
                preview: diff.lines.slice(0, PREVIEW_LINES),
                openSyncPr: syncPr
                    ? {
                          number: syncPr.number,
                          title: syncPr.title,
                          url: syncPr.url,
                      }
                    : null,
                tokenExpiresAt:
                    this.github.tokenExpiresAt()?.toISOString() ?? null,
            };
        } catch (e) {
            const message =
                e instanceof Error ? e.message : 'GitHub could not be read';
            this.logger.warn(`Roadmap sync status: ${message}`);
            return {
                ...base,
                state: 'unavailable',
                tokenExpiresAt:
                    this.github.tokenExpiresAt()?.toISOString() ?? null,
                error: message,
            };
        }
    }
}
