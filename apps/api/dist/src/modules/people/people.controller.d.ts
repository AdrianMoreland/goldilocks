import type { AdminUser, PermissionMatrix } from '@goldilocks/shared-types';
import { SetOverridesRequestDto, UpdatePermissionMatrixRequestDto, UpdateUserRequestDto } from '../../common/dto/dtos';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { PeopleService } from './people.service';
export declare class PeopleController {
    private readonly people;
    constructor(people: PeopleService);
    list(): Promise<AdminUser[]>;
    update(id: string, body: UpdateUserRequestDto, req: RequestWithUser): Promise<void>;
    setOverrides(id: string, body: SetOverridesRequestDto, req: RequestWithUser): Promise<void>;
    matrix(): Promise<PermissionMatrix>;
    setMatrix(body: UpdatePermissionMatrixRequestDto, req: RequestWithUser): Promise<void>;
}
//# sourceMappingURL=people.controller.d.ts.map