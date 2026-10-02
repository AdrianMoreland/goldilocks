import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    applyRoadmapEdit,
    RoadmapEditError,
    type RoadmapDocument,
    type RoadmapEditRequest,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
import {
    normalizeRoadmap,
    readRoadmapFile,
    roadmapFilePath,
    writeRoadmapFile,
} from './roadmap-file';

/** The one row that holds the roadmap. */
const ROW_ID = 1;

const EMPTY: RoadmapDocument = {
    markdown: '',
    version: 0,
    updatedBy: null,
    updatedAt: null,
};

@Injectable()
export class RoadmapService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    private toDocument(row: {
        markdown: string;
        version: number;
        updatedBy: string | null;
        updatedAt: Date;
    }): RoadmapDocument {
        return {
            markdown: row.markdown,
            version: row.version,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt.toISOString(),
        };
    }

    /**
     * The stored roadmap. Before anything has been imported, a local checkout seeds the database from
     * docs/ROADMAP.md on first read; on Railway (no file) the page asks for `roadmap:import` instead.
     */
    async get(): Promise<RoadmapDocument> {
        const row = await this.prisma.roadmapDocument.findUnique({
            where: { id: ROW_ID },
        });
        if (row) return this.toDocument(row);

        const file = roadmapFilePath();
        if (!file) return EMPTY;
        const created = await this.prisma.roadmapDocument.create({
            data: {
                id: ROW_ID,
                markdown: readRoadmapFile(file),
                updatedBy: 'import',
            },
        });
        return this.toDocument(created);
    }

    async edit(
        request: RoadmapEditRequest,
        actor: { email: string },
    ): Promise<RoadmapDocument> {
        const current = await this.get();
        if (current.version === 0) {
            throw new NotFoundException(
                'The roadmap has not been imported yet. Run `pnpm --filter api roadmap:import`.',
            );
        }
        if (request.version !== current.version) {
            throw new ConflictException(
                'The roadmap changed since you loaded it. Reload and try again.',
            );
        }

        // Where a local file exists it is kept in step, so refuse to overwrite a hand edit it holds
        // that the database has not seen (a roadmap session, or a save made from the deployed app).
        const file =
            process.env.NODE_ENV === 'production' ? null : roadmapFilePath();
        if (
            file &&
            normalizeRoadmap(readRoadmapFile(file)) !==
                normalizeRoadmap(current.markdown)
        ) {
            throw new ConflictException(
                'docs/ROADMAP.md differs from the database. Run `pnpm --filter api roadmap:import` (the file wins) or `roadmap:export` (the database wins), then retry.',
            );
        }

        let markdown: string;
        try {
            markdown = applyRoadmapEdit(current.markdown, request.edit);
        } catch (error) {
            if (error instanceof RoadmapEditError)
                throw new BadRequestException(error.message);
            throw error;
        }

        // The version in the WHERE clause makes a concurrent save lose cleanly instead of overwriting.
        const saved = await this.prisma.roadmapDocument.updateMany({
            where: { id: ROW_ID, version: current.version },
            data: {
                markdown,
                version: { increment: 1 },
                updatedBy: actor.email,
            },
        });
        if (saved.count === 0) {
            throw new ConflictException(
                'The roadmap changed while saving. Reload and try again.',
            );
        }
        if (file) writeRoadmapFile(file, markdown);

        await this.audit.record(
            actor.email,
            'roadmap',
            describeEdit(request.edit),
        );
        return this.get();
    }
}

function describeEdit(edit: RoadmapEditRequest['edit']): string {
    switch (edit.type) {
        case 'add':
            return `add: ${edit.text}`;
        case 'edit':
            return `edit: ${edit.text} → ${edit.newText}`;
        case 'toggle':
            return `${edit.checked ? 'check' : 'uncheck'}: ${edit.text}`;
        case 'delete':
            return `delete: ${edit.text}`;
    }
}
