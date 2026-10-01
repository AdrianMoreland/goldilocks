import type { AiCitation } from '@goldilocks/shared-types';
import { type BuiltPrompt } from './prompt-builder';
export interface InterpretedDraft {
    message: string;
    notes: string | null;
    citations: AiCitation[];
}
export declare function interpretDraft(raw: string, prompt: BuiltPrompt): InterpretedDraft;
//# sourceMappingURL=draft-interpreter.d.ts.map