# Next-session prompt: Goldilocks Redesign Final

Paste everything below the line into a new chat.

---

We are redesigning where Goldilocks shows its charts. Read docs/CHARTS-PLAN-HANDOFF.md in the repo first (live copy: https://claude.ai/artifact/JrDtrcHPSCxaWwSVQLFuWZ). It holds the chart plan (categories 1, 2, 3), where each chart moves, the requirements, the artifacts and the code to read, and the open questions.

Repo: AdrianMoreland/goldilocks, branch main (last known commit: the one that added this file, after c2ab593 "feat: v10 Analytics, People & permissions, and Settings (#180)"). Clone it and check whether main has moved since.

## Skills and tools to use

Load each before the step that needs it, and tell me in one line which ones you used:

- **frontend-design**: before writing the Redesign Final page (layout, type, Sonar look).
- **dataviz**: before drawing any chart, so every chart follows one system in light and dark.
- **chrome-browser** (Claude in Chrome): to open the live Goldilocks app in my browser and screenshot each page in scope, to copy from.
- **Artifact guides** (pages and design topics): before the first publish.
- **docs**: to update the live plan doc (Change plan section, grill answers).
- **gl-git, gl-start-of-day, gl-end-of-day, gl-sync-docs, gl-drive**: my own skills. Use whichever this session lists: gl-start-of-day at the start, gl-git for the commit, gl-sync-docs to keep docs/CHARTS-PLAN-HANDOFF.md in step with the doc, gl-end-of-day at the end. If one isn't listed, say so and carry on without it.
- If another listed skill fits a step better than these, suggest it before using it.

## Steps

### 0. Grill session (before building anything)

Interview me until the plan has no gaps. Ask one question at a time, using multiple-choice questions where possible, each with your recommended answer first and a one-line reason. Cover:

- every open question in the plan (Receipts source, Money flow nodes, Analytics tab names and permissions, Goods held age start, Assistant Usage access, Pricing chart toggle default);
- anything in category 1 that is unclear to you after reading the code (data source, period options, filters, empty states, who can see it);
- category 2: walk me through each candidate quickly and ask keep, cut, or decide later;
- the "Not discussed, assumed kept" list: confirm each;
- anything about the Redesign Final artifact itself (pages, data, before/after toggle).

Push back where my answer conflicts with the code, the data, or another answer. When we're done, write the answers into the plan doc and docs/CHARTS-PLAN-HANDOFF.md (a "Decisions from the grill session" section), commit on a branch with gl-git, and show me the summary.

### 1. Build Goldilocks Redesign Final

Build a new HTML artifact called "Goldilocks Redesign Final" that is an exact copy of the UI deployed today, so we can change it later. In scope: the Pricing dashboard (metal cards, spot price chart with its range and All Metals / Selected controls, product table, tools panel), Analytics with all 7 current tabs and every chart as it is now, and the Admin overview with its charts. Show the other pages only as sidebar entries, and add an empty "Assistant" entry for the page we will design next.

- Copy the look from the real code, not from the v10 prototype: Sonar tokens, sidebar, header, cards, spacing, and the charts as the app draws them (Recharts area chart on Pricing; the SVG chart kit in apps/web/src/app/analytics/components/charts.tsx; Recharts bars on Admin).
- Screenshot the live app with Claude in Chrome to compare against. If you cannot reach it, say so and work from the code.
- Use realistic made-up data in the same shapes the analytics API returns. No real customer names.
- One self-contained HTML file. Do not load designs in iframes from separate files: they do not load in the Claude iOS app, which is where I review.
- It must work in light and dark, and at phone, iPad and desktop widths.
- Do not edit the Goldilocks Master Redesign or Goldilocks Chart Review artifacts.

Stop after publishing and let me review it.

### 2. Change plan

After I approve step 1: list in the plan anything you could not match exactly, then turn the plan plus the grill decisions into a task list per page (Pricing, Assistant, Admin, Analytics) under a new "Change plan" section, in the doc and in the repo file. Don't apply any changes to the artifact yet.
