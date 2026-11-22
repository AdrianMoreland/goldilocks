import { BranchesService } from './branches.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { CreateBranchRequestDto } from '../../common/dto/dtos';
import type { Branch } from '@goldilocks/shared-types';
export declare class BranchesController {
    private readonly service;
    constructor(service: BranchesService);
    getAll(): Promise<Branch[]>;
    create(body: CreateBranchRequestDto, req: RequestWithUser): Promise<Branch>;
}
//# sourceMappingURL=branches.controller.d.ts.map