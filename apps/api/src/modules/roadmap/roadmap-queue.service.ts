import { BadRequestException, Injectable } from '@nestjs/common';
import {
    ROADMAP_QUEUE_MAX_TEXT,
    type RoadmapQueueAppended,
    type RoadmapQueueEntry,
    type RoadmapQueueFiledResult,
    type RoadmapQueueList,
    type RoadmapQueueSource,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { RoadmapWriter } from './roadmap-writer';

const SOURCES = ['phone', 'web'];
const LIST_CAP = 100;
const PENDING_CAP = 200;

const dublinDate = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Dublin' }).format(d);

/** One INBOX line: `- 2026-11-09 (phone): note text`. The laptop check lints lines against this shape. */
export const queueLine = (at: Date, source: string, text: string) =>
    `- ${dublinDate(at)} (${source}): ${text}`;

/** One line, collapsed whitespace, capped. Empty after cleaning is refused. */
export function cleanQueueText(raw: string): string {
    const text = raw
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, ROADMAP_QUEUE_MAX_TEXT);
    if (!text) throw new BadRequestException('Note is empty');
    return text;
}

type Row = {
    id: number;
    title: string;
    source: string;
    status: string;
    issueCreatedAt: Date;
    handledAt: Date | null;
};

function toEntry(r: Row): RoadmapQueueEntry {
    return {
        id: r.id,
        text: r.title,
        source: r.source as RoadmapQueueSource,
        status: r.status === 'filed' ? 'filed' : 'new',
        line: queueLine(r.issueCreatedAt, r.source, r.title),
        createdAt: r.issueCreatedAt.toISOString(),
        filedAt: r.handledAt?.toISOString() ?? null,
    };
}

/**
 * The roadmap queue: notes typed in the app or sent from the phone, kept in `roadmap_inbox` (rows with
 * source phone or web; GitHub-issue rows are not touched). `append` is the RoadmapWriter implementation;
 * a laptop tool reads the new rows, adds their lines to docs/INBOX.md and marks them filed.
 */
@Injectable()
export class RoadmapQueueService implements RoadmapWriter {
    constructor(private readonly prisma: PrismaService) {}

    async append(entry: {
        text: string;
        source: RoadmapQueueSource;
    }): Promise<RoadmapQueueAppended> {
        const text = cleanQueueText(entry.text);
        const at = new Date();
        const row = await this.prisma.roadmapInbox.create({
            data: {
                title: text,
                url: '',
                source: entry.source,
                status: 'new',
                issueCreatedAt: at,
            },
        });
        return { id: row.id, line: queueLine(at, entry.source, text) };
    }

    /** New notes first, then filed ones, newest first within each (for the page). */
    async list(): Promise<RoadmapQueueList> {
        const rows = await this.prisma.roadmapInbox.findMany({
            where: { source: { in: SOURCES } },
            orderBy: { issueCreatedAt: 'desc' },
            take: LIST_CAP,
        });
        const entries = rows.map(toEntry);
        entries.sort(
            (a, b) =>
                Number(a.status !== 'new') - Number(b.status !== 'new') ||
                b.createdAt.localeCompare(a.createdAt),
        );
        return { entries };
    }

    /** Notes a laptop session has not filed yet, oldest first, so INBOX.md stays in order. */
    async pending(): Promise<RoadmapQueueList> {
        const rows = await this.prisma.roadmapInbox.findMany({
            where: { source: { in: SOURCES }, status: 'new' },
            orderBy: { id: 'asc' },
            take: PENDING_CAP,
        });
        return { entries: rows.map(toEntry) };
    }

    /** Marks notes as filed. Ids that are not new queue rows are left alone and not counted. */
    async markFiled(
        ids: number[],
        actor: string,
    ): Promise<RoadmapQueueFiledResult> {
        const res = await this.prisma.roadmapInbox.updateMany({
            where: { id: { in: ids }, source: { in: SOURCES }, status: 'new' },
            data: { status: 'filed', handledAt: new Date(), handledBy: actor },
        });
        return { filed: res.count };
    }
}
