import { KnowledgeService } from './knowledge.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';

describe('KnowledgeService.listApproved', () => {
    const row = (slug: string) => ({
        slug,
        title: slug,
        category: 'sales',
        jurisdiction: 'IE',
        owner: 'Adrian',
        status: 'approved',
        version: 3,
        contentUpdatedOn: new Date('2026-09-30T00:00:00Z'),
        markdown: '## Purpose\nx',
    });

    it('asks only for approved SOPs, in slug order, so the assistant never sees a draft or a retired one', async () => {
        const findMany = jest.fn().mockResolvedValue([row('a'), row('b')]);
        const service = new KnowledgeService({
            kbDocument: { findMany },
        } as unknown as PrismaService);

        const docs = await service.listApproved();

        expect(findMany).toHaveBeenCalledWith({
            where: { status: 'approved' },
            orderBy: { slug: 'asc' },
        });
        expect(docs.map((doc) => doc.slug)).toEqual(['a', 'b']);
        expect(docs[0]).toMatchObject({
            status: 'approved',
            contentUpdatedOn: '2026-09-30',
        });
    });
});
