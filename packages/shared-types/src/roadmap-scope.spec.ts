import { describe, expect, it } from 'vitest';
import { bundleScopeFiles, parseDecisions, parseScopeBundle, parseScopeFile, splitScopeBundle } from './roadmap-scope';

const FEATURES = [
  '# Features',
  '',
  '## Open',
  '',
  '### F-02 · Rules engine',
  '`P1 · L · planned · after: F-01, D-20 · flags: BC, phase-1` · verified `abc1234` (2026-11-01)',
  'Evidence: `packages/a/rules.ts`, `apps/api/b.ts`',
  'Was: 1.8',
  'Spec: `specs/02-rules.md`',
  'Prose about the item.',
  '- [x] first',
  '- [ ] second',
  '  - [ ] nested',
  '',
  '### F-03 · Not verified yet',
  '`P3 · M · idea · after: none · flags: phase-2`',
  'Evidence: none yet',
  '',
  '### F-04 · Broken block',
  'no metadata here',
  '',
  '## Done',
  '',
  '- F-01 · Pricing (was 0.1)',
].join('\n');

const DECISIONS = [
  '# Decisions',
  '',
  '## Open',
  '',
  '### D-20 · GDPR sign-off',
  'Default: none; items stay blocked. Blocks: F-02, F-05.',
  '',
  '## Settled',
  '',
  '- D-01 · Ground rule: BC is the system of record',
  '- D-07 · Palladium: decided',
].join('\n');

describe('roadmap scope files', () => {
  it('parses an item with its metadata, evidence, tasks and prose', () => {
    const { items, done } = parseScopeFile('features', FEATURES);
    expect(items.map((i) => i.id)).toEqual(['F-02', 'F-03']);
    expect(items[0]).toMatchObject({
      scope: 'features',
      title: 'Rules engine',
      priority: 'P1',
      effort: 'L',
      status: 'planned',
      after: ['F-01', 'D-20'],
      flags: ['BC', 'phase-1'],
      verified: 'abc1234',
      was: '1.8',
      evidence: ['packages/a/rules.ts', 'apps/api/b.ts'],
      spec: 'specs/02-rules.md',
      body: 'Prose about the item.',
    });
    expect(items[0].tasks).toEqual([
      { checked: true, text: 'first', depth: 0 },
      { checked: false, text: 'second', depth: 0 },
      { checked: false, text: 'nested', depth: 1 },
    ]);
    expect(items[1]).toMatchObject({ verified: null, after: [], status: 'idea' });
    expect(done).toEqual([{ id: 'F-01', scope: 'features', text: 'Pricing (was 0.1)' }]);
  });

  it('skips a block without a valid metadata line', () => {
    expect(parseScopeFile('ops', FEATURES).items.some((i) => i.id === 'F-04')).toBe(false);
  });

  it('parses open and settled decisions', () => {
    const d = parseDecisions(DECISIONS);
    expect(d[0]).toMatchObject({ id: 'D-20', settled: false, default: 'none; items stay blocked', blocks: 'F-02, F-05' });
    expect(d[1]).toMatchObject({ id: 'D-01', settled: true, title: 'Ground rule', text: 'Ground rule: BC is the system of record' });
    expect(d).toHaveLength(3);
  });

  it('round-trips files through a bundle and builds the whole view', () => {
    const bundle = bundleScopeFiles([
      { path: 'docs/roadmap/features.md', content: FEATURES },
      { path: 'docs/roadmap/decisions.md', content: DECISIONS },
      { path: 'docs/NOW.md', content: '# Now\r\nDo F-02' },
    ]);
    expect([...splitScopeBundle(bundle).keys()]).toEqual(['docs/roadmap/features.md', 'docs/roadmap/decisions.md', 'docs/NOW.md']);
    const view = parseScopeBundle(bundle);
    expect(view.items).toHaveLength(2);
    expect(view.decisions).toHaveLength(3);
    expect(view.now).toBe('# Now\nDo F-02\n');
  });

  it('gives an empty view for an empty bundle', () => {
    expect(parseScopeBundle('')).toEqual({ items: [], done: [], decisions: [], now: null });
  });
});
