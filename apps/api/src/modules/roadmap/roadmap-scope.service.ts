import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import {
    bundleScopeFiles,
    EMPTY_SCOPE_VIEW,
    parseScopeBundle,
    ROADMAP_SCOPE_FILES,
    type RoadmapScope,
    type RoadmapScopeRefresh,
} from '@goldilocks/shared-types';
import {
    GITHUB,
    type GithubFile,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

/** `roadmap_document` row 1 holds the old single-file roadmap; row 2 holds the scope-file bundle. */
const ROW_ID = 2;
const DEFAULT_BRANCH = 'main';
const HEADER = /^<!--roadmap-scope repo=(\S+) branch=(\S+) commit=(\S+)-->\n/;

/**
 * The roadmap kept as scope files in a separate repository, read-only. The app pulls the files named in
 * `ROADMAP_SCOPE_FILES` from `GITHUB_ROADMAP_REPO` (branch `GITHUB_ROADMAP_BRANCH`, default `main`) and
 * stores them as one bundle in `roadmap_document` row 2. A pull replaces the stored copy: the app holds no
 * edits of its own on this path. Off unless `ROADMAP_SOURCE=scope`; the old row 1 flow is untouched.
 */
@Injectable()
export class RoadmapScopeService {
    private readonly logger = new Logger(RoadmapScopeService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        @Inject(GITHUB) private readonly github: GithubPort,
    ) {}

    enabled(): boolean {
        return process.env.ROADMAP_SOURCE === 'scope';
    }

    private target() {
        return {
            repo: process.env.GITHUB_ROADMAP_REPO?.trim() || null,
            branch: process.env.GITHUB_ROADMAP_BRANCH?.trim() || DEFAULT_BRANCH,
        };
    }

    private configured(): boolean {
        return this.github.isConfigured() && !!this.target().repo;
    }

    async get(): Promise<RoadmapScope> {
        const row = await this.prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });
        const { repo, branch } = this.target();
        const base = {
            enabled: this.enabled(),
            configured: this.configured(),
        };
        if (!row) {
            return {
                ...base,
                empty: true,
                repo,
                branch,
                commit: null,
                version: 0,
                syncedAt: null,
                syncedBy: null,
                view: EMPTY_SCOPE_VIEW,
            };
        }
        const header = HEADER.exec(row.markdown);
        return {
            ...base,
            empty: false,
            repo: header?.[1] ?? repo,
            branch: header?.[2] ?? branch,
            commit: header?.[3] ?? null,
            version: row.version,
            syncedAt: row.updatedAt.toISOString(),
            syncedBy: row.updatedBy,
            view: parseScopeBundle(row.markdown),
        };
    }

    /** The button. Throws readable errors; nothing is written unless every required file was read. */
    async refresh(actor: string): Promise<RoadmapScopeRefresh> {
        const { repo, branch } = this.target();
        if (!this.github.isConfigured()) {
            throw new BadRequestException(
                'Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.',
            );
        }
        if (!repo) {
            throw new BadRequestException(
                'GITHUB_ROADMAP_REPO is not set on the API.',
            );
        }

        const read = await Promise.all(
            ROADMAP_SCOPE_FILES.map(async (f) => {
                try {
                    const file = await this.github.readFile(
                        f.path,
                        branch,
                        repo,
                    );
                    return { ...f, file };
                } catch (e) {
                    if (!f.required && notFound(e)) return { ...f, file: null };
                    throw new BadGatewayException(
                        `${f.path}: ${e instanceof Error ? e.message : 'GitHub could not be read'}`,
                    );
                }
            }),
        );
        const found = read.filter(
            (r): r is typeof r & { file: GithubFile } => r.file !== null,
        );
        const commits = new Set(found.map((r) => r.file.commit));
        if (commits.size !== 1) {
            throw new BadGatewayException(
                'The roadmap repository changed while it was being read. Try again.',
            );
        }
        const commit = [...commits][0];
        const body = bundleScopeFiles(
            found.map((r) => ({ path: r.path, content: r.file.content })),
        );
        const view = parseScopeBundle(body);
        if (view.items.length === 0) {
            throw new BadGatewayException(
                'The scope files held no roadmap items; nothing was stored.',
            );
        }
        const markdown = `<!--roadmap-scope repo=${repo} branch=${branch} commit=${commit}-->\n${body}`;

        const current = await this.prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });
        const summary = {
            commit,
            items: view.items.length,
            decisions: view.decisions.filter((d) => !d.settled).length,
        };
        if (current?.markdown === markdown) {
            return { changed: false, version: current.version, ...summary };
        }

        const version = await this.prisma.$transaction(async (tx) => {
            let next: number;
            if (!current) {
                await tx.roadmapDocument.create({
                    data: {
                        id: ROW_ID,
                        markdown,
                        version: 1,
                        updatedBy: actor,
                    },
                });
                next = 1;
            } else {
                const saved = await tx.roadmapDocument.updateMany({
                    where: { id: ROW_ID, version: current.version },
                    data: {
                        markdown,
                        version: { increment: 1 },
                        updatedBy: actor,
                    },
                });
                if (saved.count === 0) {
                    throw new ConflictException(
                        'The stored roadmap changed while saving. Try again.',
                    );
                }
                next = current.version + 1;
            }
            await this.audit.record(
                actor,
                'roadmap',
                `scope pull: ${repo}@${commit.slice(0, 7)}, ${summary.items} item(s)`,
                tx,
            );
            return next;
        });
        return { changed: true, version, ...summary };
    }

    /** Schedule and start-up: only when switched on and set up; never throws. */
    async autoRefresh(actor: string): Promise<void> {
        if (!this.enabled() || !this.configured()) return;
        try {
            await this.refresh(actor);
        } catch (e) {
            this.logger.warn(
                `Roadmap scope pull (${actor}) did not run: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }
}

function notFound(e: unknown): boolean {
    return (
        typeof e === 'object' &&
        e !== null &&
        (e as { status?: number | null }).status === 404
    );
}
