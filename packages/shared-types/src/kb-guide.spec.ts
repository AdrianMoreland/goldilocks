import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { KB_GUIDE, guideLibraryTargets } from './kb-guide';
import { parseKbDocument } from './kb-markdown';

// The guide is the desk's front door. If an SOP owner renames a heading or a
// file, this fails here instead of leaving a dead link on the page.
describe('KB_GUIDE against the real SOPs (docs/sops)', () => {
  const dir = join(__dirname, '../../../docs/sops');
  const docs = new Map<string, Set<string>>();
  for (const name of readdirSync(dir).filter((file) => file.endsWith('.md'))) {
    const parsed = parseKbDocument(readFileSync(join(dir, name), 'utf8'));
    if (parsed.ok) docs.set(parsed.doc.frontmatter.slug, new Set(parsed.doc.sections.map((section) => section.anchor)));
  }
  const targets = guideLibraryTargets();

  it('has two branches, each with a chain of steps', () => {
    expect(KB_GUIDE.branches.map((branch) => branch.id)).toEqual(['price', 'buyback']);
    for (const branch of KB_GUIDE.branches) expect(branch.steps.length).toBeGreaterThanOrEqual(4);
  });

  it.each(targets.filter((target) => !target.pendingSop).map((target) => [`${target.slug}${target.anchor ? `#${target.anchor}` : ''}`, target] as const))(
    '%s exists',
    (_label, target) => {
      const sections = docs.get(target.slug);
      expect(sections, `no SOP with slug "${target.slug}"`).toBeDefined();
      if (target.anchor) expect(sections?.has(target.anchor), `"${target.slug}" has no section "${target.anchor}"`).toBe(true);
    },
  );

  it('only marks a SOP as pending while it really does not exist yet', () => {
    for (const target of targets.filter((t) => t.pendingSop)) {
      expect(docs.has(target.slug), `"${target.slug}" now exists — remove pendingSop`).toBe(false);
    }
  });

  it('never uses "Sell" or "Buy" as a label (product vocabulary is Price / Buyback)', () => {
    const labels = [
      ...KB_GUIDE.branches.flatMap((b) => [b.title, b.tag, b.blurb, ...b.steps.flatMap((s) => [s.title, s.hint])]),
    ].filter((text) => /^(sell|buy)\b/i.test(text));
    expect(labels).toEqual([]);
  });
});
