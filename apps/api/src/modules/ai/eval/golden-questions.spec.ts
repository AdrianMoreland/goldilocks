import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { aiInputLimit, parseKbDocument } from '@goldilocks/shared-types';
import { GOLDEN_QUESTIONS } from './golden-questions';
import { figure, fixtureProduct, fixtureProductAt } from './price-fixture';

// The repository root is six levels up: eval → ai → modules → src → api → apps → root.
const SOP_DIR = join(__dirname, '../../../../../../docs/sops');

describe('golden questions against the real SOPs', () => {
    const approved = new Map<string, Set<string>>();
    for (const name of readdirSync(SOP_DIR).filter((file) =>
        file.endsWith('.md'),
    )) {
        const parsed = parseKbDocument(
            readFileSync(join(SOP_DIR, name), 'utf8'),
        );
        if (parsed.ok && parsed.doc.frontmatter.status === 'approved') {
            approved.set(
                parsed.doc.frontmatter.slug,
                new Set(parsed.doc.sections.map((section) => section.anchor)),
            );
        }
    }

    it('has unique ids and a question within the allowed length for its mode', () => {
        expect(new Set(GOLDEN_QUESTIONS.map((c) => c.id)).size).toBe(
            GOLDEN_QUESTIONS.length,
        );
        for (const c of GOLDEN_QUESTIONS) {
            expect(c.question.length).toBeLessThanOrEqual(
                aiInputLimit(c.mode ?? 'procedures'),
            );
        }
    });

    it.each(
        GOLDEN_QUESTIONS.filter((c) => c.citesAny).map(
            (c) => [c.id, c] as const,
        ),
    )(
        '%s expects citations the assistant could actually make',
        (_id, golden) => {
            for (const cite of golden.citesAny ?? []) {
                const sections = approved.get(cite.slug);
                if (!sections) {
                    throw new Error(
                        `"${cite.slug}" is not an approved SOP, so the assistant cannot cite it`,
                    );
                }
                if (cite.anchor && !sections.has(cite.anchor)) {
                    throw new Error(
                        `"${cite.slug}" has no section "${cite.anchor}"`,
                    );
                }
            }
        },
    );

    it('keeps the "not in the assistant\'s knowledge" cases honest: those SOPs must really not be approved', () => {
        expect(approved.has('limit-orders')).toBe(false);
        expect(approved.has('branch-directory')).toBe(false);
    });
});

describe('the price fixture behind the live-price cases', () => {
    it('gives different prices at a typed spot than at the live spot, so the manual-spot case can tell them apart', () => {
        const live = fixtureProduct('100g Gold Bar').priceSell;
        const typed = fixtureProductAt('100g Gold Bar', {
            GOLD: 3000,
        }).priceSell;

        expect(typed).not.toBe(live);
        expect(figure(typed).test(String(live))).toBe(false);
    });

    it('figure() finds an amount however the model writes it, and not inside a longer number', () => {
        const pattern = figure(10120);

        for (const written of [
            '€10,120',
            '10120',
            '10.120 EUR',
            '10 120',
            'is €10,120.',
        ]) {
            expect(pattern.test(written)).toBe(true);
        }
        for (const written of ['€110,120', '101,200', '€10,1205']) {
            expect(pattern.test(written)).toBe(false);
        }
    });

    it('has a buyback below the price for every product, which is how a dealer is paid', () => {
        for (const name of ['100g Gold Bar', '1oz Krugerrand']) {
            const product = fixtureProduct(name);
            expect(product.priceBuy).toBeLessThan(product.priceSell);
        }
    });
});
