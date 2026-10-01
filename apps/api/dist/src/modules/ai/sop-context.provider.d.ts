import { KnowledgeService } from '../knowledge/knowledge.service';
import { type BuiltPrompt } from './prompt-builder';
export interface SopContextProvider {
    load(question: string): Promise<BuiltPrompt>;
}
export declare const SOP_CONTEXT: unique symbol;
export declare class FullCorpusContext implements SopContextProvider {
    private readonly knowledge;
    constructor(knowledge: KnowledgeService);
    load(): Promise<BuiltPrompt>;
}
//# sourceMappingURL=sop-context.provider.d.ts.map