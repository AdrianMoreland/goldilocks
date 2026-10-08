import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseKbDocument, type KbSection } from './kb-markdown';
import {
  buildArticleLayout,
  buildBlocks,
  classifySection,
  extractSources,
  isStopStep,
  parseBlocks,
  ruleTone,
  shareTermsAcrossBlocks,
  type KbLayoutEntry,
  type KbRenderBlock,
} from './kb-layout';
import { KB_TERMS } from './kb-terms';

// The rules are checked against the real SOP text, so a rewording that breaks a
// rule fails here and not on the desk.
const dir = join(__dirname, '../../../docs/sops');
const docs = new Map<string, { status: string; sections: KbSection[] }>();
for (const name of readdirSync(dir).filter((file) => file.endsWith('.md'))) {
  const parsed = parseKbDocument(readFileSync(join(dir, name), 'utf8'));
  if (parsed.ok) docs.set(parsed.doc.frontmatter.slug, { status: parsed.doc.frontmatter.status, sections: parsed.doc.sections });
}

function section(slug: string, anchor: string): KbSection {
  const found = docs.get(slug)?.sections.find((candidate) => candidate.anchor === anchor);
  if (!found) throw new Error(`fixture missing: ${slug}#${anchor}`);
  return found;
}

function entry(slug: string, anchor: string): KbLayoutEntry {
  const layout = buildArticleLayout(docs.get(slug)?.sections ?? []);
  const found = layout.entries.find((candidate) => candidate.section.anchor === anchor);
  if (!found) throw new Error(`fixture missing: ${slug}#${anchor}`);
  return found;
}

const ofType = <T extends KbRenderBlock['type']>(blocks: KbRenderBlock[], type: T) =>
  blocks.filter((block): block is Extract<KbRenderBlock, { type: T }> => block.type === type);

describe('parseBlocks', () => {
  it('reads a paragraph followed directly by a bullet list as two blocks', () => {
    const blocks = parseBlocks(section('bc-record-customer-payment', 'final-check-then-post').markdown);
    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'list', 'paragraph']);
    const list = blocks[1];
    expect(list?.type === 'list' && list.items).toHaveLength(4);
  });

  it('keeps an indented nested list inside its item', () => {
    const [block] = parseBlocks('1. First\n   - inner a\n   - inner b\n2. Second');
    expect(block?.type === 'list' && block.items.map((item) => item.hasNested)).toEqual([true, false]);
  });

  it('treats a table as one block and does not split it into lists', () => {
    const blocks = parseBlocks('Fees:\n\n| Method | Fee |\n| --- | --- |\n| Card | 1% |\n');
    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'other']);
  });
});

describe('classifySection', () => {
  it('finds the lead, the Before you start card, the STOP card and the steps', () => {
    const sections = docs.get('bc-record-customer-payment')?.sections ?? [];
    const kinds = Object.fromEntries(sections.map((s, i) => [s.anchor, classifySection(s, i)]));
    expect(kinds).toMatchObject({
      purpose: 'lead',
      'before-you-start': 'before',
      'fill-in-the-journal': 'steps',
      'if-it-does-not-match': 'stop',
      next: 'next',
      related: 'related',
    });
  });

  it('only treats the first Purpose section as the lead', () => {
    const s = section('bc-record-customer-payment', 'purpose');
    expect(classifySection(s, 3)).not.toBe('lead');
  });

  it('marks a proposed-controls section as a proposal', () => {
    const proposals = [...docs.values()].flatMap((doc) => doc.sections).filter((s) => s.isProposed);
    for (const proposal of proposals) expect(classifySection(proposal, 2)).toBe('proposal');
  });
});

describe('form table (Label: value)', () => {
  const blocks = entry('bc-record-customer-payment', 'fill-in-the-journal').blocks;

  it('turns the journal fields into rows and keeps the first non-field item as a lead-in', () => {
    const [form] = ofType(blocks, 'form');
    expect(form?.leadIns).toHaveLength(1);
    expect(form?.leadIns[0]).toContain('Cash Receipt Journals');
    expect(form?.rows.map((row) => row.label)).toEqual([
      'Posting Date',
      'Document Type',
      'Account Type',
      'Account No.',
      'Posting Group',
      'Amount',
      'Bal. Account Type',
      'Bal. Account No.',
    ]);
  });

  it('capitalises the value and flags only the "negative" row as the one to watch', () => {
    const [form] = ofType(blocks, 'form');
    expect(form?.rows[1]?.value).toBe('Payment.');
    expect(form?.rows.filter((row) => row.danger).map((row) => row.label)).toEqual(['Amount']);
  });
});

describe('mini flow', () => {
  it('turns five short lettered-style steps into cards', () => {
    const blocks = entry('bc-record-customer-payment', 'link-the-payment-to-the-invoice').blocks;
    const [flow] = ofType(blocks, 'markdown');
    expect(flow?.variant).toBe('miniflow');
    expect(flow?.markdown.split('\n').filter((line) => /^\d\./.test(line))).toHaveLength(5);
  });
});

describe('checklist', () => {
  it('ticks the Before you start bullets', () => {
    const blocks = entry('bc-record-customer-payment', 'before-you-start').blocks;
    expect(ofType(blocks, 'markdown').map((block) => block.variant)).toEqual(['checklist']);
  });

  it('ticks a bullet list that follows "Check each of these:" and keeps the text around it', () => {
    const blocks = entry('bc-record-customer-payment', 'final-check-then-post').blocks;
    expect(blocks.map((block) => (block.type === 'markdown' ? block.variant : block.type))).toEqual(['plain', 'checklist', 'plain']);
  });
});

describe('rules list', () => {
  it('marks Never/Always bullets', () => {
    const blocks = entry('customer-email-wording', 'always-include').blocks;
    const rules = ofType(blocks, 'markdown').filter((block) => block.variant === 'rules');
    expect(rules.length).toBeGreaterThan(0);
  });

  it('reads the tone of a bullet', () => {
    expect(ruleTone('Never predict prices')).toBe('no');
    expect(ruleTone('Don’t say that')).toBe('no');
    expect(ruleTone('Always quote the VAT-inclusive price')).toBe('yes');
    expect(ruleTone('Check the ID')).toBe('neutral');
  });
});

describe('Right / Wrong', () => {
  it('splits the pair into two cards', () => {
    const blocks = entry('bc-collection-and-shipment', 'serial-numbers-for-bars').blocks;
    const [pair] = ofType(blocks, 'rightwrong');
    expect(pair?.right).toContain('3 bars means 3 lines');
    expect(pair?.wrong).toContain('one line with Quantity 3');
  });
});

describe('leading STOP step', () => {
  it('lifts "Do not accept the cash…" above the list and restarts numbering at 1', () => {
    const blocks = entry('cash-transactions-ie', 'before-accepting-the-cash').blocks;
    const [stop] = ofType(blocks, 'stop');
    expect(stop?.markdown).toMatch(/^Do not accept the cash/);
    const [steps] = ofType(blocks, 'markdown').filter((block) => block.variant === 'steps');
    expect(steps?.markdown.startsWith('1. ')).toBe(true);
    expect(steps?.markdown).not.toContain('Do not accept the cash');
  });

  it('recognises a stop-style step', () => {
    expect(isStopStep('Never predict the price')).toBe(true);
    expect(isStopStep('**Stop** and call a manager')).toBe(true);
    expect(isStopStep('Select Post')).toBe(false);
  });
});

describe('Sources line', () => {
  it('lifts the Sources line out of the Purpose and gives it as a footnote', () => {
    const layout = buildArticleLayout(docs.get('cash-transactions-ie')?.sections ?? []);
    expect(layout.sources).toMatch(/^AML Policy \(Dec 2022\)/);
    const lead = layout.entries[0];
    expect(lead?.kind).toBe('lead');
    expect(JSON.stringify(lead?.blocks)).not.toMatch(/Sources:/);
    expect(JSON.stringify(lead?.blocks)).toContain('Take large cash payments safely');
  });

  it('copes with a bolded label, a continuation line and no Sources at all', () => {
    expect(extractSources('Text.\n**Sources:** A, B,\nC.\n\nMore.').sources).toBe('A, B, C');
    expect(extractSources('Text.\n\nMore.')).toEqual({ markdown: 'Text.\n\nMore.', sources: null });
  });
});

describe('collapse default', () => {
  it('starts a long reference section folded and a short one open', () => {
    const layout = buildArticleLayout(docs.get('cash-transactions-ie')?.sections ?? []);
    const long = layout.entries.filter((e) => e.kind === 'ref' && e.collapsed);
    const short = layout.entries.filter((e) => e.kind === 'ref' && !e.collapsed);
    for (const e of long) expect(e.section.markdown.length).toBeGreaterThan(700);
    for (const e of short) expect(e.section.markdown.length).toBeLessThan(1000);
    expect(long.length + short.length).toBeGreaterThan(0);
  });

  it('keeps the main steps section open however long it is', () => {
    const layout = buildArticleLayout(docs.get('bc-customer-sales-workflow')?.sections ?? []);
    expect(layout.entries.find((e) => e.section.anchor === 'the-steps')?.collapsed).toBe(false);
  });

  it('never folds a steps, STOP or Before you start card', () => {
    for (const doc of docs.values()) {
      const layout = buildArticleLayout(doc.sections);
      for (const e of layout.entries) {
        if (['steps', 'stop', 'before'].includes(e.kind)) expect(e.collapsed, e.section.heading).toBe(false);
      }
    }
  });
});

describe('At a glance', () => {
  it('uses the sections of a payment how-to, with the STOP section as a red chip', () => {
    const layout = buildArticleLayout(docs.get('bc-record-customer-payment')?.sections ?? []);
    expect(layout.glance.map((chip) => chip.label)).toEqual(['Fill in the journal', 'Link the payment to the invoice', 'Final check, then post', 'If it does not match']);
    expect(layout.glance.at(-1)?.stop).toBe(true);
  });

  it('uses the numbered steps when the procedure has one list of a readable length', () => {
    const chips = buildArticleLayout(docs.get('customer-collection')?.sections ?? []).glance;
    for (const chip of chips) expect(chip.label.length).toBeLessThanOrEqual(46);
  });
});

describe('Next and Related', () => {
  it('reads the first link of the Next section', () => {
    const layout = buildArticleLayout(docs.get('bc-record-customer-payment')?.sections ?? []);
    expect(layout.next).toEqual({ slug: 'bc-release-and-confirm', anchor: null });
  });
});

describe('term links', () => {
  it('gives each term to the first block that mentions it, and to no other', () => {
    const blocks: KbRenderBlock[] = [
      { type: 'markdown', variant: 'plain', markdown: 'Nothing to link here.' },
      { type: 'markdown', variant: 'plain', markdown: 'The spot price moves.' },
      { type: 'markdown', variant: 'plain', markdown: 'The spot price again.' },
    ];
    const shared = shareTermsAcrossBlocks(blocks, KB_TERMS);
    const ids = [...shared.values()].flat().map((term) => term.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(shared.has(0)).toBe(false);
  });
});

describe('every SOP in the library', () => {
  it.each([...docs.entries()].filter(([, doc]) => doc.status !== 'retired').map(([slug, doc]) => [slug, doc.sections] as const))(
    '%s lays out without throwing, and every section gets an entry',
    (_slug, sections) => {
      const layout = buildArticleLayout(sections);
      expect(layout.entries).toHaveLength(sections.length);
      layout.entries.forEach((e, index) => {
        expect(e.section).toBe(sections[index]);
        // A non-empty section always renders something.
        if (e.section.markdown.trim() !== '') expect(e.blocks.length, e.section.heading).toBeGreaterThan(0);
      });
      // Step chips point at a list that exists.
      for (const chip of layout.glance) expect(sections.some((s) => s.anchor === chip.anchor), chip.label).toBe(true);
      // Contents never list the lead or Related.
      expect(layout.contents.some((c) => c.anchor === 'related')).toBe(false);
    },
  );

  it('keeps every word of every section in the blocks it renders', () => {
    for (const [slug, doc] of docs) {
      for (const [index, s] of doc.sections.entries()) {
        if (index === 0 && s.anchor === 'purpose') continue; // the Sources line moves to the footnote
        const kind = classifySection(s, index);
        const text = JSON.stringify(buildBlocks(s.markdown, kind)).replace(/\\n|\s+/g, '').replace(/[*_`]/g, '').toLowerCase();
        const words = s.markdown.replace(/\[\[[^\]]*\]\]|[*_`|\-:#>()[\]0-9.]/g, ' ').split(/\s+/).filter((w) => /^[A-Za-z]{6,}$/.test(w));
        for (const word of words.slice(0, 40)) expect(text.includes(word.toLowerCase()), `${slug}#${s.anchor}: "${word}"`).toBe(true);
      }
    }
  });
});
