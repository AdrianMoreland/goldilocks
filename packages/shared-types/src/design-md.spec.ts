import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDesignDoc, splitDocSections } from './design-md';

const SAMPLE = [
  '---',
  'name: Demo',
  'description: A demo.',
  'colors:',
  '  gold: "#daab69"',
  '  ink: "#000000"',
  'typography:',
  '  h1:',
  '    fontSize: "3rem"',
  '    fontWeight: 800',
  'rounded:',
  '  md: "6px"',
  '---',
  '',
  '# Design System: Demo',
  '',
  '## Overview',
  '',
  'Intro.',
  '',
  '**The Gold Rule.** Gold means state.',
  '',
  "## Do's and Don'ts",
  '',
  '### Do:',
  '- **Do** keep tokens.',
  '- **Do** wrap',
  '  onto a second line.',
  '',
  "### Don't:",
  "- **Don't** add pills.",
  '',
].join('\n');

describe('splitDocSections', () => {
  it('splits on ## and ignores headings inside code fences', () => {
    const sections = splitDocSections('## A\ntext\n```\n## not a heading\n```\n## B\nmore');
    expect(sections.map((s) => s.title)).toEqual(['A', 'B']);
    expect(sections[0]!.body).toContain('## not a heading');
  });
});

describe('parseDesignDoc', () => {
  const doc = parseDesignDoc(SAMPLE);

  it('reads tokens from the front matter', () => {
    expect(doc.name).toBe('Demo');
    expect(doc.tokens.colors).toEqual({ gold: '#daab69', ink: '#000000' });
    expect(doc.tokens.typography.h1).toEqual({ fontSize: '3rem', fontWeight: '800' });
    expect(doc.tokens.rounded.md).toBe('6px');
  });

  it('collects sections, named rules and do / don\'t lists', () => {
    expect(doc.sections.map((s) => s.title)).toEqual(['Overview', "Do's and Don'ts"]);
    expect(doc.rules).toEqual([{ name: 'The Gold Rule', text: 'Gold means state.' }]);
    expect(doc.dos).toEqual(['**Do** keep tokens.', '**Do** wrap onto a second line.']);
    expect(doc.donts).toEqual(["**Don't** add pills."]);
  });

  it('parses the real DESIGN.md', () => {
    const real = parseDesignDoc(readFileSync('../../DESIGN.md', 'utf8'));
    expect(real.tokens.colors['merrion-gold']).toBe('#daab69');
    expect(Object.keys(real.tokens.typography)).toContain('table-item');
    expect(real.tokens.rounded.xl).toBe('12px');
    expect(real.sections.map((s) => s.title)).toContain('Colors');
    expect(real.rules.length).toBeGreaterThan(5);
    expect(real.dos.length).toBeGreaterThan(5);
    expect(real.donts.length).toBeGreaterThan(5);
  });
});
