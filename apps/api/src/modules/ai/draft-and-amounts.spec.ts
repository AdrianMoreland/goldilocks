import type { KbDocument } from '@goldilocks/shared-types';
import { findUnverifiedAmounts, numbersIn, parseAmount } from './amount-check';
import { interpretDraft } from './draft-interpreter';
import { buildPrompt, modeInstructions, NOTES_MARKER } from './prompt-builder';
import { collectFacts } from './tools/tool-facts';

const doc = (slug: string, markdown: string): KbDocument => ({
    slug,
    title: `Title of ${slug}`,
    category: 'sales',
    jurisdiction: 'IE',
    owner: 'Adrian',
    status: 'approved',
    version: 1,
    contentUpdatedOn: '2026-09-30',
    markdown,
});

const PROMPT = buildPrompt([
    doc(
        'payment',
        '## Accepted payment methods\nCash over €10,000 needs checks.',
    ),
]);

describe('interpretDraft', () => {
    const draft = `Subject: Your enquiry

Hello Anna,

A 100g gold bar is €10,120 [[payment#accepted-payment-methods]].

Kind regards,
[Your name]
Merrion Gold
${NOTES_MARKER}
- Customer wants a price for a 100g gold bar.
- Cash over €10,000 needs checks [[payment#accepted-payment-methods]] and [[made-up#nothing]].`;

    it('splits the message to send from the staff notes', () => {
        const result = interpretDraft(draft, PROMPT);

        expect(result.message.startsWith('Subject: Your enquiry')).toBe(true);
        expect(result.message).toContain('Kind regards,');
        expect(result.message).not.toContain('Customer wants a price');
        expect(result.notes).toContain('Customer wants a price');
    });

    it('removes any wiki link that leaked into the message, because the customer must never see one', () => {
        const { message } = interpretDraft(draft, PROMPT);

        expect(message).not.toContain('[[');
        expect(message).toContain('A 100g gold bar is €10,120.');
    });

    it('keeps real citations from the notes, and strips invented ones', () => {
        const { citations, notes } = interpretDraft(draft, PROMPT);

        expect(citations).toEqual([
            {
                slug: 'payment',
                anchor: 'accepted-payment-methods',
                title: 'Title of payment',
                heading: 'Accepted payment methods',
            },
        ]);
        expect(notes).not.toContain('made-up');
    });

    it('treats a reply with no marker as all message, without notes', () => {
        const result = interpretDraft(
            'Hello Anna, thanks for your email.',
            PROMPT,
        );

        expect(result).toEqual({
            message: 'Hello Anna, thanks for your email.',
            notes: null,
            citations: [],
        });
    });

    it('accepts the marker with stray spacing or dashes', () => {
        const result = interpretDraft('Hi.\n --- NOTES ---\n- a note', PROMPT);

        expect(result.message).toBe('Hi.');
        expect(result.notes).toBe('- a note');
    });
});

describe('modeInstructions', () => {
    it('tells the model how to split a drafted reply, and that the email must not carry citations', () => {
        for (const mode of ['email', 'whatsapp'] as const) {
            expect(modeInstructions(mode)).toContain(NOTES_MARKER);
            expect(modeInstructions(mode)).toMatch(/No citations/);
            expect(modeInstructions(mode)).toContain('findProductPrices');
        }
        expect(modeInstructions('email')).toMatch(/Subject:/);
        expect(modeInstructions('whatsapp')).toMatch(/no subject line/i);
    });
});

describe('parseAmount', () => {
    it.each([
        ['10120', 10120],
        ['10,120', 10120],
        ['10.120', 10120],
        ['10,120.50', 10120.5],
        ['10.120,50', 10120.5],
        ['10,5', 10.5],
        ['3.5', 3.5],
        ['1,234,567', 1234567],
    ])('reads %s as %d', (raw, expected) => {
        expect(parseAmount(raw)).toBe(expected);
    });
});

describe('findUnverifiedAmounts', () => {
    const allowed = new Set([10120, 9780, 3090.5]);

    it('accepts amounts that came from a lookup, in any common spelling', () => {
        expect(
            findUnverifiedAmounts(
                'Price €10,120, buyback 9.780 EUR, or 3090.50 euros.',
                allowed,
            ),
        ).toEqual([]);
    });

    it('reports an amount nobody supplied', () => {
        expect(
            findUnverifiedAmounts('The price is €10,500 today.', allowed),
        ).toEqual(['€10,500']);
    });

    it('reports a total the model worked out itself, which is what the tool totals are for', () => {
        expect(
            findUnverifiedAmounts('Three bars come to €30,360.', allowed),
        ).toEqual(['€30,360']);
    });

    it('ignores numbers that are not money, such as weights and percentages', () => {
        expect(
            findUnverifiedAmounts(
                'A 100g bar plus a 2% handling fee.',
                allowed,
            ),
        ).toEqual([]);
    });

    it('reports each wrong amount once', () => {
        expect(
            findUnverifiedAmounts('€1,111 and again €1,111.', allowed),
        ).toEqual(['€1,111']);
    });
});

describe('numbersIn', () => {
    it('collects every number in the text', () => {
        expect(numbersIn('Pay €10,000 or 50,000.50 within 15 days')).toEqual(
            new Set([10000, 50000.5, 15]),
        );
    });
});

describe('collectFacts', () => {
    it('gathers every figure a lookup returned, however deeply nested', () => {
        const facts = collectFacts([
            {
                products: [{ price: 10120, buyback: 9780 }],
                spot: [{ eurPerTroyOunce: 3000, mayBeOutOfDate: false }],
            },
        ]);

        expect(facts.numbers.sort()).toEqual([3000, 9780, 10120].sort());
        expect(facts.mayBeOutOfDate).toBe(false);
    });

    it('notices a spot that may be out of date, and when it was taken', () => {
        const facts = collectFacts([
            {
                spot: [
                    { mayBeOutOfDate: true, asOfIrishTime: '01 Oct, 09:00' },
                ],
            },
        ]);

        expect(facts).toMatchObject({
            mayBeOutOfDate: true,
            asOfIrishTime: '01 Oct, 09:00',
        });
    });
});
