import {
    parseProductName,
    priceMetalEvidence,
    type MatchInput,
    type SpotRow,
} from '@goldilocks/shared-types';
import { splitAlias } from './product-name-usage';

/** One row (sale, purchase, invoice line or purchase order line) that carries a product name. */
export interface EvidenceRow {
    /** The cleaned product text of the row. */
    name: string;
    /** The normalised refinery on the row, if the source has one. */
    refinery: string | null;
    /** The tab metal (sales and purchases only). */
    tabMetal: 'GOLD' | 'SILVER' | 'PGM' | null;
    /** YYYY-MM-DD */
    date: string | null;
    /** Price of one item, in euro (the sheets and Zoho are in euro; the spot table is read in euro). */
    unitPrice: number | null;
}

export type EvidenceIndex = Map<string, EvidenceRow[]>;

export function buildEvidenceIndex(rows: EvidenceRow[]): EvidenceIndex {
    const index: EvidenceIndex = new Map();
    for (const r of rows) {
        const list = index.get(r.name);
        if (list) list.push(r);
        else index.set(r.name, [r]);
    }
    return index;
}

/** The rows of an alias ("name" or "name|REFINERY"). */
function rowsOf(alias: string, index: EvidenceIndex): EvidenceRow[] {
    const { name, refinery } = splitAlias(alias);
    return (index.get(name) ?? []).filter(
        (r) =>
            refinery === null || r.refinery === null || r.refinery === refinery,
    );
}

/**
 * What the rows carrying a name say about its metal. `metal` is the tab metal when every sale and purchase of the name
 * is on one gold or silver tab (platinum and palladium share the PGM tab, so that is no evidence of one metal).
 * `metalEvidence` is the metal the unit prices point to, against that day's spot, for a name that has no tab metal.
 */
export function evidenceFor(
    alias: string,
    index: EvidenceIndex,
    spotOn: (date: string) => SpotRow | undefined,
    known: { metalHint: string | null },
): Pick<MatchInput, 'metal' | 'metalEvidence'> {
    const rows = rowsOf(alias, index);
    if (rows.length === 0) return {};
    const p = parseProductName(alias);
    if (p.metals.size > 0) return {};
    if (known.metalHint) return {};
    const tabs = new Set(
        rows
            .map((r) => r.tabMetal)
            .filter((m): m is NonNullable<typeof m> => m !== null),
    );
    if (tabs.size === 1) {
        const only = [...tabs][0];
        if (only === 'GOLD' || only === 'SILVER') return { metal: only };
    }
    const price = priceMetalEvidence(
        rows.map((r) => ({ date: r.date, unitPrice: r.unitPrice })),
        p.grams,
        spotOn,
    );
    return price
        ? {
              metalEvidence: {
                  metal: price.metal,
                  from: 'price',
                  rows: price.rows,
              },
          }
        : {};
}
