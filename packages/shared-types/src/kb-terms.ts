import { mapOutsideCode } from './kb-markdown';

/**
 * Words and phrases in SOP text that are explained by another SOP. The reader
 * turns the first mention of each into a link, so nobody has to know where
 * "customer safe" or "market modes" is defined. The SOP files are never
 * edited for this: links are added at display time from this list, and a test
 * checks every target against the real SOPs so a renamed heading is caught.
 */
export interface KbTerm {
  id: string;
  /** Matched as whole words/phrases, longest first. */
  phrases: string[];
  target: { slug: string; anchor?: string };
  /** Abbreviations like "VAT" or "BC" must match exactly; "net" in a sentence is not "NET". */
  caseSensitive?: boolean;
  /** The SOP doesn't exist yet; the term simply isn't linked until it does. */
  pendingSop?: boolean;
}

export const KB_TERMS: KbTerm[] = [
  { id: 'price-lock', phrases: ['price is locked', 'lock the price', 'locks the price', 'price lock', 'locked price', 'hedged', 'hedging', 'hedge'], target: { slug: 'payment-lock-and-hedge', anchor: 'core-rule' } },
  { id: 'funds-landed', phrases: ['funds have landed', 'funds landed', 'funds land', 'confirm the funds', 'confirming funds'], target: { slug: 'payment-lock-and-hedge', anchor: 'confirming-funds' } },
  { id: 'limit-orders', phrases: ['limit orders', 'limit order'], target: { slug: 'limit-orders' } },
  { id: 'customer-safe', phrases: ['customer safe', 'CST Safe'], target: { slug: 'stock-management', anchor: 'customer-safe-cst-safe' } },
  { id: 'available-vs-net', phrases: ['NET'], target: { slug: 'stock-management', anchor: 'available-vs-net' }, caseSensitive: true },
  { id: 'stock-sheet', phrases: ['stock sheet', 'Stock - IE'], target: { slug: 'stock-management', anchor: 'the-stock-sheet' } },
  { id: 'bonded-silver', phrases: ['bonded silver', 'bonded warehouse', 'in bond'], target: { slug: 'bonded-silver-storage' } },
  { id: 'scrap', phrases: ['non-standard items', 'scrap'], target: { slug: 'pricing', anchor: 'scrap-and-non-standard-items' } },
  { id: 'spot-price', phrases: ['live spot', 'spot price'], target: { slug: 'pricing', anchor: 'spot-price' } },
  { id: 'buy-price', phrases: ['buy price'], target: { slug: 'pricing', anchor: 'buy-price' } },
  { id: 'sell-price', phrases: ['sell price'], target: { slug: 'pricing', anchor: 'sell-price' } },
  { id: 'vat', phrases: ['investment gold', 'VAT'], target: { slug: 'pricing', anchor: 'vat' }, caseSensitive: true },
  { id: 'identity-check', phrases: ['identity check', 'ID check'], target: { slug: 'customer-collection', anchor: 'identity-check' } },
  { id: 'third-party', phrases: ['third-party collection'], target: { slug: 'customer-collection', anchor: 'third-party-collection' } },
  { id: 'quote-validity', phrases: ['quote validity', 'indicative'], target: { slug: 'customer-inquiry-to-quote', anchor: 'quote-validity' } },
  { id: 'paying-customer', phrases: ['paying the customer'], target: { slug: 'customer-buyback', anchor: 'paying-the-customer' } },
  { id: 'signature-tablet', phrases: ['signature tablet', 'signature capture'], target: { slug: 'systems-overview', anchor: 'customer-id-and-signatures' } },
  { id: 'hedging-platforms', phrases: ['StoneX', 'CoinInvest'], target: { slug: 'systems-overview', anchor: 'system-map' }, caseSensitive: true },
  { id: 'bc', phrases: ['Business Central', 'Zoho', 'BC'], target: { slug: 'systems-overview', anchor: 'bc-and-zoho' }, caseSensitive: true },
  { id: 'buyback', phrases: ['Buyback', 'buyback'], target: { slug: 'customer-buyback' }, caseSensitive: true },
  { id: 'kyc-aml', phrases: ['KYC', 'AML'], target: { slug: 'kyc-aml' }, caseSensitive: true },
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Whole-word matcher for one term. Global, so callers can iterate matches. */
export function termRegExp(term: KbTerm): RegExp {
  const phrases = [...term.phrases].sort((a, b) => b.length - a.length).map(escapeRegExp);
  return new RegExp(`(?<![\\w-])(?:${phrases.join('|')})(?![\\w-])`, term.caseSensitive ? 'g' : 'gi');
}

/**
 * The text of a section as it would read on screen, minus everything that
 * must never become an automatic link: code, existing links, TODO notes and
 * headings.
 */
function linkableText(markdown: string): string {
  return mapOutsideCode(markdown, (text) =>
    text
      .replace(/\[\[[^\]]*\]\]/g, ' ')
      .replace(/\[TODO:?[^\]]*\]/gi, ' ')
      .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/^#{1,6}\s.*$/gm, ' '),
  )
    .split('`')
    .filter((_, index) => index % 2 === 0)
    .join(' ');
}

/**
 * Decides, once for a whole article, which section links which term. A term
 * is linked only where it first appears — repeating a link on every mention
 * turns a page into a wall of underlines — and never to the article you are
 * already reading. `isAvailable` lets the caller drop targets that aren't in
 * the library (retired, or not written yet).
 */
export function planAutolinks(
  sections: { anchor: string; heading: string; markdown: string }[],
  currentSlug: string,
  isAvailable: (target: KbTerm['target']) => boolean,
  terms: KbTerm[] = KB_TERMS,
): Map<string, KbTerm[]> {
  const plan = new Map<string, KbTerm[]>();
  const used = new Set<string>();
  const candidates = terms.filter((term) => term.target.slug !== currentSlug && isAvailable(term.target));

  for (const section of sections) {
    if (section.anchor === 'related') continue;
    const text = linkableText(section.markdown);
    const linked: KbTerm[] = [];

    for (const term of candidates) {
      if (used.has(term.id)) continue;
      if (termRegExp(term).test(text)) {
        used.add(term.id);
        linked.push(term);
      }
    }
    if (linked.length > 0) plan.set(section.anchor, linked);
  }

  return plan;
}
