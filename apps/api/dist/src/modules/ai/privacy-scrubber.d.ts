export declare const REDACTED_NAME = "[customer]";
export declare const REDACTED_EMAIL = "[email]";
export declare const REDACTED_PHONE = "[phone]";
export declare const REDACTED_ACCOUNT = "[account]";
export interface ScrubResult {
    text: string;
    redacted: boolean;
}
export declare function vocabularyOf(text: string): Set<string>;
export declare function scrubPersonalData(input: string, vocabulary: ReadonlySet<string>): ScrubResult;
export declare function normaliseQuestion(text: string): string;
//# sourceMappingURL=privacy-scrubber.d.ts.map