import { type AiAnswerStatus, type AiCitation } from '@goldilocks/shared-types';
import { type BuiltPrompt } from './prompt-builder';
export interface InterpretedAnswer {
    answer: string;
    status: AiAnswerStatus;
    citations: AiCitation[];
}
export declare function checkCitations(text: string, prompt: BuiltPrompt): {
    cleaned: string;
    citations: AiCitation[];
};
export declare function interpretAnswer(raw: string, prompt: BuiltPrompt): InterpretedAnswer;
//# sourceMappingURL=answer-interpreter.d.ts.map