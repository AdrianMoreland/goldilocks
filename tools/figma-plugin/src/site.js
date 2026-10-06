/**
 * Site: the public website's components (apps/site/app/components), drawn with the same tokens and molecules as the
 * staff app. Each is a Figma component so store pages can be composed from instances of them. The text layers carry
 * names (name, meta, price ...) so a spec can override them; the library export lists them.
 */

const deliverSite = (title, desc, content, o) => place(wrapper('Site', title, desc, content, o));

const siteSelectTrigger = (text, w = 240) =>
    F({ name: 'SelectTrigger', dir: 'H', w, h: 36, pad: [0, 12], align: 'center', justify: 'between', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [
        T(text, { c: 'foreground', name: 'value' }),
        I('chevron-down', 16, 'muted-foreground'),
    ]);

/** The quantity stepper: minus and plus buttons around a small field. */
function siteStepper(disabled) {
    return F({ name: 'QuantityStepper', dir: 'H', gap: 8, align: 'center', opacity: disabled ? 0.5 : undefined }, [
        makeButton({ variant: 'outline', size: 'sm', label: '−', name: 'Decrease' }),
        F({ name: 'Quantity', dir: 'H', w: 48, h: 32, align: 'center', justify: 'center', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [T('1', { weight: 500, name: 'quantity' })]),
        makeButton({ variant: 'outline', size: 'sm', label: '+', name: 'Increase' }),
    ]);
}

const SITE_STOCK = {
    'in-stock': { label: 'In stock · Dublin', variant: 'secondary' },
    'supplier-order': { label: 'Supplier order · 7 to 10 days', variant: 'outline' },
    unavailable: { label: 'Unavailable', variant: 'outline' },
};

const siteAvailability = (stock) => makeBadge({ variant: SITE_STOCK[stock].variant, label: SITE_STOCK[stock].label, name: 'Availability' });

/** The price and price per gram, or the unavailable notice. */
function sitePrice(price, o = {}) {
    if (price === 'unavailable') return T('Price unavailable right now', { c: 'muted-foreground', name: 'price' });
    return F({ name: 'Price', dir: 'H', gap: 8, align: 'baseline' }, [
        T('€3,849', { size: o.size ?? 24, lh: o.lh ?? 28, weight: 600, c: 'price-text', name: 'price' }),
        T('€123.76 per g', { size: 14, c: 'muted-foreground', name: 'perGram' }),
    ]);
}

const siteDisabled = (c) => c.stock === 'unavailable' || c.price === 'unavailable';

reg('site/product-card', async () => {
    const set = await variantSet(
        'site/product-card',
        'Product card',
        [
            { name: 'stock', values: ['in-stock', 'supplier-order', 'unavailable'] },
            { name: 'price', values: ['live', 'unavailable'] },
        ],
        (c) =>
            F({ kind: 'component', name: 'Product card', w: 300, fill: 'card', stroke: 'border', radius: 'xl', shadow: 'sm', clip: true }, [
                F({ name: 'Image', h: 160, fillW: true, fill: 'muted', align: 'center', justify: 'center' }, [T('Product image', { c: 'muted-foreground', name: 'image' })]),
                F({ name: 'Body', gap: 8, pad: 16, fillW: true }, [
                    siteAvailability(c.stock),
                    T('Britannia 1 oz Gold Coin', { s: 'large', fillW: true, name: 'name' }),
                    T('31.1 g · 999.9 · The Royal Mint', { c: 'muted-foreground', fillW: true, name: 'meta' }),
                    sitePrice(c.price),
                    F({ name: 'Actions', dir: 'H', gap: 8, align: 'center', fillW: true }, [
                        siteStepper(siteDisabled(c)),
                        F({ name: 'Add to cart', dir: 'H', h: 36, pad: [0, 16], fillW: true, align: 'center', justify: 'center', fill: 'primary', radius: 'md', opacity: siteDisabled(c) ? 0.5 : undefined }, [
                            T('Add to cart', { weight: 500, c: 'ink', name: 'label' }),
                        ]),
                    ]),
                    makeButton({ variant: 'link', size: 'sm', label: 'Details', name: 'Details' }),
                ]),
            ]),
    );
    deliverSite('Product card', 'apps/site/app/components/product-card.tsx · image, availability, name, price, quantity, Add to cart', [set]);
});

reg('site/product-row', async () => {
    const set = await variantSet(
        'site/product-row',
        'Product row',
        [
            { name: 'stock', values: ['in-stock', 'supplier-order', 'unavailable'] },
            { name: 'price', values: ['live', 'unavailable'] },
        ],
        (c) =>
            F({ kind: 'component', name: 'Product row', dir: 'H', gap: 16, w: 1120, pad: [12, 16], align: 'center', stroke: 'border', sides: 'b', fill: 'card' }, [
                F({ name: 'Thumbnail', w: 56, h: 56, fill: 'muted', radius: 'md', align: 'center', justify: 'center' }, [T('img', { size: 12, c: 'muted-foreground', name: 'image' })]),
                F({ name: 'Name', gap: 2, w: 320 }, [T('Britannia 1 oz Gold Coin', { weight: 500, name: 'name' }), T('31.1 g · 999.9 · The Royal Mint', { c: 'muted-foreground', name: 'meta' })]),
                F({ name: 'Availability', w: 200 }, [siteAvailability(c.stock)]),
                F({ name: 'Price column', w: 120, gap: 2 }, [
                    c.price === 'unavailable'
                        ? T('Unavailable', { size: 14, c: 'muted-foreground', name: 'price' })
                        : T('€3,849', { weight: 600, c: 'price-text', name: 'price' }),
                    c.price === 'unavailable' ? null : T('€123.76 per g', { size: 14, c: 'muted-foreground', name: 'perGram' }),
                ]),
                F({ name: 'Spacer', dir: 'H', fillW: true }),
                siteStepper(siteDisabled(c)),
                makeButton({ variant: 'default', size: 'sm', label: 'Add to cart', name: 'Add to cart' }),
                makeButton({ variant: 'link', size: 'sm', label: 'Details', name: 'Details' }),
            ]),
    );
    deliverSite('Product row', 'apps/site/app/components/product-row.tsx · the compact table view of the store', [set]);
});

reg('molecules/range-slider', async () => {
    const c = F({ kind: 'component', name: 'Range slider', abs: true, w: 240, h: 16 }, [
        Rect({ name: 'track', w: 240, h: 6, x: 0, y: 5, fill: 'muted', radius: 'full' }),
        Rect({ name: 'range', w: 150, h: 6, x: 40, y: 5, fill: 'primary', radius: 'full' }),
        Dot(16, 'background', { name: 'thumb min', x: 32, y: 0, stroke: 'primary', sw: 1 }),
        Dot(16, 'background', { name: 'thumb max', x: 182, y: 0, stroke: 'primary', sw: 1 }),
    ]);
    masterize('molecules/range-slider', c);
    deliver('Range slider', 'packages/ui/src/range-slider.tsx · two thumbs, for a price range', [c]);
});

reg('site/store-filters', async () => {
    const group = (title, labels, checkedIndex) =>
        F({ name: title, gap: 8, fillW: true }, [
            T(title, { weight: 600, name: 'heading' }),
            ...labels.map((label, i) => F({ name: label, dir: 'H', gap: 8, align: 'center' }, [makeCheckbox(i === checkedIndex), T(label, { name: 'option' })])),
        ]);
    const panel = F({ kind: 'component', name: 'Store filters', w: 260, gap: 16, pad: 16, fill: 'card', stroke: 'border', radius: 'xl' }, [
        T('FILTERS', { size: 12, weight: 600, ls: 10, c: 'muted-foreground', name: 'title' }),
        group('Metal', ['Gold', 'Silver', 'Platinum', 'Palladium', 'Copper'], 0),
        Line({ fillW: true, name: 'separator' }),
        group('Type', ['Coins', 'Bars'], 0),
        Line({ fillW: true, name: 'separator' }),
        F({ name: 'Price range', gap: 8, fillW: true }, [
            T('Price range', { weight: 600, name: 'heading' }),
            F({ name: 'range slider', abs: true, w: 228, h: 16 }, [
                Rect({ name: 'track', w: 228, h: 6, x: 0, y: 5, fill: 'muted', radius: 'full' }),
                Rect({ name: 'range', w: 228, h: 6, x: 0, y: 5, fill: 'primary', radius: 'full' }),
                Dot(16, 'background', { name: 'thumb min', x: 0, y: 0, stroke: 'primary', sw: 1 }),
                Dot(16, 'background', { name: 'thumb max', x: 212, y: 0, stroke: 'primary', sw: 1 }),
            ]),
            F({ name: 'Range labels', dir: 'H', justify: 'between', fillW: true }, [T('€100', { c: 'muted-foreground', name: 'min' }), T('€15,000', { c: 'muted-foreground', name: 'max' })]),
        ]),
        Line({ fillW: true, name: 'separator' }),
        F({ name: 'Collect from', gap: 8, fillW: true }, [T('Collect from', { weight: 600, name: 'heading' }), siteSelectTrigger('Any branch', 228)]),
        makeButton({ variant: 'ghost', size: 'sm', label: 'Clear all', name: 'Clear all' }),
    ]);
    masterize('site/store-filters', panel);
    deliverSite('Store filters', 'apps/site/app/components/store-filters.tsx · metal, type, price range, collect from', [panel]);
});

reg('site/price-ticker', async () => {
    const TICKS = ['Gold €3,707 +0.50%', 'Silver €55 +0.20%', 'Platinum €1,512 -1.00%', 'Palladium €1,034 -1.20%'];
    const set = await variantSet('site/price-ticker', 'Price ticker', [{ name: 'state', values: ['live', 'loading', 'stale'] }], (c) =>
        F({ kind: 'component', name: 'Price ticker', dir: 'H', gap: 24, w: 1200, pad: [8, 24], align: 'center', fill: 'foreground' },
            c.state === 'live'
                ? TICKS.map((t) => T(t, { size: 12, weight: 500, c: 'background', name: 'price' }))
                : [T(c.state === 'loading' ? 'Loading live prices' : 'Prices delayed. Please call us for a live price.', { size: 12, weight: 500, c: 'background', name: 'message' })],
        ),
    );
    deliverSite('Price ticker', 'apps/site/app/components/price-ticker.tsx · live prices above the header; a move always has a sign', [set]);
});

const siteWordmark = () =>
    F({ name: 'Logo', dir: 'H', gap: 10, align: 'center' }, [Dot(26, null, { name: 'ring', stroke: 'primary', sw: 3 }), T('MERRION GOLD', { size: 18, weight: 600, ls: 25, name: 'wordmark' })]);

reg('site/public-header', async () => {
    const set = await variantSet(
        'site/public-header',
        'Public header',
        [
            { name: 'viewport', values: ['desktop', 'phone'] },
            { name: 'cart', values: ['empty', 'items'] },
        ],
        (c) => {
            const cart = makeButton({ variant: 'default', size: 'sm', label: c.cart === 'items' ? 'Cart (3)' : 'Cart (0)', name: 'Cart' });
            if (c.viewport === 'phone') {
                return F({ kind: 'component', name: 'Public header', dir: 'H', gap: 12, w: 375, pad: [16, 16], align: 'center', fill: 'background', stroke: 'border', sides: 'b' }, [
                    siteWordmark(),
                    F({ name: 'Spacer', dir: 'H', fillW: true }),
                    cart,
                    makeButton({ variant: 'outline', size: 'sm', label: 'Menu', name: 'Menu' }),
                ]);
            }
            return F({ kind: 'component', name: 'Public header', dir: 'H', gap: 28, w: 1200, pad: [16, 24], align: 'center', fill: 'background', stroke: 'border', sides: 'b' }, [
                siteWordmark(),
                ...['Buy', 'Sell', 'Prices', 'Storage', 'Learn', 'Branches'].map((label) => T(label, { size: 15, weight: 500, name: 'link' })),
                F({ name: 'Spacer', dir: 'H', fillW: true }),
                T('01 254 7901', { c: 'muted-foreground', name: 'phone' }),
                cart,
            ]);
        },
    );
    deliverSite('Public header', 'apps/site/app/components/public-header.tsx · logo, six sections, phone, cart; collapses on a phone', [set]);
});

reg('site/public-footer', async () => {
    const column = (title, links) =>
        F({ name: title, gap: 8, w: 170 }, [T(title.toUpperCase(), { size: 12, weight: 600, ls: 10, c: 'muted-foreground', name: 'heading' }), ...links.map((l) => T(l, { name: 'link' }))]);
    const footer = F({ kind: 'component', name: 'Public footer', w: 1200, gap: 40, pad: [48, 24], fill: 'card', stroke: 'border', sides: 't' }, [
        F({ name: 'Columns', dir: 'H', gap: 40 }, [
            F({ name: 'Brand', gap: 12, w: 300 }, [
                siteWordmark(),
                T('Call 01 254 7901 or WhatsApp 085 275 1841.', { c: 'muted-foreground', fillW: true, name: 'contact' }),
                T('Safe deposit boxes at Merrion Vaults.', { c: 'muted-foreground', fillW: true, name: 'storage' }),
            ]),
            column('Buy and sell', ['Buy', 'How to buy', 'Sell', 'VAT-free silver', 'Live prices']),
            column('Company', ['About', 'Branches', 'Security and trust', 'FAQ', 'Contact']),
            column('Legal', ['Terms and conditions', 'Privacy policy', 'Cookie policy']),
        ]),
        T('Merrion Gold Ltd · Company number 537361 · LEI 635400GUYAUTIUK88B49', { size: 12, c: 'muted-foreground', name: 'company' }),
    ]);
    masterize('site/public-footer', footer);
    deliverSite('Public footer', 'apps/site/app/components/public-footer.tsx · sections, legal links, company details, one Merrion Vaults mention', [footer]);
});

const siteFooterButtons = (kids) => F({ name: 'Footer', dir: 'H', gap: 8, justify: 'end', fillW: true }, kids);

reg('site/market-closed-dialog', async () => {
    const outline = F({ name: 'Cancel', dir: 'H', h: 36, pad: [0, 16], align: 'center', justify: 'center', stroke: 'warning-text', radius: 'md' }, [T('Cancel', { weight: 500, c: 'warning-text', name: 'label' })]);
    const solidBtn = F({ name: 'Send request anyway', dir: 'H', h: 36, pad: [0, 16], align: 'center', justify: 'center', fill: 'warning-text', radius: 'md' }, [
        T('Send request anyway', { weight: 500, c: 'warning', name: 'label' }),
    ]);
    const d = F({ kind: 'component', name: 'Market closed dialog', w: 512, gap: 16, pad: 24, fill: 'warning', stroke: { role: 'warning-text', a: 0.3 }, radius: 'lg', shadow: 'lg' }, [
        T('The market is closed', { size: 20, weight: 600, lh: 24, c: 'warning-text', name: 'title' }),
        T('You can send your request now, but it will not be processed, priced or locked until 12/10/2026 08:45.', { c: 'warning-text', fillW: true, name: 'message' }),
        siteFooterButtons([outline, solidBtn]),
    ]);
    masterize('site/market-closed-dialog', d);
    deliverSite('Market closed dialog', 'apps/site/app/components/market-closed-dialog.tsx · shown when a request is sent outside opening hours; the date is the next opening in Irish time', [d]);
});

reg('site/payment-options-dialog', async () => {
    const set = await variantSet('site/payment-options-dialog', 'Payment options dialog', [{ name: 'understood', values: ['false', 'true'] }], (c) => {
        const on = c.understood === 'true';
        return F({ kind: 'component', name: 'Payment options dialog', w: 512, gap: 16, pad: 24, fill: 'background', stroke: 'border', radius: 'lg', shadow: 'lg' }, [
            F({ name: 'Header', gap: 6, fillW: true }, [
                T('How you pay', { size: 20, weight: 600, lh: 24, name: 'title' }),
                T('You pay after you receive our confirmed quote.', { c: 'muted-foreground', fillW: true, name: 'intro' }),
            ]),
            F({ name: 'Body', gap: 12, fillW: true }, [
                T('Bank transfer is the option we recommend: you can pay when the price suits you, then collect when your order is ready.', { fillW: true, name: 'bankTransfer' }),
                T('Or pay by card or cash in person at the office. The price is then the spot price at that time, subject to the item being available.', { fillW: true, name: 'inPerson' }),
                T('Cash payments carry a 2% handling fee.', { weight: 500, fillW: true, name: 'cashFee' }),
                Line({ fillW: true, name: 'separator' }),
                T('Prices are indicative and not locked until funds are received.', { c: 'muted-foreground', fillW: true, name: 'notice' }),
                F({ name: 'Confirm', dir: 'H', gap: 8, align: 'center' }, [makeCheckbox(on), T('I understand', { weight: 500, name: 'understood' })]),
            ]),
            siteFooterButtons([
                makeButton({ variant: 'outline', label: 'Cancel', name: 'Cancel' }),
                F({ name: 'Send order request', dir: 'H', h: 36, pad: [0, 16], align: 'center', justify: 'center', fill: 'primary', radius: 'md', opacity: on ? undefined : 0.5 }, [T('Send order request', { weight: 500, c: 'ink', name: 'label' })]),
            ]),
        ]);
    });
    deliverSite('Payment options dialog', 'apps/site/app/components/payment-options-dialog.tsx · how and when the customer pays; Send is enabled once they confirm', [set]);
});
