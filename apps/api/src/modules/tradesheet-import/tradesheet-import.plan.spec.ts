import type { RowResolverData, TradesheetTab } from '@goldilocks/shared-types';
import {
    parseTab,
    reconcileTab,
    summarise,
    type ExistingLot,
    type ExistingTrade,
} from './tradesheet-import.plan';

const aliases: RowResolverData = {
    catalogue: [
        { id: 7, sku: 'GOLD-1OZ-KRUGERRAND-COIN', metalType: 'GOLD' },
        { id: 8, sku: 'GOLD-250G-BAR', metalType: 'GOLD' },
        { id: 9, sku: 'GOLD-FULL-SOVEREIGN-COIN', metalType: 'GOLD' },
        { id: 10, sku: 'PLATINUM-100G-BAR', metalType: 'PLATINUM' },
    ],
    decisions: [],
};

const SALE_HEADERS = [
    'Branch:',
    'Initials:',
    'Client:',
    'QTY:',
    'Product:',
    'Date:',
    'Spot:',
    'CPTY:',
    'Cost:',
    'Receipt:',
    'Collected:',
    'NOTES:',
    'Reference:',
];
const PURCHASE_HEADERS = [
    'Branch',
    'Initials',
    'Client',
    'QTY',
    'Product',
    'Spot Price',
    'Received',
    'Price Paid',
    'Price / Item',
    'Date Paid:',
    'Hedged At',
    'Comments',
    'Reference',
];

const sale = (
    row: number,
    ref: string,
    cpty: string | null,
    over: Partial<Record<number, string | number | null>> = {},
    fills: Record<string, string> = {},
) => ({
    row,
    cells: Object.assign(
        [
            'DU',
            'GOD',
            'Tom',
            20,
            '1oz Krugerrand',
            '2026-10-01T00:00:00.000Z',
            3668,
            cpty,
            null,
            null,
            null,
            null,
            ref,
        ],
        over,
    ),
    fills,
});

const salesTab = (rows: TradesheetTab['rows']): TradesheetTab => ({
    name: 'IE - Gold',
    headerRow: 1,
    headers: SALE_HEADERS,
    rows,
});
const lotsTab = (rows: TradesheetTab['rows']): TradesheetTab => ({
    name: 'IE-GP',
    headerRow: 1,
    headers: PURCHASE_HEADERS,
    rows,
});

const existingTrade = (over: Partial<ExistingTrade> = {}): ExistingTrade => ({
    id: 1,
    referenceKey: 'DUG20261002',
    occurrence: 1,
    fingerprint: 'old',
    missingFromImport: false,
    sourceMonth: '2026-10',
    sourceTab: 'IE - Gold',
    client: 'Tom',
    qty: 20,
    productText: '1oz Krugerrand',
    cptyRaw: 'HEDGED',
    state: 'HEDGED',
    collected: false,
    cost: null,
    receipt: null,
    notes: null,
    lotKey: null,
    productKey: '1oz krugerrand',
    productId: 7,
    issues: [],
    ...over,
});

describe('parseTab', () => {
    it('reads a sales tab and keys each row by its reference', () => {
        const parsed = parseTab(
            salesTab([
                sale(2, 'DU-G20261002', 'Quote Only'),
                sale(3, 'DU-G20261003', 'DU-GP20261023'),
            ]),
            aliases,
        );
        expect(parsed.kind).toBe('IE_GOLD_SALES');
        expect(parsed.metal).toBe('GOLD');
        expect(
            parsed.sales.map((s) => [
                s.referenceKey,
                s.occurrence,
                s.productKey,
            ]),
        ).toEqual([
            ['DUG20261002', 1, '1oz krugerrand'],
            ['DUG20261003', 1, '1oz krugerrand'],
        ]);
        expect(parsed.sales[0].productId).toBe(7);
    });

    it('says why a tab is skipped, and what a tab with a missing column lacks', () => {
        expect(
            parseTab(
                { name: 'Bonded', headerRow: 1, headers: ['x'], rows: [] },
                aliases,
            ).problems[0],
        ).toMatch(/separately/);
        const noRef = parseTab(
            {
                name: 'IE - Gold',
                headerRow: 1,
                headers: ['Client:', 'QTY:', 'Product:'],
                rows: [],
            },
            aliases,
        );
        expect(noRef.problems).toEqual(
            expect.arrayContaining([
                'Missing column: reference.',
                'Missing column: cpty.',
            ]),
        );
        expect(noRef.sales).toEqual([]);
    });

    it('flags a repeated reference on every row that has it, and numbers the occurrences', () => {
        const parsed = parseTab(
            salesTab([
                sale(2, 'DU-G20261002', 'Deferred'),
                sale(3, 'DU-G20261002', 'DU-GP20261023'),
            ]),
            aliases,
        );
        expect(parsed.sales.map((s) => s.occurrence)).toEqual([1, 2]);
        expect(
            parsed.sales.every(
                (s) => s.duplicate && s.issues.some((i) => /2 times/.test(i)),
            ),
        ).toBe(true);
    });

    it('gives a plain sovereign the full sovereign product', () => {
        const parsed = parseTab(
            salesTab([
                sale(2, 'DU-G20261002', 'Quote Only', { 4: 'Sovereign' }),
            ]),
            aliases,
        );
        expect(parsed.sales[0]).toMatchObject({
            productKey: 'sovereign',
            productId: 9,
            how: 'RULE',
        });
    });

    it('uses a saved decision before the rules', () => {
        const parsed = parseTab(
            salesTab([
                sale(2, 'DU-G20261002', 'Quote Only', {
                    4: 'Elizabeth Sovereign',
                }),
            ]),
            {
                ...aliases,
                decisions: [
                    {
                        key: 'elizabeth sovereign',
                        productId: 8,
                        salesProductId: null,
                    },
                ],
            },
        );
        expect(parsed.sales[0]).toMatchObject({ productId: 8, how: 'ALIAS' });
    });

    describe('metal in the product text', () => {
        const catalogue: RowResolverData['catalogue'] = [
            ...aliases.catalogue,
            { id: 11, sku: 'SILVER-1OZ-BRITANNIA-COIN', metalType: 'SILVER' },
            { id: 12, sku: 'GOLD-1OZ-BAR', metalType: 'GOLD' },
        ];
        const run = (
            tabName: string,
            product: string,
            data: RowResolverData = { ...aliases, catalogue },
        ) =>
            parseTab(
                {
                    ...salesTab([
                        sale(2, 'DU-G20261002', 'Quote Only', { 4: product }),
                    ]),
                    name: tabName,
                },
                data,
            ).sales[0];

        it.each([
            ['IE - Gold', 'Silver 1oz Britannia', 11, 'silver', 'gold'],
            ['IE - Silver', '1oz Gold Bar', 12, 'gold', 'silver'],
            ['IE - Silver', 'Platinum - 100g bar', 10, 'platinum', 'silver'],
        ])('flags %s: %s', (tab, text, id, says, tabIs) => {
            const r = run(tab, text);
            expect(r.productId).toBe(id);
            expect(r.issues).toEqual([
                `Product says ${says} but the tab is ${tabIs}.`,
            ]);
        });

        it('stays quiet when the product matches the tab', () => {
            expect(run('IE - Gold', '1oz Krugerrand').issues).toEqual([]);
        });

        it('checks the metal of a product that came from a saved decision', () => {
            const r = run('IE - Gold', 'Britannia mix', {
                catalogue,
                decisions: [
                    {
                        key: 'britannia mix',
                        productId: 11,
                        salesProductId: null,
                    },
                ],
            });
            expect(r.issues).toEqual([
                'Product says silver but the tab is gold.',
            ]);
        });

        it('uses the text metal when nothing resolved', () => {
            const r = run('IE - Gold', '1oz Platinum');
            expect(r.productId).toBeNull();
            expect(r.issues).toEqual([
                'Product says platinum but the tab is gold.',
            ]);
        });
    });

    it('flags a fractional quantity and drops the quantity', () => {
        const parsed = parseTab(
            salesTab([
                sale(2, 'DU-G20261002', 'Quote Only', {
                    3: 2.5,
                    4: 'Mystery coin',
                }),
            ]),
            aliases,
        );
        const s = parsed.sales[0];
        expect(s.productKey).toBe('mystery');
        expect(s.productId).toBeNull();
        expect(s.qty).toBeNull();
        expect(s.issues).toEqual(['Quantity 2.5 is not a whole number.']);
    });

    it('reads colours: a green Collected cell and a blue empty CPTY', () => {
        const parsed = parseTab(
            salesTab([
                sale(
                    2,
                    'DU-G20261002',
                    'DU-GP20261023',
                    {},
                    { '10': 'FF34A853' },
                ),
                sale(3, 'DU-G20261003', null, {}, { '7': 'FFC9DAF8' }),
            ]),
            aliases,
        );
        expect(parsed.sales[0].parsed.collected).toMatchObject({
            collected: true,
            source: 'FILL',
        });
        expect(parsed.sales[1].parsed).toMatchObject({
            state: 'AWAITING_HEDGE',
            stateFromColour: true,
        });
    });
});

describe('reconcileTab', () => {
    const parse = (rows: TradesheetTab['rows']) =>
        parseTab(salesTab(rows), aliases);

    it('adds a row Goldilocks has not seen', () => {
        const rec = reconcileTab(
            parse([sale(2, 'DU-G20261002', 'HEDGED')]),
            '2026-10',
            [],
            [],
        );
        expect(rec.sales[0]).toMatchObject({ status: 'ADDED', existing: null });
    });

    it('calls a row unchanged when its fingerprint matches', () => {
        const parsed = parse([sale(2, 'DU-G20261002', 'HEDGED')]);
        const fp = parsed.sales[0].parsed.fingerprint;
        const rec = reconcileTab(
            parsed,
            '2026-10',
            [existingTrade({ fingerprint: fp })],
            [],
        );
        expect(rec.sales[0].status).toBe('UNCHANGED');
    });

    it('names what changed when a CPTY moves from HEDGED to a purchase line', () => {
        const rec = reconcileTab(
            parse([sale(2, 'DU-G20261002', 'DU-GP20261023')]),
            '2026-10',
            [existingTrade()],
            [],
        );
        expect(rec.sales[0].status).toBe('CHANGED');
        expect(rec.sales[0].changedFields).toEqual(
            expect.arrayContaining(['cpty', 'state']),
        );
    });

    it('restores a row that had been flagged missing', () => {
        const parsed = parse([sale(2, 'DU-G20261002', 'HEDGED')]);
        const fp = parsed.sales[0].parsed.fingerprint;
        const rec = reconcileTab(
            parsed,
            '2026-10',
            [existingTrade({ fingerprint: fp, missingFromImport: true })],
            [],
        );
        expect(rec.sales[0].status).toBe('RESTORED');
    });

    it('flags a stored row from this month and tab that the file no longer has', () => {
        const rec = reconcileTab(
            parse([sale(2, 'DU-G20261002', 'HEDGED')]),
            '2026-10',
            [
                existingTrade({ id: 1 }),
                existingTrade({ id: 9, referenceKey: 'DUG20261099' }),
            ],
            [],
        );
        expect(rec.missingTradeIds).toEqual([9]);
    });

    it('does not flag rows from another month or tab, or rows already flagged', () => {
        const rec = reconcileTab(
            parse([sale(2, 'DU-G20261002', 'HEDGED')]),
            '2026-10',
            [
                existingTrade({ id: 1 }),
                existingTrade({
                    id: 8,
                    referenceKey: 'DUG20260999',
                    sourceMonth: '2026-09',
                }),
                existingTrade({
                    id: 7,
                    referenceKey: 'DUG20261098',
                    missingFromImport: true,
                }),
            ],
            [],
        );
        expect(rec.missingTradeIds).toEqual([]);
    });

    it('never flags anything missing from a tab it could not read', () => {
        const rec = reconcileTab(
            parseTab(
                { name: 'IE - Gold', headerRow: 1, headers: ['x'], rows: [] },
                aliases,
            ),
            '2026-10',
            [existingTrade()],
            [],
        );
        expect(rec.missingTradeIds).toEqual([]);
    });

    it('adopts a row stored under another month instead of adding it twice', () => {
        const rec = reconcileTab(
            parse([sale(2, 'DU-G20261002', 'HEDGED')]),
            '2026-10',
            [existingTrade({ sourceMonth: '2026-06', sourceTab: 'RawG' })],
            [],
        );
        expect(rec.sales[0].status).not.toBe('ADDED');
        expect(rec.missingTradeIds).toEqual([]);
    });
});

describe('purchase lots', () => {
    const lot = (
        row: number,
        ref: string,
        qty: number,
        comments: string | null,
    ) => ({
        row,
        cells: [
            'DU',
            'AM',
            'John',
            qty,
            '250g bar',
            3687,
            '2026-10-01T00:00:00.000Z',
            114404,
            28601,
            '2026-10-12T00:00:00.000Z',
            3695.7,
            comments,
            ref,
        ],
        fills: {},
    });

    it('reads the comment and keys the lot', () => {
        const parsed = parseTab(
            lotsTab([lot(2, 'DU-GP20261002', 4, '3 sold')]),
            aliases,
        );
        expect(parsed.kind).toBe('IE_GOLD_PURCHASES');
        expect(parsed.lots[0]).toMatchObject({
            referenceKey: 'DUGP20261002',
            qty: 4,
            productKey: '250g bar',
            productId: 8,
        });
        expect(parsed.lots[0].parsed.sold).toMatchObject({
            soldCount: 3,
            remaining: 1,
        });
    });

    it('reports a changed comment as a change, so "3 sold" becoming "ALL SOLD" updates the lot', () => {
        const parsed = parseTab(
            lotsTab([lot(2, 'DU-GP20261002', 4, 'ALL SOLD')]),
            aliases,
        );
        const stored: ExistingLot = {
            id: 5,
            referenceKey: 'DUGP20261002',
            occurrence: 1,
            fingerprint: 'old',
            missingFromImport: false,
            sourceMonth: '2026-10',
            sourceTab: 'IE-GP',
            client: 'John',
            qty: 4,
            productText: '250g bar',
            pricePaid: 114404,
            hedgedAt: 3695.7,
            commentsRaw: '3 sold',
            productKey: '250g bar',
            productId: 8,
            issues: [],
        };
        const rec = reconcileTab(parsed, '2026-10', [], [stored]);
        expect(rec.lots[0]).toMatchObject({
            status: 'CHANGED',
            changedFields: ['comments'],
        });
    });
});

describe('summarise', () => {
    it('counts rows, shows only the rows worth a look, and lists unmatched products', () => {
        const parsed = parseTab(
            salesTab([
                sale(2, 'DU-G20261002', 'HEDGED'),
                sale(3, 'DU-G20261003', 'Quote Only', { 4: 'Mystery coin' }),
                sale(
                    4,
                    'DU-G20261004',
                    'DU-GP20261023',
                    {},
                    { '10': 'FF34A853' },
                ),
            ]),
            aliases,
        );
        const unchanged = parsed.sales[0].parsed.fingerprint;
        const rec = reconcileTab(
            parsed,
            '2026-10',
            [
                existingTrade({ fingerprint: unchanged }),
                existingTrade({ id: 2, referenceKey: 'DUG20261077' }),
            ],
            [],
        );
        const plan = summarise('october.xlsx', '2026-10', [rec], ['warn']);

        expect(plan.totals).toEqual({
            added: 2,
            changed: 0,
            restored: 0,
            unchanged: 1,
            missing: 1,
            flagged: 0,
        });
        const tab = plan.tabs[0];
        expect(tab.rows.map((r) => r.reference)).toEqual([
            'DU-G20261003',
            'DU-G20261004',
        ]);
        expect(tab.rows[1]).toMatchObject({ fromColour: true });
        expect(tab.unmatchedProducts).toEqual([
            { text: 'Mystery coin', rows: 1 },
        ]);
        expect(tab.rows[0].issues).toEqual([]);
        expect(tab.productMatches).toEqual({
            saved: 0,
            rule: 2,
            none: 1,
            notProduct: 0,
        });
        expect(plan.warnings).toEqual(['warn']);
    });
});
