import {
    normaliseQuestion,
    scrubPersonalData,
    vocabularyOf,
} from './privacy-scrubber';

const VOCAB = vocabularyOf(
    'Customers collect orders. A payout over €50,000 needs checks. StoneX and CoinInvest place hedges. Buyback price, VAT, cash, platinum, coin.',
);

const scrub = (text: string) => scrubPersonalData(text, VOCAB);

describe('scrubPersonalData', () => {
    it('removes a customer name, email and phone number', () => {
        const result = scrub(
            'Customer John Murphy (john.murphy@example.ie, 087 123 4567) is coming to collect his order.',
        );

        expect(result.text).not.toMatch(/john|murphy|example\.ie|4567/i);
        expect(result.text).toContain('[customer]');
        expect(result.text).toContain('[email]');
        expect(result.text).toContain('[phone]');
        expect(result.redacted).toBe(true);
    });

    it('collapses a full name into one placeholder', () => {
        expect(scrub('What does John Murphy owe?').text).toBe(
            'What does [customer] owe?',
        );
    });

    it('removes titles and an IBAN', () => {
        const result = scrub(
            'Mrs Byrne paid to IE29 AIBK 9311 5212 3456 78 today',
        );

        expect(result.text).not.toMatch(/byrne|mrs|AIBK|5212/i);
        expect(result.text).toContain('[account]');
    });

    it('keeps amounts, so different thresholds stay different questions', () => {
        expect(scrub('Is a €50,000 payout different from €5,000?').text).toBe(
            'Is a €50,000 payout different from €5,000?',
        );
        expect(scrub('Is a €50,000 payout different?').redacted).toBe(false);
    });

    it('keeps known vocabulary and question words that start a sentence', () => {
        const result = scrub(
            'Do we charge VAT on platinum? How does StoneX place a hedge?',
        );

        expect(result.text).toBe(
            'Do we charge VAT on platinum? How does StoneX place a hedge?',
        );
        expect(result.redacted).toBe(false);
    });

    it('over-scrubs a capitalised word it does not know', () => {
        expect(scrub('Is a Krugerrand taxed?').text).toBe(
            'Is a [customer] taxed?',
        );
    });

    it('leaves a plain question untouched and reports nothing redacted', () => {
        const result = scrub('what id do i accept at collection');

        expect(result).toEqual({
            text: 'what id do i accept at collection',
            redacted: false,
        });
    });
});

describe('normaliseQuestion', () => {
    it('makes trivial variants share one key', () => {
        expect(normaliseQuestion('  Do we charge VAT on Platinum?? ')).toBe(
            normaliseQuestion('do we charge vat on platinum'),
        );
    });

    it('keeps the digits and currency signs that change the answer', () => {
        expect(normaliseQuestion('Payout over €50,000?')).not.toBe(
            normaliseQuestion('Payout over €5,000?'),
        );
    });
});
