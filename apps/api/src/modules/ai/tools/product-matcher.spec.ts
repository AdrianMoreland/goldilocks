import type { MetalType, Product } from '@goldilocks/shared-types';
import { matchProducts, parseWeightsGrams } from './product-matcher';

const product = (
    id: number,
    name: string,
    metalType: MetalType,
    weight: number,
    overrides: Partial<Product> = {},
): Product =>
    ({
        id,
        sku: `SKU${id}`,
        name,
        metalType,
        weight,
        isActive: true,
        ...overrides,
    }) as Product;

const CATALOGUE: Product[] = [
    product(1, '1g Gold Bar', 'GOLD', 1),
    product(2, '1/10oz', 'GOLD', 3.1104),
    product(3, '10g Gold Bar', 'GOLD', 10),
    product(4, '1oz Krugerrand', 'GOLD', 31.1035),
    product(5, '1oz Gold Bar', 'GOLD', 31.1035),
    product(6, '1oz Maple Leaf', 'GOLD', 31.1035),
    product(7, '100g Gold Bar', 'GOLD', 100),
    product(8, '1oz Maple Leaf', 'SILVER', 31.1035),
    product(9, '1oz Krugerrand', 'SILVER', 31.1035),
    product(10, '100g Silver Bar', 'SILVER', 100),
    product(11, '1kg Silver Bar', 'SILVER', 1000),
    product(12, '1oz Platinum Bar', 'PLATINUM', 31.1035),
    product(13, '100g Gold Bar', 'GOLD', 100, { isActive: false }),
];

const names = (query: string, metal?: MetalType) =>
    matchProducts(CATALOGUE, query, metal).products.map(
        (p) => `${p.metalType} ${p.name}`,
    );

describe('parseWeightsGrams', () => {
    it.each([
        ['100g gold bar', [100]],
        ['100 g', [100]],
        ['2.5 grams', [2.5]],
        ['1kg', [1000]],
        ['1oz coin', [31.1035]],
        ['1 ounce', [31.1035]],
        ['1/10oz', [3.11035]],
        ['a 1oz or 100g bar', [31.1035, 100]],
        ['no weight here', []],
    ])('reads %s', (text, expected) => {
        const grams = parseWeightsGrams(text);
        expect(grams).toHaveLength(expected.length);
        grams.forEach((g, i) => expect(g).toBeCloseTo(expected[i], 3));
    });
});

describe('matchProducts', () => {
    it('finds a bar by metal and weight', () => {
        expect(names('100g gold bar')).toEqual(['GOLD 100g Gold Bar']);
        expect(names('how much is a 100g bar of gold?')).toEqual([
            'GOLD 100g Gold Bar',
        ]);
    });

    it('takes the metal from the argument when the text does not name one', () => {
        expect(names('100g bar', 'SILVER')).toEqual(['SILVER 100g Silver Bar']);
    });

    it('finds a named coin, and distinguishes it by metal', () => {
        expect(names('gold krugerrand')).toEqual(['GOLD 1oz Krugerrand']);
        expect(names('silver 1oz krugerrand')).toEqual([
            'SILVER 1oz Krugerrand',
        ]);
    });

    it('finds the 1/10 oz coin through either spelling of its weight', () => {
        expect(names('1/10oz gold')).toEqual(['GOLD 1/10oz']);
        expect(names('gold 3.11g')).toEqual(['GOLD 1/10oz']);
    });

    it('returns several products when several fit, so the reply can list them', () => {
        const result = matchProducts(CATALOGUE, '1oz gold');
        expect(result.products.map((p) => p.name).sort()).toEqual([
            '1oz Gold Bar',
            '1oz Krugerrand',
            '1oz Maple Leaf',
        ]);
        expect(result.ambiguous).toBe(true);
    });

    it('tells a bar from a coin when the request says which', () => {
        expect(names('1oz gold bar')).toEqual(['GOLD 1oz Gold Bar']);
        expect(names('1oz gold coin').sort()).toEqual([
            'GOLD 1oz Krugerrand',
            'GOLD 1oz Maple Leaf',
        ]);
    });

    it('never offers an inactive product', () => {
        expect(names('100g gold bar')).not.toContain('GOLD 100g Gold Bar ');
        expect(
            matchProducts(CATALOGUE, '100g gold bar').products.every(
                (p) => p.isActive,
            ),
        ).toBe(true);
    });

    it('matches nothing for a request too broad to be a lookup', () => {
        expect(names('gold')).toEqual([]);
        expect(names('what do you have')).toEqual([]);
        expect(names('')).toEqual([]);
    });

    it('matches nothing when a named product does not exist', () => {
        expect(names('gold unobtainium bar')).toEqual([]);
        expect(names('500g gold bar')).toEqual([]);
    });
});
