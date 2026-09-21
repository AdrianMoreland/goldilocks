import { BranchesService } from './branches.service';
import { CreateBranchRequestDto } from '../../common/dto/dtos';
import type { Branch } from '@goldilocks/shared-types';
export declare class BranchesController {
    private readonly service;
    constructor(service: BranchesService);
    getAll(): Promise<Branch[]>;
    create(body: CreateBranchRequestDto): Promise<Branch>;
}
//# sourceMappingURL=branches.controller.d.ts.map