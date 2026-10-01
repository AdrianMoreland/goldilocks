import { describe, expect, it } from 'vitest';
import { indexKbDocument, searchKb, toPlainText } from './kb-search';

const pricing = indexKbDocument({
  slug: 'pricing',
  title: 'Pricing products for sale and buyback',
  category: 'sales',
  markdown: `---\nslug: pricing\n---\n## Spot price\nUse the live spot on the dashboard. It refreshes every 10 minutes.\n\n## VAT\nSilver, platinum and palladium are sold with 23% VAT.\n\n## Buy price\nThe buy price is spot value less the discount rate.`,
});
const storage = indexKbDocument({
  slug: 'bonded-silver-storage',
  title: 'Bonded silver storage',
  category: 'storage',
  markdown: `## What we offer\nSilver held in bond is VAT-free.\n\n## Storage fee\nThe fee is billed quarterly: 0.25% of the holdings.`,
});
const docs = [pricing, storage];

describe('toPlainText', () => {
  it('removes Markdown syntax and link brackets', () => {
    const text = toPlainText('1. **Bold** step with [[pricing#vat]] and [a link](/x)\n| a | b |\n|---|---|\n| c | d |');
    expect(text).toBe('Bold step with vat and a link a b c d');
  });
});

describe('searchKb', () => {
  it('returns nothing for an empty or punctuation-only query', () => {
    expect(searchKb(docs, '')).toEqual([]);
    expect(searchKb(docs, '  ?! ')).toEqual([]);
  });

  it('finds the section, not just the document, and points at its anchor', () => {
    const [top] = searchKb(docs, 'quarterly');
    expect(top).toMatchObject({ slug: 'bonded-silver-storage', sectionAnchor: 'storage-fee', sectionHeading: 'Storage fee' });
  });

  it('requires every word to match', () => {
    expect(searchKb(docs, 'quarterly platinum')).toEqual([]);
    expect(searchKb(docs, 'silver vat').map((h) => h.slug)).toContain('bonded-silver-storage');
  });

  it('ranks a heading match above a body mention', () => {
    const hits = searchKb(docs, 'vat');
    expect(hits[0]).toMatchObject({ slug: 'pricing', sectionAnchor: 'vat' });
  });

  it('is case-insensitive and highlights the matched words in the snippet', () => {
    const [top] = searchKb(docs, 'QUARTERLY');
    const hit = top.snippet.find((part) => part.hit);
    expect(hit?.text.toLowerCase()).toBe('quarterly');
  });

  it('respects the limit', () => {
    expect(searchKb(docs, 'the', 1)).toHaveLength(1);
  });
});
