/**
 * What the plugin panel lists. Each entry points at the source it was drawn from (paths from the repo root),
 * so build.mjs can flag an entry whose source file has gone and list files that have no entry yet.
 *
 *   id        group/name; the matching builder is registered in src/<group>.js with reg('<id>', ...)
 *   covers    source files this entry is drawn from (checked to exist at build time)
 *   needs     other entries it is built on (they are created first when missing)
 */
const UI = 'apps/web/src/components/ui';
const WEB = 'apps/web/src';
const DASH = 'apps/web/src/app/dashboard/components';

export const GROUPS = [
    { key: 'variables', label: 'Variables', blurb: 'Colour, type, radius and spacing from DESIGN.md. Variables and text styles are always kept up to date; the ticks choose which reference frames are drawn.' },
    { key: 'molecules', label: 'Molecules', blurb: 'The small building blocks in components/ui, drawn as Figma components with their variants.' },
    { key: 'components', label: 'Components', blurb: 'Larger shared pieces: sidebar, header, user menu, forms.' },
    { key: 'blocks', label: 'Blocks', blurb: 'Feature-specific compositions with placeholder data: spot cards, product table, trade tab, sign-in form.' },
    { key: 'layouts', label: 'Layouts', blurb: 'Whole pages assembled from instances of the components and blocks (built first when missing).' },
];

export const CATALOGUE = [
    // ── Variables ────────────────────────────────────────────────────────────
    { id: 'variables/colors', group: 'variables', label: 'Colors', desc: 'Primitives, light and dark roles, metals', covers: ['DESIGN.md'] },
    { id: 'variables/typography', group: 'variables', label: 'Typography', desc: 'Text styles and specimens', covers: ['DESIGN.md', 'apps/web/src/index.css'] },
    { id: 'variables/radius', group: 'variables', label: 'Radius', desc: 'Corner radius scale', covers: ['DESIGN.md'] },
    { id: 'variables/spacing', group: 'variables', label: 'Spacing', desc: 'Spacing unit, gutters, cell padding', covers: ['DESIGN.md'] },

    // ── Molecules (components/ui) ────────────────────────────────────────────
    { id: 'molecules/button', group: 'molecules', label: 'Button', desc: '6 variants × 4 sizes', covers: [`${UI}/button.tsx`] },
    { id: 'molecules/badge', group: 'molecules', label: 'Badge', desc: 'default, secondary, destructive, outline', covers: [`${UI}/badge.tsx`] },
    { id: 'molecules/input', group: 'molecules', label: 'Input and label', desc: 'default, filled, disabled, invalid', covers: [`${UI}/input.tsx`, `${UI}/label.tsx`] },
    { id: 'molecules/textarea', group: 'molecules', label: 'Textarea', desc: 'placeholder and filled', covers: [`${UI}/textarea.tsx`] },
    { id: 'molecules/checkbox', group: 'molecules', label: 'Checkbox', desc: 'checked and unchecked', covers: [`${UI}/checkbox.tsx`] },
    { id: 'molecules/radio-group', group: 'molecules', label: 'Radio group', desc: 'selected and unselected', covers: [`${UI}/radio-group.tsx`] },
    { id: 'molecules/switch', group: 'molecules', label: 'Switch', desc: 'on and off', covers: [`${UI}/switch.tsx`] },
    { id: 'molecules/slider', group: 'molecules', label: 'Slider', desc: 'track, range and thumb', covers: [`${UI}/slider.tsx`] },
    { id: 'molecules/progress', group: 'molecules', label: 'Progress', desc: 'bar at three values', covers: [`${UI}/progress.tsx`] },
    { id: 'molecules/separator', group: 'molecules', label: 'Separator', desc: 'horizontal and vertical', covers: [`${UI}/separator.tsx`] },
    { id: 'molecules/skeleton', group: 'molecules', label: 'Skeleton', desc: 'loading placeholders', covers: [`${UI}/skeleton.tsx`] },
    { id: 'molecules/avatar', group: 'molecules', label: 'Avatar', desc: 'two sizes with initials', covers: [`${UI}/avatar.tsx`] },
    { id: 'molecules/toggle', group: 'molecules', label: 'Toggle and toggle group', desc: 'on, off, segmented group', covers: [`${UI}/toggle.tsx`, `${UI}/toggle-group.tsx`] },
    { id: 'molecules/tabs', group: 'molecules', label: 'Tabs', desc: 'three tabs, each active in turn', covers: [`${UI}/tabs.tsx`] },
    { id: 'molecules/card', group: 'molecules', label: 'Card', desc: 'header, content, footer', covers: [`${UI}/card.tsx`] },
    { id: 'molecules/table', group: 'molecules', label: 'Table', desc: 'header and rows', covers: [`${UI}/table.tsx`] },
    { id: 'molecules/select', group: 'molecules', label: 'Select', desc: 'trigger and open menu', covers: [`${UI}/select.tsx`] },
    { id: 'molecules/dropdown-menu', group: 'molecules', label: 'Dropdown menu', desc: 'items, shortcuts, destructive', covers: [`${UI}/dropdown-menu.tsx`] },
    { id: 'molecules/dialog', group: 'molecules', label: 'Dialog', desc: 'title, body, footer actions', covers: [`${UI}/dialog.tsx`] },
    { id: 'molecules/sheet', group: 'molecules', label: 'Sheet and drawer', desc: 'side panel and bottom drawer', covers: [`${UI}/sheet.tsx`, `${UI}/drawer.tsx`] },
    { id: 'molecules/tooltip', group: 'molecules', label: 'Tooltip and popover', desc: 'tooltip, popover, hover card', covers: [`${UI}/tooltip.tsx`, `${UI}/popover.tsx`, `${UI}/hover-card.tsx`] },
    { id: 'molecules/accordion', group: 'molecules', label: 'Accordion and collapsible', desc: 'one item open', covers: [`${UI}/accordion.tsx`, `${UI}/collapsible.tsx`] },
    { id: 'molecules/breadcrumb', group: 'molecules', label: 'Breadcrumb', desc: 'trail with separators', covers: [`${UI}/breadcrumb.tsx`] },
    { id: 'molecules/command', group: 'molecules', label: 'Command palette', desc: 'search, groups, shortcuts', covers: [`${UI}/command.tsx`] },
    { id: 'molecules/toast', group: 'molecules', label: 'Toast', desc: 'default, success, error', covers: [`${UI}/sonner.tsx`] },
    { id: 'molecules/spinner', group: 'molecules', label: 'Loading spinner', desc: 'three sizes', covers: [`${UI}/loading-spinner.tsx`] },
    { id: 'molecules/calendar', group: 'molecules', label: 'Calendar', desc: 'month grid with a selected day', covers: [`${UI}/calendar.tsx`] },
    { id: 'molecules/navigation-menu', group: 'molecules', label: 'Navigation menu', desc: 'link row, one active', covers: [`${UI}/navigation-menu.tsx`] },
    { id: 'molecules/scroll-area', group: 'molecules', label: 'Scroll area', desc: 'content with a scrollbar', covers: [`${UI}/scroll-area.tsx`] },

    // ── Components ───────────────────────────────────────────────────────────
    { id: 'components/logo', group: 'components', label: 'Logo', desc: 'Merrion Gold mark, 3 sizes', covers: [`${WEB}/components/logo.tsx`] },
    { id: 'components/app-sidebar', group: 'components', label: 'App sidebar', desc: 'logo, nav groups, user footer', covers: [`${WEB}/components/app-sidebar.tsx`, `${WEB}/components/nav-main.tsx`, `${WEB}/components/nav-secondary.tsx`, `${UI}/sidebar.tsx`], needs: ['components/logo'] },
    { id: 'components/site-header', group: 'components', label: 'Site header', desc: 'trigger, title, search, actions', covers: [`${WEB}/components/site-header.tsx`], needs: ['components/logo'] },
    { id: 'components/nav-user', group: 'components', label: 'User menu', desc: 'sidebar footer and its menu', covers: [`${WEB}/components/nav-user.tsx`] },
    { id: 'components/command-search', group: 'components', label: 'Command search', desc: 'search trigger and palette', covers: [`${WEB}/components/command-search.tsx`] },
    { id: 'components/form', group: 'components', label: 'Generic form', desc: 'field group, error, actions', covers: [`${UI}/form.tsx`] },
    { id: 'components/admin-panel', group: 'components', label: 'Admin panel and stat', desc: 'titled panel with stats', covers: [`${WEB}/app/admin/components/panel.tsx`] },

    // ── Blocks ───────────────────────────────────────────────────────────────
    { id: 'blocks/spot-card', group: 'blocks', label: 'Spot price card', desc: '4 metals × normal, active, frozen', covers: [`${DASH}/section-cards.tsx`] },
    { id: 'blocks/spot-chart', group: 'blocks', label: 'Spot price chart', desc: 'area chart card with metal toggle', covers: [`${DASH}/chart-area-interactive.tsx`, `${UI}/chart.tsx`] },
    { id: 'blocks/product-table', group: 'blocks', label: 'Product table', desc: 'header, group rows, 8 sample rows', covers: [`${DASH}/table/product-table-body.tsx`, `${DASH}/table/product-columns.tsx`] },
    { id: 'blocks/product-filter-bar', group: 'blocks', label: 'Product filter bar', desc: 'search, filters, columns menu', covers: [`${DASH}/table/product-filter-bar.tsx`] },
    { id: 'blocks/market-mode-banner', group: 'blocks', label: 'Market mode banner', desc: 'Weekend, Volatile, Shortage strip', covers: [`${DASH}/market-mode-banner.tsx`] },
    { id: 'blocks/freshness-indicator', group: 'blocks', label: 'Price freshness', desc: 'live and stale indicator, stale notice', covers: [`${DASH}/data-freshness-indicator.tsx`, `${DASH}/stale-prices-notice.tsx`] },
    { id: 'blocks/trade-tab', group: 'blocks', label: 'Trade tab', desc: 'quote cart with results', covers: [`${DASH}/pricing-tools/trade-tab.tsx`, `${DASH}/pricing-tools/tab-widgets.tsx`] },
    { id: 'blocks/melt-calculator', group: 'blocks', label: 'Melt calculator', desc: 'weight, category, payout', covers: [`${DASH}/pricing-tools/trade-tab.tsx`] },
    { id: 'blocks/tools-panel', group: 'blocks', label: 'Pricing tools panel', desc: 'title, tab pills, trade tab', covers: [`${DASH}/pricing-tools/pricing-tools-panel.tsx`], needs: ['blocks/trade-tab'] },
    { id: 'blocks/sign-in-form', group: 'blocks', label: 'Sign-in form', desc: 'card with fields and error', covers: ['apps/web/src/app/auth/sign-in/components/login-form-1.tsx'] },
    { id: 'blocks/system-health', group: 'blocks', label: 'System health panel', desc: 'status pill and check list', covers: ['apps/web/src/app/admin/components/overview/health-panel.tsx'], needs: ['components/admin-panel'] },
    { id: 'blocks/add-product-dialog', group: 'blocks', label: 'Add product dialog', desc: 'form fields and actions', covers: [`${DASH}/table/add-product-dialog.tsx`, `${DASH}/table/product-form.tsx`] },
    { id: 'blocks/delete-product-dialog', group: 'blocks', label: 'Delete product dialog', desc: 'confirmation', covers: [`${DASH}/table/delete-product-dialog.tsx`] },

    // ── Layouts ──────────────────────────────────────────────────────────────
    { id: 'layouts/sign-in', group: 'layouts', label: 'Sign-in page', desc: '/auth/sign-in', covers: ['apps/web/src/app/auth/sign-in/page.tsx'], needs: ['components/logo', 'blocks/sign-in-form'] },
    { id: 'layouts/dashboard', group: 'layouts', label: 'Dashboard', desc: '/dashboard with the tools panel open', covers: ['apps/web/src/app/dashboard/page.tsx'], needs: ['components/app-sidebar', 'components/site-header', 'blocks/spot-card', 'blocks/spot-chart', 'blocks/product-filter-bar', 'blocks/product-table', 'blocks/tools-panel'] },
    { id: 'layouts/admin', group: 'layouts', label: 'Admin console', desc: '/admin, Overview tab', covers: ['apps/web/src/app/admin/page.tsx'], needs: ['components/app-sidebar', 'components/site-header', 'blocks/system-health', 'components/admin-panel'] },
];
