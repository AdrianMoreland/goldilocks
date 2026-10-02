import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RoadmapEditRequestDto } from '../../common/dto/dtos';
import { RoadmapService } from './roadmap.service';
export declare class RoadmapController {
    private readonly service;
    constructor(service: RoadmapService);
    get(): Promise<{
        markdown: string;
        version: number;
        updatedBy: string | null;
        updatedAt: string | null;
    }>;
    edit(body: RoadmapEditRequestDto, req: RequestWithUser): Promise<{
        markdown: string;
        version: number;
        updatedBy: string | null;
        updatedAt: string | null;
    }>;
}
//# sourceMappingURL=roadmap.controller.d.ts.map