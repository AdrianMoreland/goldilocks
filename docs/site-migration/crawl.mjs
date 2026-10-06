// Lists every public page and post on the old WordPress site into url-inventory.csv.
// Read-only: uses the site's public REST API, one request per 100 items.
import { writeFileSync } from 'node:fs';

const BASE = 'https://www.merriongold.ie/wp-json/wp/v2';
const UA = { 'User-Agent': 'Mozilla/5.0 (migration inventory)' };

async function all(type) {
  const rows = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${BASE}/${type}?per_page=100&page=${page}&_fields=link,slug,date,modified,title,status,parent`, { headers: UA });
    if (res.status === 400) break; // past the last page
    if (!res.ok) throw new Error(`${type} page ${page}: ${res.status}`);
    const batch = await res.json();
    rows.push(...batch.map((r) => ({ type, ...r })));
    if (page >= Number(res.headers.get('x-wp-totalpages'))) break;
  }
  return rows;
}

const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const items = [...(await all('pages')), ...(await all('posts'))];
const header = ['type', 'path', 'title', 'published', 'modified', 'decision', 'new_path', 'notes'];
const lines = items.map((r) =>
  [
    r.type === 'pages' ? 'page' : 'post',
    new URL(r.link).pathname,
    r.title.rendered.replace(/&#8211;|&#8217;|&amp;/g, (m) => ({ '&#8211;': '-', '&#8217;': "'", '&amp;': '&' })[m]),
    r.date.slice(0, 10),
    r.modified.slice(0, 10),
    '',
    '',
    '',
  ].map(csv).join(','),
);
writeFileSync(new URL('./url-inventory.csv', import.meta.url), [header.join(','), ...lines].join('\n') + '\n');
console.log(`${items.length} URLs written`);
