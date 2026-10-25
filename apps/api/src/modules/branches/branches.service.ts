import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import type { Branch, CreateBranchRequest } from '@goldilocks/shared-types';

@Injectable()
export class BranchesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    async getAll(): Promise<Branch[]> {
        const rows = await this.prisma.branch.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            address: row.address,
            region: row.region,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        }));
    }

    async create(
        dto: CreateBranchRequest,
        actorEmail: string,
    ): Promise<Branch> {
        // The branch and its audit entry commit together: no branch exists without its entry.
        const row = await this.prisma.$transaction(async (tx) => {
            const created = await tx.branch.create({
                data: {
                    name: dto.name,
                    address: dto.address,
                    region: dto.region,
                    currency: dto.currency,
                },
            });
            await this.audit.record(
                actorEmail,
                'branch-create',
                `${created.name} (${created.region}, ${created.currency})`,
                tx,
            );
            return created;
        });

        return {
            id: row.id,
            name: row.name,
            address: row.address,
            region: row.region,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        };
    }
}
