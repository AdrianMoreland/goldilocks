import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { Branch, CreateBranchRequest } from '@goldilocks/shared-types';
export declare class BranchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<Branch[]>;
    create(dto: CreateBranchRequest): Promise<Branch>;
}
//# sourceMappingURL=branches.service.d.ts.map