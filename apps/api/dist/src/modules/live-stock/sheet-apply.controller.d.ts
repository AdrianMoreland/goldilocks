import type { SheetApplyItem, SheetApplyPreview, SheetApplyResult } from '@goldilocks/shared-types';
import { SheetApplyService } from './sheet-apply.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { ResolveSheetApplicationRequestDto } from '../../common/dto/dtos';
export declare class SheetApplyController {
    private readonly service;
    constructor(service: SheetApplyService);
    preview(req: RequestWithUser): Promise<SheetApplyPreview>;
    apply(req: RequestWithUser): Promise<SheetApplyResult>;
    pending(req: RequestWithUser): Promise<SheetApplyItem[]>;
    resolve(req: RequestWithUser, id: number, body: ResolveSheetApplicationRequestDto): Promise<{
        status: string;
    }>;
}
//# sourceMappingURL=sheet-apply.controller.d.ts.map