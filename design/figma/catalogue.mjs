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
const SITE = 'apps/site/app/components';
const UI_PKG = 'packages/ui/src';

export const GROUPS = [
    { key: 'variables', label: 'Variables', blurb: 'Colour, type, radius and spacing from DESIGN.md. Variables and text styles are always kept up to date; the ticks choose which reference frames are drawn.' },
    { key: 'components', label: 'Components', blurb: 'Larger shared pieces: sidebar, header, user menu, forms.' },
    { key: 'blocks', label: 'Blocks', blurb: 'Feature-specific compositions with placeholder data: spot cards, product table, trade tab, sign-in form.' },
    { key: 'site', label: 'Site', blurb: 'The public website: store components, header and footer, price ticker and the order dialogs (apps/site).' },
    { key: 'layouts', label: 'Layouts', blurb: 'Whole pages assembled from instances of the components and blocks (built first when missing).' },
];

export const CATALOGUE = [
    // ── Variables ────────────────────────────────────────────────────────────
    { id: 'variables/colors', group: 'variables', label: 'Colors', desc: 'Primitives, light and dark roles, metals', covers: ['DESIGN.md'] },
    { id: 'variables/typography', group: 'variables', label: 'Typography', desc: 'Text styles and specimens', covers: ['DESIGN.md', 'apps/web/src/index.css'] },
    { id: 'variables/radius', group: 'variables', label: 'Radius', desc: 'Corner radius scale', covers: ['DESIGN.md'] },
    { id: 'variables/spacing', group: 'variables', label: 'Spacing', desc: 'Spacing unit, gutters, cell padding', covers: ['DESIGN.md'] },

    { id: 'molecules/range-slider', group: 'molecules', label: 'Range slider', desc: 'two thumbs, for a price range', covers: [`${UI_PKG}/range-slider.tsx`] },

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

    // ── Site (apps/site) ─────────────────────────────────────────────────────
    { id: 'site/product-card', group: 'site', label: 'Product card', desc: '3 availability states × price live or unavailable', covers: [`${SITE}/product-card.tsx`, `${SITE}/product-availability.tsx`, `${SITE}/quantity-stepper.tsx`] },
    { id: 'site/product-row', group: 'site', label: 'Product row', desc: 'the compact table view, same states', covers: [`${SITE}/product-row.tsx`] },
    { id: 'site/store-filters', group: 'site', label: 'Store filters', desc: 'metal, type, price range, collect from', covers: [`${SITE}/store-filters.tsx`] },
    { id: 'site/price-ticker', group: 'site', label: 'Price ticker', desc: 'live, loading, stale', covers: [`${SITE}/price-ticker.tsx`] },
    { id: 'site/public-header', group: 'site', label: 'Public header', desc: 'desktop and phone, cart empty or with items', covers: [`${SITE}/public-header.tsx`] },
    { id: 'site/public-footer', group: 'site', label: 'Public footer', desc: 'sections, legal, company details', covers: [`${SITE}/public-footer.tsx`] },
    { id: 'site/market-closed-dialog', group: 'site', label: 'Market closed dialog', desc: 'amber warning with the next opening time', covers: [`${SITE}/market-closed-dialog.tsx`] },
    { id: 'site/payment-options-dialog', group: 'site', label: 'Payment options dialog', desc: 'how and when the customer pays', covers: [`${SITE}/payment-options-dialog.tsx`] },

    // ── Layouts ──────────────────────────────────────────────────────────────
    { id: 'layouts/sign-in', group: 'layouts', label: 'Sign-in page', desc: '/auth/sign-in', covers: ['apps/web/src/app/auth/sign-in/page.tsx'], needs: ['components/logo', 'blocks/sign-in-form'] },
    { id: 'layouts/dashboard', group: 'layouts', label: 'Dashboard', desc: '/dashboard with the tools panel open', covers: ['apps/web/src/app/dashboard/page.tsx'], needs: ['components/app-sidebar', 'components/site-header', 'blocks/spot-card', 'blocks/spot-chart', 'blocks/product-filter-bar', 'blocks/product-table', 'blocks/tools-panel'] },
    { id: 'layouts/admin', group: 'layouts', label: 'Admin console', desc: '/admin, Overview tab', covers: ['apps/web/src/app/admin/page.tsx'], needs: ['components/app-sidebar', 'components/site-header', 'blocks/system-health', 'components/admin-panel'] },
];
