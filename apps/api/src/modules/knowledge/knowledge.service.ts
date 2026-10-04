import { createHash } from 'node:crypto';
import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {
    findBrokenLinks,
    parseKbDocument,
    splitFrontmatter,
    splitSections,
    findLinks,
    type BrokenKbLink,
    type KbDocument,
    type KbStatus,
    type ParsedKbDocument,
    type UpdateKbDocumentRequest,
} from '@goldilocks/shared-types';
import type { KbDocument as KbDocumentRow } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';

export interface KbImportFile {
    /** File name, used only to tell the operator which file a problem belongs to. */
    name: string;
    raw: string;
}

export interface KbImportOptions {
    /**
     * Import even though some `[[slug]]` links point at SOPs that don't exist
     * yet. The README's rule is that such a link fails the import; this is the
     * explicit, reported escape hatch for a set that is still being written.
     * Links to a missing *section* are never allowed.
     */
    allowUnresolvedLinks?: boolean;
    /** Overwrite a stored SOP whose version is higher than the file's (e.g. after an in-app edit). */
    force?: boolean;
    /** Validate and report, write nothing. */
    dryRun?: boolean;
}

export type KbImportAction =
    | 'created'
    | 'updated'
    | 'unchanged'
    | 'skipped'
    | 'rejected';

export interface KbImportFileResult {
    file: string;
    slug: string | null;
    action: KbImportAction;
    errors: string[];
}

export interface KbImportReport {
    results: KbImportFileResult[];
    /** Links to SOPs that don't exist (yet). Empty unless allowUnresolvedLinks let them through. */
    unresolvedLinks: BrokenKbLink[];
    /** False when validation failed (nothing written) or on a dry run. */
    applied: boolean;
}

function contentHash(raw: string): string {
    return createHash('sha256')
        .update(raw.replace(/\r\n/g, '\n'))
        .digest('hex');
}

function toDay(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function toDocument(row: KbDocumentRow): KbDocument {
    return {
        slug: row.slug,
        title: row.title,
        category: row.category,
        jurisdiction: row.jurisdiction,
        owner: row.owner,
        status: row.status,
        version: row.version,
        contentUpdatedOn: toDay(row.contentUpdatedOn),
        markdown: row.markdown,
    };
}

function todayUtc(): Date {
    const now = new Date();
    return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
}

/**
 * Knowledge Center (roadmap 1.4). Owns who may see which SOP and the rules for
 * bringing SOP files in. Parsing, anchors and link rules live in
 * @goldilocks/shared-types so the web reader uses the very same ones.
 */
@Injectable()
export class KnowledgeService {
    private readonly logger = new Logger(KnowledgeService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    /**
     * Every SOP the caller may read. Draft SOPs are included — the reader shows
     * them with a "Not yet approved" banner (README) — but retired ones are
     * kept for audit only and are visible to admins alone.
     */
    async listDocuments(isAdmin: boolean): Promise<KbDocument[]> {
        const rows = await this.prisma.kbDocument.findMany({
            where: isAdmin ? undefined : { status: { not: 'retired' } },
            orderBy: { slug: 'asc' },
        });

        return rows.map(toDocument);
    }

    /**
     * Only the SOPs a manager has approved, in a fixed order (by slug). This is what
     * the AI assistant may answer from (README: "approved: visible and used by the AI
     * assistant"; drafts are not). The order is deliberate: the assistant's prompt is
     * built from it, and an identical prompt prefix is what lets OpenAI's prompt cache
     * reuse it between questions.
     */
    async listApproved(): Promise<KbDocument[]> {
        const rows = await this.prisma.kbDocument.findMany({
            where: { status: 'approved' },
            orderBy: { slug: 'asc' },
        });
        return rows.map(toDocument);
    }

    /**
     * Admin edit of a SOP's content. The approval workflow lives here: changing
     * the procedure's text or title sends an approved SOP back to draft, because
     * what was approved no longer exists. Changing only the owner does not.
     * Nothing is saved that would break a link into this SOP from another.
     */
    async updateDocument(
        slug: string,
        dto: UpdateKbDocumentRequest,
        actor: string,
    ): Promise<KbDocument> {
        const existing = await this.requireDocument(slug);
        const markdown = dto.markdown.trim();

        if (splitFrontmatter(markdown)) {
            throw new BadRequestException(
                'Remove the --- block at the top: title and owner have their own fields.',
            );
        }

        const others = await this.prisma.kbDocument.findMany({
            where: { slug: { not: slug } },
            select: { slug: true, markdown: true },
        });
        const universe = [
            {
                slug,
                sections: splitSections(markdown),
                links: findLinks(markdown),
            },
            ...others.map((row) => ({
                slug: row.slug,
                sections: splitSections(row.markdown),
                links: findLinks(row.markdown),
            })),
        ];
        // A link to a SOP that isn't written yet is tolerated (several SOPs point at kyc-aml);
        // a link to a section that doesn't exist is always a mistake, in either direction.
        const brokenSections = findBrokenLinks(universe).filter(
            (link) => link.reason === 'missing-section',
        );
        if (brokenSections.length > 0) {
            throw new BadRequestException(
                brokenSections.map(
                    (link) =>
                        `"${link.from}" links to [[${link.slug}#${link.anchor}]], a section that doesn't exist.`,
                ),
            );
        }

        const contentChanged =
            markdown !== existing.markdown.trim() ||
            dto.title !== existing.title;
        if (!contentChanged && dto.owner === existing.owner) {
            return toDocument(existing);
        }

        const status: KbStatus =
            existing.status === 'approved' && contentChanged
                ? 'draft'
                : existing.status;
        const updated = await this.prisma.$transaction(async (tx) => {
            const row = await tx.kbDocument.update({
                where: { slug },
                data: {
                    title: dto.title,
                    owner: dto.owner,
                    markdown,
                    status,
                    editedInApp: contentChanged || existing.editedInApp,
                    contentHash: contentChanged
                        ? `app:${contentHash(markdown)}`
                        : existing.contentHash,
                },
            });
            await this.audit.record(
                actor,
                'sop',
                `edited "${slug}"${status !== existing.status ? ` (${existing.status} → ${status})` : ''}`,
                tx,
            );
            return row;
        });
        return toDocument(updated);
    }

    /**
     * Moves a SOP through the approval workflow: draft → approved, approved →
     * draft, or retired. Approving is what bumps the version and dates the SOP
     * (README), and it is refused while any `[TODO]` is left — step one of the
     * approval checklist is "resolve every TODO".
     */
    async setStatus(
        slug: string,
        next: KbStatus,
        actor: string,
    ): Promise<KbDocument> {
        const existing = await this.requireDocument(slug);
        if (existing.status === next) return toDocument(existing);

        if (next === 'approved') {
            if (existing.status === 'retired') {
                throw new BadRequestException(
                    'Return a retired SOP to draft before approving it.',
                );
            }
            const open = splitSections(existing.markdown).filter(
                (section) => section.hasTodo,
            );
            if (open.length > 0) {
                throw new BadRequestException(
                    `Can't approve "${existing.title}": ${open.length} ${open.length === 1 ? 'section still contains' : 'sections still contain'} a [TODO] (${open.map((s) => s.heading || 'introduction').join(', ')}). Resolve them first.`,
                );
            }
            if (/^todo$/i.test(existing.owner.trim())) {
                throw new BadRequestException(
                    `Can't approve "${existing.title}": it has no owner yet.`,
                );
            }
        }

        const updated = await this.prisma.$transaction(async (tx) => {
            const row = await tx.kbDocument.update({
                where: { slug },
                data:
                    next === 'approved'
                        ? {
                              status: next,
                              version: existing.version + 1,
                              contentUpdatedOn: todayUtc(),
                          }
                        : { status: next },
            });
            await this.audit.record(
                actor,
                'sop',
                `moved "${slug}" ${existing.status} → ${next}`,
                tx,
            );
            return row;
        });
        return toDocument(updated);
    }

    private async requireDocument(slug: string): Promise<KbDocumentRow> {
        const row = await this.prisma.kbDocument.findUnique({
            where: { slug },
        });
        if (!row) throw new NotFoundException(`SOP "${slug}" not found.`);
        return row;
    }

    /**
     * Validates a batch of SOP files and, only if all of them are sound,
     * writes them in one transaction. All-or-nothing on purpose: a half-imported
     * set would leave links pointing at SOPs that aren't there.
     */
    async importDocuments(
        files: KbImportFile[],
        options: KbImportOptions = {},
    ): Promise<KbImportReport> {
        const results: KbImportFileResult[] = [];
        const parsed: { file: KbImportFile; doc: ParsedKbDocument }[] = [];

        for (const file of files) {
            const result = parseKbDocument(file.raw);
            if (!result.ok) {
                results.push({
                    file: file.name,
                    slug: null,
                    action: 'rejected',
                    errors: result.errors,
                });
            } else {
                parsed.push({ file, doc: result.doc });
            }
        }

        const bySlug = new Map<string, string>();
        for (const { file, doc } of parsed) {
            const slug = doc.frontmatter.slug;
            const first = bySlug.get(slug);
            if (first) {
                results.push({
                    file: file.name,
                    slug,
                    action: 'rejected',
                    errors: [
                        `Duplicate slug "${slug}" — already used by ${first}.`,
                    ],
                });
            } else {
                bySlug.set(slug, file.name);
            }
        }
        const unique = parsed.filter(
            ({ file, doc }) => bySlug.get(doc.frontmatter.slug) === file.name,
        );

        // Links may point at SOPs already stored, so check against stored + incoming (incoming wins).
        const stored = await this.prisma.kbDocument.findMany({
            select: {
                slug: true,
                markdown: true,
                version: true,
                contentHash: true,
                editedInApp: true,
            },
        });
        const incomingSlugs = new Set(
            unique.map(({ doc }) => doc.frontmatter.slug),
        );
        const linkUniverse = [
            ...unique.map(({ doc }) => ({
                slug: doc.frontmatter.slug,
                sections: doc.sections,
                links: doc.links,
            })),
            ...stored
                .filter((row) => !incomingSlugs.has(row.slug))
                .map((row) => ({
                    slug: row.slug,
                    sections: splitSections(row.markdown),
                    links: findLinks(row.markdown),
                })),
        ];
        const broken = findBrokenLinks(linkUniverse).filter((link) =>
            incomingSlugs.has(link.from),
        );

        const blocking = broken.filter(
            (link) =>
                link.reason === 'missing-section' ||
                !options.allowUnresolvedLinks,
        );
        const unresolvedLinks = broken.filter(
            (link) => !blocking.includes(link),
        );

        for (const link of blocking) {
            const target = link.anchor
                ? `${link.slug}#${link.anchor}`
                : link.slug;
            const message =
                link.reason === 'missing-section'
                    ? `Link [[${target}]] points at a section that doesn't exist.`
                    : `Link [[${target}]] points at a SOP that doesn't exist.`;
            const owner = unique.find(
                ({ doc }) => doc.frontmatter.slug === link.from,
            );
            const fileName = owner?.file.name ?? link.from;
            // One entry per file, listing each distinct problem once.
            const existing = results.find(
                (r) => r.file === fileName && r.action === 'rejected',
            );
            if (!existing) {
                results.push({
                    file: fileName,
                    slug: link.from,
                    action: 'rejected',
                    errors: [message],
                });
            } else if (!existing.errors.includes(message)) {
                existing.errors.push(message);
            }
        }

        const storedBySlug = new Map(stored.map((row) => [row.slug, row]));
        const writes: {
            slug: string;
            action: KbImportAction;
            run: () => ReturnType<PrismaService['kbDocument']['upsert']>;
        }[] = [];

        for (const { file, doc } of unique) {
            const { frontmatter, body } = doc;
            if (
                results.some(
                    (r) => r.file === file.name && r.action === 'rejected',
                )
            )
                continue;

            const hash = contentHash(file.raw);
            const existing = storedBySlug.get(frontmatter.slug);

            if (existing && existing.contentHash === hash) {
                results.push({
                    file: file.name,
                    slug: frontmatter.slug,
                    action: 'unchanged',
                    errors: [],
                });
                continue;
            }
            if (existing?.editedInApp && !options.force) {
                // Not an error: the rest of the set should still import. The note tells the
                // operator the file was left alone, and how to override.
                results.push({
                    file: file.name,
                    slug: frontmatter.slug,
                    action: 'skipped',
                    errors: [
                        'Edited in the app, so the file was left alone (importing would overwrite those edits). Use force to overwrite.',
                    ],
                });
                continue;
            }
            if (
                existing &&
                existing.version > frontmatter.version &&
                !options.force
            ) {
                results.push({
                    file: file.name,
                    slug: frontmatter.slug,
                    action: 'rejected',
                    errors: [
                        `Stored version is ${existing.version} but the file is version ${frontmatter.version}. Use force to overwrite.`,
                    ],
                });
                continue;
            }

            const data = {
                title: frontmatter.title,
                category: frontmatter.category,
                jurisdiction: frontmatter.jurisdiction,
                owner: frontmatter.owner,
                status: frontmatter.status,
                version: frontmatter.version,
                contentUpdatedOn: new Date(
                    `${frontmatter.updatedAt}T00:00:00.000Z`,
                ),
                markdown: body,
                contentHash: hash,
                // The file is the source again (this only runs for a fresh SOP or with force).
                editedInApp: false,
            };
            const action: KbImportAction = existing ? 'updated' : 'created';
            results.push({
                file: file.name,
                slug: frontmatter.slug,
                action,
                errors: [],
            });
            writes.push({
                slug: frontmatter.slug,
                action,
                run: () =>
                    this.prisma.kbDocument.upsert({
                        where: { slug: frontmatter.slug },
                        create: { slug: frontmatter.slug, ...data },
                        update: data,
                    }),
            });
        }

        const hasErrors = results.some((r) => r.action === 'rejected');
        if (hasErrors || options.dryRun) {
            return {
                results: this.inFileOrder(files, results),
                unresolvedLinks,
                applied: false,
            };
        }

        if (writes.length > 0) {
            await this.prisma.$transaction(writes.map((write) => write.run()));
            this.logger.log(
                `Knowledge Center import: ${writes.length} SOP(s) written`,
            );
        }

        return {
            results: this.inFileOrder(files, results),
            unresolvedLinks,
            applied: true,
        };
    }

    private inFileOrder(
        files: KbImportFile[],
        results: KbImportFileResult[],
    ): KbImportFileResult[] {
        const order = new Map(files.map((file, index) => [file.name, index]));
        return [...results].sort(
            (a, b) => (order.get(a.file) ?? 0) - (order.get(b.file) ?? 0),
        );
    }
}
