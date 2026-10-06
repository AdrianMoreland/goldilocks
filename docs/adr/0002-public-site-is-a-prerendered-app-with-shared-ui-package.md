---
status: accepted
---
# The public site is a separate prerendered app that shares a UI package

The customer site (roadmap 2.1) lives in `apps/site`, built with React Router v7 framework mode (Vite) and prerendered to static HTML at deploy time. Live prices are fetched in the browser from a separate, cached, rate-limited public price API on `apps/api`. Page content (company, trust, legal, blog, product copy) lives in the repo as MDX and structured files keyed by SKU. shadcn primitives are extracted into `packages/ui`; each app owns its own theme through CSS variables. A plain single-page app was rejected because crawlers and link previews need real HTML to replace a WordPress site's search presence; Next.js was rejected to avoid a second frontend framework.

## Consequences

- The site needs only static hosting plus a CDN; a price API outage degrades the price widgets, never the pages.
- Today's price is not in the prerendered HTML, so "gold price today" SEO pages are weaker until a server-rendered or hybrid route is added for them.
- Changing product or page copy needs a deploy until a database-backed CMS exists (roadmap 2.1, Admin CMS).
- Extracting `packages/ui` touches the staff app's imports once; after that the two apps share primitives but not themes.
- The public price API and rate limiting must exist before live prices ship (roadmap 2.0 scaling-trigger item).
