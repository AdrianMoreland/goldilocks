import { isValidToken } from './roadmap-token';

describe('isValidToken', () => {
    it('accepts the same token', () => {
        expect(isValidToken('s3cret', 's3cret')).toBe(true);
    });

    it('rejects a different, shorter or longer token', () => {
        expect(isValidToken('s3cret', 's3cre')).toBe(false);
        expect(isValidToken('s3cret', 's3cret!')).toBe(false);
        expect(isValidToken('s3cret', 'other')).toBe(false);
    });

    it('rejects when either side is missing or empty', () => {
        expect(isValidToken(undefined, 'x')).toBe(false);
        expect(isValidToken('', '')).toBe(false);
        expect(isValidToken('x', undefined)).toBe(false);
    });
});
