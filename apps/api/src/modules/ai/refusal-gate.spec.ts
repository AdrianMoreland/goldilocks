import { RefusalGate } from './refusal-gate';

const run = (chunks: string[]) => {
    const gate = new RefusalGate();
    return chunks.map((chunk) => gate.push(chunk)).join('') + gate.flush();
};

describe('RefusalGate', () => {
    it('passes a normal answer through, including the pieces it held back', () => {
        expect(run(['Yes, ', 'platinum ', 'carries 23% VAT.'])).toBe(
            'Yes, platinum carries 23% VAT.',
        );
    });

    it('shows nothing of a refusal, even when the marker arrives in pieces', () => {
        expect(run(['NO_', 'ANSWER', ': Ask a manager.'])).toBe('');
        expect(run(['no_answer: Ask a manager.'])).toBe('');
    });

    it('releases a very short answer at the end of the stream', () => {
        expect(run(['Yes.'])).toBe('Yes.');
    });

    it('does not mistake a word that merely starts with "NO" for a refusal', () => {
        expect(run(['No, a quote has no validity period.'])).toBe(
            'No, a quote has no validity period.',
        );
    });
});
