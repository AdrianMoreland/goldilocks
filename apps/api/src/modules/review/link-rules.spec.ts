import {
    judgeLineTrade,
    judgeSaleLot,
    productTokens,
    sameProduct,
    type LotEnd,
    type SaleEnd,
} from './link-rules';

const sale = (over: Partial<SaleEnd> = {}): SaleEnd => ({
    qty: 4,
    productKey: '1oz britannia',
    productText: '1oz brits',
    ...over,
});
const lot = (over: Partial<LotEnd> = {}): LotEnd => ({
    qty: 550,
    allocatedQty: 4,
    productKey: '1oz britannia',
    productText: '1oz Britannia',
    ...over,
});

describe('sameProduct', () => {
    it('trusts equal catalogue keys and rejects different ones', () => {
        expect(
            sameProduct(
                { productKey: 'a', text: 'x' },
                { productKey: 'a', text: 'y' },
            ),
        ).toBe(true);
        expect(
            sameProduct(
                { productKey: 'a', text: '1oz Eagle' },
                { productKey: 'b', text: '1oz Krugerrand' },
            ),
        ).toBe(false);
    });

    it('compares names when a key is missing, knowing brits is Britannia', () => {
        expect(
            sameProduct(
                { productKey: null, text: '1oz brits' },
                { productKey: null, text: '1oz Britannia' },
            ),
        ).toBe(true);
        expect(
            sameProduct(
                { productKey: null, text: '1oz Gold Bullion Bar' },
                { productKey: null, text: '1oz bar' },
            ),
        ).toBe(true);
        expect(
            sameProduct(
                { productKey: null, text: '1oz Krugerrand' },
                { productKey: null, text: '1oz Britannia' },
            ),
        ).toBe(false);
        expect(
            sameProduct(
                { productKey: null, text: '' },
                { productKey: null, text: '1oz bar' },
            ),
        ).toBe(false);
    });

    it('treats spelling variants as the same product even when the catalogue keys differ', () => {
        const same = (
            a: string,
            b: string,
            ka: string | null = 'ka',
            kb: string | null = 'kb',
        ) =>
            sameProduct(
                { productKey: ka, text: a },
                { productKey: kb, text: b },
            );
        expect(same('50g Combi bar', '50G Combi')).toBe(true);
        expect(same('1/4oz Maple', '1/4 Maple')).toBe(true);
        expect(same('1/10oz Maple', '1/10 Maple')).toBe(true);
        expect(same('1oz PAMP Lady Fortuna', '1oz bar')).toBe(true);
        expect(same('1oz Bar PAMP', '1oz bar')).toBe(true);
    });

    it('still tells real differences apart', () => {
        const same = (a: string, b: string) =>
            sameProduct(
                { productKey: 'ka', text: a },
                { productKey: 'kb', text: b },
            );
        expect(same('1/10oz Eagle', '1oz Eagle')).toBe(false);
        expect(same('1oz bar', 'half sovereign')).toBe(false);
        expect(same('Full Sovereign', '1oz bar')).toBe(false);
        expect(same('20g bar', '1oz Krugerrand')).toBe(false);
        expect(same('100g bar', '1oz Krugerrand')).toBe(false);
        expect(same('1oz Krugerrand', '1oz Britannia')).toBe(false);
    });

    it('tokens fold plurals and synonyms', () => {
        expect([...productTokens('1oz Brits')]).toEqual(['1', 'britannia']);
    });
});

describe('judgeSaleLot', () => {
    it('confirms a sale and a purchase line of the same product with room to spare', () => {
        expect(judgeSaleLot(sale(), lot())).toEqual({ verdict: 'CONFIRM' });
    });

    it('asks when the products differ', () => {
        const v = judgeSaleLot(
            sale({
                productKey: '1oz krugerrand',
                productText: '1oz Krugerrand',
            }),
            lot(),
        );
        expect(v).toMatchObject({
            verdict: 'ASK',
            reason: expect.stringContaining('different products'),
        });
    });

    it('sets a purchase line with more sold than bought aside for its own review', () => {
        const v = judgeSaleLot(sale(), lot({ qty: 10, allocatedQty: 14 }));
        expect(v).toMatchObject({
            verdict: 'SEPARATE',
            reason: expect.stringContaining(
                '14 sold from a purchase line of 10',
            ),
        });
    });

    it('confirms when the sales exactly use up the purchase', () => {
        expect(
            judgeSaleLot(sale(), lot({ qty: 10, allocatedQty: 10 })),
        ).toEqual({ verdict: 'CONFIRM' });
    });

    it('asks when an end is missing or the purchase has no quantity', () => {
        expect(judgeSaleLot(null, lot())).toMatchObject({ verdict: 'ASK' });
        expect(judgeSaleLot(sale(), null)).toMatchObject({ verdict: 'ASK' });
        expect(judgeSaleLot(sale(), lot({ qty: null }))).toMatchObject({
            verdict: 'ASK',
            reason: expect.stringContaining('no quantity'),
        });
    });
});

describe('judgeLineTrade', () => {
    const line = { qty: 2, itemName: '1oz Gold Britannia' };

    it('confirms the same quantity of the same product', () => {
        expect(judgeLineTrade(line, sale({ qty: 2 }))).toEqual({
            verdict: 'CONFIRM',
        });
    });

    it('asks on a different quantity or product', () => {
        expect(judgeLineTrade(line, sale({ qty: 3 }))).toMatchObject({
            verdict: 'ASK',
            reason: expect.stringContaining('2 and the sale 3'),
        });
        expect(
            judgeLineTrade(
                { qty: 2, itemName: '1oz Krugerrand' },
                sale({ qty: 2 }),
            ),
        ).toMatchObject({
            verdict: 'ASK',
            reason: expect.stringContaining('different products'),
        });
        expect(
            judgeLineTrade({ qty: null, itemName: 'x' }, sale()),
        ).toMatchObject({ verdict: 'ASK' });
    });
});
