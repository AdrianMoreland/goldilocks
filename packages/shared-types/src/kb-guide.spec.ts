import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { KB_BC_HUB, KB_FLOW_BARS, KB_GUIDE, flowBarFor, flowNextSlug, guideLibraryTargets } from './kb-guide';
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

  it('has two branches, each with phases that carry a desk lane and a BC lane', () => {
    expect(KB_GUIDE.branches.map((branch) => branch.id)).toEqual(['price', 'buyback']);
    for (const branch of KB_GUIDE.branches) {
      expect(branch.phases.length).toBeGreaterThanOrEqual(4);
      for (const phase of branch.phases) {
        expect(phase.desk.length, `${branch.id} › ${phase.title} has nothing at the desk`).toBeGreaterThan(0);
        expect(phase.bc.length, `${branch.id} › ${phase.title} has nothing in BC`).toBeGreaterThan(0);
      }
    }
  });

  it('puts the STOP gate in the Price flow before the lock-in phase', () => {
    const price = KB_GUIDE.branches.find((branch) => branch.id === 'price');
    const gated = price?.phases.findIndex((phase) => phase.gate) ?? -1;
    expect(gated).toBeGreaterThan(0);
    expect(price?.phases[gated + 1]?.title).toBe('Lock it in');
  });

  it('lists the BC clicks of the sale in the real BC order', () => {
    const price = KB_GUIDE.branches.find((branch) => branch.id === 'price');
    const lockIn = price?.phases.find((phase) => phase.title === 'Lock it in');
    expect(lockIn?.bc.map((node) => node.title)).toEqual(['Sales Order', 'Prepayment Invoice', 'Record the payment', 'Release and confirm']);
  });

  it('gives the BC hub both flows, six traps and a STOP block', () => {
    expect(KB_BC_HUB.flows.map((flow) => flow.id)).toEqual(['price', 'buyback']);
    expect(KB_BC_HUB.traps).toHaveLength(6);
    expect(KB_BC_HUB.flows[0]?.items.some((item) => item.kind === 'stop')).toBe(true);
  });

  it('keeps every flow-bar procedure in one bar only, so its stepper is unambiguous', () => {
    const slugs = KB_FLOW_BARS.flatMap((bar) => bar.items.map((item) => item.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('derives the next step from a sequential flow, and from nothing else', () => {
    expect(flowBarFor('bc-record-customer-payment')?.index).toBe(3);
    expect(flowNextSlug('bc-record-customer-payment')).toBe('bc-release-and-confirm');
    expect(flowNextSlug('bc-collection-and-shipment')).toBeNull();
    expect(flowNextSlug('pricing')).toBeNull(); // a desk bar is a set of procedures, not a sequence
    expect(flowNextSlug('cash-transactions-ie')).toBeNull();
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
      ...KB_GUIDE.branches.flatMap((b) => [
        b.title,
        b.tag,
        b.blurb,
        ...b.phases.flatMap((phase) => [phase.title, ...[...phase.desk, ...phase.bc].flatMap((node) => [node.title, node.hint])]),
      ]),
      ...KB_BC_HUB.flows.flatMap((flow) => [flow.title, flow.sub]),
      ...KB_FLOW_BARS.map((bar) => bar.label),
    ].filter((text) => /^(sell|buy)/i.test(text));
    expect(labels).toEqual([]);
  });
});
