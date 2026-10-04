import { BadRequestException, NotFoundException } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../admin/audit-log.service';

type Row = Record<string, unknown>;

function serviceWith(prisma: unknown) {
    const db = prisma as PrismaService;
    // Writes run in a transaction; the stub hands the same fake client to the callback.
    if (!('$transaction' in db)) {
        Object.assign(db, {
            $transaction: (run: (tx: unknown) => unknown) => run(db),
        });
    }
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    return Object.assign(
        new KnowledgeService(db, audit as unknown as AuditLogService),
        { recorded: audit.record },
    );
}

describe('KnowledgeService.updateDocument', () => {
    const row = (overrides: Row = {}): Row => ({
        slug: 'pricing',
        title: 'Pricing',
        category: 'sales',
        jurisdiction: 'IE',
        owner: 'Adrian',
        status: 'approved',
        version: 3,
        contentUpdatedOn: new Date('2026-09-30T00:00:00Z'),
        markdown: '## Purpose\nPrice things.\n\n## VAT\nAdd VAT.',
        contentHash: 'file-hash',
        editedInApp: false,
        ...overrides,
    });
    const dto = (overrides: Row = {}) => ({
        title: 'Pricing',
        owner: 'Adrian',
        markdown: '## Purpose\nPrice things.\n\n## VAT\nAdd VAT, carefully.',
        ...overrides,
    });

    function editor(
        stored: Row = row(),
        others: { slug: string; markdown: string }[] = [],
    ) {
        const prisma = {
            kbDocument: {
                findUnique: jest.fn().mockResolvedValue(stored),
                findMany: jest.fn().mockResolvedValue(others),
                update: jest.fn((args: { data: Row }) =>
                    Promise.resolve({ ...stored, ...args.data }),
                ),
            },
        };
        return { service: serviceWith(prisma), prisma };
    }
    const updateData = (prisma: ReturnType<typeof editor>['prisma']) =>
        (prisma.kbDocument.update.mock.calls[0] as [{ data: Row }])[0].data;

    it('sends an approved SOP back to draft when its text changes, and marks it edited in the app', async () => {
        const { service, prisma } = editor();

        const result = await service.updateDocument(
            'pricing',
            dto(),
            'boss@example.com',
        );

        expect(updateData(prisma)).toMatchObject({
            status: 'draft',
            editedInApp: true,
        });
        expect(String(updateData(prisma).contentHash)).toMatch(/^app:/);
        expect(result.status).toBe('draft');
    });

    it('audits an edit that sends an approved SOP back to draft', async () => {
        const { service, prisma } = editor();

        await service.updateDocument('pricing', dto(), 'boss@example.com');

        expect(service.recorded).toHaveBeenCalledWith(
            'boss@example.com',
            'sop',
            'edited "pricing" (approved → draft)',
            prisma,
        );
    });

    it('keeps the status when only the owner changes', async () => {
        const { service, prisma } = editor();

        await service.updateDocument(
            'pricing',
            dto({
                markdown: '## Purpose\nPrice things.\n\n## VAT\nAdd VAT.',
                owner: 'Sam',
            }),
            'boss',
        );

        expect(updateData(prisma)).toMatchObject({
            status: 'approved',
            owner: 'Sam',
            editedInApp: false,
        });
    });

    it('does nothing when nothing changed', async () => {
        const { service, prisma } = editor();

        await service.updateDocument(
            'pricing',
            dto({ markdown: '## Purpose\nPrice things.\n\n## VAT\nAdd VAT.' }),
            'boss',
        );

        expect(prisma.kbDocument.update).not.toHaveBeenCalled();
    });

    it('does not reopen a draft or retire a SOP by editing it', async () => {
        const draft = editor(row({ status: 'draft' }));
        await draft.service.updateDocument('pricing', dto(), 'boss');
        expect(updateData(draft.prisma).status).toBe('draft');

        const retired = editor(row({ status: 'retired' }));
        await retired.service.updateDocument('pricing', dto(), 'boss');
        expect(updateData(retired.prisma).status).toBe('retired');
    });

    it('rejects a pasted frontmatter block', async () => {
        const { service, prisma } = editor();

        await expect(
            service.updateDocument(
                'pricing',
                dto({ markdown: '---\nslug: x\n---\n## A\nb' }),
                'boss',
            ),
        ).rejects.toBeInstanceOf(BadRequestException);
        expect(prisma.kbDocument.update).not.toHaveBeenCalled();
    });

    it('refuses to delete a section another SOP links to', async () => {
        const { service, prisma } = editor(row(), [
            { slug: 'quote', markdown: '## Steps\nSee [[pricing#vat]].' },
        ]);

        // The edit drops the "VAT" section that "quote" links to.
        await expect(
            service.updateDocument(
                'pricing',
                dto({ markdown: '## Purpose\nOnly this.' }),
                'boss',
            ),
        ).rejects.toMatchObject({
            // BadRequestException keeps a list of messages on `response.message`.
            response: {
                message: [
                    expect.stringMatching(/"quote".*\[\[pricing#vat\]\]/),
                ],
            },
        });
        expect(prisma.kbDocument.update).not.toHaveBeenCalled();
    });

    it('refuses a link to a section that does not exist, but tolerates a link to a SOP not written yet', async () => {
        const { service } = editor();

        await expect(
            service.updateDocument(
                'pricing',
                dto({ markdown: '## A\nsee [[pricing#nope]]' }),
                'boss',
            ),
        ).rejects.toBeInstanceOf(BadRequestException);
        await expect(
            service.updateDocument(
                'pricing',
                dto({ markdown: '## A\nsee [[kyc-aml]]' }),
                'boss',
            ),
        ).resolves.toBeDefined();
    });

    it('404s for an unknown SOP', async () => {
        const { service, prisma } = editor();
        prisma.kbDocument.findUnique.mockResolvedValue(null);

        await expect(
            service.updateDocument('ghost', dto(), 'boss'),
        ).rejects.toBeInstanceOf(NotFoundException);
    });
});

describe('KnowledgeService.setStatus', () => {
    const row = (overrides: Row = {}): Row => ({
        slug: 'pricing',
        title: 'Pricing',
        owner: 'Adrian',
        status: 'draft',
        version: 2,
        contentUpdatedOn: new Date('2026-01-01T00:00:00Z'),
        markdown: '## Purpose\nAll confirmed.',
        category: 'sales',
        jurisdiction: 'IE',
        ...overrides,
    });

    function workflow(stored: Row = row()) {
        const prisma = {
            kbDocument: {
                findUnique: jest.fn().mockResolvedValue(stored),
                update: jest.fn((args: { data: Row }) =>
                    Promise.resolve({ ...stored, ...args.data }),
                ),
            },
        };
        return { service: serviceWith(prisma), prisma };
    }
    const updateData = (prisma: ReturnType<typeof workflow>['prisma']) =>
        (prisma.kbDocument.update.mock.calls[0] as [{ data: Row }])[0].data;

    it('approving bumps the version and dates the SOP today', async () => {
        const { service, prisma } = workflow();

        const result = await service.setStatus('pricing', 'approved', 'boss');

        expect(updateData(prisma)).toMatchObject({
            status: 'approved',
            version: 3,
        });
        expect(updateData(prisma).contentUpdatedOn).toBeInstanceOf(Date);
        expect(result.status).toBe('approved');
        expect(result.contentUpdatedOn).toBe(
            new Date().toISOString().slice(0, 10),
        );
    });

    it('audits an approval inside the same transaction as the status change', async () => {
        const { service, prisma } = workflow();

        await service.setStatus('pricing', 'approved', 'boss@example.com');

        expect(service.recorded).toHaveBeenCalledWith(
            'boss@example.com',
            'sop',
            'moved "pricing" draft → approved',
            prisma,
        );
    });

    it('refuses to approve while a [TODO] remains, and says where', async () => {
        const { service, prisma } = workflow(
            row({
                markdown:
                    '## Payment\nTake [TODO: how much] up front.\n\n## Other\nfine',
            }),
        );

        await expect(
            service.setStatus('pricing', 'approved', 'boss'),
        ).rejects.toThrow(/Payment/);
        expect(prisma.kbDocument.update).not.toHaveBeenCalled();
    });

    it('refuses to approve a SOP with no owner', async () => {
        const { service } = workflow(row({ owner: 'TODO' }));
        await expect(
            service.setStatus('pricing', 'approved', 'boss'),
        ).rejects.toThrow(/no owner/);
    });

    it('will not approve straight from retired', async () => {
        const { service } = workflow(row({ status: 'retired' }));
        await expect(
            service.setStatus('pricing', 'approved', 'boss'),
        ).rejects.toThrow(/draft before approving/);
    });

    it('returning to draft or retiring changes only the status', async () => {
        const back = workflow(row({ status: 'approved' }));
        await back.service.setStatus('pricing', 'draft', 'boss');
        expect(updateData(back.prisma)).toEqual({ status: 'draft' });

        const retire = workflow(row({ status: 'approved' }));
        await retire.service.setStatus('pricing', 'retired', 'boss');
        expect(updateData(retire.prisma)).toEqual({ status: 'retired' });
    });

    it('is a no-op when the status is already the requested one', async () => {
        const { service, prisma } = workflow(row({ status: 'draft' }));
        await service.setStatus('pricing', 'draft', 'boss');
        expect(prisma.kbDocument.update).not.toHaveBeenCalled();
    });
});

describe('KnowledgeService.importDocuments with SOPs edited in the app', () => {
    const file = (slug: string, body: string) => ({
        name: `${slug}.md`,
        raw: `---\nslug: ${slug}\ntitle: T\ncategory: sales\njurisdiction: IE\nowner: Adrian\nstatus: draft\nversion: 1\nupdatedAt: 2026-09-30\n---\n${body}\n`,
    });
    const edited = {
        slug: 'a',
        markdown: '## Purpose\nedited',
        version: 3,
        contentHash: 'app:xyz',
        editedInApp: true,
    };

    function importer() {
        const prisma = {
            kbDocument: {
                findMany: jest.fn().mockResolvedValue([edited]),
                upsert: jest.fn((args: unknown) => ({ upserted: args })),
            },
            $transaction: jest.fn().mockResolvedValue([]),
        };
        return { service: serviceWith(prisma), prisma };
    }

    it('skips an edited SOP instead of overwriting it, and still imports the rest', async () => {
        const { service, prisma } = importer();

        const report = await service.importDocuments([
            file('a', '## Purpose\nfile version'),
            file('b', '## Purpose\nnew'),
        ]);

        expect(report.applied).toBe(true);
        expect(report.results.find((r) => r.slug === 'a')).toMatchObject({
            action: 'skipped',
        });
        expect(report.results.find((r) => r.slug === 'b')).toMatchObject({
            action: 'created',
        });
        expect(prisma.kbDocument.upsert).toHaveBeenCalledTimes(1);
    });

    it('overwrites an edited SOP only when forced, and clears the edited flag', async () => {
        const { service, prisma } = importer();

        const report = await service.importDocuments(
            [file('a', '## Purpose\nfile version')],
            { force: true },
        );

        expect(report.results[0].action).toBe('updated');
        const args = (
            prisma.kbDocument.upsert.mock.calls[0] as [{ update: Row }]
        )[0];
        expect(args.update).toMatchObject({ editedInApp: false });
    });
});
