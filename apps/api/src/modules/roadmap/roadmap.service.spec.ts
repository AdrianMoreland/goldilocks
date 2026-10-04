import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
import { RoadmapService } from './roadmap.service';
import * as file from './roadmap-file';

jest.mock('./roadmap-file', () => ({
    ...jest.requireActual('./roadmap-file'),
    roadmapFilePath: jest.fn(),
    readRoadmapFile: jest.fn(),
    writeRoadmapFile: jest.fn(),
}));

const MARKDOWN = '## 0.1 Core 🔴\n\n- [ ] First task\n- [x] Second task\n';
const row = (over: Partial<{ markdown: string; version: number }> = {}) => ({
    markdown: MARKDOWN,
    version: 3,
    updatedBy: 'a@b.c',
    updatedAt: new Date('2026-10-01T10:00:00Z'),
    ...over,
});

describe('RoadmapService', () => {
    let service: RoadmapService;
    const prisma = {
        roadmapDocument: {
            findUnique: jest.fn(),
            create: jest.fn(),
            updateMany: jest.fn(),
        },
        $transaction: jest.fn(),
    };
    const audit = { record: jest.fn() };
    const actor = { email: 'boss@example.com' };
    const toggle = (version = 3) => ({
        version,
        edit: {
            type: 'toggle' as const,
            line: 2,
            text: 'First task',
            checked: true,
        },
    });

    beforeEach(async () => {
        jest.resetAllMocks();
        prisma.$transaction.mockImplementation(
            (run: (tx: unknown) => unknown) => run(prisma),
        );
        (file.roadmapFilePath as jest.Mock).mockReturnValue(null);
        const module = await Test.createTestingModule({
            providers: [
                RoadmapService,
                { provide: PrismaService, useValue: prisma },
                { provide: AuditLogService, useValue: audit },
            ],
        }).compile();
        service = module.get(RoadmapService);
    });

    it('returns an empty version-0 document when nothing is stored and there is no file', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue(null);
        await expect(service.get()).resolves.toMatchObject({
            markdown: '',
            version: 0,
        });
    });

    it('seeds the database from the local file on first read', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue(null);
        (file.roadmapFilePath as jest.Mock).mockReturnValue(
            '/repo/docs/ROADMAP.md',
        );
        (file.readRoadmapFile as jest.Mock).mockReturnValue(MARKDOWN);
        prisma.roadmapDocument.create.mockResolvedValue(row({ version: 1 }));
        const doc = await service.get();
        expect(prisma.roadmapDocument.create).toHaveBeenCalledWith({
            data: { id: 1, markdown: MARKDOWN, updatedBy: 'import' },
        });
        expect(doc.version).toBe(1);
    });

    it('applies an edit, bumps the version through the WHERE clause and audits it', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue(row());
        prisma.roadmapDocument.updateMany.mockResolvedValue({ count: 1 });
        await service.edit(toggle(), actor);
        const args = prisma.roadmapDocument.updateMany.mock.calls[0][0];
        expect(args.where).toEqual({ id: 1, version: 3 });
        expect(args.data.markdown).toContain('- [x] First task');
        expect(args.data.updatedBy).toBe('boss@example.com');
        expect(audit.record).toHaveBeenCalledWith(
            'boss@example.com',
            'roadmap',
            'check: First task',
            prisma,
        );
    });

    it('rejects an edit made against an older version', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue(row());
        await expect(service.edit(toggle(2), actor)).rejects.toThrow(
            ConflictException,
        );
        expect(prisma.roadmapDocument.updateMany).not.toHaveBeenCalled();
    });

    it('loses cleanly when another save lands first', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue(row());
        prisma.roadmapDocument.updateMany.mockResolvedValue({ count: 0 });
        await expect(service.edit(toggle(), actor)).rejects.toThrow(
            ConflictException,
        );
        expect(audit.record).not.toHaveBeenCalled();
    });

    it('turns a stale line into a 400', async () => {
        prisma.roadmapDocument.findUnique.mockResolvedValue(row());
        const stale = {
            version: 3,
            edit: { type: 'delete' as const, line: 2, text: 'Not this' },
        };
        await expect(service.edit(stale, actor)).rejects.toThrow(
            BadRequestException,
        );
    });

    describe('local file', () => {
        beforeEach(() => {
            (file.roadmapFilePath as jest.Mock).mockReturnValue(
                '/repo/docs/ROADMAP.md',
            );
            prisma.roadmapDocument.findUnique.mockResolvedValue(row());
            prisma.roadmapDocument.updateMany.mockResolvedValue({ count: 1 });
        });

        it('writes the edit back to docs/ROADMAP.md when the file matches the database', async () => {
            (file.readRoadmapFile as jest.Mock).mockReturnValue(
                MARKDOWN.replace(/\n/g, '\r\n'),
            );
            await service.edit(toggle(), actor);
            expect(file.writeRoadmapFile).toHaveBeenCalledWith(
                '/repo/docs/ROADMAP.md',
                expect.stringContaining('- [x] First task'),
            );
        });

        it('refuses, and writes nothing, when the file holds a hand edit the database lacks', async () => {
            (file.readRoadmapFile as jest.Mock).mockReturnValue(
                MARKDOWN + '- [ ] Added by hand\n',
            );
            await expect(service.edit(toggle(), actor)).rejects.toThrow(
                /roadmap:import/,
            );
            expect(prisma.roadmapDocument.updateMany).not.toHaveBeenCalled();
            expect(file.writeRoadmapFile).not.toHaveBeenCalled();
        });

        it('leaves the file alone in production', async () => {
            const previous = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            try {
                await service.edit(toggle(), actor);
                expect(file.writeRoadmapFile).not.toHaveBeenCalled();
            } finally {
                process.env.NODE_ENV = previous;
            }
        });
    });
});
