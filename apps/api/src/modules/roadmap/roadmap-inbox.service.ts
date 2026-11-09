import {
    BadGatewayException,
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import type {
    RoadmapInbox,
    RoadmapInboxItem,
    RoadmapInboxPromote,
    RoadmapInboxRefresh,
} from '@goldilocks/shared-types';
import {
    GITHUB,
    type GithubIssue,
    type GithubPort,
} from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoadmapService } from './roadmap.service';

export const INBOX_LABEL = 'roadmap';
const KINDS = ['idea', 'task', 'fix', 'bug'];

/**
 * The kind of a captured idea: a label of that name, or the "Kind" answer of the issue form
 * (`### Kind` then the choice). Null when the issue says nothing.
 */
export function kindOf(labels: string[], body: string): string | null {
    const label = labels.find((l) => KINDS.includes(l.toLowerCase()));
    if (label) return capitalise(label);
    const form = /###\s*Kind\s*\r?\n+\s*([^\r\n]+)/i.exec(body)?.[1]?.trim();
    if (form && KINDS.includes(form.toLowerCase())) return capitalise(form);
    return null;
}

function capitalise(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

type Row = {
    id: number;
    /** Null for queue rows (source phone or web); only GitHub rows reach the inbox page. */
    issueNumber: number | null;
    title: string;
    body: string;
    kind: string | null;
    url: string;
    status: string;
    issueCreatedAt: Date;
    handledAt: Date | null;
    handledBy: string | null;
};

function toItem(r: Row): RoadmapInboxItem {
    return {
        id: r.id,
        issueNumber: r.issueNumber ?? 0,
        title: r.title,
        body: r.body,
        kind: r.kind,
        url: r.url,
        status: r.status as RoadmapInboxItem['status'],
        issueCreatedAt: r.issueCreatedAt.toISOString(),
        handledAt: r.handledAt?.toISOString() ?? null,
        handledBy: r.handledBy,
    };
}

/**
 * The roadmap inbox (roadmap 1.20 slice 4): open GitHub issues labelled `roadmap` copied into the app so they can be
 * promoted to a roadmap task or dismissed. Fetching only reads GitHub. Handling an item also closes its issue, but that
 * is best effort: a token without issue permission never blocks the triage, it just leaves the issue open (and the
 * next refresh will not bring it back, because the row already exists).
 */
@Injectable()
export class RoadmapInboxService {
    private readonly logger = new Logger(RoadmapInboxService.name);
    private refreshing: Promise<RoadmapInboxRefresh> | null = null;

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly roadmap: RoadmapService,
        @Inject(GITHUB) private readonly github: GithubPort,
    ) {}

    async list(): Promise<RoadmapInbox> {
        const rows = await this.prisma.roadmapInbox.findMany({
            where: { source: 'github' },
            orderBy: [{ issueCreatedAt: 'desc' }],
            take: 200,
        });
        // New items first, then the handled ones, each newest first.
        const items = rows.map(toItem);
        items.sort(
            (a, b) =>
                Number(a.status !== 'new') - Number(b.status !== 'new') ||
                b.issueCreatedAt.localeCompare(a.issueCreatedAt),
        );
        return { items, configured: this.github.isConfigured() };
    }

    /** Fetch new issues. Concurrent calls (a webhook and the schedule) share one run. */
    refresh(): Promise<RoadmapInboxRefresh> {
        this.refreshing ??= this.doRefresh().finally(() => {
            this.refreshing = null;
        });
        return this.refreshing;
    }

    /** For the webhook and the schedule: never throws. */
    async autoRefresh(): Promise<RoadmapInboxRefresh | null> {
        if (!this.github.isConfigured()) return null;
        try {
            return await this.refresh();
        } catch (e) {
            this.logger.warn(
                `Inbox refresh did not run: ${e instanceof Error ? e.message : String(e)}`,
            );
            return null;
        }
    }

    private async doRefresh(): Promise<RoadmapInboxRefresh> {
        if (!this.github.isConfigured()) {
            throw new BadRequestException(
                'Sync is not set up: GITHUB_SYNC_TOKEN is missing on the API.',
            );
        }
        let issues: GithubIssue[];
        try {
            issues = await this.github.listOpenIssues(INBOX_LABEL);
        } catch (e) {
            throw new BadGatewayException(
                e instanceof Error ? e.message : 'GitHub could not be read',
            );
        }

        // Queue rows (phone or web) have no issue number and are not part of this comparison.
        const known = (
            await this.prisma.roadmapInbox.findMany({
                where: { source: 'github' },
                select: { issueNumber: true, status: true },
            })
        ).flatMap((k) =>
            k.issueNumber === null
                ? []
                : [{ issueNumber: k.issueNumber, status: k.status }],
        );
        const knownNumbers = new Set(known.map((k) => k.issueNumber));
        const fresh = issues.filter((i) => !knownNumbers.has(i.number));
        if (fresh.length > 0) {
            await this.prisma.roadmapInbox.createMany({
                data: fresh.map((i) => ({
                    issueNumber: i.number,
                    title: i.title.slice(0, 500),
                    body: i.body.slice(0, 10_000),
                    kind: kindOf(i.labels, i.body),
                    url: i.url,
                    issueCreatedAt: new Date(i.createdAt),
                })),
                skipDuplicates: true,
            });
        }

        // A new item whose issue is no longer in the open list was closed on GitHub: it needs no triage here.
        // Only trusted when the list is short enough to be complete (the API returns at most 100).
        let closedOnGithub = 0;
        if (issues.length < 100) {
            const open = new Set(issues.map((i) => i.number));
            const gone = known
                .filter((k) => k.status === 'new' && !open.has(k.issueNumber))
                .map((k) => k.issueNumber);
            if (gone.length > 0) {
                const res = await this.prisma.roadmapInbox.updateMany({
                    where: { issueNumber: { in: gone }, status: 'new' },
                    data: {
                        status: 'dismissed',
                        handledAt: new Date(),
                        handledBy: 'github',
                    },
                });
                closedOnGithub = res.count;
            }
        }
        return { added: fresh.length, closedOnGithub };
    }

    /** Add the item as a task in a section of the roadmap, mark it promoted and close the issue. */
    async promote(
        id: number,
        input: RoadmapInboxPromote,
        actor: string,
    ): Promise<RoadmapInboxItem> {
        const item = await this.mustBeNew(id);
        // The roadmap edit validates the version, the section and the text; it throws before anything is marked.
        await this.roadmap.edit(
            {
                version: input.version,
                edit: {
                    type: 'add',
                    sectionLine: input.sectionLine,
                    text: input.text,
                },
            },
            { email: actor },
        );
        return this.finish(
            item,
            'promoted',
            actor,
            `promote #${item.issueNumber}: ${input.text}`,
            'Added to the roadmap.',
            'completed',
        );
    }

    async dismiss(id: number, actor: string): Promise<RoadmapInboxItem> {
        const item = await this.mustBeNew(id);
        return this.finish(
            item,
            'dismissed',
            actor,
            `dismiss #${item.issueNumber}: ${item.title}`,
            'Not added to the roadmap.',
            'not_planned',
        );
    }

    private async mustBeNew(id: number): Promise<Row> {
        const item = await this.prisma.roadmapInbox.findUnique({
            where: { id },
        });
        if (!item || item.source !== 'github' || item.issueNumber === null) {
            throw new NotFoundException('Inbox item not found');
        }
        if (item.status !== 'new') {
            throw new BadRequestException('That item was already handled');
        }
        return item;
    }

    private async finish(
        item: Row,
        status: 'promoted' | 'dismissed',
        actor: string,
        detail: string,
        comment: string,
        reason: 'completed' | 'not_planned',
    ): Promise<RoadmapInboxItem> {
        const saved = await this.prisma.$transaction(async (tx) => {
            const row = await tx.roadmapInbox.update({
                where: { id: item.id },
                data: { status, handledAt: new Date(), handledBy: actor },
            });
            await this.audit.record(actor, 'roadmap-inbox', detail, tx);
            return row;
        });
        if (this.github.isConfigured() && item.issueNumber !== null) {
            try {
                await this.github.closeIssue(item.issueNumber, comment, reason);
            } catch (e) {
                this.logger.warn(
                    `Issue #${item.issueNumber} was not closed: ${e instanceof Error ? e.message : String(e)}`,
                );
            }
        }
        return toItem(saved);
    }
}
