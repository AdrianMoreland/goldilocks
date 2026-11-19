import {
    amountAgrees,
    decideLine,
    tradeLinkKey,
    type SaleCandidate,
    type ShipmentLine,
} from './shipment-matcher';

const line: ShipmentLine = {
    shipmentNo: 'SHP-100200',
    itemNo: '1101',
    customerId: 5,
    postedOn: new Date('2026-10-20'),
    productId: 7,
    qty: 2,
    amount: 5000,
};

function sale(over: Partial<SaleCandidate> = {}): SaleCandidate {
    return {
        id: 1,
        sourceKey: 'TS|1',
        customerId: 5,
        client: 'Jane Doe',
        date: new Date('2026-10-01'),
        productId: 7,
        qty: 2,
        receipt: 5000,
        ...over,
    };
}

describe('amountAgrees', () => {
    it('accepts the same amount, within €1 or 0.5%, or with VAT', () => {
        expect(amountAgrees(5000, 5000)).toBe(true);
        expect(amountAgrees(5020, 5000)).toBe(true);
        expect(amountAgrees(6150, 5000)).toBe(true);
        expect(amountAgrees(5100, 5000)).toBe(false);
        expect(amountAgrees(null, 5000)).toBe(false);
    });
});

describe('decideLine', () => {
    it('links the one sale that fits and agrees on amount', () => {
        const d = decideLine(line, [sale()], 'Jane Doe', new Set());
        expect(d).toMatchObject({ outcome: 'LINK', trade: { id: 1 } });
    });

    it('fits a sheet row without a customer by name', () => {
        const d = decideLine(
            line,
            [sale({ customerId: null, client: ' jane doe ' })],
            'Jane Doe',
            new Set(),
        );
        expect(d.outcome).toBe('LINK');
    });

    it('suggests when the amount differs or several sales fit', () => {
        expect(
            decideLine(line, [sale({ receipt: 4000 })], 'Jane Doe', new Set()),
        ).toMatchObject({ outcome: 'SUGGEST', note: 'AMOUNT_DIFFERS' });
        const d = decideLine(
            line,
            [sale(), sale({ id: 2, sourceKey: null })],
            'Jane Doe',
            new Set(),
        );
        expect(d).toMatchObject({
            outcome: 'SUGGEST',
            note: 'SEVERAL_SALES_FIT',
        });
    });

    it('links the sale to the cent when several are within tolerance', () => {
        const a = { ...line, amount: 4006 };
        const sales = [
            sale({ id: 1, receipt: 4006 }),
            sale({ id: 2, sourceKey: 'TS|2', receipt: 4000 }),
        ];
        expect(decideLine(a, sales, 'Jane Doe', new Set())).toMatchObject({
            outcome: 'LINK',
            trade: { id: 1 },
        });
        expect(
            decideLine({ ...line, amount: 4003 }, sales, 'Jane Doe', new Set()),
        ).toMatchObject({ outcome: 'SUGGEST', note: 'SEVERAL_SALES_FIT' });
    });

    it('ignores taken sales, other products, quantities and dates', () => {
        const none = [
            sale({ productId: 8 }),
            sale({ qty: 3 }),
            sale({ date: new Date('2026-05-01') }),
            sale({ date: new Date('2026-11-01') }),
            sale({ customerId: 6 }),
        ];
        expect(decideLine(line, none, 'Jane Doe', new Set()).outcome).toBe(
            'NONE',
        );
        expect(
            decideLine(line, [sale()], 'Jane Doe', new Set([1])).outcome,
        ).toBe('NONE');
    });

    it('names a sale without a workbook key by its id', () => {
        expect(tradeLinkKey({ id: 9, sourceKey: null })).toBe('trade#9');
        expect(tradeLinkKey({ id: 9, sourceKey: 'TS|9' })).toBe('TS|9');
    });
});
