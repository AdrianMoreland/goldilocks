import { Decimal } from '../../../prisma/generated/internal/prismaNamespace';
import { toNumber } from './prisma-mappers';

describe('toNumber', () => {
    it('passes a plain number through unchanged', () => {
        expect(toNumber(42.5)).toBe(42.5);
    });

    it('converts a Prisma Decimal to a number', () => {
        expect(toNumber(new Decimal('123.45'))).toBe(123.45);
    });

    it('treats undefined as 0', () => {
        expect(toNumber(undefined)).toBe(0);
    });

    it('treats null as 0', () => {
        expect(toNumber(null)).toBe(0);
    });
});
