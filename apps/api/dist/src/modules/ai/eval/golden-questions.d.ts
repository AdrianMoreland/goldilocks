import type { AiAnswerStatus, AiMode, RecalculateOverrides } from '@goldilocks/shared-types';
export interface Cite {
    slug: string;
    anchor?: string;
}
export interface GoldenCase {
    id: string;
    question: string;
    note: string;
    status: AiAnswerStatus[];
    citesAny?: Cite[];
    mode?: AiMode;
    spotOverrides?: RecalculateOverrides;
    toolsUsed?: string[];
    noWarnings?: boolean;
    maxAnswerLength?: number;
    mustMatch?: RegExp[];
    mustNotMatch?: RegExp[];
    notesMustMatch?: RegExp[];
}
export declare const GOLDEN_QUESTIONS: GoldenCase[];
//# sourceMappingURL=golden-questions.d.ts.map