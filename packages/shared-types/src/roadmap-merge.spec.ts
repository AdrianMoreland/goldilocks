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
});
