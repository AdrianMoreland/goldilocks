import { listedRefinery, refineryWords } from './refineries';

/**
 * Pure helpers for the live stock board: reading the names the stock sheet uses into a family and a variant, folding
 * serials and refineries, and planning the baseline load. No database, no clock.
 */

export type LiveMetal = 'GOLD' | 'SILVER' | 'PGM';
export type LiveKind = 'COIN' | 'BAR';

// ---------------------------------------------------------------- weights

export interface ParsedWeight {
  /** Canonical label: "1oz", "1/10oz", "100g", "1kg". */
  label: string;
  /** Grams, for ordering. */
  grams: number;
}

const OZ_GRAMS = 31.1034768;
const WEIGHT_RE = /(^|[^0-9./])(\d+(?:\.\d+)?(?:\s*\/\s*\d+)?)\s*(oz|ozt|z|g|gr|gram|grams|kg|kilo)(?![a-z])/i;

function fractionValue(n: string): number {
  const [a = 0, b] = n.split('/').map((s) => Number(s.trim()));
  return b ? a / b : a;
}

/** The first weight in a text ("1/10oz Maple", "100g Bar", "10z Kookaburra" is read as 1oz), or null. */
export function parseWeight(text: string): (ParsedWeight & { index: number; length: number }) | null {
  const m = WEIGHT_RE.exec(text);
  if (!m) return null;
  const numberText = (m[2] ?? '').replace(/\s+/g, '');
  const unitRaw = (m[3] ?? '').toLowerCase();
  let unit: 'oz' | 'g' | 'kg';
  let numText = numberText;
  // "10z" is a typo for "1oz": a number ending in 0 before a bare "z".
  if (unitRaw === 'z' && /^\d*0$/.test(numberText) && numberText.length > 1) {
    numText = numberText.slice(0, -1);
    unit = 'oz';
  } else if (unitRaw === 'z') {
    unit = 'oz';
  } else if (unitRaw.startsWith('oz')) unit = 'oz';
  else if (unitRaw === 'kg' || unitRaw === 'kilo') unit = 'kg';
  else unit = 'g';
  const value = fractionValue(numText);
  if (!Number.isFinite(value) || value <= 0) return null;
  const grams = unit === 'oz' ? value * OZ_GRAMS : unit === 'kg' ? value * 1000 : value;
  const index = m.index + (m[1] ?? '').length;
  return {
    label: `${numText}${unit}`,
    grams: Math.round(grams * 10000) / 10000,
    index,
    length: m[0].length - (m[1] ?? '').length,
  };
}

// ---------------------------------------------------------------- coins

/** Coin families in the order they are matched (longest and most specific first). Display names. */
const COIN_FAMILIES: ReadonlyArray<{ family: string; words: readonly string[] }> = [
  { family: 'Tree of Life', words: ['tree of life'] },
  { family: 'Krugerrand', words: ['krugerrand', 'kruger'] },
  { family: 'Maple', words: ['maple', 'maple leaf'] },
  { family: 'Britannia', words: ['britannia'] },
  { family: 'Philharmonic', words: ['philharmonic', 'philharmoniker'] },
  { family: 'Eagle', words: ['eagle', 'american eagle'] },
  { family: 'Buffalo', words: ['buffalo'] },
  { family: 'Kangaroo', words: ['kangaroo'] },
  { family: 'Kookaburra', words: ['kookaburra'] },
  { family: 'Koala', words: ['koala'] },
  { family: 'Lunar', words: ['lunar'] },
  { family: 'Sovereign', words: ['sovereign'] },
  { family: 'Libertad', words: ['libertad'] },
  { family: 'Panda', words: ['panda'] },
  { family: 'Nugget', words: ['nugget'] },
  { family: 'Napoleon', words: ['napoleon'] },
  { family: 'Vreneli', words: ['vreneli'] },
  { family: 'Lady Fortuna', words: ['lady fortuna'] },
];

export interface ParsedCoin {
  family: string;
  /** Weight plus whatever else tells the variants apart: "1oz", "1oz 22K", "Half Proof". */
  variant: string;
  grams: number | null;
}

const words = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9/]+/g, ' ').trim()} `;

/** Reads "1oz Krugerrand", "2013 1oz Britannia - Old Design", "Half Sovereign Proof" into a family and a variant. */
export function parseCoinName(text: string): ParsedCoin {
  const raw = text.trim().replace(/\s+/g, ' ');
  const w = words(raw);
  let family: string | null = null;
  let familyWords = '';
  let best = 0;
  for (const f of COIN_FAMILIES) {
    for (const word of f.words) {
      if (w.includes(` ${word} `) && word.length > best) {
        family = f.family;
        familyWords = word;
        best = word.length;
      }
    }
  }
  const weight = parseWeight(raw);
  if (!family) {
    // A one-off ("50€ Gold Proof Coin"): its whole name is the variant, grouped under Other.
    return { family: 'Other', variant: raw, grams: weight?.grams ?? null };
  }
  let rest = raw;
  if (weight) rest = (rest.slice(0, weight.index) + ' ' + rest.slice(weight.index + weight.length)).trim();
  // Drop the family words (case-insensitive), then tidy separators.
  const famRe = new RegExp(`\\b${familyWords.replace(/ /g, '\\s+')}\\b`, 'i');
  rest = rest.replace(famRe, ' ').replace(/\s*[-–]\s*/g, ' - ').replace(/\s+/g, ' ').replace(/^[-\s]+|[-\s]+$/g, '');
  const variant = [weight?.label, rest].filter(Boolean).join(' ').trim() || raw;
  return { family, variant, grams: weight?.grams ?? null };
}

// ---------------------------------------------------------------- bars

export interface ParsedBarWeight {
  /** "100g", "1oz", "1kg". The line's variant. */
  variant: string;
  grams: number | null;
}

/** "100g Bar", "1oz bar", "1KG Bar", "10z Bar". Anything without a weight keeps its own text. */
export function parseBarWeight(text: string): ParsedBarWeight {
  const w = parseWeight(text);
  if (!w) return { variant: text.trim(), grams: null };
  return { variant: w.label, grams: w.grams };
}

/** Serial folded for comparing: upper case, letters and digits only. */
export function liveSerialKey(serial: string): string {
  return serial.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** A refinery as the board stores it: the canonical name when listed, else tidied upper case; "" for none. */
export function liveRefinery(text: string | null | undefined): { value: string; listed: boolean } {
  const t = (text ?? '').trim();
  if (!t) return { value: '', listed: true };
  const hit = listedRefinery(t);
  if (hit === null) return { value: '', listed: true };
  if (hit) return { value: hit, listed: true };
  return { value: refineryWords(t), listed: false };
}

export const LIVE_BRANCH_CODES = ['DU', 'CO', 'BL', 'BC'] as const;

/** Compare variants by size, then name. Unweighted variants sort last. */
export function variantGrams(variant: string): number {
  return parseWeight(variant)?.grams ?? Number.POSITIVE_INFINITY;
}

// ---------------------------------------------------------------- baseline plan

export interface BaselineBarRow {
  metal: LiveMetal;
  /** 1-based row in the sheet, for messages. */
  row: number;
  branch: string;
  weight: string;
  refinery: string | null;
  serial: string | null;
  grams: number | null;
  details: string | null;
  sold: boolean;
}

export interface BaselineCoinRow {
  metal: LiveMetal;
  row: number;
  item: string;
  /** Count per branch code as written in the sheet. */
  counts: Record<string, number | null>;
  details: Record<string, string | null>;
}

export interface BaselineLine {
  branchCode: string;
  metal: LiveMetal;
  kind: LiveKind;
  family: string;
  variant: string;
  refinery: string;
  qty: number;
  details: string | null;
}

export interface BaselineBar {
  branchCode: string;
  metal: LiveMetal;
  family: string;
  variant: string;
  refinery: string;
  serial: string;
  serialKey: string;
  grams: number | null;
  details: string | null;
}

export interface BaselineFix {
  row: number;
  field: 'refinery' | 'weight' | 'item';
  from: string;
  to: string;
}

export interface BaselineIssue {
  row: number;
  message: string;
}

export interface BaselinePlan {
  lines: BaselineLine[];
  bars: BaselineBar[];
  /** Spellings changed on the way in, shown in the preview so a person can see them. */
  fixes: BaselineFix[];
  /** Rows not loaded, with the reason. */
  issues: BaselineIssue[];
  /** Same serial on two bars in the file: neither loads. */
  clashes: { serialKey: string; rows: number[] }[];
  skippedSold: number;
  unlistedRefineries: string[];
}

const keyOf = (l: Pick<BaselineLine, 'branchCode' | 'metal' | 'kind' | 'family' | 'variant' | 'refinery'>) =>
  [l.branchCode, l.metal, l.kind, l.family.toLowerCase(), l.variant.toLowerCase(), l.refinery].join('|');

/**
 * Turns the stock sheet's rows into lines and serialled bars. Sold-flagged bars are not loaded. A bar with no branch
 * is reported, never guessed. A serial found twice goes to `clashes` and neither copy loads.
 */
export function planBaseline(input: { bars: BaselineBarRow[]; coins: BaselineCoinRow[] }): BaselinePlan {
  const lines = new Map<string, BaselineLine>();
  const bars: BaselineBar[] = [];
  const barRows: number[] = [];
  const fixes: BaselineFix[] = [];
  const issues: BaselineIssue[] = [];
  const unlisted = new Set<string>();
  let skippedSold = 0;

  const add = (l: BaselineLine) => {
    const k = keyOf(l);
    const cur = lines.get(k);
    if (cur) {
      cur.qty += l.qty;
      if (!cur.details && l.details) cur.details = l.details;
    } else lines.set(k, { ...l });
  };

  for (const b of input.bars) {
    if (b.sold) {
      skippedSold += 1;
      continue;
    }
    const branchCode = b.branch.trim().toUpperCase();
    if (!branchCode) {
      issues.push({ row: b.row, message: 'No branch, so the bar was not loaded.' });
      continue;
    }
    const weight = parseBarWeight(b.weight);
    if (weight.grams === null) {
      issues.push({ row: b.row, message: `Weight "${b.weight}" not understood.` });
      continue;
    }
    if (weight.variant.toLowerCase() !== b.weight.trim().toLowerCase().replace(/\s*bars?$/, '').replace(/\s+/g, '')) {
      fixes.push({ row: b.row, field: 'weight', from: b.weight, to: weight.variant });
    }
    const ref = liveRefinery(b.refinery);
    if (b.refinery && ref.value !== b.refinery.trim()) {
      fixes.push({ row: b.row, field: 'refinery', from: b.refinery, to: ref.value || '(none)' });
    }
    if (!ref.listed) unlisted.add(ref.value);
    const serial = b.serial?.trim() || null;
    add({
      branchCode,
      metal: b.metal,
      kind: 'BAR',
      family: 'Bar',
      variant: weight.variant,
      refinery: ref.value,
      qty: 1,
      details: null,
    });
    if (serial && serial.toUpperCase() !== 'NOSERIAL') {
      barRows.push(b.row);
      bars.push({
        branchCode,
        metal: b.metal,
        family: 'Bar',
        variant: weight.variant,
        refinery: ref.value,
        serial,
        serialKey: liveSerialKey(serial),
        grams: b.grams ?? weight.grams,
        details: b.details,
      });
    }
  }

  for (const c of input.coins) {
    const parsed = parseCoinName(c.item);
    for (const [code, count] of Object.entries(c.counts)) {
      if (count === null || count === undefined) continue;
      if (!Number.isInteger(count) || count < 0) {
        issues.push({ row: c.row, message: `${c.item} (${code}): "${count}" is not a whole count.` });
        continue;
      }
      if (count === 0) continue;
      add({
        branchCode: code.trim().toUpperCase(),
        metal: c.metal,
        kind: 'COIN',
        family: parsed.family,
        variant: parsed.variant,
        refinery: '',
        qty: count,
        details: c.details[code]?.trim() || null,
      });
    }
  }

  // Serial clashes inside the file: the same folded serial on more than one bar.
  const seen = new Map<string, number[]>();
  bars.forEach((b, i) => seen.set(b.serialKey, [...(seen.get(b.serialKey) ?? []), i]));
  const clashes: BaselinePlan['clashes'] = [];
  const drop = new Set<number>();
  for (const [serialKey, idx] of seen) {
    if (idx.length > 1) {
      clashes.push({ serialKey, rows: idx.map((i) => barRows[i] ?? 0) });
      idx.forEach((i) => drop.add(i));
    }
  }
  return {
    lines: [...lines.values()],
    bars: bars.filter((_, i) => !drop.has(i)),
    fixes,
    issues,
    clashes: clashes.map((c) => ({ serialKey: c.serialKey, rows: c.rows })),
    skippedSold,
    unlistedRefineries: [...unlisted].sort(),
  };
}
