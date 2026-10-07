import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { KB_TERMS, planAutolinks, termRegExp, type KbTerm } from './kb-terms';
import { parseKbDocument } from './kb-markdown';

const term = (id: string): KbTerm => KB_TERMS.find((candidate) => candidate.id === id)!;
const all = () => true;

describe('termRegExp', () => {
  it('matches whole phrases only, and respects case where it matters', () => {
    expect(termRegExp(term('vat')).test('plus VAT on silver')).toBe(true);
    expect(termRegExp(term('vat')).test('the privatisation')).toBe(false);
    expect(termRegExp(term('kyc-aml')).test('run the KYC checks')).toBe(true);
    expect(termRegExp(term('kyc-aml')).test('the kycs of the day')).toBe(false);
    expect(termRegExp(term('kyc-aml')).test('a kyc form')).toBe(false);
    expect(termRegExp(term('customer-safe')).test('placed in the Customer Safe')).toBe(true);
  });

  it('prefers the longest phrase', () => {
    const text = 'the price is locked when funds land';
    expect(text.match(termRegExp(term('price-lock')))?.[0]).toBe('price is locked');
  });
});

describe('planAutolinks', () => {
  const sections = (...markdown: string[]) => markdown.map((text, index) => ({ anchor: `s${index + 1}`, heading: `S${index + 1}`, markdown: text }));

  it('links a term only at its first mention in the article', () => {
    const plan = planAutolinks(sections('Bag it in the customer safe.', 'Again the customer safe.'), 'other', all);
    expect(plan.get('s1')?.map((t) => t.id)).toEqual(['customer-safe']);
    expect(plan.has('s2')).toBe(false);
  });

  it('never links an article to itself', () => {
    expect(planAutolinks(sections('customer safe'), 'stock-management', all).size).toBe(0);
  });

  it('ignores code, existing links, TODO notes and headings', () => {
    const plan = planAutolinks(
      sections(
        'Use `customer safe` and [[stock-management#customer-safe-cst-safe]] and [customer safe](/x) and [TODO: customer safe].\n## customer safe heading',
      ),
      'other',
      all,
    );
    expect(plan.size).toBe(0);
  });

  it('drops terms whose target is not in the library', () => {
    const plan = planAutolinks(sections('Run the KYC checks.'), 'other', (target) => target.slug !== 'kyc-aml');
    expect(plan.size).toBe(0);
  });

  it('skips the Related section', () => {
    const plan = planAutolinks([{ anchor: 'related', heading: 'Related', markdown: 'customer safe' }], 'other', all);
    expect(plan.size).toBe(0);
  });
});

// A renamed heading or file must fail here, not leave a dead link in a SOP.
describe('KB_TERMS against the real SOPs', () => {
  const dir = join(__dirname, '../../../docs/sops');
  const docs = new Map<string, Set<string>>();
  for (const name of readdirSync(dir).filter((file) => file.endsWith('.md'))) {
    const parsed = parseKbDocument(readFileSync(join(dir, name), 'utf8'));
    if (parsed.ok) docs.set(parsed.doc.frontmatter.slug, new Set(parsed.doc.sections.map((section) => section.anchor)));
  }

  it.each(KB_TERMS.filter((t) => !t.pendingSop).map((t) => [t.id, t] as const))('%s points at a real section', (_id, t) => {
    const sections = docs.get(t.target.slug);
    expect(sections, `no SOP "${t.target.slug}"`).toBeDefined();
    if (t.target.anchor) expect(sections?.has(t.target.anchor), `"${t.target.slug}" has no section "${t.target.anchor}"`).toBe(true);
  });

  it('only marks a SOP pending while it really does not exist', () => {
    for (const t of KB_TERMS.filter((candidate) => candidate.pendingSop)) expect(docs.has(t.target.slug)).toBe(false);
  });

  it('has unique ids', () => {
    expect(new Set(KB_TERMS.map((t) => t.id)).size).toBe(KB_TERMS.length);
  });
});
