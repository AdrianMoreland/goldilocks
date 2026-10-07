import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  findBrokenLinks,
  findLinks,
  findTodos,
  headingAnchor,
  kbArticlePath,
  parseKbDocument,
  rewriteKbLinks,
  splitFrontmatter,
  splitSections,
  KB_UNRESOLVED_HREF_PREFIX,
} from './kb-markdown';

const FRONTMATTER = `---
slug: demo
title: Demo SOP
category: sales
jurisdiction: IE
owner: Adrian
status: draft
version: 2
updatedAt: 2026-09-30
---
`;

describe('headingAnchor', () => {
  it.each([
    ['Identity check', 'identity-check'],
    ['Customer safe (CST Safe)', 'customer-safe-cst-safe'],
    ['Scrap and non-standard items', 'scrap-and-non-standard-items'],
    ['VAT — Ireland', 'vat-ireland'],
    ['Available vs NET', 'available-vs-net'],
    ['Proposed controls (not yet in force)', 'proposed-controls-not-yet-in-force'],
    ['  Café rules!  ', 'cafe-rules'],
  ])('%s -> %s', (heading, anchor) => {
    expect(headingAnchor(heading)).toBe(anchor);
  });
});

describe('splitFrontmatter', () => {
  it('reads flat key/value pairs and returns the body', () => {
    const file = splitFrontmatter(`${FRONTMATTER}## Purpose\nDo the thing.\n`)!;
    expect(file.data).toMatchObject({ slug: 'demo', version: '2', updatedAt: '2026-09-30' });
    expect(file.body).toBe('## Purpose\nDo the thing.');
  });

  it('handles CRLF line endings and quoted values', () => {
    const file = splitFrontmatter('---\r\ntitle: "Quoted: title"\r\n---\r\nBody')!;
    expect(file.data.title).toBe('Quoted: title');
    expect(file.body).toBe('Body');
  });

  it('returns null when there is no frontmatter block', () => {
    expect(splitFrontmatter('## Just a heading')).toBeNull();
  });
});

describe('splitSections', () => {
  it('splits at level-2 headings and keeps deeper headings inside their section', () => {
    const sections = splitSections('## One\nfirst\n### Sub\nnested\n## Two\nsecond');
    expect(sections.map((s) => s.anchor)).toEqual(['one', 'two']);
    expect(sections[0]!.markdown).toContain('### Sub');
  });

  it('keeps anchors unique when a heading repeats', () => {
    const sections = splitSections('## Steps\na\n## Steps\nb\n## Steps\nc');
    expect(sections.map((s) => s.anchor)).toEqual(['steps', 'steps-2', 'steps-3']);
  });

  it('does not treat # lines inside a fenced block as headings', () => {
    const sections = splitSections('## Real\n```\n## not a heading\n```\nafter');
    expect(sections).toHaveLength(1);
  });

  it('flags a section with an unconfirmed fact and records what needs confirming', () => {
    const [section] = splitSections('## Payment\n3. Take payment. [TODO: amount required before the order goes live]') as [NonNullable<ReturnType<typeof splitSections>[number]>];
    expect(section.hasTodo).toBe(true);
    expect(section.todos).toEqual(['amount required before the order goes live']);
  });

  it('marks proposed-controls sections', () => {
    const [section] = splitSections('## Proposed controls (not yet in force)\n1. A log') as [NonNullable<ReturnType<typeof splitSections>[number]>];
    expect(section.isProposed).toBe(true);
  });

  it('keeps text before the first heading as an unnamed intro section', () => {
    const sections = splitSections('Intro text\n## One\nbody');
    expect(sections[0]).toMatchObject({ heading: '', anchor: '' });
  });
});

describe('code spans are ignored', () => {
  it('does not count documented syntax as a link or a TODO', () => {
    const md = 'Write `[[slug#section]]` and `[TODO: …]` like this.\n\n```\n[[fenced]] [TODO: x]\n```';
    expect(findLinks(md)).toEqual([]);
    expect(findTodos(md)).toEqual([]);
  });

  it('leaves code untouched when rewriting links', () => {
    const out = rewriteKbLinks('See [[real]] but not `[[code]]`.', () => ({ label: 'Real', href: '/x' }));
    expect(out).toBe('See [Real](/x) but not `[[code]]`.');
  });
});

describe('links', () => {
  it('finds slug and slug#section references', () => {
    expect(findLinks('a [[pricing]] b [[payment-lock-and-hedge#confirming-funds]]')).toEqual([
      { slug: 'pricing', anchor: null },
      { slug: 'payment-lock-and-hedge', anchor: 'confirming-funds' },
    ]);
  });

  it('rewrites resolved links to Markdown links and unresolved ones to a marker', () => {
    const out = rewriteKbLinks('[[pricing#vat]] and [[kyc-aml]]', (ref) =>
      ref.slug === 'pricing' ? { label: 'VAT', href: kbArticlePath(ref.slug, ref.anchor) } : null,
    );
    expect(out).toBe(`[VAT](/knowledge/articles/pricing#vat) and [kyc-aml](${KB_UNRESOLVED_HREF_PREFIX}kyc-aml)`);
  });
});

describe('findBrokenLinks', () => {
  const doc = (slug: string, body: string) => {
    const sections = splitSections(body);
    return { slug, sections, links: findLinks(body) };
  };

  it('reports a missing document and a missing section separately', () => {
    const broken = findBrokenLinks([
      doc('a', '## One\n[[b#two]] [[b#nope]] [[ghost]]'),
      doc('b', '## Two\ntext'),
    ]);
    expect(broken).toEqual([
      { from: 'a', slug: 'b', anchor: 'nope', reason: 'missing-section' },
      { from: 'a', slug: 'ghost', anchor: null, reason: 'missing-document' },
    ]);
  });
});

describe('parseKbDocument', () => {
  it('parses a valid SOP', () => {
    const result = parseKbDocument(`${FRONTMATTER}## Purpose\nText [[other]]`);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.doc.frontmatter).toMatchObject({ slug: 'demo', version: 2, status: 'draft' });
      expect(result.doc.links).toEqual([{ slug: 'other', anchor: null }]);
    }
  });

  it.each([
    ['a bad category', FRONTMATTER.replace('category: sales', 'category: cooking')],
    ['an uppercase slug', FRONTMATTER.replace('slug: demo', 'slug: Demo_SOP')],
    ['a non-date updatedAt', FRONTMATTER.replace('2026-09-30', 'yesterday')],
    ['a missing owner', FRONTMATTER.replace('owner: Adrian\n', '')],
  ])('rejects %s', (_label, raw) => {
    const result = parseKbDocument(`${raw}## Purpose\nx`);
    expect(result.ok).toBe(false);
  });

  it('rejects a file with no frontmatter', () => {
    expect(parseKbDocument('## Purpose\nx').ok).toBe(false);
  });
});

// The real SOPs are the best fixture: if a future edit breaks the format the
// importer relies on, this fails before the importer does.
describe('docs/sops (the real files)', () => {
  const dir = join(__dirname, '../../../docs/sops');
  const files = readdirSync(dir).filter((name) => name.endsWith('.md'));
  const parsed = files.map((name) => {
    const result = parseKbDocument(readFileSync(join(dir, name), 'utf8'));
    return { name, result };
  });

  it('finds the SOP files', () => {
    expect(files.length).toBeGreaterThanOrEqual(12);
  });

  it.each(parsed.map((p) => [p.name, p] as const))('%s parses with valid frontmatter', (_name, { result }) => {
    expect(result.ok ? [] : result.errors).toEqual([]);
  });

  it('every link resolves except to SOPs that have not been written yet', () => {
    const docs = parsed.flatMap((p) =>
      p.result.ok ? [{ slug: p.result.doc.frontmatter.slug, sections: p.result.doc.sections, links: p.result.doc.links }] : [],
    );
    const broken = findBrokenLinks(docs);

    // Section-level mistakes (a real SOP linked with a heading that does not exist) are never acceptable.
    expect(broken.filter((b) => b.reason === 'missing-section')).toEqual([]);
    // Documents still to come (none now). Any entry added here must be a SOP that is really on its way.
    expect([...new Set(broken.map((b) => b.slug))].sort()).toEqual([]);
  });
});
