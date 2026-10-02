import { describe, expect, it } from 'vitest';
import { applyRoadmapEdit, countTasks, parseRoadmap, RoadmapEditError } from './roadmap';

const SAMPLE = [
  '# Roadmap',
  '',
  'Intro text.',
  '',
  '## How to read this',
  '',
  '- plain bullet',
  '',
  '# PHASE 0 — Harden',
  '',
  '**Goal:** safe.',
  '',
  '## 0.1 Core pricing 🔴',
  '',
  '- [x] Done thing — S',
  '- [ ] Parent — M *(note)*',
  '  - [ ] Child one',
  '  - [x] Child two',
  '  - *(a caveat under the parent)*',
  '- [ ] Last top-level',
  '',
  '## 0.2 Money 🟠 *(quick win)* ← depends: 0.1',
  '',
  'Prose here.',
  '',
  '# Icebox',
  '',
  'Ideas.',
  '',
].join('\n');

describe('parseRoadmap', () => {
  const sections = parseRoadmap(SAMPLE);

  it('finds sections with ids, priority, note and dependency', () => {
    const money = sections.find((s) => s.id === '0.2')!;
    expect(money).toMatchObject({ title: 'Money', priority: 'P1', note: 'quick win', depends: '0.1', group: 'PHASE 0 — Harden' });
    expect(sections.find((s) => s.key === 'icebox')?.body).toBe('Ideas.');
  });

  it('builds the task tree with notes and line numbers', () => {
    const core = sections.find((s) => s.id === '0.1')!;
    expect(core.tasks.map((t) => t.text)).toEqual(['Done thing — S', 'Parent — M *(note)*', 'Last top-level']);
    const parent = core.tasks[1]!;
    expect(parent.children.map((c) => [c.text, c.checked])).toEqual([['Child one', false], ['Child two', true]]);
    expect(parent.notes).toEqual(['*(a caveat under the parent)*']);
    expect(SAMPLE.split('\n')[parent.line]).toContain('Parent');
    expect(countTasks(core.tasks)).toEqual({ done: 2, total: 5 });
  });

  it('keeps the prose of non-task sections', () => {
    expect(sections.find((s) => s.key === 'how-to-read-this')?.body).toBe('- plain bullet');
  });

  it('does not treat headings inside code fences as sections', () => {
    const md = '## 1.1 A\n\n```\n# not a heading\n- [ ] not a task\n```\n- [ ] real\n';
    const s = parseRoadmap(md)[0]!;
    expect(s.tasks.map((t) => t.text)).toEqual(['real']);
  });
});

describe('applyRoadmapEdit', () => {
  const core = parseRoadmap(SAMPLE).find((s) => s.id === '0.1')!;
  const lineOf = (text: string) => SAMPLE.split('\n').indexOf(text);

  it('toggles only the one line', () => {
    const out = applyRoadmapEdit(SAMPLE, { type: 'toggle', line: core.tasks[0]!.line, text: core.tasks[0]!.text, checked: false });
    expect(out.split('\n').filter((l, i) => l !== SAMPLE.split('\n')[i])).toEqual(['- [ ] Done thing — S']);
  });

  it('refuses a stale line', () => {
    expect(() => applyRoadmapEdit(SAMPLE, { type: 'toggle', line: core.tasks[0]!.line, text: 'something else', checked: true })).toThrow(RoadmapEditError);
    expect(() => applyRoadmapEdit(SAMPLE, { type: 'delete', line: 0, text: 'x' })).toThrow(RoadmapEditError);
  });

  it('deletes a task together with its children and notes', () => {
    const parent = core.tasks[1]!;
    const out = applyRoadmapEdit(SAMPLE, { type: 'delete', line: parent.line, text: parent.text });
    expect(out).not.toContain('Child one');
    expect(out).not.toContain('a caveat');
    expect(out).toContain('- [ ] Last top-level');
  });

  it('adds a top-level task after the last top-level block', () => {
    const out = applyRoadmapEdit(SAMPLE, { type: 'add', sectionLine: core.headingLine, text: 'New task' });
    const lines = out.split('\n');
    expect(lines[lines.indexOf('- [ ] Last top-level') + 1]).toBe('- [ ] New task');
  });

  it('adds a subtask after the parent block', () => {
    const parent = core.tasks[1]!;
    const out = applyRoadmapEdit(SAMPLE, { type: 'add', sectionLine: core.headingLine, parentLine: parent.line, text: 'Child three' });
    const lines = out.split('\n');
    expect(lines[lines.indexOf('  - *(a caveat under the parent)*') + 1]).toBe('  - [ ] Child three');
  });

  it('adds the first task to a section that has none', () => {
    const money = parseRoadmap(SAMPLE).find((s) => s.id === '0.2')!;
    const out = applyRoadmapEdit(SAMPLE, { type: 'add', sectionLine: money.headingLine, text: 'First' });
    const reparsed = parseRoadmap(out).find((s) => s.id === '0.2')!;
    expect(reparsed.tasks.map((t) => t.text)).toEqual(['First']);
    expect(reparsed.body).toBe('Prose here.');
  });

  it('edits the text and keeps the checkbox state', () => {
    const t = core.tasks[0]!;
    const out = applyRoadmapEdit(SAMPLE, { type: 'edit', line: t.line, text: t.text, newText: 'Renamed' });
    expect(out).toContain('- [x] Renamed');
    expect(lineOf('- [x] Done thing — S')).toBeGreaterThan(0);
  });

  it('preserves CRLF line endings', () => {
    const crlf = SAMPLE.replace(/\n/g, '\r\n');
    const out = applyRoadmapEdit(crlf, { type: 'toggle', line: core.tasks[2]!.line, text: core.tasks[2]!.text, checked: true });
    expect(out.includes('\r\n')).toBe(true);
    expect(out.replace(/\r\n/g, '')).not.toContain('\n');
  });
});
