import type { KbDocument } from '@goldilocks/shared-types';
import { buildPrompt, NO_ANSWER_MARKER } from './prompt-builder';

const doc = (
    slug: string,
    markdown: string,
    overrides: Partial<KbDocument> = {},
): KbDocument => ({
    slug,
    title: `Title of ${slug}`,
    category: 'sales',
    jurisdiction: 'IE',
    owner: 'Adrian',
    status: 'approved',
    version: 3,
    contentUpdatedOn: '2026-09-30',
    markdown,
    ...overrides,
});

const pricing = doc(
    'pricing',
    '## Purpose\nPrice things.\n\n## VAT\nSilver carries 23% VAT.',
);
const collection = doc('customer-collection', '## Steps\n1. Check ID.');

describe('buildPrompt', () => {
    it('states the rules, including the no-answer form and the citation requirement', () => {
        const { systemPrompt } = buildPrompt([pricing]);

        expect(systemPrompt).toContain('Answer ONLY from the procedures');
        expect(systemPrompt).toContain(`${NO_ANSWER_MARKER}:`);
        expect(systemPrompt).toContain('[[slug#section]]');
    });

    it('includes every SOP with a citation id per section', () => {
        const { systemPrompt, sections, documents } = buildPrompt([pricing]);

        expect(documents).toBe(1);
        expect(systemPrompt).toContain(
            '=== SOP: Title of pricing (slug: pricing, owner: Adrian, version 3) ===',
        );
        expect(systemPrompt).toContain('cite as [[pricing#vat]]');
        expect(systemPrompt).toContain('Silver carries 23% VAT.');
        expect([...sections.keys()]).toEqual([
            'pricing#purpose',
            'pricing#vat',
        ]);
    });

    it('is deterministic and independent of input order, so the vendor prompt cache can reuse it', () => {
        const a = buildPrompt([pricing, collection]);
        const b = buildPrompt([collection, pricing]);

        expect(a.systemPrompt).toBe(b.systemPrompt);
        expect(a.corpusHash).toBe(b.corpusHash);
        expect(buildPrompt([pricing, collection]).systemPrompt).toBe(
            a.systemPrompt,
        );
        expect(
            a.systemPrompt.indexOf('slug: customer-collection'),
        ).toBeLessThan(a.systemPrompt.indexOf('slug: pricing'));
    });

    it('withholds the text of a section with an unresolved [TODO] and names the owner', () => {
        const { systemPrompt } = buildPrompt([
            doc(
                'limit-orders',
                '## Payment\nTake [TODO: how much up front] first.\n\n## Cancelling\nRefund in full.',
            ),
        ]);

        expect(systemPrompt).toContain(
            'cite as [[limit-orders#payment]] — NOT CONFIRMED',
        );
        expect(systemPrompt).toContain('ask Adrian');
        expect(systemPrompt).toContain('(text withheld until confirmed)');
        // Neither the TODO wording nor the surrounding text may reach the model.
        expect(systemPrompt).not.toContain('how much up front');
        expect(systemPrompt).not.toContain('Take [TODO');
        // Other sections of the same SOP are unaffected.
        expect(systemPrompt).toContain('Refund in full.');
    });

    it('labels proposed controls as proposals', () => {
        const { systemPrompt } = buildPrompt([
            doc('stock', '## Proposed controls (not yet in force)\n1. A log.'),
        ]);
        expect(systemPrompt).toContain('PROPOSAL (not in force yet)');
    });

    it('lets text before the first heading be cited as the whole SOP', () => {
        const { systemPrompt, sections } = buildPrompt([
            doc('intro', 'Just some intro text.\n\n## Later\nMore.'),
        ]);

        expect(systemPrompt).toContain(
            '--- Section: Introduction — cite as [[intro]]',
        );
        expect([...sections.keys()]).toEqual(['intro#later']);
    });

    it('changes the corpus hash when a SOP is edited or re-approved, and only then', () => {
        const base = buildPrompt([pricing]).corpusHash;

        expect(buildPrompt([pricing]).corpusHash).toBe(base);
        expect(
            buildPrompt([doc('pricing', pricing.markdown, { version: 4 })])
                .corpusHash,
        ).not.toBe(base);
        expect(
            buildPrompt([doc('pricing', `${pricing.markdown} Extra.`)])
                .corpusHash,
        ).not.toBe(base);
        // The date and owner are not part of what the assistant can say, so they don't churn the hash.
        expect(
            buildPrompt([
                doc('pricing', pricing.markdown, {
                    contentUpdatedOn: '2027-01-01',
                }),
            ]).corpusHash,
        ).toBe(base);
    });

    it('says so when nothing is approved', () => {
        const built = buildPrompt([]);

        expect(built.documents).toBe(0);
        expect(built.systemPrompt).toContain('No procedures are approved yet');
    });
});
