import type { KbDocument } from '@goldilocks/shared-types';
import { interpretAnswer } from './answer-interpreter';
import { buildPrompt } from './prompt-builder';

const doc = (slug: string, title: string, markdown: string): KbDocument => ({
    slug,
    title,
    category: 'sales',
    jurisdiction: 'IE',
    owner: 'Adrian',
    status: 'approved',
    version: 1,
    contentUpdatedOn: '2026-09-30',
    markdown,
});

const prompt = buildPrompt([
    doc(
        'pricing',
        'Pricing products',
        '## VAT\nSilver carries 23% VAT.\n\n## Buy price\nSpot less discount.',
    ),
    doc(
        'customer-collection',
        'Customer collection',
        '## Identity check\nPassport or licence.',
    ),
]);

describe('interpretAnswer', () => {
    it('accepts an answer whose citations exist, and resolves their titles and headings', () => {
        const result = interpretAnswer(
            'Silver has 23% VAT [[pricing#vat]]. Check a passport [[customer-collection#identity-check]].',
            prompt,
        );

        expect(result.status).toBe('answered');
        expect(result.citations).toEqual([
            {
                slug: 'pricing',
                anchor: 'vat',
                title: 'Pricing products',
                heading: 'VAT',
            },
            {
                slug: 'customer-collection',
                anchor: 'identity-check',
                title: 'Customer collection',
                heading: 'Identity check',
            },
        ]);
        expect(result.answer).toContain('[[pricing#vat]]');
    });

    it('lists a repeated citation once', () => {
        const result = interpretAnswer(
            'A [[pricing#vat]] B [[pricing#vat]]',
            prompt,
        );
        expect(result.citations).toHaveLength(1);
    });

    it('removes a citation the library does not contain, so a made-up link never reaches the screen', () => {
        const result = interpretAnswer(
            'Yes [[pricing#vat]] and also [[pricing#invented-section]] and [[no-such-sop#x]].',
            prompt,
        );

        expect(result.status).toBe('answered');
        expect(result.citations.map((c) => c.anchor)).toEqual(['vat']);
        expect(result.answer).not.toContain('invented-section');
        expect(result.answer).not.toContain('no-such-sop');
        expect(result.answer).toBe('Yes [[pricing#vat]] and also and.');
    });

    it('reports an answer with no valid citation as uncited', () => {
        expect(interpretAnswer('Probably 23%.', prompt).status).toBe('uncited');
        expect(
            interpretAnswer('Probably 23% [[pricing#invented]].', prompt)
                .status,
        ).toBe('uncited');
    });

    it('accepts a citation of a whole SOP, but not of an unknown one', () => {
        expect(interpretAnswer('See [[pricing]].', prompt).citations).toEqual([
            {
                slug: 'pricing',
                anchor: null,
                title: 'Pricing products',
                heading: null,
            },
        ]);
        expect(interpretAnswer('See [[ghost]].', prompt).status).toBe(
            'uncited',
        );
    });

    it('treats NO_ANSWER as a refusal, in any case, and keeps only the reason', () => {
        const result = interpretAnswer(
            'NO_ANSWER: The approved procedures do not cover limit orders. Ask a manager.',
            prompt,
        );

        expect(result).toEqual({
            answer: 'The approved procedures do not cover limit orders. Ask a manager.',
            status: 'refused',
            citations: [],
        });
        expect(interpretAnswer('no_answer   ', prompt).answer).toBe(
            'The approved procedures do not cover this. Ask a manager.',
        );
    });

    it('ignores citations inside a refusal', () => {
        expect(
            interpretAnswer('NO_ANSWER: not covered [[pricing#vat]]', prompt)
                .citations,
        ).toEqual([]);
    });

    it('does not mistake the word in the middle of an answer for a refusal', () => {
        expect(
            interpretAnswer(
                'Say NO_ANSWER only when unsure. [[pricing#vat]]',
                prompt,
            ).status,
        ).toBe('answered');
    });
});
