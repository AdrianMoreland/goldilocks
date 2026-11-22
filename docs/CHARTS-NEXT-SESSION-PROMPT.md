# Next-session prompt: Goldilocks Redesign Final

Paste everything below the line into a new chat.

---

We are redesigning where Goldilocks shows its charts. Read docs/CHARTS-PLAN-HANDOFF.md in the repo first (live copy: https://claude.ai/artifact/JrDtrcHPSCxaWwSVQLFuWZ). It holds the chart plan (categories 1, 2, 3), where each chart moves, the requirements, the artifacts and the code to read, and the open questions.

Repo: AdrianMoreland/goldilocks, branch main (last known commit c2ab593, 22 Nov 2026: v10 Analytics, People & permissions, Settings). Clone it and check whether main has moved since.

This session, do only step 1, then stop for my review:

1. Build a new HTML artifact called "Goldilocks Redesign Final" that is an exact copy of the UI deployed today, so we can change it later. In scope: the Pricing dashboard (metal cards, spot price chart with its range and All Metals / Selected controls, product table, tools panel), Analytics with all 7 current tabs and every chart as it is now, and the Admin overview with its charts. Show the other pages only as sidebar entries, and add an empty "Assistant" entry for the page we will design next.
   - Copy the look from the real code, not from the v10 prototype: Sonar tokens, sidebar, header, cards, spacing, and the charts as the app draws them (Recharts area chart on Pricing; the SVG chart kit in apps/web/src/app/analytics/components/charts.tsx; Recharts bars on Admin).
   - If you can, open the live app in my Chrome and take screenshots of each page to compare against. If you cannot reach it, say so and work from the code.
   - Use realistic made-up data in the same shapes the analytics API returns. No real customer names.
   - One self-contained HTML file. Do not load designs in iframes from separate files: they do not load in the Claude iOS app, which is where I review.
   - It must work in light and dark, and at phone, iPad and desktop widths.
   - Do not edit the Goldilocks Master Redesign or Goldilocks Chart Review artifacts.

2. After it is published, list in the plan anything you could not match exactly, then turn the plan into a task list per page (Pricing, Assistant, Admin, Analytics) under a new "Change plan" section. Don't apply any changes to the artifact yet.

Ask me the plan's open questions only when they block a step.
