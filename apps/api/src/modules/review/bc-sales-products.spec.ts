import {
    genericNormOf,
    planBcSalesProducts,
    type BcItemInput,
    type CataloguePricingProduct,
} from './bc-sales-products';
import { BcSalesProductsService } from './bc-sales-products.service';

const catalogue: CataloguePricingProduct[] = [
    { id: 1, sku: 'GOLD-1OZ-BAR', name: '1oz Gold Bar', metalType: 'GOLD' },
    {
        id: 2,
        sku: 'SILVER-1KG-BAR',
        name: '1kg Silver Bar',
        metalType: 'SILVER',
    },
    {
        id: 3,
        sku: 'SILVER-500G-BAR',
        name: '500g Silver Bar',
        metalType: 'SILVER',
    },
    {
        id: 4,
        sku: 'GOLD-1/2OZ-KRUGERRAND-COIN',
        name: '1/2oz Gold Krugerrand',
        metalType: 'GOLD',
    },
    { id: 5, sku: 'GOLD-100G-BAR', name: '100g Gold Bar', metalType: 'GOLD' },
    {
        id: 7,
        sku: 'GOLD-1OZ-KANGAROO-COIN',
        name: '1oz Gold Kangaroo',
        metalType: 'GOLD',
    },
    {
        id: 8,
        sku: 'GOLD-1OZ-BRITANNIA-COIN',
        name: '1oz Gold Britannia',
        metalType: 'GOLD',
    },
    { id: 6, sku: 'GOLD-10G-BAR', name: '10g Gold Bar', metalType: 'GOLD' },
];

const item = (
    itemNo: string,
    description: string,
    productId: number | null,
    salesProductId: number | null = null,
): BcItemInput => ({ itemNo, description, productId, salesProductId });

const plan = (items: BcItemInput[]) => planBcSalesProducts(items, catalogue);

describe('genericNormOf and refinery', () => {
    it('takes the refinery out of the generic name', () => {
        const r = plan([
            item('1001', 'Argor-Heraeus 1oz bar', 1),
            item('3001', '500g Argor-Heraeus Silver Bars', 3),
            item('2001', '1/2oz Gold Krugerrand', 4),
            item('1005', 'Best Value (Mixed Refiners) 100g bar', 5),
            item('1006', 'PAMP Suisse Lady Fortuna 10g bar', 6),
        ]).rows;
        expect(r[0]).toMatchObject({
            refinery: 'ARGOR-HERAEUS',
            genericNorm: '1oz bar',
            action: 'CREATE',
        });
        expect(r[1]).toMatchObject({
            refinery: 'ARGOR-HERAEUS',
            genericNorm: '500g bar',
            action: 'CREATE',
        });
        expect(r[2]).toMatchObject({
            refinery: null,
            genericNorm: '1/2oz krugerrand',
            action: 'CREATE',
        });
        expect(r[3]).toMatchObject({
            refinery: null,
            genericNorm: '100g bar',
            action: 'CREATE',
        });
        expect(r[4]).toMatchObject({
            refinery: 'PAMP SUISSE',
            genericNorm: 'lady fortuna 10g bar',
        });
    });
    it('leaves metal words and mixed-refiner noise out of the generic name', () => {
        expect(genericNormOf('1oz Gold Trees of Life (2026)', null)).toBe(
            '1oz tree of life',
        );
        expect(genericNormOf('1OZ PLATINUM PHILHARMONIC', null)).toBe(
            '1oz philharmonic',
        );
        expect(
            genericNormOf('Best Value (Mixed Refiners) 100g bar', null),
        ).toBe('100g bar');
        expect(genericNormOf('Mixed/Other 1oz bar', null)).toBe('1oz bar');
    });
    it('drops a leading "the" with the refinery', () => {
        expect(
            genericNormOf(
                'The Perth Mint Australia 1oz Bar',
                'PERTH MINT AUSTRALIA',
            ),
        ).toBe('1oz bar');
    });
});

describe('coins have no refinery', () => {
    it('keeps the mint words in the generic name of a coin', () => {
        const rows = plan([
            item('2002', '1oz Perth Mint Kangaroo Gold Coin', 7),
            item('2003', 'Royal Mint Britannia 1oz Gold Coin', 8),
        ]).rows;
        expect(rows[0]).toMatchObject({
            refinery: null,
            genericNorm: '1oz perth mint kangaroo',
            action: 'CREATE',
        });
        expect(rows[1]).toMatchObject({
            refinery: null,
            genericNorm: 'royal mint britannia 1oz',
        });
    });
});

describe('planBcSalesProducts', () => {
    it('creates a row with a fitting pricing product, with its metal', () => {
        const [r] = plan([item('1001', 'Argor-Heraeus 1oz bar', 1)]).rows;
        expect(r).toMatchObject({
            action: 'CREATE',
            name: 'Argor-Heraeus 1oz bar',
            metal: 'GOLD',
            pricingProductId: 1,
            pricingProductName: '1oz Gold Bar',
            suggestedSku: 'GOLD-1OZ-BAR',
        });
        expect(r.reason).toBeUndefined();
    });
    it('reports items that already have a specific product as LINKED', () => {
        expect(
            plan([item('1001', 'Argor-Heraeus 1oz bar', 1, 9)]).rows[0].action,
        ).toBe('LINKED');
    });
    it('skips an item with no pricing product', () => {
        const [r] = plan([item('1003', 'PAMP Suisse 1oz bar', null)]).rows;
        expect(r).toMatchObject({
            action: 'SKIP',
            reason: 'No pricing product linked: link it in BC items first.',
            metal: 'GOLD',
        });
    });
    it('skips a pricing link the description contradicts (1002 linked to the 1kg silver bar)', () => {
        const out = plan([item('1002', 'The Perth Mint Australia 1oz Bar', 2)]);
        expect(out.rows[0]).toMatchObject({
            action: 'SKIP',
            suggestedSku: 'GOLD-1OZ-BAR',
            refinery: 'PERTH MINT',
            reason: 'Pricing link looks wrong: linked to 1kg Silver Bar, description suggests GOLD-1OZ-BAR. Check it in BC items.',
        });
        expect(out.totals).toEqual({ create: 0, linked: 0, skip: 1, total: 1 });
    });
    it('suffixes the item number when two items share a name', () => {
        const rows = plan([
            item('1001', '1oz Bar', 1),
            item('1002', '1OZ BAR', 1),
            item('1003', 'Other 1oz bar', 1),
        ]).rows;
        expect(rows.map((r) => r.name)).toEqual([
            '1oz Bar (1001)',
            '1OZ BAR (1002)',
            'Other 1oz bar',
        ]);
    });
    it('leaves metal null when nothing says what it is', () => {
        const [r] = plan([item('6001', 'Mystery thing', null)]).rows;
        expect(r).toMatchObject({ action: 'SKIP', metal: null });
    });
});

describe('BcSalesProductsService.apply', () => {
    function setup(
        items: BcItemInput[],
        existingSales: Array<{
            id: number;
            name: string;
            metal: string;
            pricingProductId: number | null;
        }> = [],
    ) {
        let nextId = 100;
        const tx = {
            bcItem: {
                findMany: jest.fn().mockResolvedValue(items),
                update: jest.fn().mockResolvedValue({}),
            },
            product: {
                findMany: jest.fn().mockResolvedValue(catalogue),
            },
            salesProduct: {
                findMany: jest.fn().mockResolvedValue(existingSales),
                create: jest
                    .fn()
                    .mockImplementation(() =>
                        Promise.resolve({ id: nextId++ }),
                    ),
            },
        };
        const prisma = {
            ...tx,
            $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
        };
        const audit = { record: jest.fn().mockResolvedValue(undefined) };
        const service = new BcSalesProductsService(
            prisma as never,
            audit as never,
        );
        return { service, tx, audit };
    }

    const items = [
        item('1001', 'Argor-Heraeus 1oz bar', 1),
        item('1002', 'The Perth Mint Australia 1oz Bar', 2),
        item('1003', 'PAMP Suisse 1oz bar', null),
        item('2001', '1/2oz Gold Krugerrand', 4, 50),
    ];

    it('previews without writing', async () => {
        const { service, tx } = setup(items);
        const p = await service.preview();
        expect(p.totals).toEqual({ create: 1, linked: 1, skip: 2, total: 4 });
        expect(tx.salesProduct.create).not.toHaveBeenCalled();
    });

    it('creates only the CREATE rows, links the items and audits it', async () => {
        const { service, tx, audit } = setup(items);
        const r = await service.apply({}, 'admin@example.com');
        expect(r).toEqual({ created: 1, linked: 0, skipped: 2 });
        expect(tx.salesProduct.create).toHaveBeenCalledTimes(1);
        expect(tx.salesProduct.create).toHaveBeenCalledWith({
            data: {
                name: 'Argor-Heraeus 1oz bar',
                metal: 'GOLD',
                genericNorm: '1oz bar',
                refinery: 'ARGOR-HERAEUS',
                pricingProductId: 1,
                active: true,
            },
            select: { id: true },
        });
        expect(tx.bcItem.update).toHaveBeenCalledWith({
            where: { itemNo: '1001' },
            data: { salesProductId: 100 },
        });
        expect(audit.record).toHaveBeenCalledWith(
            'admin@example.com',
            'sales-products-from-bc',
            expect.any(String),
            tx,
        );
    });

    it('reuses a specific product with the same name instead of duplicating it', async () => {
        const { service, tx } = setup(items, [
            {
                id: 7,
                name: 'Argor-Heraeus 1oz bar',
                metal: 'GOLD',
                pricingProductId: 1,
            },
        ]);
        const r = await service.apply({}, 'a');
        expect(r).toEqual({ created: 0, linked: 1, skipped: 2 });
        expect(tx.salesProduct.create).not.toHaveBeenCalled();
        expect(tx.bcItem.update).toHaveBeenCalledWith({
            where: { itemNo: '1001' },
            data: { salesProductId: 7 },
        });
    });

    it('skips an item whose name is taken by a specific product for a different pricing product', async () => {
        const { service, tx } = setup(items, [
            {
                id: 7,
                name: 'Argor-Heraeus 1oz bar',
                metal: 'GOLD',
                pricingProductId: 6,
            },
        ]);
        const p = await service.preview();
        expect(p.rows[0]).toMatchObject({
            action: 'SKIP',
            reason: 'A specific product with this name already exists for a different product.',
        });
        expect(await service.apply({}, 'a')).toEqual({
            created: 0,
            linked: 0,
            skipped: 3,
        });
        expect(tx.bcItem.update).not.toHaveBeenCalled();
    });

    it('turns a unique-name clash on create into a conflict', async () => {
        const { service, tx } = setup(items);
        tx.salesProduct.create.mockRejectedValue(
            Object.assign(new Error('dup'), { code: 'P2002' }),
        );
        await expect(service.apply({}, 'a')).rejects.toThrow(
            'Specific products were changed at the same time: preview again.',
        );
    });

    it('does nothing the second time, when the items are already linked', async () => {
        const done = items.map((i) =>
            i.itemNo === '1001' ? { ...i, salesProductId: 100 } : i,
        );
        const { service, tx, audit } = setup(done);
        expect(await service.apply({}, 'a')).toEqual({
            created: 0,
            linked: 0,
            skipped: 2,
        });
        expect(tx.bcItem.update).not.toHaveBeenCalled();
        expect(audit.record).not.toHaveBeenCalled();
    });

    it('limits itself to the chosen item numbers, and counts a chosen item that is not ready as skipped', async () => {
        const { service, tx } = setup(items);
        const r = await service.apply({ itemNos: ['1002', '9999'] }, 'a');
        expect(r).toEqual({ created: 0, linked: 0, skipped: 1 });
        expect(tx.salesProduct.create).not.toHaveBeenCalled();
    });
});
