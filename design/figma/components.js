/**
 * Components: larger shared pieces (sidebar, header, user menu, forms). They compose the same maker
 * functions as the molecules and are imported as components so layouts can place instances of them.
 */

const deliverComponent = (title, desc, content, o) => place(wrapper('Components', title, desc, content, o));

const navItem = (icon, label, active) =>
    F({ name: label, dir: 'H', gap: 8, pad: [0, 8], h: 32, align: 'center', fill: active ? 'primary' : undefined, radius: 'md', fillW: true }, [
        I(icon, 16, active ? 'ink' : 'foreground'),
        T(label, { weight: active ? 500 : 400, c: active ? 'ink' : 'foreground', name: 'label' }),
    ]);

const navGroup = (label, items) =>
    F({ name: label, gap: 4, pad: 8, fillW: true }, [
        F({ name: 'group label', pad: [0, 8], h: 32, align: 'center', fillW: true }, [T(label, { size: 12, weight: 500, c: 'muted-foreground' })]),
        ...items.map(([icon, text, active]) => navItem(icon, text, active)),
    ]);

const userRow = (name, email) =>
    F({ name: 'user', dir: 'H', gap: 8, pad: 8, align: 'center', radius: 'md', fillW: true }, [
        F({ name: 'mark', dir: 'H', w: 32, h: 32, align: 'center', justify: 'center' }, [Logo(28)]),
        F({ name: 'text', gap: 2, fillW: true }, [T(name, { weight: 500, c: 'foreground' }), T(email, { size: 12, c: 'muted-foreground' })]),
        I('ellipsis-vertical', 16, 'foreground'),
    ]);

reg('components/logo', async () => {
    const set = await variantSet('components/logo', 'Logo', [{ name: 'size', values: ['sm', 'default', 'lg'] }], (c) =>
        F({ kind: 'component', name: 'Logo', dir: 'H' }, [Logo({ sm: 24, default: 32, lg: 56 }[c.size])]),
    );
    deliverComponent('Logo', 'components/logo.tsx · the mark keeps its brand gold in every theme', [set]);
});

reg('components/app-sidebar', async () => {
    const set = await variantSet('components/app-sidebar', 'App sidebar', [
            { name: 'role', values: ['staff', 'admin'] },
            { name: 'page', values: ['workbook', 'admin'] },
        ], (c) => {
        const groups = [navGroup('Navigation', [['layout-dashboard', 'Pricing Workbook', c.page === 'workbook'], ['book-open', 'Knowledge Center', false]])];
        if (c.role === 'admin') groups.push(navGroup('Admin', [['shield-check', 'Admin Console', c.page === 'admin'], ['square-kanban', 'Project Management', false]]));
        return F({ kind: 'component', name: 'AppSidebar', w: 256, h: 820, fill: 'sidebar', stroke: 'border', sides: 'r' }, [
            F({ name: 'SidebarHeader', pad: 8, fillW: true }, [
                F({ name: 'brand', dir: 'H', gap: 8, pad: 8, h: 48, align: 'center', fillW: true }, [
                    F({ name: 'mark', dir: 'H', w: 32, h: 32, align: 'center', justify: 'center' }, [Logo(32)]),
                    F({ name: 'text', fillW: true }, [T('Merrion Gold', { weight: 500 }), T('Pricing Workbook', { size: 12, lh: 16 })]),
                ]),
            ]),
            F({ name: 'SidebarContent', fillW: true, fillH: true }, groups),
            F({ name: 'SidebarFooter', pad: 8, fillW: true }, [userRow('Adrian Moreland', 'adrian@merrion.ie')]),
        ]);
    });
    deliverComponent('App sidebar', 'components/app-sidebar.tsx, nav-main.tsx · admins also see the Admin group; page picks the active item', [set]);
});

reg('components/site-header', async () => {
    const separator = () => Line({ name: 'Separator', w: 1, h: 16 });
    const set = await variantSet('components/site-header', 'Site header', [
            { name: 'page', values: ['workbook', 'admin'] },
            { name: 'search', values: ['off', 'on'] },
        ], (c) => {
        const left = [
            F({ name: 'SidebarTrigger', dir: 'H', w: 28, h: 28, align: 'center', justify: 'center', radius: 'md' }, [I('panel-left', 16, 'foreground')]),
            separator(),
            Logo(30),
            T(c.page === 'admin' ? 'Admin Console' : 'Pricing Workbook', { s: 'h3' }),
            separator(),
        ];
        const actions =
            c.page === 'admin'
                ? [makeButton({ variant: 'outline', size: 'sm', icon: 'table-2', label: 'Pricing workbook' })]
                : [
                      F({ name: 'freshness', dir: 'H', gap: 6, pad: [0, 4], align: 'center' }, [Dot(8, { hex: STATUS.emerald }), T('Live · 14:02:31', { size: 12, lh: 16, c: 'muted-foreground' })]),
                      makeButton({ variant: 'outline', size: 'icon', icon: 'refresh-cw' }),
                      separator(),
                      makeButton({ variant: 'outline', size: 'icon', icon: 'sparkles' }),
                      makeButton({ variant: 'default', size: 'icon', icon: 'panel-right' }),
                  ];
        if (c.search === 'on') {
            left.push(
                F({ name: 'SearchTrigger', dir: 'H', gap: 8, w: 224, h: 32, pad: [0, 12], align: 'center', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [
                    I('search', 14, 'muted-foreground'),
                    T('Search...', { c: 'muted-foreground' }),
                ]),
            );
        }
        return F({ kind: 'component', name: 'SiteHeader', dir: 'H', w: 1184, h: 56, pad: [12, 24], align: 'center', justify: 'between', fill: 'background', stroke: 'border', sides: 'b' }, [
            F({ name: 'left', dir: 'H', gap: 8, align: 'center' }, left),
            F({ name: 'actions', dir: 'H', gap: 8, align: 'center' }, actions),
        ]);
    });
    deliverComponent('Site header', 'components/site-header.tsx · page picks the title and the actions (freshness, refresh and tools toggle on the workbook)', [set]);
});

reg('components/nav-user', async () => {
    const trigger = F({ kind: 'component', name: 'NavUser', w: 240, fill: 'sidebar', radius: 'md' }, [userRow('Adrian Moreland', 'adrian@merrion.ie')]);
    masterize('components/nav-user', trigger);
    const menu = menuPanel(
        [
            F({ name: 'identity', dir: 'H', gap: 8, pad: [6, 4], align: 'center', fillW: true }, [
                Logo(28),
                F({ name: 'text', gap: 2, fillW: true }, [T('Adrian Moreland', { weight: 500 }), T('adrian@merrion.ie', { size: 12, c: 'muted-foreground' })]),
            ]),
            F({ name: 'Separator', pad: [4, 0], fillW: true }, [Line({ w: 10, h: 1, fillW: true })]),
            makeMenuItem('Dark mode', { icon: 'moon' }),
            makeMenuItem('Theme editor', { icon: 'paintbrush' }),
            F({ name: 'Separator', pad: [4, 0], fillW: true }, [Line({ w: 10, h: 1, fillW: true })]),
            makeMenuItem('Log out', { icon: 'log-out' }),
        ],
        { name: 'UserMenu', w: 224 },
    );
    deliverComponent('User menu', 'components/nav-user.tsx', [row([trigger, menu], { align: 'start', gap: 32 })]);
});

reg('components/command-search', async () => {
    const trigger = F({ kind: 'component', name: 'SearchTrigger', dir: 'H', gap: 8, w: 224, h: 32, pad: [0, 12], align: 'center', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [
        I('search', 14, 'muted-foreground'),
        T('Search...', { c: 'muted-foreground', fillW: true }),
        F({ name: 'kbd', dir: 'H', gap: 2, pad: [0, 6], h: 16, align: 'center', fill: 'muted', stroke: 'border', radius: 4 }, [T('⌘K', { size: 10, weight: 500 })]),
    ]);
    masterize('components/command-search', trigger);
    deliverComponent('Command search', 'components/command-search.tsx · the palette itself is in Molecules → Command palette', [trigger]);
});

reg('components/form', async () => {
    const field = (label, input, extra) => F({ name: label, gap: 8, fillW: true }, [makeLabel(label), input, extra]);
    const set = await variantSet('components/form', 'Form', [{ name: 'state', values: ['default', 'error'] }], (c) => {
        const bad = c.state === 'error';
        return F({ kind: 'component', name: 'Form', gap: 16, w: 360 }, [
            field('Email', makeInput({ fillW: true, value: bad ? 'adrian@' : undefined, placeholder: 'you@example.com', state: bad ? 'invalid' : 'default' }), bad ? T('Invalid email address', { size: 14, c: 'destructive' }) : null),
            field('Password', makeInput({ fillW: true, value: '••••••••' }), T('At least 8 characters.', { size: 12, c: 'muted-foreground' })),
            F({ name: 'actions', dir: 'H', gap: 8, justify: 'end', fillW: true }, [makeButton({ variant: 'outline', label: 'Cancel' }), makeButton({ label: 'Submit' })]),
        ]);
    });
    deliverComponent('Generic form', 'components/ui/form.tsx · FormItem, FormLabel, FormControl, FormMessage', [set]);
});

reg('components/admin-panel', async () => {
    const panel = F({ kind: 'component', name: 'Panel', gap: 12, pad: 16, w: 520, fill: 'card', stroke: 'border', radius: 'xl' }, [
        F({ name: 'header', dir: 'H', gap: 12, justify: 'between', align: 'start', fillW: true }, [
            F({ name: 'titles', gap: 2, fillW: true }, [T('Panel title', { size: 14, weight: 600 }), T('A short description of what the panel shows.', { size: 12, c: 'muted-foreground', fillW: true })]),
        ]),
        T('Content goes here.', { c: 'muted-foreground', fillW: true }),
    ]);
    masterize('components/admin-panel', panel);
    const stat = await variantSet('components/admin-panel-stat', 'Stat', [{ name: 'tone', values: ['normal', 'warn', 'bad'] }], (c) =>
        F({ kind: 'component', name: 'Stat', gap: 2 }, [T('Requests (24h)', { size: 12, c: 'muted-foreground' }), T('1,284', { size: 16, weight: 600, lh: 24, c: c.tone === 'bad' ? 'destructive' : c.tone === 'warn' ? { hex: '#b45309' } : 'foreground' })]),
    );
    deliverComponent('Admin panel and stat', 'app/admin/components/panel.tsx', [cap('PANEL'), panel, cap('STAT'), stat]);
});
