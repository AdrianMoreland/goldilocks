/**
 * Layouts: whole pages assembled from instances of the components and blocks. Anything a layout needs that
 * has not been imported yet is built first (see master() in core.js), so a layout works on an empty file.
 */

function layoutFrame(name, w, h, kids, o = {}) {
    const f = F({ name: `${PREFIX}Layouts / ${name}`, dir: 'H', w, h, fill: o.fill ?? 'background', clip: true, align: o.align, justify: o.justify }, kids);
    applyMode(f);
    return place(f);
}

reg('layouts/sign-in', async () => {
    const logo = await use('components/logo', { size: 'lg' });
    const form = await use('blocks/sign-in-form', { state: 'default' });
    const page = F({ name: 'sign-in', gap: 24, w: 384, align: 'center' }, [
        F({ name: 'brand', gap: 8, align: 'center' }, [logo, T('Merrion Gold', { size: 18, weight: 600, lh: 28 }), T('Pricing Workbook', { c: 'muted-foreground' })]),
        form,
    ]);
    layoutFrame('Sign-in page', 1440, 900, [page], { fill: 'muted', align: 'center', justify: 'center' });
});

reg('layouts/dashboard', async () => {
    const sidebar = await use('components/app-sidebar', { role: 'admin', page: 'workbook' }, { fillH: true });
    const header = await use('components/site-header', { page: 'workbook', search: 'off' }, { fillW: true });
    const cards = [];
    for (const [metal, state] of [['Gold', 'active'], ['Silver', 'normal'], ['Platinum', 'normal'], ['Palladium', 'normal']]) {
        cards.push(await use('blocks/spot-card', { metal, state }, { fillW: true }));
    }
    const chart = await use('blocks/spot-chart', {}, { fillW: true });
    const filters = await use('blocks/product-filter-bar', {}, { fillW: true });
    const table = await use('blocks/product-table', {}, { fillW: true });
    const tools = await use('blocks/tools-panel', {}, { fillH: true });

    const main = F({ name: 'main', fillW: true, fillH: true, clip: true }, [
        header,
        F({ name: 'cards and chart', gap: 16, pad: [16, 24], fillW: true }, [F({ name: 'cards', dir: 'H', gap: 12, fillW: true }, cards), chart]),
        F({ name: 'table region', gap: 8, pad: [0, 24, 16, 24], fillW: true, fillH: true, clip: true }, [filters, table]),
    ]);
    layoutFrame('Dashboard', 1680, 960, [sidebar, main, tools]);
});

reg('layouts/admin', async () => {
    const sidebar = await use('components/app-sidebar', { role: 'admin', page: 'admin' }, { fillH: true });
    const header = await use('components/site-header', { page: 'admin', search: 'off' }, { fillW: true });
    const health = await use('blocks/system-health', { state: 'normal' }, { fillW: true });

    const tabs = makeTabs({ labels: ['Overview', 'Logs', 'API tester', 'Database'], active: 0 });
    const stat = (label, value) => F({ name: label, gap: 2 }, [T(label, { size: 12, c: 'muted-foreground' }), T(value, { size: 16, weight: 600, lh: 24 })]);
    const bars = F({ name: 'bars', dir: 'H', gap: 4, align: 'end', h: 64 }, [14, 22, 30, 26, 38, 44, 36, 52, 48, 40, 58, 46].map((v, i) => Rect({ name: 'bar', w: 16, h: v, fill: 'primary', radius: 3, opacity: i === 11 ? 1 : 0.55 })));
    const traffic = makePanel({
        title: 'Traffic',
        description: 'Requests per hour, last 24 hours',
        w: 560,
        body: [F({ name: 'stats', dir: 'H', gap: 32 }, [stat('Requests (24h)', '1,284'), stat('Errors', '3'), stat('Median latency', '48 ms')]), bars],
    });
    const errors = makePanel({
        title: 'Recent errors',
        description: 'Newest first',
        w: 560,
        body: [F({ name: 'empty', pad: [24, 12], align: 'center', justify: 'center', stroke: 'border', dashed: true, radius: 'lg', fillW: true }, [T('No errors in the last 24 hours.', { c: 'muted-foreground', align: 'CENTER', fillW: true })])],
    });

    const main = F({ name: 'main', fillW: true, fillH: true, clip: true }, [
        header,
        F({ name: 'content', gap: 16, pad: [24, 24], fillW: true, fillH: true }, [tabs, health, F({ name: 'panels', dir: 'H', gap: 16, fillW: true }, [traffic, errors])]),
    ]);
    layoutFrame('Admin console', 1440, 900, [sidebar, main]);
});
