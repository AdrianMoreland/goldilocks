/**
 * Blocks: feature-specific compositions with placeholder data (a few products, four metals, a sample quote).
 * Each is a Figma component so the layouts can place instances of it.
 */

const deliverBlock = (title, desc, content, o) => place(wrapper('Blocks', title, desc, content, o));

// The per-tab accent recipe from pricing-tools/tab-theme.ts, resolved to the tints it derives.
const accentOf = (name) => {
    const text = name === 'price' ? 'price-text' : name === 'buyback' ? 'buyback-text' : name === 'primary' ? 'primary-text' : name;
    return { base: name, text, soft: soft(name, 16), textSoft: { mix: [text, 80, 'foreground'] }, on: 'ink' };
};
const metalAccent = (metal) => {
    const key = `metal-${metal.toLowerCase()}`;
    return { base: key, text: { mix: [key, 70, 'foreground'] }, soft: soft(key, 16), on: 'ink' };
};

const fieldLabel = (text) => T(text, { size: 13, weight: 600, lh: 18, c: 'muted-foreground' });
const sectionLabel = (text, a) => T(text, { size: 11, weight: 700, lh: 15, ls: 2.5, c: a.textSoft });
const pill = (kids, o = {}) => F({ dir: 'H', gap: 6, pad: o.pad ?? [10, 16], align: 'center', justify: 'center', radius: 'full', ...o }, kids);

// ── spot price card ─────────────────────────────────────────────────────────

const SPOT = {
    Gold: { price: '€3,208', change: '+€12.40', pct: '+0.39%', dir: 'up', live: '€3,214' },
    Silver: { price: '€36.42', change: '-€0.31', pct: '-0.84%', dir: 'down', live: '€36.38' },
    Platinum: { price: '€1,012', change: '+€4.10', pct: '+0.41%', dir: 'up', live: '€1,015' },
    Palladium: { price: '€948', change: '+€3.20', pct: '+0.34%', dir: 'up', live: '€951' },
};

function makeSpotCard({ metal, state, kind }) {
    const d = SPOT[metal];
    const a = metalAccent(metal);
    const frozen = state === 'frozen';
    const move = d.dir === 'up' ? { hex: STATUS.green } : { hex: STATUS.redDark };
    return F(
        {
            kind,
            name: 'Spot price card',
            w: 268,
            gap: 6,
            pad: [12, 0],
            fill: 'card-raised',
            stroke: state === 'normal' ? undefined : a.base,
            sw: 2,
            dashed: frozen,
            radius: 'xl',
            shadow: 'sm',
        },
        [
            F({ name: 'CardHeader', dir: 'H', pad: [0, 16], justify: 'between', align: 'center', fillW: true }, [
                F({ name: 'title', dir: 'H', gap: 8, align: 'center' }, [T(metal, { weight: 700, c: a.text }), Dot(8, { hex: STATUS.emerald }, { name: 'freshness' })]),
                F({ name: 'actions', dir: 'H', gap: 6, align: 'center' }, [
                    frozen ? F({ name: 'Frozen chip', dir: 'H', gap: 4, pad: [2, 6], align: 'center', fill: a.soft, radius: 'md' }, [I('snowflake', 12, a.text), T('FROZEN', { size: 11, weight: 800, lh: 14, ls: 4, c: a.text })]) : null,
                    F({ name: 'freeze', dir: 'H', pad: 8, fill: a.soft, radius: 'lg' }, [I(frozen ? 'play' : 'pause', 20, a.text)]),
                ]),
            ]),
            F({ name: 'CardContent', gap: 4, pad: [0, 16], fillW: true }, [
                T(d.price, { size: 20, weight: 700, lh: 20, name: 'price' }),
                frozen
                    ? T(`Live market now: ${d.live}`, { size: 12, lh: 16, c: 'muted-foreground' })
                    : F({ name: 'change', dir: 'H', gap: 6, align: 'center' }, [T(d.change, { size: 12, lh: 16, c: move }), T(d.pct, { size: 12, lh: 16, c: move }), I(d.dir === 'up' ? 'arrow-up' : 'arrow-down', 12, move)]),
            ]),
        ],
    );
}

reg('blocks/spot-card', async () => {
    const set = await variantSet(
        'blocks/spot-card',
        'Spot price card',
        [
            { name: 'metal', values: ['Gold', 'Silver', 'Platinum', 'Palladium'] },
            { name: 'state', values: ['normal', 'active', 'frozen'] },
        ],
        (c) => makeSpotCard({ ...c, kind: 'component' }),
    );
    deliverBlock('Spot price card', 'dashboard/components/section-cards.tsx · active = selected metal, frozen = a typed override', [set]);
});

// ── spot price chart ────────────────────────────────────────────────────────

function chartSeries(w, h, phase, drift) {
    const pts = [];
    const n = 36;
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const y = 0.5 - 0.22 * Math.sin(t * 6.3 + phase) - 0.12 * Math.sin(t * 15 + phase * 2) - drift * t;
        pts.push([Math.round(t * w), Math.round(y * h)]);
    }
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
    return { line, area: `${line} L ${w} ${h} L 0 ${h} Z` };
}

reg('blocks/spot-chart', async () => {
    const W = 800;
    const H = 150;
    const { line, area } = chartSeries(W, H, 0.4, 0.12);
    const grid = [0, 1, 2, 3].map((i) => Rect({ name: 'grid', w: W, h: 1, x: 0, y: Math.round((i * H) / 3), fill: 'border', opacity: 0.8 }));
    const plot = F({ name: 'plot', abs: true, w: W, h: H + 8 }, [
        ...grid,
        Path(area, { name: 'area', fill: { hex: '#D4A017', a: 0.18 }, x: 0, y: 0 }),
        Path(line, { name: 'line', stroke: 'metal-gold', sw: 2, x: 0, y: 0 }),
    ]);
    const months = ['01 Sep', '08 Sep', '15 Sep', '22 Sep', '29 Sep', '06 Oct'];
    const toggle = (label, i) =>
        F({ name: label, dir: 'H', h: 32, pad: [0, 12], align: 'center', justify: 'center', fill: i === 1 ? 'primary' : 'background', stroke: i === 1 ? 'primary' : 'border', sides: undefined }, [T(label, { weight: 500, c: i === 1 ? 'ink' : 'foreground' })]);
    const range = F({ name: 'ToggleGroup', dir: 'H', radius: 'md', clip: true, shadow: 'xs' }, ['1W', '1M', '3M', '1Y'].map(toggle));
    const c = F({ kind: 'component', name: 'Spot price chart', gap: 8, pad: [12, 0], w: 840, fill: 'card', stroke: 'border', radius: 'xl', shadow: 'sm' }, [
        F({ name: 'CardHeader', dir: 'H', pad: [0, 16], justify: 'between', align: 'center', fillW: true }, [
            F({ name: 'title', dir: 'H', gap: 4, align: 'center' }, [F({ name: 'collapse', dir: 'H', w: 28, h: 28, align: 'center', justify: 'center' }, [I('chevron-down', 16, 'foreground')]), T('Spot price history', { weight: 600, lh: 16, size: 16 })]),
            F({ name: 'CardAction', dir: 'H', gap: 8, align: 'center' }, [makeButton({ variant: 'secondary', size: 'sm', label: 'All Metals' }), makeButton({ variant: 'default', size: 'sm', label: 'Absolute €' }), range]),
        ]),
        F({ name: 'CardContent', pad: [0, 20], gap: 6, fillW: true }, [plot, F({ name: 'x axis', dir: 'H', justify: 'between', fillW: true }, months.map((m) => T(m, { size: 12, c: 'muted-foreground' })))]),
    ]);
    masterize('blocks/spot-chart', c);
    deliverBlock('Spot price chart', 'dashboard/components/chart-area-interactive.tsx · illustrative curve, not market data', [c]);
});

// ── product table ───────────────────────────────────────────────────────────

const COLS = [
    { key: 'select', w: 28 },
    { key: 'name', label: 'Product', w: 210, grow: true },
    { key: 'marketValue', label: 'Market Value', w: 112 },
    { key: 'priceSell', label: 'Price', w: 84 },
    { key: 'spreadSell', label: 'Premium', w: 88 },
    { key: 'priceBuy', label: 'Buyback', w: 90 },
    { key: 'spreadBuy', label: 'Discount', w: 88 },
    { key: 'priceSellVatExcl', label: 'Price ex. VAT', w: 112 },
    { key: 'weight', label: 'Weight', w: 80 },
];
const PRODUCTS = [
    { group: 'Bars', name: '10 g Gold Bar', mv: '€1,031', sell: '€1,092', sp: '+5.9%', buy: '€1,012', sd: '-1.8%', ex: '€888', wt: '10 g' },
    { name: '1 oz Gold Bar', mv: '€3,208', sell: '€3,331', sp: '+3.8%', buy: '€3,152', sd: '-1.7%', ex: '€2,708', wt: '31.1 g' },
    { name: '100 g Gold Bar', mv: '€10,314', sell: '€10,468', sp: '+1.5%', buy: '€10,171', sd: '-1.4%', ex: '€8,511', wt: '100 g' },
    { group: 'Coins', name: '1 oz Gold Britannia', mv: '€3,208', sell: '€3,372', sp: '+5.1%', buy: '€3,144', sd: '-2.0%', ex: '€2,741', wt: '31.1 g' },
    { name: '1/2 oz Gold Krugerrand', mv: '€1,604', sell: '€1,728', sp: '+7.7%', buy: '€1,566', sd: '-2.4%', ex: '€1,405', wt: '15.6 g' },
    { name: '1 oz Silver Maple Leaf', mv: '€36', sell: '€46', sp: '+26.4%', buy: '€33', sd: '-8.0%', ex: '€37', wt: '31.1 g' },
    { name: '1 oz Silver Britannia', mv: '€36', sell: '€45', sp: '+24.7%', buy: '€33', sd: '-8.3%', ex: '€37', wt: '31.1 g' },
    { name: '1 oz Platinum Maple', mv: '€1,012', sell: '€1,094', sp: '+8.1%', buy: '€968', sd: '-4.3%', ex: '€889', wt: '31.1 g' },
];

function makeSpreadBadge(label, tone) {
    return makeBadge({ variant: 'outline', label, size: 12, text: tone === 'price' ? 'price-text' : 'buyback-text', fill: soft(tone, 12), stroke: { mix: [tone, 40, 'background'] }, name: 'SpreadBadge' });
}

function productRow(p) {
    const cell = (text, i, o = {}) => T(text, { ...(COLS[i].grow ? { fillW: true } : { w: COLS[i].w }), size: 16, lh: 24, weight: o.weight ?? 400, c: o.c ?? 'foreground', name: COLS[i].key });
    const wrapCell = (node, i) => F({ name: COLS[i].key, w: COLS[i].w, dir: 'H', align: 'center' }, [node]);
    return F({ name: 'ProductRow', dir: 'H', gap: 0, pad: [6, 12], align: 'center', stroke: 'border', sides: 'b', fillW: true }, [
        wrapCell(makeCheckbox(false), 0),
        cell(p.name, 1),
        cell(p.mv, 2, { c: 'muted-foreground', weight: 600 }),
        cell(p.sell, 3, { c: 'price-text', weight: 600 }),
        wrapCell(makeSpreadBadge(p.sp, 'price'), 4),
        cell(p.buy, 5, { c: 'buyback-text', weight: 600 }),
        wrapCell(makeSpreadBadge(p.sd, 'buyback'), 6),
        cell(p.ex, 7, { c: 'muted-foreground' }),
        cell(p.wt, 8, { c: 'muted-foreground' }),
    ]);
}

function makeProductTable({ kind, rows = PRODUCTS, w }) {
    const head = F({ name: 'TableHeader', dir: 'H', pad: [6, 12], align: 'center', fill: 'muted', fillW: true }, COLS.map((c, i) => (i === 0 ? F({ name: 'select', dir: 'H', w: c.w, align: 'center' }, [makeCheckbox(false)]) : T(c.label, { ...(c.grow ? { fillW: true } : { w: c.w }), size: 16, lh: 24, weight: 700, name: c.key }))));
    const body = [];
    for (const p of rows) {
        if (p.group) body.push(F({ name: 'GroupRow', dir: 'H', pad: [6, 12], fill: { mix: ['muted', 40, 'background'] }, fillW: true }, [T(p.group.toUpperCase(), { size: 12, weight: 600, ls: 2.5, c: 'muted-foreground' })]));
        body.push(productRow(p));
    }
    return F({ kind, name: 'Product table', w, clip: true, stroke: 'border', radius: 'lg' }, [head, ...body]);
}

reg('blocks/product-table', async () => {
    const t = makeProductTable({ kind: 'component' });
    masterize('blocks/product-table', t);
    deliverBlock('Product table', 'dashboard/components/table/product-table-body.tsx, product-columns.tsx · Price is teal, Buyback raspberry', [t]);
});

reg('blocks/product-filter-bar', async () => {
    const faceted = (label) =>
        F({ name: `${label} filter`, dir: 'H', gap: 8, pad: [0, 12], h: 32, align: 'center', fill: 'background', stroke: 'border', dashed: true, radius: 'md', shadow: 'xs' }, [I('circle-plus', 16, 'foreground'), T(label, { weight: 500 })]);
    const search = F({ name: 'Search', dir: 'H', gap: 8, w: 320, h: 32, pad: [0, 8], align: 'center', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [I('search', 16, 'muted-foreground'), T('Search name or SKU… (/)', { c: 'muted-foreground' })]);
    const bar = F({ kind: 'component', name: 'Product filter bar', dir: 'H', gap: 8, align: 'center', w: 960 }, [
        search,
        faceted('Type'),
        faceted('Price'),
        F({ name: 'columns', dir: 'H', fillW: true, justify: 'end' }, [makeButton({ variant: 'outline', size: 'sm', icon: 'columns-2', label: 'Customize Columns' })]),
    ]);
    masterize('blocks/product-filter-bar', bar);
    deliverBlock('Product filter bar', 'dashboard/components/table/product-filter-bar.tsx', [bar]);
});

// ── banner and freshness ────────────────────────────────────────────────────

reg('blocks/market-mode-banner', async () => {
    const LABELS = { weekend: 'WEEKEND', volatile: 'VOLATILE', shortage: 'METAL SHORTAGE' };
    const set = await variantSet('blocks/market-mode-banner', 'Market mode banner', [{ name: 'mode', values: ['weekend', 'volatile', 'shortage'] }], (c) =>
        F({ kind: 'component', name: 'Market mode banner', dir: 'H', gap: 8, w: 1184, pad: [6, 16], align: 'center', justify: 'center', fill: 'foreground' }, [
            I('activity', 16, 'background'),
            T(`${LABELS[c.mode]} MODE ON`, { weight: 600, ls: 2.5, c: 'background' }),
            T('— Trade quotes use adjusted premiums/discounts; the price grid shows standard prices.', { c: 'background', opacity: 0.8 }),
            T('Change', { weight: 400, underline: true, c: 'background' }),
        ]),
    );
    deliverBlock('Market mode banner', 'dashboard/components/market-mode-banner.tsx · shown only while a mode is on', [set]);
});

reg('blocks/freshness-indicator', async () => {
    const set = await variantSet('blocks/freshness-indicator', 'Price freshness', [{ name: 'state', values: ['live', 'cached', 'stale'] }], (c) => {
        const warn = c.state !== 'live';
        const dot = { hex: warn ? STATUS.amber : STATUS.emerald };
        const text = { live: 'Live · 14:02:31', cached: 'Cache · 14:02:31', stale: 'Live · 13:21:07' }[c.state];
        return F({ kind: 'component', name: 'Price freshness', dir: 'H', gap: 6, pad: [0, 4], align: 'center' }, [Dot(8, dot), T(text, { size: 12, lh: 16, c: warn ? { hex: '#b45309' } : 'muted-foreground' })]);
    });
    const notice = F({ name: 'Stale prices notice', dir: 'H', gap: 6, align: 'center' }, [I('triangle-alert', 16, { hex: STATUS.amber }), T('Prices may be out of date', { size: 12, c: { hex: '#b45309' } })]);
    deliverBlock('Price freshness', 'data-freshness-indicator.tsx, stale-prices-notice.tsx · amber is never silent', [cap('INDICATOR'), set, cap('STALE NOTICE'), notice]);
});

// ── trade tab, melt calculator, tools panel ─────────────────────────────────

const tabCard = (kids) => F({ name: 'card', gap: 10, pad: 14, fill: 'card', stroke: 'border', radius: 24, fillW: true }, kids);

function spotEditor(label, a) {
    return F({ name: 'ToolSpotEditor', gap: 10, fillW: true }, [
        fieldLabel(label),
        F({ name: 'controls', dir: 'H', gap: 8, align: 'center', fillW: true }, [
            makeInput({ w: 112, h: 40, radius: 12, value: '€3,208.00' }),
            F({ name: 'slider', abs: true, w: 110, h: 16 }, [Rect({ name: 'track', w: 110, h: 4, x: 0, y: 6, fill: 'muted', radius: 'full' }), Dot(14, a.base, { name: 'thumb', x: 48, y: 1 })]),
            pill([T('Reset', { size: 12, weight: 700, lh: 16 })], { pad: [8, 12], stroke: 'border', fill: 'background' }),
        ]),
        T('Follows the Gold card. Type a price to detach.', { size: 11, lh: 15, c: 'muted-foreground', fillW: true }),
    ]);
}

function itemRow(name, qty, pct, a) {
    const small = (text, w) => F({ name: 'field', dir: 'H', w, h: 32, align: 'center', justify: 'center', fill: 'background', radius: 'lg' }, [T(text, { size: 12, lh: 16 })]);
    return F({ name: 'item', dir: 'H', gap: 6, pad: [6, 6, 6, 10], align: 'center', fill: { mix: ['muted', 40, 'background'] }, radius: 16, fillW: true }, [
        Dot(8, a.base),
        F({ name: 'product', dir: 'H', h: 32, pad: [0, 12], align: 'center', fill: 'background', radius: 'lg', fillW: true }, [T(name, { size: 12, lh: 16, fillW: true })]),
        small(qty, 44),
        small(pct, 56),
        F({ name: 'remove', dir: 'H', w: 28, h: 28, align: 'center', justify: 'center', radius: 'full' }, [I('x', 14, 'muted-foreground')]),
    ]);
}

function resultHighlight(label, value, a) {
    return F({ name: 'ResultHighlight', dir: 'H', pad: [14, 16], align: 'center', justify: 'between', fill: a.soft, radius: 16, fillW: true }, [
        T(label, { size: 13, weight: 600, lh: 18, c: a.textSoft }),
        T(value, { size: 20, weight: 800, lh: 24, c: a.text }),
    ]);
}

const resultLine = (left, sub, right) =>
    F({ name: 'line', dir: 'H', justify: 'between', align: 'center', fillW: true }, [
        F({ name: 'text', gap: 2 }, [T(left, { weight: 500 }), sub ? T(sub, { size: 12, lh: 16, c: 'muted-foreground' }) : null]),
        T(right, { weight: 600 }),
    ]);
const sumLine = (left, right) => F({ name: 'sum', dir: 'H', justify: 'between', fillW: true }, [T(left), T(right, { weight: 500 })]);
const wideButton = (icon, label) => pill([I(icon, 16, 'foreground'), T(label, { weight: 700 })], { pad: [10, 16], stroke: 'border', fill: 'card', fillW: true });

function makeTradeTab(side, kind) {
    const buying = side === 'price';
    const a = accentOf(side);
    return F({ kind, name: 'Trade tab', gap: 16, pad: [0, 16], w: 384 }, [
        F({ name: 'mode row', dir: 'H', gap: 8, align: 'center', fillW: true }, [
            F({ name: 'direction', gap: 2, pad: [10, 14], align: 'center', justify: 'center', fill: a.base, radius: 'full', fillW: true }, [
                T(buying ? 'Price' : 'Buyback', { size: 16, weight: 800, lh: 20, c: a.on }),
                F({ name: 'other', dir: 'H', gap: 4, align: 'center' }, [I('arrow-left-right', 12, a.on), T(buying ? 'Buyback' : 'Price', { size: 11, weight: 600, lh: 14, c: a.on })]),
            ]),
            pill([I('flame', 16, 'foreground'), T('Melt', { size: 13, weight: 700, lh: 18 })], { pad: [10, 16], stroke: 'border', fill: 'card' }),
        ]),
        tabCard([spotEditor('Gold spot price', a)]),
        F({ name: 'Items', gap: 8, fillW: true }, [
            fieldLabel('Items'),
            F({ name: 'items', gap: 6, fillW: true }, [itemRow('1 oz Gold Britannia', '2', buying ? '5.10' : '2.00', a), itemRow('1/2 oz Gold Krugerrand', '4', buying ? '7.70' : '2.40', a)]),
            pill([I('plus', 16, a.text), T('Add item', { weight: 700, c: a.text })], { pad: [10, 16], stroke: a.base, sw: 1.5, dashed: true, fillW: true, radius: 16 }),
        ]),
        F({ name: 'Results', gap: 8, fillW: true }, [
            sectionLabel('RESULTS', a),
            resultLine('2 × 1 oz Gold Britannia', '62.2 g · 5.10%', buying ? '€6,744' : '€6,288'),
            resultLine('4 × 1/2 oz Gold Krugerrand', '62.4 g · 7.70%', buying ? '€6,912' : '€6,264'),
            sumLine('Total weight', '124.6 g'),
            sumLine('Avg €/g', buying ? '€109.4' : '€100.8'),
            resultHighlight(buying ? 'Total price to customer' : 'Total buyback to customer', buying ? '€13,656' : '€12,552', a),
            wideButton('table-2', 'Easy Copy'),
            wideButton('message-square', 'Customer message'),
        ]),
    ]);
}

reg('blocks/trade-tab', async () => {
    const set = await variantSet('blocks/trade-tab', 'Trade tab', [{ name: 'side', values: ['price', 'buyback'] }], (c) => makeTradeTab(c.side, 'component'));
    deliverBlock('Trade tab', 'pricing-tools/trade-tab.tsx, tab-widgets.tsx · Price = teal, Buyback = raspberry', [set]);
});

reg('blocks/melt-calculator', async () => {
    const a = accentOf('price');
    const c = F({ kind: 'component', name: 'Melt calculator', gap: 16, pad: [0, 16], w: 384 }, [
        F({ name: 'inputs', gap: 10, pad: 14, fill: 'card', stroke: 'border', radius: 24, fillW: true }, [
            fieldLabel('Weight (g)'),
            makeInput({ fillW: true, h: 40, radius: 12, value: '25' }),
            fieldLabel('Category'),
            F({ name: 'select', dir: 'H', h: 40, pad: [0, 12], align: 'center', justify: 'between', fill: 'background', stroke: 'border', radius: 12, shadow: 'xs', fillW: true }, [T('Jewellery 9ct'), I('chevron-down', 16, 'muted-foreground')]),
        ]),
        tabCard([spotEditor('Gold spot price', a)]),
        F({ name: 'Results', gap: 8, fillW: true }, [sectionLabel('RESULTS', a), sumLine('Spot per gram', '€103.16'), sumLine('Market value', '€2,579.00'), resultHighlight('Estimated payout', '€1,030', a)]),
    ]);
    masterize('blocks/melt-calculator', c);
    deliverBlock('Melt calculator', 'pricing-tools/trade-tab.tsx · MeltPanel', [c]);
});

reg('blocks/tools-panel', async () => {
    const trade = await use('blocks/trade-tab', { side: 'price' }, { name: 'Trade tab' });
    const c = F({ kind: 'component', name: 'Pricing tools panel', w: 384, h: 820, fill: 'card', stroke: 'border', sides: 'l', clip: true }, [
        F({ name: 'header', dir: 'H', gap: 8, pad: 16, justify: 'between', align: 'start', stroke: 'border', sides: 'b', fillW: true }, [
            F({ name: 'titles' }, [T('Pricing Tools', { s: 'h4' }), T('Gold', { s: 'muted', c: 'muted-foreground' })]),
            F({ name: 'settings', dir: 'H', w: 32, h: 32, align: 'center', justify: 'center', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [I('settings', 16, 'foreground')]),
        ]),
        F({ name: 'body', gap: 16, pad: [16, 0], fillW: true, fillH: true, clip: true }, [F({ name: 'tabs', pad: [0, 16], fillW: true }, [makeTabs({ labels: ['Product', 'Trade', 'Portfolio', 'Calculators'], active: 1, pill: true })]), trade]),
    ]);
    masterize('blocks/tools-panel', c);
    deliverBlock('Pricing tools panel', 'pricing-tools/pricing-tools-panel.tsx · 384 px wide; the Trade tab is an instance of the Trade tab block', [c]);
});

// ── sign-in form ────────────────────────────────────────────────────────────

reg('blocks/sign-in-form', async () => {
    const set = await variantSet('blocks/sign-in-form', 'Sign-in form', [{ name: 'state', values: ['default', 'error', 'submitting'] }], (c) =>
        F({ kind: 'component', name: 'Sign-in form', gap: 24, pad: [24, 0], w: 384, fill: 'card', stroke: 'border', radius: 'xl', shadow: 'sm' }, [
            F({ name: 'CardHeader', gap: 6, pad: [0, 24], align: 'center', fillW: true }, [
                T('Merrion Gold Pricing Workbook', { size: 20, weight: 600, lh: 20, align: 'CENTER', fillW: true }),
                T('Sign in with your staff account', { c: 'muted-foreground', align: 'CENTER', fillW: true }),
            ]),
            F({ name: 'CardContent', gap: 16, pad: [0, 24], fillW: true }, [
                F({ name: 'Email', gap: 8, fillW: true }, [makeLabel('Email'), makeInput({ fillW: true, placeholder: 'you@example.com' })]),
                F({ name: 'Password', gap: 8, fillW: true }, [makeLabel('Password'), makeInput({ fillW: true, value: '••••••••' })]),
                c.state === 'error' ? T('Invalid email or password.', { c: 'destructive', fillW: true }) : null,
                makeButton({ label: c.state === 'submitting' ? 'Signing in…' : 'Sign in', fillW: true }),
            ]),
        ]),
    );
    deliverBlock('Sign-in form', 'app/auth/sign-in/components/login-form-1.tsx', [set]);
});

// ── admin: system health ────────────────────────────────────────────────────

function makePanel({ title, description, action, body, w = 520, kind, name }) {
    return F({ kind, name: name ?? 'Panel', gap: 12, pad: 16, w, fill: 'card', stroke: 'border', radius: 'xl' }, [
        F({ name: 'header', dir: 'H', gap: 12, justify: 'between', align: 'start', fillW: true }, [
            F({ name: 'titles', gap: 2, fillW: true }, [T(title, { size: 14, weight: 600 }), description ? T(description, { size: 12, c: 'muted-foreground', fillW: true }) : null]),
            action,
        ]),
        ...body,
    ]);
}

reg('blocks/system-health', async () => {
    const TONE = {
        normal: { word: 'All systems normal', fg: '#047857', c: STATUS.emerald },
        attention: { word: '1 check needs attention', fg: '#b45309', c: STATUS.amber },
        down: { word: '1 check is down', fg: '#b91c1c', c: STATUS.red },
    };
    const set = await variantSet('blocks/system-health', 'System health', [{ name: 'state', values: ['normal', 'attention', 'down'] }], (c) => {
        const t = TONE[c.state];
        const pillOf = F({ name: 'status', dir: 'H', pad: [4, 10], radius: 'full', fill: { hex: t.c, a: 0.1 }, stroke: { hex: t.c, a: 0.3 } }, [T(t.word, { size: 12, weight: 700, c: { hex: t.fg } })]);
        const item = (label, status, detail, dot) =>
            F({ name: label, dir: 'H', gap: 12, pad: [10, 0], align: 'start', stroke: 'border', sides: 'b', fillW: true }, [
                F({ name: 'dot', pad: [6, 0, 0, 0] }, [Dot(8, { hex: dot })]),
                F({ name: 'text', gap: 2, fillW: true }, [
                    F({ name: 'title', dir: 'H', gap: 4 }, [T(label, { weight: 500 }), T(`· ${status}`, { c: 'muted-foreground' })]),
                    T(detail, { size: 12, c: 'muted-foreground', fillW: true }),
                ]),
            ]);
        const worst = c.state === 'normal' ? ['Up', STATUS.emerald] : c.state === 'attention' ? ['Degraded', STATUS.amber] : ['Down', STATUS.red];
        return makePanel({
            kind: 'component',
            name: 'System health',
            title: 'System health',
            description: 'production · API up 3d 4h · Node 22.11.0 · Assistant on',
            action: pillOf,
            w: 720,
            body: [
                F({ name: 'checks', dir: 'H', gap: 24, fillW: true }, [
                    F({ name: 'left', fillW: true }, [item('Database', 'Up', 'Query took 12 ms', STATUS.emerald), item('Redis', 'Up', '3 ms round trip', STATUS.emerald)]),
                    F({ name: 'right', fillW: true }, [item('Memory', 'Up', '214 MB of 1,024 MB heap', STATUS.emerald), item('Price feed', worst[0], c.state === 'normal' ? 'Last fetch 4 min ago' : c.state === 'attention' ? 'Last fetch 41 min ago' : 'No fetch for 3 h 10 min', worst[1])]),
                ]),
            ],
        });
    });
    deliverBlock('System health panel', 'app/admin/components/overview/health-panel.tsx', [set]);
});

// ── dialogs ─────────────────────────────────────────────────────────────────

reg('blocks/add-product-dialog', async () => {
    const field = (label, value, o = {}) => F({ name: label, gap: 6, fillW: true }, [T(label, { size: 12, weight: 500, lh: 16 }), makeInput({ fillW: true, value, state: o.state })]);
    const two = (a, b) => F({ name: 'pair', dir: 'H', gap: 12, fillW: true }, [a, b]);
    const d = makeDialog({
        title: 'Add product',
        description: 'Create a new product in the catalogue.',
        confirm: 'Add product',
        w: 520,
        kind: 'component',
        body: F({ name: 'fields', gap: 12, fillW: true }, [
            two(field('Name', '1 oz Gold Britannia'), field('SKU', 'GB-1OZ-BRIT')),
            two(field('Type', 'Coin'), field('Metal', 'Gold')),
            two(field('Weight (g)', '31.10'), field('Stock', '12')),
            two(field('Premium % (Price)', '5.10'), field('Discount % (Buyback)', '2.00')),
            field('VAT %', '0'),
        ]),
    });
    masterize('blocks/add-product-dialog', d);
    deliverBlock('Add product dialog', 'dashboard/components/table/add-product-dialog.tsx, product-form.tsx', [d]);
});

reg('blocks/delete-product-dialog', async () => {
    const d = makeDialog({
        title: 'Delete 1 oz Gold Britannia?',
        description: 'GB-1OZ-BRIT will be hidden from the table, the pricing tools and every quote. You can restore it later from Admin panel → Deleted products.',
        confirm: 'Delete product',
        destructive: true,
        w: 460,
        kind: 'component',
    });
    masterize('blocks/delete-product-dialog', d);
    deliverBlock('Delete product dialog', 'dashboard/components/table/delete-product-dialog.tsx', [d]);
});
