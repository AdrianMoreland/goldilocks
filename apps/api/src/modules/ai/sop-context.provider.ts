import { Injectable } from '@nestjs/common';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { buildPrompt, type BuiltPrompt } from './prompt-builder';

/**
 * Decides which procedures the assistant sees for a question. Today that is
 * all of them (they total about 6,000 tokens, far too little for retrieval to
 * pay for itself). The interface is the seam for roadmap 1.5's "later: RAG" —
 * a retrieval-based implementation replaces FullCorpusContext without
 * touching AskService.
 */
export interface SopContextProvider {
    load(question: string): Promise<BuiltPrompt>;
}

export const SOP_CONTEXT = Symbol('SOP_CONTEXT');

@Injectable()
export class FullCorpusContext implements SopContextProvider {
    constructor(private readonly knowledge: KnowledgeService) {}

    async load(): Promise<BuiltPrompt> {
        return buildPrompt(await this.knowledge.listApproved());
    }
}
