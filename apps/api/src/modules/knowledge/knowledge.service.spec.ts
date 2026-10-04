import { KnowledgeService, type KbImportFile } from './knowledge.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';

const sop = (
    slug: string,
    body: string,
    overrides: Record<string, string> = {},
): KbImportFile => {
    const meta = {
        slug,
        title: `Title of ${slug}`,
        category: 'sales',
        jurisdiction: 'IE',
        owner: 'Adrian',
        status: 'draft',
        version: '1',
        updatedAt: '2026-09-30',
        ...overrides,
    };
    const frontmatter = Object.entries(meta)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    return { name: `${slug}.md`, raw: `---\n${frontmatter}\n---\n${body}\n` };
};

function build(
    stored: {
        slug: string;
        markdown: string;
        version: number;
        contentHash: string;
    }[] = [],
) {
    const prisma = {
        kbDocument: {
            findMany: jest.fn().mockResolvedValue(stored),
            upsert: jest.fn((args: { create: Record<string, string> }) => ({
                upserted: args,
            })),
        },
        $transaction: jest.fn().mockResolvedValue([]),
    };
    return {
        service: new KnowledgeService(
            prisma as unknown as PrismaService,
            {} as never,
        ),
        prisma,
    };
}

describe('KnowledgeService.listDocuments', () => {
    const row = (slug: string, status: 'draft' | 'approved' | 'retired') => ({
        slug,
        title: slug,
        category: 'sales',
        jurisdiction: 'IE',
        owner: 'Adrian',
        status,
        version: 2,
        contentUpdatedOn: new Date('2026-09-30T00:00:00Z'),
        markdown: '## Purpose\nx',
    });

    it('hides retired SOPs from staff but keeps drafts', async () => {
        const { service, prisma } = build();
        prisma.kbDocument.findMany.mockResolvedValue([
            row('a', 'draft'),
            row('b', 'approved'),
        ]);

        await service.listDocuments(false);

        expect(prisma.kbDocument.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { status: { not: 'retired' } } }),
        );
    });

    it('shows everything, retired included, to admins', async () => {
        const { service, prisma } = build();
        await service.listDocuments(true);
        expect(prisma.kbDocument.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: undefined }),
        );
    });

    it('returns the SOP date as a plain day, not a timestamp', async () => {
        const { service, prisma } = build();
        prisma.kbDocument.findMany.mockResolvedValue([row('a', 'draft')]);
        const [doc] = await service.listDocuments(false);
        expect(doc).toMatchObject({
            slug: 'a',
            contentUpdatedOn: '2026-09-30',
            version: 2,
        });
    });
});

describe('KnowledgeService.importDocuments', () => {
    it('creates new SOPs in one transaction and stores the body without frontmatter', async () => {
        const { service, prisma } = build();

        const report = await service.importDocuments([
            sop('a', '## Purpose\nDo it.'),
            sop('b', '## Purpose\n[[a#purpose]]'),
        ]);

        expect(report.applied).toBe(true);
        expect(report.results.map((r) => [r.slug, r.action])).toEqual([
            ['a', 'created'],
            ['b', 'created'],
        ]);
        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        const create = prisma.kbDocument.upsert.mock.calls[0][0].create;
        expect(create).toMatchObject({
            slug: 'a',
            version: 1,
            markdown: '## Purpose\nDo it.',
        });
        expect(create.markdown).not.toContain('---');
    });

    it('skips a file whose content has not changed', async () => {
        const first = build();
        const file = sop('a', '## Purpose\nDo it.');
        await first.service.importDocuments([file]);
        const { contentHash, markdown } =
            first.prisma.kbDocument.upsert.mock.calls[0][0].create;

        const { service, prisma } = build([
            { slug: 'a', markdown, version: 1, contentHash },
        ]);
        const report = await service.importDocuments([file]);

        expect(report.results[0].action).toBe('unchanged');
        expect(prisma.kbDocument.upsert).not.toHaveBeenCalled();
    });

    it('rejects a link to a SOP that does not exist and writes nothing', async () => {
        const { service, prisma } = build();

        const report = await service.importDocuments([
            sop('a', '## Purpose\nsee [[kyc-aml]]'),
        ]);

        expect(report.applied).toBe(false);
        expect(report.results[0]).toMatchObject({ action: 'rejected' });
        expect(report.results[0].errors[0]).toContain('kyc-aml');
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('lets a missing SOP through only when explicitly allowed, and reports it', async () => {
        const { service } = build();

        const report = await service.importDocuments(
            [sop('a', '## Purpose\nsee [[kyc-aml]]')],
            { allowUnresolvedLinks: true },
        );

        expect(report.applied).toBe(true);
        expect(report.unresolvedLinks).toEqual([
            {
                from: 'a',
                slug: 'kyc-aml',
                anchor: null,
                reason: 'missing-document',
            },
        ]);
    });

    it('never allows a link to a missing section, even with allowUnresolvedLinks', async () => {
        const { service } = build();

        const report = await service.importDocuments(
            [sop('a', '## Purpose\nx'), sop('b', '## Purpose\n[[a#nope]]')],
            { allowUnresolvedLinks: true },
        );

        expect(report.applied).toBe(false);
        expect(report.results.find((r) => r.slug === 'b')?.errors[0]).toContain(
            "section that doesn't exist",
        );
    });

    it('resolves links against SOPs already stored, so a single file can be re-imported', async () => {
        const { service } = build([
            {
                slug: 'a',
                markdown: '## Purpose\nx',
                version: 1,
                contentHash: 'old',
            },
        ]);

        const report = await service.importDocuments([
            sop('b', '## Purpose\n[[a#purpose]]'),
        ]);

        expect(report.applied).toBe(true);
    });

    it('rejects invalid frontmatter and reports why', async () => {
        const { service } = build();

        const report = await service.importDocuments([
            sop('a', '## Purpose\nx', { category: 'cooking' }),
        ]);

        expect(report.applied).toBe(false);
        expect(report.results[0].errors.join(' ')).toContain('category');
    });

    it('rejects two files that claim the same slug', async () => {
        const { service } = build();

        const report = await service.importDocuments([
            { ...sop('a', '## Purpose\nx'), name: 'one.md' },
            { ...sop('a', '## Purpose\ny'), name: 'two.md' },
        ]);

        expect(report.applied).toBe(false);
        expect(
            report.results.find((r) => r.file === 'two.md')?.errors[0],
        ).toContain('Duplicate slug');
    });

    it('will not overwrite a stored SOP that has a higher version unless forced', async () => {
        const stored = [
            {
                slug: 'a',
                markdown: '## Purpose\nedited in-app',
                version: 5,
                contentHash: 'other',
            },
        ];

        const blocked = await build(stored).service.importDocuments([
            sop('a', '## Purpose\nfile'),
        ]);
        expect(blocked.applied).toBe(false);
        expect(blocked.results[0].errors[0]).toContain('version is 5');

        const forced = await build(stored).service.importDocuments(
            [sop('a', '## Purpose\nfile')],
            { force: true },
        );
        expect(forced.applied).toBe(true);
        expect(forced.results[0].action).toBe('updated');
    });

    it('writes nothing on a dry run', async () => {
        const { service, prisma } = build();

        const report = await service.importDocuments(
            [sop('a', '## Purpose\nx')],
            { dryRun: true },
        );

        expect(report.applied).toBe(false);
        expect(report.results[0].action).toBe('created');
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('is all-or-nothing: one bad file blocks the good ones', async () => {
        const { service, prisma } = build();

        const report = await service.importDocuments([
            sop('good', '## Purpose\nx'),
            sop('bad', '## Purpose\n[[ghost]]'),
        ]);

        expect(report.applied).toBe(false);
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
});
