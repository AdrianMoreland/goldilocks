/**
 * Foreign gold coins sold by melt value: each is a specific product on the "Gold Melt" pricing row, priced from its
 * fine gold weight. Data only; `readForeignCoin` finds the coin a text names. Pure.
 */

const GRAMS_PER_TROY_OZ = 31.1035;

export interface ForeignCoin {
  /** The specific product's name (`sales_products.name`). */
  name: string;
  /** Fine gold in grams. */
  fineGrams: number;
  /** The coin a text names, from its cleaned tokens. `true` is sure, `'bare'` means the coin is clear but not its size. */
  test: (t: Tokens) => boolean | 'bare';
}

type Tokens = ReadonlySet<string>;

/** Fine gold in troy ounces as the product's `weightLabel` ("0.1867oz melt"). */
export function meltLabel(fineGrams: number): string {
  return `${(fineGrams / GRAMS_PER_TROY_OZ).toFixed(4)}oz melt`;
}

const has = (t: Tokens, ...w: string[]) => w.some((x) => t.has(x));
const num = (t: Tokens, ...n: string[]) => n.some((x) => t.has(x));

export const FOREIGN_COINS: readonly ForeignCoin[] = [
  { name: '20 French Franc', fineGrams: 5.806, test: (t) => (has(t, 'napoleon') && !num(t, '10', '100')) || (has(t, 'french') && has(t, 'franc') && num(t, '20')) },
  { name: '10 French Franc', fineGrams: 2.903, test: (t) => (has(t, 'napoleon') && num(t, '10')) || (has(t, 'french') && has(t, 'franc') && num(t, '10')) },
  { name: '100 French Franc', fineGrams: 29.03, test: (t) => (has(t, 'napoleon') && num(t, '100')) || (has(t, 'french') && has(t, 'franc') && num(t, '100')) },
  { name: '20 Swiss Franc (Vreneli)', fineGrams: 5.806, test: (t) => has(t, 'vreneli') || (has(t, 'swiss') && has(t, 'franc') && num(t, '20')) },
  { name: 'Austrian 4 Ducat', fineGrams: 13.77, test: (t) => has(t, 'ducat') && num(t, '4') },
  { name: 'Austrian 1 Ducat', fineGrams: 3.442, test: (t) => (has(t, 'ducat') && !num(t, '4') ? (num(t, '1', 'one') ? true : 'bare') : false) },
  { name: 'Austrian 100 Corona', fineGrams: 30.488, test: (t) => has(t, 'corona', 'krone', 'kronen') && num(t, '100') },
  { name: 'Austrian 20 Corona', fineGrams: 6.098, test: (t) => has(t, 'corona', 'krone', 'kronen') && num(t, '20') },
  { name: 'Austrian 10 Corona', fineGrams: 3.049, test: (t) => has(t, 'corona', 'krone', 'kronen') && num(t, '10') },
  { name: 'Mexican 50 Pesos', fineGrams: 37.5, test: (t) => has(t, 'centenario') || (has(t, 'peso') && num(t, '50')) },
  { name: 'Mexican 2.5 Pesos', fineGrams: 1.875, test: (t) => (has(t, 'dos') && has(t, 'medio')) || (has(t, 'peso') && num(t, '2.5')) },
  { name: 'South African 2 Rand', fineGrams: 7.322, test: (t) => has(t, 'rand') && !has(t, 'refinery') && num(t, '2') },
  { name: 'South African 1 Rand', fineGrams: 3.661, test: (t) => has(t, 'rand') && !has(t, 'refinery') && num(t, '1') },
  {
    name: 'US $20 Double Eagle',
    fineGrams: 30.093,
    test: (t) =>
      (has(t, 'double') && has(t, 'eagle')) ||
      has(t, 'gauden') ||
      (has(t, 'liberty') && num(t, '20', '$20')) ||
      (has(t, 'us') && num(t, '20', '$20')) ||
      num(t, '$20') ||
      (has(t, 'dollar') && num(t, '20')),
  },
  {
    name: 'US $10 Eagle',
    fineGrams: 15.046,
    test: (t) => num(t, '$10') || (has(t, 'dollar') && num(t, '10')) || (num(t, '10') && has(t, 'liberty', 'eagle')),
  },
  { name: 'US $5 Half Eagle', fineGrams: 7.523, test: (t) => num(t, '$5') || (has(t, 'dollar') && num(t, '5')) },
  { name: 'US $2.5 Quarter Eagle', fineGrams: 3.762, test: (t) => num(t, '$2.5') || (has(t, 'dollar') && num(t, '2.5')) || (has(t, 'indian') && has(t, 'head') && num(t, '2.5')) },
  { name: 'German 20 Mark', fineGrams: 7.168, test: (t) => has(t, 'mark') && (num(t, '20') || has(t, 'german')) },
  { name: 'Russian 10 Rouble', fineGrams: 7.742, test: (t) => has(t, 'rouble', 'ruble') && num(t, '10') },
  { name: 'Russian 5 Rouble', fineGrams: 3.871, test: (t) => has(t, 'rouble', 'ruble') && num(t, '5') },
  { name: 'Turkish 100 Kurush', fineGrams: 6.615, test: (t) => has(t, 'kurush', 'kurus', 'piastre') && num(t, '100') },
  { name: 'Saudi Guinea', fineGrams: 7.322, test: (t) => has(t, 'saudi') && has(t, 'guinea') },
];

/** Cleaned tokens of a name for the tests above: lower case, accents gone, plurals cut ("francs" -> "franc"). */
export function coinTokens(text: string): Set<string> {
  const stripped = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/(\d)\s+(oz|ounces?|g|grams?|kg)\b/g, '$1$2');
  const out = new Set<string>();
  for (const raw of stripped.replace(/[^a-z0-9./$]+/g, ' ').split(' ')) {
    if (!raw) continue;
    let w = raw.replace(/^\.+|\.+$/g, '');
    if (/^[a-z]{4,}s$/.test(w) && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);
    if (w) out.add(w);
  }
  return out;
}

/** The foreign coin a text names, and whether its size is clear; null when it names none. */
export function readForeignCoin(text: string): { coin: ForeignCoin; sure: boolean } | null {
  const tokens = coinTokens(text);
  let bare: ForeignCoin | null = null;
  for (const coin of FOREIGN_COINS) {
    const r = coin.test(tokens);
    if (r === true) return { coin, sure: true };
    if (r === 'bare' && !bare) bare = coin;
  }
  return bare ? { coin: bare, sure: false } : null;
}
