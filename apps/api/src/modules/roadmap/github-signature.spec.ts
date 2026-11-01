import { createHmac } from 'node:crypto';
import { isValidGithubSignature } from './github-signature';

const sign = (secret: string, body: Buffer) =>
    `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;

describe('isValidGithubSignature', () => {
    const body = Buffer.from('{"ref":"refs/heads/master"}');

    it('accepts the signature GitHub would send', () => {
        expect(
            isValidGithubSignature('s3cret', body, sign('s3cret', body)),
        ).toBe(true);
    });

    it('rejects a signature made with another secret', () => {
        expect(
            isValidGithubSignature('s3cret', body, sign('other', body)),
        ).toBe(false);
    });

    it('rejects a body that was changed after signing', () => {
        const header = sign('s3cret', body);
        expect(
            isValidGithubSignature(
                's3cret',
                Buffer.from('{"ref":"x"}'),
                header,
            ),
        ).toBe(false);
    });

    it('rejects a missing secret, body or header, and a malformed header', () => {
        const header = sign('s3cret', body);
        expect(isValidGithubSignature(undefined, body, header)).toBe(false);
        expect(isValidGithubSignature('', body, header)).toBe(false);
        expect(isValidGithubSignature('s3cret', undefined, header)).toBe(false);
        expect(isValidGithubSignature('s3cret', body, undefined)).toBe(false);
        expect(isValidGithubSignature('s3cret', body, 'sha256=')).toBe(false);
        expect(isValidGithubSignature('s3cret', body, 'nonsense')).toBe(false);
        expect(
            isValidGithubSignature('s3cret', body, header.toUpperCase()),
        ).toBe(false);
    });
});
