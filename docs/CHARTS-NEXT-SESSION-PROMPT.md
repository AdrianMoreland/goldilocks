# Next-session prompt: Goldilocks Redesign Final

For a Claude Code cloud session with the goldilocks repo attached. Paste everything below the line into the new session.

---

We are redesigning where Goldilocks shows its charts. The goldilocks repo is attached to this session; work on master and check what has landed since c2ab593 ("feat: v10 Analytics, People & permissions, and Settings (#180)"). Read docs/CHARTS-PLAN-HANDOFF.md first (live copy: https://claude.ai/artifact/JrDtrcHPSCxaWwSVQLFuWZ). It holds the chart plan (categories 1, 2, 3), where each chart moves, the requirements, the artifacts and the code to read, and the open questions.

## Skills and tools to use

Load each before the step that needs it, and tell me in one line which ones you used:

- **frontend-design**: before building the replica (layout, type, Sonar look).
- **dataviz**: before drawing any chart, so every chart follows one system in light and dark.
- **chrome-browser** (Claude in Chrome): to open the live Goldilocks app in my browser and screenshot every page, tab and dialog, to copy from.
- **Supabase MCP**: read-only queries for the real data. Never write to the database.
- **Artifact guides** (pages and design topics): before the first publish.
- **docs**: to update the live plan doc (grill answers, Change plan section).
- **gl-git, gl-start-of-day, gl-end-of-day, gl-sync-docs, gl-drive**: my own skills. Use whichever this session lists: gl-start-of-day at the start, gl-git for commits, gl-sync-docs to keep docs/CHARTS-PLAN-HANDOFF.md in step with the doc, gl-end-of-day at the end. If one isn't listed, say so and carry on without it.
- If another listed skill fits a step better than these, suggest it before using it.

## Steps

### 1. Build Goldilocks Redesign Final: a replica of the deployed app

Build a new HTML artifact called "Goldilocks Redesign Final": a pixel-perfect, fully navigable replica of the app as deployed today, with real data. This is the starting point we will change later, so it must match the live app, not the v10 prototype.

- **Every page**, as in the deployed sidebar: Pricing (metal cards, spot chart with ranges and All Metals / Selected, the full product table, the tools panel with all its tabs), Price board, Inventory, Orders, Customer orders, Stocktake, Import, Customers, Invoices, SOP, Analytics (all 7 tabs, every chart), Rules, Admin (overview, people, permissions), Project and Settings. Sidebar links, tabs, sheets, dialogs, filters and toggles all work. Add an empty "Assistant" entry for the page we design next.
- **Pixel-perfect:** copy from the real code (Sonar tokens, components, spacing, icons) and check each page against a Chrome screenshot of the live app at desktop and phone widths. Charts are drawn as the app draws them: the Recharts area chart on Pricing, the SVG chart kit in apps/web/src/app/analytics/components/charts.tsx, Recharts bars on Admin.
- **Real data:** use read-only Supabase queries for the full product catalogue (names, weights, premiums, discounts, stock), branches, live spot prices and spot history, trades, orders, invoices and the analytics figures, so every number looks like the live app. Replace customer and staff names, emails and phone numbers with made-up ones. Where the database cannot be reached, use the repo's seed and import fixtures, and tell me which pages that affects.
- **iPhone:** one self-contained HTML file (data inline or as JSON inside it). Do not load pages in iframes from separate files: they do not load in the Claude iOS app, which is where I review.
- Light and dark, phone, iPad and desktop widths.
- Do not edit the Goldilocks Master Redesign or Goldilocks Chart Review artifacts.

When it's published, list every place it doesn't match the live app, then stop and let me review it.

### 2. Grill session

After I approve the replica, interview me until the plan has no gaps. Ask one question at a time, using multiple-choice questions where possible, each with your recommended answer first and a one-line reason. Point at the replica when a question is about a specific screen. Cover:

- every open question in the plan (Receipts source, Money flow nodes, Analytics tab names and permissions, Goods held age start, Assistant Usage access, Pricing chart toggle default);
- anything in category 1 that is unclear to you after reading the code and the real data (data source, period options, filters, empty states, who can see it);
- category 2: walk me through each candidate quickly and ask keep, cut, or decide later;
- the "Not discussed, assumed kept" list: confirm each.

Push back where my answer conflicts with the code, the data, or another answer. When we're done, write the answers into the plan doc and docs/CHARTS-PLAN-HANDOFF.md (a "Decisions from the grill session" section), commit on a branch with gl-git, and show me the summary.

### 3. Change plan

Turn the plan plus the grill decisions into a task list per page (Pricing, Assistant, Admin, Analytics) under a new "Change plan" section, in the doc and in the repo file. Don't apply any changes to the artifact yet.
