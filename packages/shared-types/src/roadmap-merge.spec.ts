import { describe, expect, it } from 'vitest';
import { mergeRoadmap } from './roadmap-merge';

const BASE = `# Roadmap

## 0.1 Core 🔴

- [ ] Alpha task
  - [ ] Alpha child one
  - [ ] Alpha child two
- [ ] Beta task
- [x] Gamma task

## 0.2 Money 🟠

- [ ] Delta task
- [ ] Epsilon task
`;

const edit = (text: string, from: string, to: string) => {
  expect(text).toContain(from);
  return text.replace(from, to);
};

describe('mergeRoadmap', () => {
  it('changes nothing when all three agree', () => {
    const r = mergeRoadmap(BASE, BASE, BASE);
    expect(r.forApp).toBe(BASE);
    expect(r.forFile).toBe(BASE);
    expect(r.log).toEqual([]);
    expect(r.fileChanged).toBe(false);
    expect(r.appChanged).toBe(false);
  });

  it('sends an app tick to the file and leaves everything else alone', () => {
    const app = edit(BASE, '- [ ] Beta task', '- [x] Beta task');
    const r = mergeRoadmap(BASE, BASE, app);
    expect(r.forFile).toBe(app);
    expect(r.forApp).toBe(app);
    expect(r.fileChanged).toBe(true);
    expect(r.appChanged).toBe(false);
    expect(r.log.map((e) => e.kind)).toEqual(['to-file']);
    expect(r.log[0]!.text).toContain('Beta task');
  });

  it('sends an app untick and a rename to the file', () => {
    let app = edit(BASE, '- [x] Gamma task', '- [ ] Gamma task');
    app = edit(app, 'Delta task', 'Delta task renamed');
    const r = mergeRoadmap(BASE, BASE, app);
    expect(r.forFile).toBe(app);
    expect(r.log).toHaveLength(2);
  });

  it('brings a file edit into the app and keeps the app\'s own unrelated edit', () => {
    const file = edit(BASE, '- [ ] Delta task', '- [x] Delta task');
    const app = edit(BASE, '- [ ] Beta task', '- [x] Beta task');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forApp).toContain('- [x] Delta task');
    expect(r.forApp).toContain('- [x] Beta task');
    expect(r.forFile).toBe(r.forApp);
    expect(r.appChanged).toBe(true);
    expect(r.fileChanged).toBe(true);
    expect(r.log.map((e) => e.kind).sort()).toEqual(['to-app', 'to-file']);
  });

  it('lets the app win when both changed the same task differently', () => {
    const file = edit(BASE, '- [ ] Beta task', '- [ ] Beta task (file wording)');
    const app = edit(BASE, '- [ ] Beta task', '- [x] Beta task');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forApp).toContain('- [x] Beta task\n');
    expect(r.forApp).not.toContain('file wording');
    expect(r.forFile).toBe(r.forApp);
    expect(r.log.map((e) => e.kind)).toEqual(['conflict-app-wins']);
  });

  it('is quiet when both made the same change', () => {
    const both = edit(BASE, '- [ ] Beta task', '- [x] Beta task');
    const r = mergeRoadmap(BASE, both, both);
    expect(r.forApp).toBe(both);
    expect(r.forFile).toBe(both);
    expect(r.log).toEqual([]);
    expect(r.fileChanged).toBe(false);
    expect(r.appChanged).toBe(false);
  });

  it('puts a task added in the app after its sibling in the file', () => {
    const app = edit(BASE, '- [ ] Beta task\n', '- [ ] Beta task\n- [ ] Brand new task\n');
    const r = mergeRoadmap(BASE, BASE, app);
    expect(r.forFile).toBe(app);
    expect(r.forFile.indexOf('Brand new task')).toBeGreaterThan(r.forFile.indexOf('Beta task'));
    expect(r.forFile.indexOf('Brand new task')).toBeLessThan(r.forFile.indexOf('Gamma task'));
  });

  it('puts a task added in the file into the app, in place', () => {
    const file = edit(BASE, '- [ ] Delta task\n', '- [ ] Delta task\n- [ ] File task\n');
    const r = mergeRoadmap(BASE, file, BASE);
    expect(r.forApp).toBe(file);
    expect(r.log.map((e) => e.kind)).toEqual(['to-app']);
  });

  it('keeps both when each side added different lines at the same place', () => {
    const file = edit(BASE, '- [ ] Beta task\n', '- [ ] Beta task\n- [ ] From file\n');
    const app = edit(BASE, '- [ ] Beta task\n', '- [ ] Beta task\n- [ ] From app\n');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forApp).toContain('From file');
    expect(r.forApp).toContain('From app');
    expect(r.forFile).toBe(r.forApp);
    expect(r.log.map((e) => e.kind)).toEqual(['both-added']);
  });

  it('removes a task and its subtasks from the file when the app deleted them and the file did not touch them', () => {
    const app = edit(BASE, '- [ ] Alpha task\n  - [ ] Alpha child one\n  - [ ] Alpha child two\n', '');
    const r = mergeRoadmap(BASE, BASE, app);
    expect(r.forFile).toBe(app);
    expect(r.forFile).not.toContain('Alpha');
    expect(r.log.map((e) => e.kind)).toEqual(['to-file']);
  });

  it('keeps the file\'s version when the app deleted a task the file edited since the base', () => {
    const file = edit(BASE, '- [ ] Beta task', '- [ ] Beta task (reworded in file)');
    const app = edit(BASE, '- [ ] Beta task\n', '');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forFile).toContain('reworded in file');
    expect(r.forApp).toContain('reworded in file');
    expect(r.log.map((e) => e.kind)).toEqual(['kept-file-edit']);
  });

  it('never deletes from the app a task that vanished from the file; it is flagged and stays gone from the file', () => {
    const file = edit(BASE, '- [ ] Epsilon task\n', '');
    const r = mergeRoadmap(BASE, file, BASE);
    expect(r.forApp).toBe(BASE);
    expect(r.forApp).toContain('Epsilon task');
    expect(r.forFile).toBe(file);
    expect(r.appChanged).toBe(false);
    expect(r.log).toEqual([{ kind: 'missing-from-file', baseLine: 14, text: '- [ ] Epsilon task' }]);
  });

  it('lets an app edit win over a file deletion of the same task', () => {
    const file = edit(BASE, '- [ ] Epsilon task\n', '');
    const app = edit(BASE, '- [ ] Epsilon task', '- [x] Epsilon task');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forApp).toContain('- [x] Epsilon task');
    expect(r.forFile).toContain('- [x] Epsilon task');
    expect(r.log.map((e) => e.kind)).toEqual(['conflict-app-wins']);
  });

  it('merges edits in different sections without a conflict', () => {
    const file = edit(BASE, '- [x] Gamma task', '- [ ] Gamma task');
    const app = edit(BASE, '- [ ] Epsilon task', '- [x] Epsilon task');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forApp).toContain('- [ ] Gamma task');
    expect(r.forApp).toContain('- [x] Epsilon task');
    expect(r.log.map((e) => e.kind).sort()).toEqual(['to-app', 'to-file']);
  });

  it('keeps heading and prose edits from either side too', () => {
    const file = edit(BASE, '## 0.2 Money 🟠', '## 0.2 Money and rounding 🟠');
    const app = edit(BASE, '# Roadmap', '# Goldilocks Roadmap');
    const r = mergeRoadmap(BASE, file, app);
    expect(r.forApp).toContain('# Goldilocks Roadmap');
    expect(r.forApp).toContain('## 0.2 Money and rounding 🟠');
  });

  it('keeps the line endings of each side', () => {
    const crlf = (s: string) => s.replace(/\n/g, '\r\n');
    const app = crlf(edit(BASE, '- [ ] Beta task', '- [x] Beta task'));
    const r = mergeRoadmap(crlf(BASE), crlf(BASE), app);
    expect(r.forFile).toBe(app);
    expect(r.forApp).toBe(app);
  });

  it('handles an empty base (first sync) by treating both sides as additions', () => {
    const r = mergeRoadmap('', BASE, BASE);
    expect(r.forApp).toBe(BASE);
    expect(r.forFile).toBe(BASE);
  });

  describe('edits on neighbouring lines', () => {
    it('keeps a tick from each side when they ticked consecutive tasks', () => {
      const file = edit(BASE, '- [ ] Beta task', '- [x] Beta task');
      const app = edit(BASE, '- [x] Gamma task', '- [ ] Gamma task');
      const r = mergeRoadmap(BASE, file, app);
      expect(r.forApp).toContain('- [x] Beta task');
      expect(r.forApp).toContain('- [ ] Gamma task');
      expect(r.forFile).toBe(r.forApp);
      expect(r.log.map((e) => e.kind).sort()).toEqual(['to-app', 'to-file']);
    });

    it('keeps the file\'s deletion and the app\'s tick on the next line', () => {
      const file = edit(BASE, '- [ ] Beta task\n', '');
      const app = edit(BASE, '- [x] Gamma task', '- [ ] Gamma task');
      const r = mergeRoadmap(BASE, file, app);
      expect(r.forFile).not.toContain('Beta task');
      expect(r.forFile).toContain('- [ ] Gamma task');
      expect(r.forApp).toContain('Beta task'); // never deleted from the app
      expect(r.forApp).toContain('- [ ] Gamma task');
      expect(r.log.map((e) => e.kind).sort()).toEqual(['missing-from-file', 'to-file']);
    });

    it('keeps a task added in the file right before a line the app edited', () => {
      const file = edit(BASE, '- [ ] Beta task\n', '- [ ] Beta task\n- [ ] File addition\n');
      const app = edit(BASE, '- [x] Gamma task', '- [ ] Gamma task');
      const r = mergeRoadmap(BASE, file, app);
      expect(r.forFile).toContain('File addition');
      expect(r.forFile).toContain('- [ ] Gamma task');
      expect(r.forFile).toBe(r.forApp);
    });

    it('still lets the app win when both edited the very same line', () => {
      const file = edit(BASE, '- [ ] Beta task', '- [x] Beta task');
      const app = edit(BASE, '- [ ] Beta task', '- [ ] Beta task (app)');
      const r = mergeRoadmap(BASE, file, app);
      expect(r.forFile).toContain('Beta task (app)');
      expect(r.log.map((e) => e.kind)).toEqual(['conflict-app-wins']);
    });
  });

  describe('the base after a pull (docs/ROADMAP-SYNC-PULL-DESIGN.md)', () => {
    const B = '## 1 A\n\n- [ ] one\n- [ ] two\n- [ ] three\n';

    it('newBase = mergeRoadmap(base, file, base).forApp keeps flagged deletions and absorbs file additions', () => {
      const file = '## 1 A\n\n- [ ] one\n- [ ] three\n- [ ] four\n';
      expect(mergeRoadmap(B, file, B).forApp).toBe('## 1 A\n\n- [ ] one\n- [ ] two\n- [ ] three\n- [ ] four\n');
    });

    it('later, app-only edits are the only thing pushed and a deleted line is not resurrected', () => {
      const file = '## 1 A\n\n- [ ] one\n- [ ] three\n';
      const app = '## 1 A\n\n- [ ] one\n- [ ] two\n- [x] three\n';
      const newBase = mergeRoadmap(B, file, B).forApp;
      const r = mergeRoadmap(newBase, file, app);
      expect(r.forFile).toBe('## 1 A\n\n- [ ] one\n- [x] three\n');
      expect(r.forApp).toBe(app);
    });

    it('is quiet once the app deletes the line too', () => {
      const file = '## 1 A\n\n- [ ] one\n- [ ] three\n';
      const app = '## 1 A\n\n- [ ] one\n- [ ] three\n';
      const r = mergeRoadmap(B, file, app);
      expect(r.log).toEqual([]);
      expect(r.forFile).toBe(file);
    });
  });

  it('keeps every independent single-line edit from both sides (seeded random check)', () => {
    let seed = 12345;
    const rand = (n: number) => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed % n;
    };
    for (let round = 0; round < 200; round++) {
      const n = 12 + rand(10);
      const lines = Array.from({ length: n }, (_, i) => `- [ ] task number ${i}`);
      const fileLines = [...lines];
      const appLines = [...lines];
      const wantFile = new Set<number>();
      const wantApp = new Set<number>();
      for (let i = 0; i < n; i++) {
        const pick = rand(4);
        if (pick === 0) {
          fileLines[i] = `- [x] task number ${i}`;
          wantFile.add(i);
        } else if (pick === 1) {
          appLines[i] = `- [x] task number ${i}`;
          wantApp.add(i);
        }
      }
      const base = lines.join('\n') + '\n';
      const r = mergeRoadmap(base, fileLines.join('\n') + '\n', appLines.join('\n') + '\n');
      const out = r.forFile.split('\n');
      for (let i = 0; i < n; i++) {
        const ticked = wantFile.has(i) || wantApp.has(i);
        expect(out[i]).toBe(ticked ? `- [x] task number ${i}` : `- [ ] task number ${i}`);
      }
      expect(r.forApp).toBe(r.forFile);
    }
  });
});

