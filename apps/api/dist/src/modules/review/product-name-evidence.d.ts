import { type MatchInput, type SpotRow } from '@goldilocks/shared-types';
export interface EvidenceRow {
    name: string;
    refinery: string | null;
    tabMetal: 'GOLD' | 'SILVER' | 'PGM' | null;
    date: string | null;
    unitPrice: number | null;
}
export type EvidenceIndex = Map<string, EvidenceRow[]>;
export declare function buildEvidenceIndex(rows: EvidenceRow[]): EvidenceIndex;
export declare function evidenceFor(alias: string, index: EvidenceIndex, spotOn: (date: string) => SpotRow | undefined, known: {
    metalHint: string | null;
}): Pick<MatchInput, 'metal' | 'metalEvidence'>;
//# sourceMappingURL=product-name-evidence.d.ts.map