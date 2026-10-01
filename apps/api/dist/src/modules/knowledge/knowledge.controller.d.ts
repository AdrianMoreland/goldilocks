import { type RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { KbDocumentDto, KbDocumentListResponseDto, SetKbStatusRequestDto, UpdateKbDocumentRequestDto } from '../../common/dto/dtos';
import { KnowledgeService } from './knowledge.service';
export declare class KnowledgeController {
    private readonly knowledge;
    constructor(knowledge: KnowledgeService);
    listDocuments(request: RequestWithUser): Promise<KbDocumentListResponseDto>;
    updateDocument(slug: string, body: UpdateKbDocumentRequestDto, request: RequestWithUser): Promise<KbDocumentDto>;
    setStatus(slug: string, body: SetKbStatusRequestDto, request: RequestWithUser): Promise<KbDocumentDto>;
}
//# sourceMappingURL=knowledge.controller.d.ts.map