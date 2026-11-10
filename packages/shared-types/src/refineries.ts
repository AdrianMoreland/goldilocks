/**
 * The refineries and mints seen in the data, with the spellings that stand for each. Pure. Matching ignores case,
 * punctuation and accents.
 */

export const REFINERIES: ReadonlyArray<{ refinery: string; spellings: readonly string[] }> = [
  { refinery: 'VALCAMBI SUISSE', spellings: ['Valcambi'] },
  { refinery: 'PAMP SUISSE', spellings: ['PAMP', 'PAMP Suisse', 'PAMP Fortuna', 'PAMP Lady Fortuna', 'PAMP Rosa', 'PAMP Diwali', 'PAMP Diawli'] },
  { refinery: 'ARGOR-HERAEUS', spellings: ['Argor Heraeus', 'Argor'] },
  { refinery: 'HERAEUS', spellings: ['Heareus'] },
  { refinery: 'UMICORE', spellings: [] },
  { refinery: 'METALOR', spellings: [] },
  { refinery: 'CREDIT SUISSE', spellings: [] },
  { refinery: 'PERTH MINT', spellings: ['The Perth Mint', 'Perth Mint Australia'] },
  { refinery: 'ROYAL MINT', spellings: ['Royal Mint - Star Wars'] },
  { refinery: 'BAIRD & CO', spellings: ['Baird', 'Baird & Co.', 'Baird and Co'] },
  { refinery: 'C HAFNER', spellings: ['Hafner', 'C. Hafner', 'C.Hafner', 'CHafner'] },
  { refinery: 'JOHNSON MATTHEY', spellings: [] },
  { refinery: 'MERRION GOLD', spellings: [] },
  { refinery: 'NADIR', spellings: [] },
  { refinery: 'OPM METALS', spellings: ['OPM'] },
  { refinery: 'ASSAY OFFICE', spellings: [] },
  { refinery: 'MUNZE OSTERREICH', spellings: ['Münze Österreich', 'Austrian Mint'] },
  { refinery: 'ELEMENTAL', spellings: [] },
  { refinery: 'ROYAL CANADIAN MINT', spellings: [] },
  { refinery: 'SEMPSA', spellings: [] },
  { refinery: 'RAND REFINERY', spellings: [] },
  { refinery: 'DEGUSSA', spellings: [] },
];

/** Words for "no single refinery": they resolve to null. */
const NO_REFINERY = ['Best Value (Mixed Refiners)', 'Mixed', 'Mixed/Other', 'Unknown'];

/** Upper case, accents dropped, everything but letters and digits becomes one space. */
export function refineryWords(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

const byWords = new Map<string, string>();
for (const r of REFINERIES) {
  byWords.set(refineryWords(r.refinery), r.refinery);
  for (const s of r.spellings) byWords.set(refineryWords(s), r.refinery);
}
const noRefinery = new Set(NO_REFINERY.map(refineryWords));

/** The canonical refinery for a spelling, null when the text means "no single refinery", undefined when not listed. */
export function listedRefinery(text: string): string | null | undefined {
  const w = refineryWords(text);
  if (noRefinery.has(w)) return null;
  return byWords.get(w);
}

// Longest first, so "ARGOR HERAEUS" wins over "HERAEUS".
const spellingList = [...byWords.entries()].sort((a, b) => b[0].length - a[0].length);

/** The longest listed refinery or spelling contained, as whole words, in a free text; `words` is the spelling found. */
export function refineryMatch(text: string | null | undefined): { refinery: string; words: string } | null {
  const w = ` ${refineryWords(String(text ?? ''))} `;
  for (const [words, canonical] of spellingList) if (w.includes(` ${words} `)) return { refinery: canonical, words };
  return null;
}

/** The refinery named in a free text (longest match, whole words); null when none. */
export function refineryInText(text: string | null | undefined): string | null {
  return refineryMatch(text)?.refinery ?? null;
}
