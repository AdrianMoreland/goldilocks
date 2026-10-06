/**
 * Molecules: the primitives in apps/web/src/components/ui, drawn the way their Tailwind classes render.
 * The make* functions are shared with the block builders, which compose them without needing the
 * molecule components to have been imported.
 */

const cap = (text) => T(text, { s: 'label', c: 'muted-foreground' });
const row = (kids, o = {}) => F({ name: o.name ?? 'row', dir: 'H', gap: o.gap ?? 16, align: o.align ?? 'center', wrap: o.wrap }, kids);
const deliver = (title, desc, content, o) => place(wrapper('Molecules', title, desc, content, o));

// ── shared makers ───────────────────────────────────────────────────────────

const BTN = {
    default: { fill: 'primary', text: 'ink' },
    secondary: { fill: 'muted', text: 'foreground' },
    outline: { fill: 'background', stroke: 'border', text: 'foreground', shadow: 'xs' },
    ghost: { text: 'foreground' },
    destructive: { fill: 'destructive', text: WHITE, shadow: 'xs' },
    link: { text: 'primary-text', underline: true },
};
const BTN_SIZE = { default: { h: 36, px: 16, gap: 8 }, sm: { h: 32, px: 12, gap: 6 }, lg: { h: 40, px: 24, gap: 8 }, icon: { w: 36, h: 36, px: 0, gap: 0 } };

function makeButton({ variant = 'default', size = 'default', label = 'Button', icon, kind, name, fillW } = {}) {
    const v = BTN[variant];
    const s = BTN_SIZE[size];
    const kids = [];
    if (size === 'icon') kids.push(I(icon ?? 'plus', 16, v.text));
    else {
        if (icon) kids.push(I(icon, 16, v.text));
        kids.push(T(label, { weight: 500, c: v.text, underline: v.underline, name: 'label' }));
    }
    return F(
        { kind, name: name ?? 'Button', dir: 'H', gap: s.gap, pad: [0, s.px], w: s.w, h: s.h, align: 'center', justify: 'center', fill: v.fill, stroke: v.stroke, shadow: v.shadow, radius: 'md', fillW },
        kids,
    );
}

const BADGE = {
    default: { fill: 'primary', text: 'ink' },
    secondary: { fill: 'muted', text: 'foreground' },
    destructive: { fill: 'destructive', text: WHITE },
    outline: { stroke: 'border', text: 'foreground' },
};
function makeBadge({ variant = 'default', label = 'Badge', kind, fill, text, stroke, size = 12, name } = {}) {
    const v = BADGE[variant];
    return F(
        { kind, name: name ?? 'Badge', dir: 'H', gap: 4, pad: [2, 8], align: 'center', justify: 'center', fill: fill ?? v.fill, stroke: stroke ?? v.stroke, radius: 'md' },
        [T(label, { size, weight: 500, c: text ?? v.text, name: 'label' })],
    );
}

function makeInput({ state = 'default', kind, w = 240, value, placeholder = 'Email', name, fillW, h = 36, radius = 'md' } = {}) {
    const filled = state === 'filled' || value !== undefined;
    return F(
        {
            kind,
            name: name ?? 'Input',
            dir: 'H',
            w: fillW ? undefined : w,
            h,
            pad: [0, 12],
            align: 'center',
            fill: 'background',
            stroke: state === 'invalid' ? 'destructive' : 'border',
            shadow: 'xs',
            radius,
            opacity: state === 'disabled' ? 0.5 : undefined,
            fillW,
        },
        [T(value ?? (filled ? 'name@merrion.ie' : placeholder), { c: filled ? 'foreground' : 'muted-foreground', name: 'value' })],
    );
}

const makeLabel = (text, o = {}) => T(text, { weight: 500, c: 'foreground', name: o.name ?? 'Label', ...o });

function makeSwitch(on, kind) {
    return F(
        { kind, name: 'Switch', dir: 'H', w: 32, h: 18, pad: 1, align: 'center', justify: on ? 'end' : 'start', fill: on ? 'primary' : 'border', radius: 'full' },
        [Dot(16, 'background', { name: 'thumb' })],
    );
}

function makeCheckbox(checked, kind) {
    return F(
        { kind, name: 'Checkbox', dir: 'H', w: 16, h: 16, align: 'center', justify: 'center', fill: checked ? 'primary' : undefined, stroke: checked ? 'primary' : 'border', radius: 4, shadow: 'xs' },
        checked ? [I('check', 14, 'ink')] : [],
    );
}

const makeAvatar = (size = 32, initials = 'AM', kind) =>
    F({ kind, name: 'Avatar', dir: 'H', w: size, h: size, align: 'center', justify: 'center', fill: 'muted', radius: 'full' }, [T(initials, { size: size > 32 ? 14 : 12, weight: 500, c: 'foreground' })]);

/** A tab strip like TabsList: muted track, the active trigger lifted onto the background. */
function makeTabs({ labels, active, kind, pill }) {
    const triggers = labels.map((label, i) =>
        F(
            { name: label, dir: 'H', pad: pill ? [4, 10] : [0, 8], h: pill ? undefined : 29, align: 'center', justify: 'center', fill: !pill && i === active ? 'background' : pill ? 'muted' : undefined, radius: 'md', shadow: !pill && i === active ? 'xs' : undefined, stroke: pill && i === active ? 'foreground' : undefined },
            [T(label, { size: pill ? 12 : 14, weight: 500, c: pill ? (i === active ? 'foreground' : 'muted-foreground') : i === active ? 'foreground' : 'muted-foreground' })],
        ),
    );
    return pill
        ? F({ kind, name: 'Tabs', dir: 'H', gap: 4, wrap: true }, triggers)
        : F({ kind, name: 'Tabs', dir: 'H', pad: 3, h: 36, align: 'center', fill: 'muted', radius: 'lg' }, triggers);
}

const makeMenuItem = (label, o = {}) =>
    F({ name: label, dir: 'H', gap: 8, pad: [6, 8], align: 'center', radius: 'sm', fill: o.active ? 'muted' : undefined, fillW: true }, [
        o.icon ? I(o.icon, 16, o.destructive ? 'destructive' : 'muted-foreground') : null,
        T(label, { c: o.destructive ? 'destructive' : 'foreground', fillW: true }),
        o.shortcut ? T(o.shortcut, { size: 12, c: 'muted-foreground', ls: 10 }) : null,
        o.check ? I('check', 16, 'foreground') : null,
    ]);

const menuPanel = (kids, o = {}) => F({ kind: o.kind, name: o.name ?? 'Menu', gap: 0, pad: 4, w: o.w ?? 224, fill: 'card', stroke: 'border', radius: 'md', shadow: 'md' }, kids);

// ── builders ────────────────────────────────────────────────────────────────

reg('molecules/button', async () => {
    const set = await variantSet(
        'molecules/button',
        'Button',
        [
            { name: 'variant', values: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] },
            { name: 'size', values: ['default', 'sm', 'lg', 'icon'] },
        ],
        (c) => makeButton({ ...c, kind: 'component' }),
    );
    deliver('Button', 'components/ui/button.tsx · variant × size (rows are variants)', [set]);
});

reg('molecules/badge', async () => {
    const set = await variantSet('molecules/badge', 'Badge', [{ name: 'variant', values: ['default', 'secondary', 'destructive', 'outline'] }], (c) => makeBadge({ ...c, kind: 'component' }));
    deliver('Badge', 'components/ui/badge.tsx', [set]);
});

reg('molecules/input', async () => {
    const set = await variantSet('molecules/input', 'Input', [{ name: 'state', values: ['default', 'filled', 'disabled', 'invalid'] }], (c) => makeInput({ ...c, kind: 'component' }));
    const label = makeLabel('Email');
    label.name = 'Label';
    const field = F({ name: 'Field example', gap: 8, w: 240 }, [makeLabel('Email'), makeInput({ fillW: true }), T('We will never share it.', { size: 12, c: 'muted-foreground' })]);
    deliver('Input and label', 'components/ui/input.tsx, label.tsx', [cap('INPUT'), set, cap('LABEL AND FIELD'), row([label, field], { align: 'start', gap: 40 })]);
});

reg('molecules/textarea', async () => {
    const set = await variantSet('molecules/textarea', 'Textarea', [{ name: 'state', values: ['placeholder', 'filled'] }], (c) =>
        F({ kind: 'component', name: 'Textarea', dir: 'V', w: 280, h: 72, pad: [8, 12], fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [
            T(c.state === 'filled' ? 'Quote for 12 × 1 oz Britannia, collect Friday.' : 'Type your message here.', { c: c.state === 'filled' ? 'foreground' : 'muted-foreground', fillW: true }),
        ]),
    );
    deliver('Textarea', 'components/ui/textarea.tsx', [set]);
});

reg('molecules/checkbox', async () => {
    const set = await variantSet('molecules/checkbox', 'Checkbox', [{ name: 'checked', values: ['false', 'true'] }], (c) => makeCheckbox(c.checked === 'true', 'component'));
    deliver('Checkbox', 'components/ui/checkbox.tsx', [set]);
});

reg('molecules/radio-group', async () => {
    const set = await variantSet('molecules/radio-group', 'Radio', [{ name: 'selected', values: ['false', 'true'] }], (c) =>
        F({ kind: 'component', name: 'Radio', dir: 'H', w: 16, h: 16, align: 'center', justify: 'center', stroke: 'border', radius: 'full', shadow: 'xs' }, c.selected === 'true' ? [Dot(8, 'primary')] : []),
    );
    deliver('Radio group', 'components/ui/radio-group.tsx', [set]);
});

reg('molecules/switch', async () => {
    const set = await variantSet('molecules/switch', 'Switch', [{ name: 'checked', values: ['false', 'true'] }], (c) => makeSwitch(c.checked === 'true', 'component'));
    deliver('Switch', 'components/ui/switch.tsx', [set]);
});

reg('molecules/slider', async () => {
    const c = F({ kind: 'component', name: 'Slider', abs: true, w: 240, h: 16 }, [
        Rect({ name: 'track', w: 240, h: 6, x: 0, y: 5, fill: 'muted', radius: 'full' }),
        Rect({ name: 'range', w: 120, h: 6, x: 0, y: 5, fill: 'primary', radius: 'full' }),
        Dot(16, 'primary', { name: 'thumb', x: 112, y: 0, stroke: 'background', sw: 2 }),
    ]);
    masterize('molecules/slider', c);
    deliver('Slider', 'components/ui/slider.tsx', [c]);
});

reg('molecules/progress', async () => {
    const set = await variantSet('molecules/progress', 'Progress', [{ name: 'value', values: ['25', '60', '100'] }], (c) =>
        F({ kind: 'component', name: 'Progress', abs: true, w: 240, h: 8, clip: true, fill: { mix: ['primary', 20, 'background'] }, radius: 'full' }, [
            Rect({ name: 'bar', w: Math.round(2.4 * Number(c.value)), h: 8, x: 0, y: 0, fill: 'primary' }),
        ]),
    );
    deliver('Progress', 'components/ui/progress.tsx', [set]);
});

reg('molecules/separator', async () => {
    const set = await variantSet('molecules/separator', 'Separator', [{ name: 'orientation', values: ['horizontal', 'vertical'] }], (c) =>
        F({ kind: 'component', name: 'Separator', abs: true, w: c.orientation === 'horizontal' ? 240 : 1, h: c.orientation === 'horizontal' ? 1 : 24, fill: 'border' }),
    );
    deliver('Separator', 'components/ui/separator.tsx', [set]);
});

reg('molecules/skeleton', async () => {
    const set = await variantSet('molecules/skeleton', 'Skeleton', [{ name: 'shape', values: ['line', 'block', 'circle'] }], (c) =>
        F({ kind: 'component', name: 'Skeleton', abs: true, w: c.shape === 'line' ? 200 : c.shape === 'block' ? 200 : 40, h: c.shape === 'line' ? 16 : c.shape === 'block' ? 80 : 40, fill: 'muted', radius: c.shape === 'circle' ? 'full' : 'md' }),
    );
    deliver('Skeleton', 'components/ui/skeleton.tsx', [set]);
});

reg('molecules/avatar', async () => {
    const set = await variantSet('molecules/avatar', 'Avatar', [{ name: 'size', values: ['default', 'lg'] }], (c) => makeAvatar(c.size === 'lg' ? 40 : 32, 'AM', 'component'));
    deliver('Avatar', 'components/ui/avatar.tsx', [set]);
});

reg('molecules/toggle', async () => {
    const set = await variantSet('molecules/toggle', 'Toggle', [{ name: 'pressed', values: ['false', 'true'] }], (c) =>
        F({ kind: 'component', name: 'Toggle', dir: 'H', w: 36, h: 36, align: 'center', justify: 'center', fill: c.pressed === 'true' ? 'muted' : undefined, radius: 'md' }, [I('bold', 16, 'foreground')]),
    );
    const group = F({ name: 'Toggle group', dir: 'H', stroke: 'border', radius: 'md', clip: true, shadow: 'xs' }, ['bold', 'italic', 'underline'].map((icon, i) =>
        F({ name: icon, dir: 'H', w: 36, h: 34, align: 'center', justify: 'center', fill: i === 0 ? 'muted' : undefined }, [I(icon, 16, 'foreground')]),
    ));
    deliver('Toggle and toggle group', 'components/ui/toggle.tsx, toggle-group.tsx', [cap('TOGGLE'), set, cap('TOGGLE GROUP'), group]);
});

reg('molecules/tabs', async () => {
    const set = await variantSet('molecules/tabs', 'Tabs', [{ name: 'active', values: ['1', '2', '3'] }], (c) =>
        makeTabs({ labels: ['Account', 'Password', 'Team'], active: Number(c.active) - 1, kind: 'component' }),
    );
    const pills = makeTabs({ labels: ['Product', 'Trade', 'Portfolio', 'Calculators'], active: 1, pill: true });
    deliver('Tabs', 'components/ui/tabs.tsx · the dashboard panel uses the pill form below', [cap('TABS LIST'), set, cap('PRICING TOOLS PILLS (bg-muted, text-xs)'), pills]);
});

reg('molecules/card', async () => {
    const c = F({ kind: 'component', name: 'Card', gap: 24, pad: [24, 0], w: 360, fill: 'card', stroke: 'border', radius: 'xl', shadow: 'sm' }, [
        F({ name: 'CardHeader', gap: 6, pad: [0, 24], fillW: true }, [T('Card title', { size: 16, weight: 600, lh: 16, name: 'title' }), T('Card description', { c: 'muted-foreground', name: 'description' })]),
        F({ name: 'CardContent', pad: [0, 24], fillW: true }, [T('Card content goes here.', { fillW: true })]),
        F({ name: 'CardFooter', dir: 'H', gap: 8, pad: [0, 24], fillW: true }, [makeButton({ variant: 'outline', label: 'Cancel' }), makeButton({ label: 'Save' })]),
    ]);
    masterize('molecules/card', c);
    deliver('Card', 'components/ui/card.tsx', [c]);
});

reg('molecules/table', async () => {
    const cols = ['Product', 'Price', 'Buyback', 'Weight'];
    const rows = [
        ['1 oz Britannia', '€3,411', '€3,262', '31.1 g'],
        ['10 g Gold Bar', '€1,142', '€1,078', '10 g'],
        ['1 oz Maple Leaf', '€3,408', '€3,258', '31.1 g'],
    ];
    const cell = (text, o = {}) => T(text, { fillW: true, weight: o.head ? 700 : 400, size: 16, lh: 24, c: o.muted ? 'muted-foreground' : 'foreground', align: o.right ? 'RIGHT' : undefined });
    const t = F({ kind: 'component', name: 'Table', w: 560, radius: 'lg', stroke: 'border', clip: true }, [
        F({ name: 'TableHeader', dir: 'H', pad: [6, 12], gap: 12, fill: 'muted', fillW: true }, cols.map((h, i) => cell(h, { head: true, right: i > 0 }))),
        ...rows.map((r) => F({ name: 'TableRow', dir: 'H', pad: [6, 12], gap: 12, stroke: 'border', sides: 'b', fillW: true }, r.map((v, i) => cell(v, { right: i > 0, muted: i === 3 })))),
    ]);
    masterize('molecules/table', t);
    deliver('Table', 'components/ui/table.tsx', [t]);
});

reg('molecules/select', async () => {
    const trigger = await variantSet('molecules/select', 'Select trigger', [{ name: 'state', values: ['placeholder', 'filled'] }], (c) =>
        F({ kind: 'component', name: 'SelectTrigger', dir: 'H', w: 240, h: 36, pad: [0, 12], align: 'center', justify: 'between', fill: 'background', stroke: 'border', radius: 'md', shadow: 'xs' }, [
            T(c.state === 'filled' ? 'Gold' : 'Select a metal', { c: c.state === 'filled' ? 'foreground' : 'muted-foreground', name: 'value' }),
            I('chevron-down', 16, 'muted-foreground'),
        ]),
    );
    const menu = menuPanel(['Gold', 'Silver', 'Platinum', 'Palladium'].map((m, i) => makeMenuItem(m, { check: i === 0, active: i === 1 })), { kind: 'component', name: 'SelectContent', w: 240 });
    deliver('Select', 'components/ui/select.tsx', [cap('TRIGGER'), trigger, cap('OPEN MENU'), menu]);
});

reg('molecules/dropdown-menu', async () => {
    const menu = menuPanel(
        [
            F({ name: 'Label', pad: [6, 8], fillW: true }, [T('My account', { weight: 500 })]),
            F({ name: 'Separator', pad: [4, 0], fillW: true }, [Line({ w: 10, h: 1, fillW: true })]),
            makeMenuItem('Profile', { icon: 'user', shortcut: '⇧⌘P', active: true }),
            makeMenuItem('Settings', { icon: 'settings', shortcut: '⌘,' }),
            F({ name: 'Separator', pad: [4, 0], fillW: true }, [Line({ w: 10, h: 1, fillW: true })]),
            makeMenuItem('Log out', { icon: 'log-out', destructive: true }),
        ],
        { kind: 'component', name: 'DropdownMenuContent' },
    );
    masterize('molecules/dropdown-menu', menu);
    deliver('Dropdown menu', 'components/ui/dropdown-menu.tsx', [menu]);
});

function makeDialog({ title, description, body, confirm = 'Save changes', destructive = false, kind, w = 440 }) {
    return F({ kind, name: 'Dialog', gap: 16, pad: 24, w, fill: 'background', stroke: 'border', radius: 'lg', shadow: 'lg' }, [
        F({ name: 'DialogHeader', gap: 8, fillW: true }, [
            F({ name: 'title row', dir: 'H', justify: 'between', align: 'start', fillW: true }, [T(title, { size: 18, weight: 600, lh: 18, name: 'title' }), I('x', 16, 'muted-foreground')]),
            T(description, { c: 'muted-foreground', fillW: true, name: 'description' }),
        ]),
        ...(body ? [body] : []),
        F({ name: 'DialogFooter', dir: 'H', gap: 8, justify: 'end', fillW: true }, [makeButton({ variant: 'outline', label: 'Cancel' }), makeButton({ variant: destructive ? 'destructive' : 'default', label: confirm })]),
    ]);
}

reg('molecules/dialog', async () => {
    const d = makeDialog({
        title: 'Edit profile',
        description: "Make changes to your profile here. Click save when you're done.",
        body: F({ name: 'fields', gap: 8, fillW: true }, [makeLabel('Name'), makeInput({ fillW: true, value: 'Adrian Moreland' })]),
        kind: 'component',
    });
    masterize('molecules/dialog', d);
    deliver('Dialog', 'components/ui/dialog.tsx', [d]);
});

reg('molecules/sheet', async () => {
    const set = await variantSet('molecules/sheet', 'Sheet', [{ name: 'side', values: ['right', 'bottom'] }], (c) => {
        const body = [
            F({ name: 'header', gap: 6, pad: 16, fillW: true }, [T('Edit profile', { weight: 600, size: 16, lh: 16 }), T('Make changes here.', { c: 'muted-foreground' })]),
            F({ name: 'body', gap: 8, pad: [0, 16], fillW: true, fillH: c.side === 'right' }, [makeLabel('Name'), makeInput({ fillW: true, value: 'Adrian Moreland' })]),
            F({ name: 'footer', gap: 8, pad: 16, fillW: true }, [makeButton({ label: 'Save changes', fillW: true }), makeButton({ variant: 'outline', label: 'Close', fillW: true })]),
        ];
        return c.side === 'right'
            ? F({ kind: 'component', name: 'Sheet', w: 360, h: 420, fill: 'background', stroke: 'border', sides: 'l', radius: 0, shadow: 'lg' }, body)
            : F({ kind: 'component', name: 'Drawer', w: 520, fill: 'background', stroke: 'border', sides: 't', radius: 0, shadow: 'lg', align: 'center' }, [
                  F({ name: 'handle', pad: [12, 0, 4, 0] }, [Rect({ name: 'grabber', w: 100, h: 8, fill: 'muted', radius: 'full' })]),
                  ...body,
              ]);
    });
    deliver('Sheet and drawer', 'components/ui/sheet.tsx, drawer.tsx', [set]);
});

reg('molecules/tooltip', async () => {
    const tip = F({ kind: 'component', name: 'Tooltip', dir: 'H', pad: [6, 12], fill: 'foreground', radius: 'md' }, [T('Freeze this spot price', { size: 12, c: 'background' })]);
    masterize('molecules/tooltip', tip);
    const pop = F({ name: 'Popover', gap: 8, pad: 16, w: 288, fill: 'card', stroke: 'border', radius: 'md', shadow: 'md' }, [
        T('Dimensions', { weight: 500 }),
        T('Set the dimensions for the layer.', { c: 'muted-foreground', fillW: true }),
        makeInput({ fillW: true, value: '100%' }),
    ]);
    const hover = F({ name: 'Hover card', dir: 'H', gap: 16, pad: 16, w: 288, fill: 'card', stroke: 'border', radius: 'md', shadow: 'md', align: 'start' }, [
        makeAvatar(40),
        F({ name: 'text', gap: 4, fillW: true }, [T('@merrion', { weight: 600 }), T('Bullion pricing for the Dublin desk.', { size: 12, c: 'muted-foreground', fillW: true })]),
    ]);
    deliver('Tooltip and popover', 'components/ui/tooltip.tsx, popover.tsx, hover-card.tsx', [cap('TOOLTIP'), tip, cap('POPOVER AND HOVER CARD'), row([pop, hover], { align: 'start', gap: 24 })]);
});

reg('molecules/accordion', async () => {
    const item = (title, open) =>
        F({ name: title, fillW: true, stroke: 'border', sides: 'b' }, [
            F({ name: 'trigger', dir: 'H', pad: [16, 0], justify: 'between', align: 'start', fillW: true }, [T(title, { weight: 500, fillW: true }), I(open ? 'chevron-up' : 'chevron-down', 16, 'muted-foreground')]),
            open ? F({ name: 'content', pad: [0, 0, 16, 0], fillW: true }, [T('Yes. It follows the WAI-ARIA pattern and is animated by default.', { c: 'foreground', fillW: true })]) : null,
        ]);
    const a = F({ kind: 'component', name: 'Accordion', w: 360 }, [item('Is it accessible?', true), item('Is it styled?', false), item('Is it animated?', false)]);
    masterize('molecules/accordion', a);
    deliver('Accordion and collapsible', 'components/ui/accordion.tsx, collapsible.tsx', [a]);
});

reg('molecules/breadcrumb', async () => {
    const b = F({ kind: 'component', name: 'Breadcrumb', dir: 'H', gap: 8, align: 'center' }, [
        T('Home', { c: 'muted-foreground' }),
        I('chevron-right', 14, 'muted-foreground'),
        T('Pricing', { c: 'muted-foreground' }),
        I('chevron-right', 14, 'muted-foreground'),
        T('Workbook'),
    ]);
    masterize('molecules/breadcrumb', b);
    deliver('Breadcrumb', 'components/ui/breadcrumb.tsx', [b]);
});

reg('molecules/command', async () => {
    const item = (label, icon, o = {}) => makeMenuItem(label, { icon, ...o });
    const heading = (text) => F({ name: 'heading', pad: [6, 8], fillW: true }, [T(text, { size: 12, weight: 500, c: 'muted-foreground' })]);
    const c = F({ kind: 'component', name: 'Command', w: 448, fill: 'card', stroke: 'border', radius: 'lg', shadow: 'md', clip: true }, [
        F({ name: 'input', dir: 'H', gap: 8, h: 44, pad: [0, 12], align: 'center', stroke: 'border', sides: 'b', fillW: true }, [I('search', 16, 'muted-foreground'), T('Type a command or search…', { c: 'muted-foreground' })]),
        F({ name: 'list', pad: 4, fillW: true }, [
            heading('Pages'),
            item('Pricing Workbook', 'layout-dashboard', { active: true }),
            item('Knowledge Center', 'book-open'),
            heading('Settings'),
            item('Profile', 'user', { shortcut: '⌘P' }),
            item('Admin Console', 'shield-check', { shortcut: '⌘A' }),
        ]),
    ]);
    masterize('molecules/command', c);
    deliver('Command palette', 'components/ui/command.tsx', [c]);
});

reg('molecules/toast', async () => {
    const T3 = { default: ['info', 'foreground', 'Prices refreshed', 'Spot prices updated just now.'], success: ['circle-check', { hex: STATUS.emerald }, 'Saved', 'The product was updated.'], error: ['circle-alert', 'destructive', "Couldn't price the copy", 'Check your connection and try again.'] };
    const set = await variantSet('molecules/toast', 'Toast', [{ name: 'type', values: ['default', 'success', 'error'] }], (c) => {
        const [icon, color, title, desc] = T3[c.type];
        return F({ kind: 'component', name: 'Toast', dir: 'H', gap: 12, pad: 16, w: 356, align: 'start', fill: 'card', stroke: 'border', radius: 'lg', shadow: 'lg' }, [
            I(icon, 16, color),
            F({ name: 'text', gap: 2, fillW: true }, [T(title, { weight: 500, fillW: true }), T(desc, { size: 13, c: 'muted-foreground', fillW: true })]),
        ]);
    });
    deliver('Toast', 'components/ui/sonner.tsx', [set]);
});

reg('molecules/spinner', async () => {
    const set = await variantSet('molecules/spinner', 'Spinner', [{ name: 'size', values: ['sm', 'default', 'lg'] }], (c) =>
        F({ kind: 'component', name: 'Spinner', dir: 'H', align: 'center', justify: 'center' }, [I('loader-circle', { sm: 16, default: 24, lg: 32 }[c.size], 'muted-foreground')]),
    );
    deliver('Loading spinner', 'components/ui/loading-spinner.tsx', [set]);
});

reg('molecules/calendar', async () => {
    const cell = (label, o = {}) =>
        F({ name: label, dir: 'H', w: 32, h: 32, align: 'center', justify: 'center', fill: o.selected ? 'primary' : o.today ? 'muted' : undefined, radius: 'md' }, [
            label ? T(label, { size: o.head ? 12 : 14, c: o.selected ? 'ink' : o.head ? 'muted-foreground' : 'foreground', weight: o.head ? 400 : 400 }) : null,
        ]);
    const weeks = [];
    const lead = 4; // 1 October 2026 is a Thursday
    for (let w = 0; w < 5; w++) {
        const cells = [];
        for (let d = 0; d < 7; d++) {
            const day = w * 7 + d - lead + 1;
            cells.push(day >= 1 && day <= 31 ? cell(String(day), { selected: day === 14, today: day === 2 }) : cell(''));
        }
        weeks.push(F({ name: 'week', dir: 'H' }, cells));
    }
    const c = F({ kind: 'component', name: 'Calendar', gap: 8, pad: 12, fill: 'background', stroke: 'border', radius: 'md' }, [
        F({ name: 'caption', dir: 'H', justify: 'between', align: 'center', fillW: true }, [
            F({ name: 'prev', dir: 'H', w: 28, h: 28, align: 'center', justify: 'center', stroke: 'border', radius: 'md' }, [I('chevron-left', 16, 'foreground')]),
            T('October 2026', { weight: 500 }),
            F({ name: 'next', dir: 'H', w: 28, h: 28, align: 'center', justify: 'center', stroke: 'border', radius: 'md' }, [I('chevron-right', 16, 'foreground')]),
        ]),
        F({ name: 'weekdays', dir: 'H' }, ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => cell(d, { head: true }))),
        ...weeks,
    ]);
    masterize('molecules/calendar', c);
    deliver('Calendar', 'components/ui/calendar.tsx', [c]);
});

reg('molecules/navigation-menu', async () => {
    const link = (label, o = {}) => F({ name: label, dir: 'H', gap: 4, pad: [8, 16], h: 36, align: 'center', fill: o.active ? 'muted' : undefined, radius: 'md' }, [T(label, { weight: 500 }), o.chevron ? I('chevron-down', 12, 'foreground') : null]);
    const n = F({ kind: 'component', name: 'NavigationMenu', dir: 'H', gap: 4 }, [link('Workbook', { active: true }), link('Knowledge', { chevron: true }), link('Admin'), link('Project')]);
    masterize('molecules/navigation-menu', n);
    deliver('Navigation menu', 'components/ui/navigation-menu.tsx', [n]);
});

reg('molecules/scroll-area', async () => {
    const lines = Array.from({ length: 7 }, (_, i) => T(`Product line ${i + 1}`, { fillW: true }));
    const s = F({ kind: 'component', name: 'ScrollArea', w: 240, h: 160, clip: true, stroke: 'border', radius: 'md' }, [F({ name: 'viewport', gap: 12, pad: 16, fillW: true }, lines)]);
    s.appendChild(Rect({ name: 'scrollbar', w: 6, h: 72, fill: 'border', radius: 'full' }));
    const bar = s.children[s.children.length - 1];
    bar.layoutPositioning = 'ABSOLUTE';
    bar.x = 228;
    bar.y = 8;
    masterize('molecules/scroll-area', s);
    deliver('Scroll area', 'components/ui/scroll-area.tsx', [s]);
});
