import { describe, expect, it } from 'vitest';
import { absorbFile, findAppOnlyTasks } from './roadmap-sync';
import { mergeRoadmap } from './roadmap-merge';

const BASE = '## 1.1 A\n\n- [ ] one\n- [ ] two\n- [ ] three\n';

describe('absorbFile', () => {
  it('takes in master\'s additions and changes', () => {
    const file = BASE.replace('- [ ] one', '- [x] one') + '- [ ] four\n';
    expect(absorbFile(BASE, file)).toBe(file);
  });

  it('keeps a task master deleted, so a later push cannot be asked to re-add it', () => {
    const file = '## 1.1 A\n\n- [ ] one\n- [ ] three\n';
    expect(absorbFile(BASE, file)).toBe(BASE);
  });

  it('leaves the app\'s own edits visible against the new base and pushes nothing else', () => {
    const file = '## 1.1 A\n\n- [ ] one\n- [ ] three\n- [ ] four\n';
    const appBefore = BASE.replace('- [ ] three', '- [x] three');
    // a pull: the app takes master's changes in and the base moves to match
    const pulled = mergeRoadmap(BASE, file, appBefore);
    const newBase = absorbFile(BASE, file);
    const next = mergeRoadmap(newBase, file, pulled.forApp);
    // the app's tick goes out; master's deletion of "two" stays deleted in the file; "four" is untouched
    expect(next.forFile).toBe('## 1.1 A\n\n- [ ] one\n- [x] three\n- [ ] four\n');
    expect(next.forApp).toContain('- [ ] two');
    expect(next.forApp).toContain('- [ ] four');
  });
});

describe('findAppOnlyTasks', () => {
  const master = '## 1.1 A\n\n- [ ] one\n- [x] two\n  - [ ] child\n\n## 1.2 B\n\n- [ ] other\n';

  it('finds nothing when the texts match', () => {
    expect(findAppOnlyTasks(master, master)).toEqual({ appOnly: [], ticksOnlyInApp: [] });
  });

  it('lists tasks only the app has, with their section, nested ones included', () => {
    const app = master + '\n## 1.3 C\n\n- [ ] new section task\n';
    const withChild = app.replace('  - [ ] child', '  - [ ] child\n  - [x] app-only child');
    const found = findAppOnlyTasks(withChild, master);
    expect(found.appOnly).toEqual([
      { section: '1.1', title: 'app-only child', checked: true },
      { section: '1.3', title: 'new section task', checked: false },
    ]);
  });

  it('lists ticks only the app made, and ignores case and spacing', () => {
    const app = master.replace('- [ ] one', '- [x]  ONE');
    expect(findAppOnlyTasks(app, master).ticksOnlyInApp).toEqual([{ section: '1.1', title: 'ONE', checked: true }]);
    expect(findAppOnlyTasks(app, master).appOnly).toEqual([]);
  });

  it('does not match a task of the same text in another section', () => {
    const app = master.replace('- [ ] other', '- [ ] one');
    expect(findAppOnlyTasks(app, master).appOnly).toEqual([{ section: '1.2', title: 'one', checked: false }]);
  });

  describe('wording that changed since the stale copy', () => {
    const masterText =
      '## 0.1 Core\n\n' +
      '- [x] `MetalPriceApiClient` `/timeframe` endpoint (real historical ranges) - M *(used by the history seed and the 5-year backfill)*\n' +
      '- [ ] Central config validation: Zod-parse `process.env` at boot - S *(partly there: `main.ts` fails fast; `Number(config.get(...))` calls remain)*\n' +
      '- [ ] Short one\n';

    it('treats a task with a different dash and a reworded note as the same task', () => {
      const app =
        '## 0.1 Core\n\n' +
        '- [x] `MetalPriceApiClient` `/timeframe` endpoint (real historical ranges) \u2014 M *(an older note)*\n' +
        '- [ ] Central config validation: Zod-parse `process.env` at boot \u2014 S *(partly there: `main.ts` fails fast on a list of required variables)*\n';
      expect(findAppOnlyTasks(app, masterText)).toEqual({ appOnly: [], ticksOnlyInApp: [] });
    });

    it('still reports a tick the app made on a reworded task', () => {
      const app = '## 0.1 Core\n\n- [x] Central config validation: Zod-parse `process.env` at boot \u2014 S *(old note)*\n';
      expect(findAppOnlyTasks(app, masterText).ticksOnlyInApp).toEqual([
        { section: '0.1', title: 'Central config validation: Zod-parse `process.env` at boot \u2014 S *(old note)*', checked: true },
      ]);
    });

    it('still reports a genuinely different task, and requires a full match for very short titles', () => {
      const app = '## 0.1 Core\n\n- [ ] A completely different task that master does not have at all\n- [ ] Short two\n';
      const found = findAppOnlyTasks(app, masterText);
      expect(found.appOnly.map((t) => t.title)).toEqual(['A completely different task that master does not have at all', 'Short two']);
    });
  });
});

