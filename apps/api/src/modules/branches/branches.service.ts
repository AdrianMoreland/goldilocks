import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { Branch, CreateBranchRequest } from '@goldilocks/shared-types';

@Injectable()
export class BranchesService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<Branch[]> {
        const rows = await this.prisma.branch.findMany({ orderBy: { createdAt: 'desc' } });
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            address: row.address,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        }));
    }

    async create(dto: CreateBranchRequest): Promise<Branch> {
        const row = await this.prisma.branch.create({
            data: {
                name: dto.name,
                address: dto.address,
                currency: dto.currency,
            },
        });

        return {
            id: row.id,
            name: row.name,
            address: row.address,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        };
    }
}
