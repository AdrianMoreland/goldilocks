// Lists the old site's product categories and product pages into product-inventory.csv.
// Read-only: the category pages are public HTML and link to every product they hold.
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://www.merriongold.ie';
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (migration inventory)' } };
const categories = ['gold', 'gold-bars', 'gold-coins', 'silver', 'silver-bars', 'silver-coins',
  'platinum-palladium', 'bars-platinum-palladium', 'coins-platinum-palladium', 'copper', 'copper-bars'];

const rows = [];
const seen = new Set();
for (const cat of categories) {
  const html = await (await fetch(`${ORIGIN}/products-categories/${cat}/`, UA)).text();
  rows.push(['category', `/products-categories/${cat}/`, cat]);
  for (const [, slug] of html.matchAll(/href="https:\/\/www\.merriongold\.ie\/products\/([^"/]+)\/"/g)) {
    if (!seen.has(slug)) { seen.add(slug); rows.push(['product', `/products/${slug}/`, cat]); }
  }
}
const csv = (v) => `"${v}"`;
writeFileSync(new URL('./product-inventory.csv', import.meta.url),
  ['type,path,first_seen_in_category', ...rows.map((r) => r.map(csv).join(','))].join('\n') + '\n');
console.log(`${rows.filter((r) => r[0] === 'category').length} categories, ${seen.size} products`);
