import { type BrokenKbLink, type KbDocument, type KbStatus, type UpdateKbDocumentRequest } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export interface KbImportFile {
    name: string;
    raw: string;
}
export interface KbImportOptions {
    allowUnresolvedLinks?: boolean;
    force?: boolean;
    dryRun?: boolean;
}
export type KbImportAction = 'created' | 'updated' | 'unchanged' | 'skipped' | 'rejected';
export interface KbImportFileResult {
    file: string;
    slug: string | null;
    action: KbImportAction;
    errors: string[];
}
export interface KbImportReport {
    results: KbImportFileResult[];
    unresolvedLinks: BrokenKbLink[];
    applied: boolean;
}
export declare class KnowledgeService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    listDocuments(isAdmin: boolean): Promise<KbDocument[]>;
    listApproved(): Promise<KbDocument[]>;
    updateDocument(slug: string, dto: UpdateKbDocumentRequest, actor: string): Promise<KbDocument>;
    setStatus(slug: string, next: KbStatus, actor: string): Promise<KbDocument>;
    private requireDocument;
    importDocuments(files: KbImportFile[], options?: KbImportOptions): Promise<KbImportReport>;
    private inFileOrder;
}
//# sourceMappingURL=knowledge.service.d.ts.map