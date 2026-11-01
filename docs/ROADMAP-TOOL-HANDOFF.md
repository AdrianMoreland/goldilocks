# Handoff: the roadmap tool (roadmap 1.20), state on 2026-11-01

Read this first in a new session. It says what is live, how to work in this repo, what bit us, and what is left. No secrets are in it, only variable names.

## 1. The goal in one paragraph

One place, `/project2` in the Goldilocks app, to capture, tick, edit and sync roadmap tasks with `docs/ROADMAP.md` on `master` through reviewed `[roadmap-sync]` PRs. The file is the record. The owner (Adrian Moreland) merges every PR by hand; the app and Claude never merge. The old `/project` page and the claude.ai "Goldilocks Backlog" page (with its daily and weekly Claude tasks) keep working untouched; `/project` is removed only when `/project2` does everything it does. Plans: `docs/ROADMAP-TOOL-PLAN.md` (overall), `docs/ROADMAP-SYNC-PULL-DESIGN.md` (slice 2, built), `docs/ROADMAP-SYNC-PUSH-DESIGN.md` (slice 3, **approved, to build**), `docs/WORKFLOW-PLAN.md`, `docs/RLS-PLAN.md`.

## 2. What is live (all on master, deployed, verified)

| Piece | Where |
|---|---|
| PR template with a `Roadmap:` line; issue forms | `.github/` |
| `roadmap-tick`: ticks `Roadmap: <section> \| <task text>` lines from a merged PR and opens or updates one `[roadmap-sync]` PR on branch `roadmap-sync/auto` (needs repo secret `ROADMAP_BOT_TOKEN`) | `.github/workflows/post-merge.yml`, `tools/roadmap-tick/` |
| `migration-check` (fails on edited migrations, opens a `migration` issue) | `post-merge.yml` |
| Smoke test after CI (API `/health` and web `/`, report only; repo variables `API_URL`, `WEB_URL`) | `.github/workflows/smoke.yml` |
| Weekly draft release notes (Mondays) | `.github/workflows/release-notes.yml`, `tools/release-notes/` |
| Three-way merge `mergeRoadmap(base, file, app)` -> `{ forApp, forFile, log, fileChanged, appChanged }`; `absorbFile`; `findAppOnlyTasks` | `packages/shared-types/src/roadmap-merge.ts`, `roadmap-sync.ts` (+ specs) |
| GitHub read port and client (`GithubPort`, token `GITHUB`) | `apps/api/src/infrastructure/github/` |
| `GET /roadmap/sync` status; `POST /roadmap/sync/pull` (dryRun, confirmReplace); signed `POST /roadmap/sync/webhook`; start-up pull | `apps/api/src/modules/roadmap/` (`roadmap-sync.service.ts`, `roadmap-pull.service.ts`, `roadmap-webhook.controller.ts`, `github-signature.ts`) |
| Tables `roadmap_sync_state` (the merge base, row id 1) and `roadmap_snapshot` (append-only backups), both with RLS on; `pnpm --filter api roadmap:snapshot` reads one back | `apps/api/prisma/` |
| `/project2` page: sync banner, "Sync from GitHub" dialog with preview and first-run confirmation | `apps/web/src/app/project2/` (`components/sync-banner.tsx`, `components/pull-dialog.tsx`, `sync-state.ts`) |

Verified live: the first pull replaced the stale copy (snapshot #1 kept the old text, 72,572 chars), a button pull merged #58 (snapshot #2), and the webhook pulled the #60 merge by itself (audit actor `github-webhook`). The app's roadmap is `roadmap_document` row 1; both `/project` and `/project2` use it; edits (tick, add, edit, delete) go through `POST /roadmap/edit` from `/project`.

## 3. How to work here (rules that were agreed)

- **Owner merges.** Never merge a PR or enable auto-merge unless told. Subscribe to each PR you open (`subscribe_pr_activity`) and fix red CI.
- **No AI traces:** no `Co-Authored-By` or session trailers in commits, no "Generated with" footer in PR bodies or comments. Local `CLAUDE.md` and `.claude/` are never committed.
- **PR body:** follow `.github/pull_request_template.md`. Use `Roadmap: 1.20 | Slice 3` (section id, then text matching exactly one unticked task) so `roadmap-tick` ticks it after merge, or `Roadmap: none`.
- **Migrations:** merging a PR with a migration applies it (Railway pre-deploy `pnpm --filter api prisma:deploy`). Keep a migration in its own commit, state it loudly in the PR title, get the owner's approval before they merge. New tables must `ENABLE ROW LEVEL SECURITY`. Slice 3 has none.
- **UI:** Goldilocks theme and design system only (`DESIGN.md`): `BaseLayout`, shared `packages/ui` components via `@/components/ui/*`, theme tokens, hairline borders, 6px controls, 12px cards, flat at rest, no tinted backgrounds, status dots for state, `tabular-nums` for figures, gold only for active and primary. Admin only.
- **Never touch `/project`.** `/project2` is built beside it.
- **Money and Business Central rules** in `docs/ROADMAP.md` ground rules do not apply to this tool (it is the project plan only).

## 4. Commands and checks (what CI runs)

```bash
pnpm install --frozen-lockfile
pnpm --filter @goldilocks/shared-types build          # consumers read dist/: rebuild after changing it
pnpm --filter @goldilocks/shared-types test           # vitest
pnpm --filter api exec tsc --noEmit --pretty false --incremental false
(cd apps/api && node node_modules/eslint/bin/eslint.js src --no-fix --no-cache --max-warnings 0)   # fix formatting with: eslint --fix <paths>
pnpm --filter api exec jest --ci                      # one module: ... jest --ci src/modules/roadmap
pnpm --filter web lint && pnpm --filter web test && pnpm --filter web build
```
Prisma commands need dummy env: `export DIRECT_URL=postgresql://ci:ci@localhost:5432/ci DATABASE_URL=$DIRECT_URL`.

## 5. Gotchas that cost time (do not repeat)

1. **Build output is tracked in git** (`apps/web/dist`, `packages/shared-types/dist`, `apps/api/dist`, stale). After a build run `git checkout -- apps/web/dist packages/shared-types/dist apps/api/dist; git clean -fdq -- apps/web/dist packages/shared-types/dist` before committing, or the stop hook complains about untracked files and the diff fills with noise. After that, rebuild `shared-types` before any web or API type-check.
2. **Never run a manual workflow on `master`** (above all "AI assistant eval"): any failed check on the newest commit makes Railway skip the deploy ("CI check suite failed"). Pick another branch, or run "Smoke test" only.
3. **Railway "Wait for CI"** waits for every workflow the push triggers. Nothing in `post-merge.yml` may wait for a deploy; the smoke test lives in its own workflow for that reason.
4. **Pre-deploy step** `pnpm --filter api prisma:deploy` is set on the api service (confirmed by the applied migration). Without it migrations are never applied.
5. **The webhook** must point at the **api** service (`.../roadmap/sync/webhook`), not the web service; secret in Railway `GITHUB_WEBHOOK_SECRET` and in GitHub must match. `rawBody: true` is set in `main.ts` for the HMAC check. The public route is allow-listed in `route-auth.spec.ts`; adding any public route needs the same conscious entry.
6. **History was rewritten** on 2026-11-01 (commit hashes and authors changed). Hashes stored in `roadmap_sync_state.baseCommit` are only labels; a mismatch just makes the next pull a harmless merge.
7. Tests for the merge must put the app text through a pull first; an app text that lacks master's new lines looks like an app deletion.
8. `get_file_contents` on big files overflows; use a local checkout. The GitHub MCP search tools are off; use `gh api` for search only. `gh` cannot reach the Actions or webhooks APIs through the proxy; use the `actions_list` MCP tool for runs.
9. The Supabase MCP can run **read-only** catalog queries (project `jzhdcaspwoclrrosdoei`). Never apply migrations through it: Prisma's own record would miss them.
10. Lint covers `apps/api/src` only; scripts in `apps/api/prisma/` are checked by type-check only.

## 6. What is left, in order

1. **Slice 3 (approved, ready to build): `docs/ROADMAP-SYNC-PUSH-DESIGN.md`.** One PR, four commits, no migration. Decisions are in its section 10.
2. Slice 4: inbox (migration `roadmap_inbox`, quick add, GitHub `roadmap` issue intake). Slice 5: backlog board, bugs, decisions (migration `backlog_item`, one-off import of the claude.ai page data). Each needs a design note and migration approval first, as slice 2 had.
3. Editing UI in `/project2` (ticks, add, edit, delete with notes), then retire `/project`.
4. `docs/RLS-PLAN.md`: enable RLS on the 26 older tables (plan merged; owner has said yes in principle; write it as its own PR with its migration for approval). Also: Supabase Auth "leaked password protection" is off (a dashboard toggle).
5. Optional small things: make the AI eval workflow refuse `master`; add "new tables must enable RLS" to `docs/ENGINEERING.md` and `migration-check`.
6. Reminders for the owner: `GITHUB_SYNC_TOKEN` and `ROADMAP_BOT_TOKEN` expire about 90 days from creation (late January 2027); the iOS Shortcut token has its own expiry. Test leftovers on the claude.ai page ("Testing mobile 3"), issue 38 and branch `docs/roadmap-sync-test` may still need cleaning (unverified). Dependabot PR #29 (73 updates) is open and untouched.

## 7. Working efficiently (the owner pays per token)

- Read this file, the slice 3 design, and only the files named in the prompt below. Do not re-read the large plan docs or `docs/ROADMAP.md`.
- Use `git grep` and read ranges, not whole files. No sub-agents for this slice.
- Run only the tests for what you just changed after each commit; run the full suites once before pushing. Keep each reply short; report once when the PR is open and CI is green.

---

## 8. Prompt for the next session (paste this)

```text
You are continuing work in the repo AdrianMoreland/goldilocks (cloud checkout, branch master). Task: implement SLICE 3 of the roadmap tool, exactly as designed and already approved by the owner.

Read these two files first, nothing else of the docs: docs/ROADMAP-TOOL-HANDOFF.md (rules, commands, gotchas) and docs/ROADMAP-SYNC-PUSH-DESIGN.md (the design; section 10 holds the owner's decisions). Do not re-explore the repo or re-read other plan docs. The owner pays per token: be efficient, no sub-agents, no over-engineering, solid tests.

Build in ONE PR from a new branch off master, in four commits, no migration:
1. packages/shared-types: add RoadmapPushRequestSchema and RoadmapPushResultSchema to roadmap-sync.schema.ts, and `appEditsToPush: number | null` to RoadmapSyncStatusSchema. Rebuild shared-types.
2. apps/api/src/infrastructure/github: extend GithubPort and GithubClient with writeFileOnBranch (create the branch at master's commit, or force-move it there if it exists, then commit docs/ROADMAP.md via the contents API as the token owner, message "roadmap-sync: app edits", no trailers), openPullRequest, updatePullRequest. Same fetch client style as the read calls (10 s timeout, no retry on writes, readable errors for 404/422). Tests with a mocked fetch.
3. apps/api/src/modules/roadmap: RoadmapPushService (reads the state row, master file and app text; result = mergeRoadmap(base, master, app); writes result.forFile; refuses without sync state, and if forFile is under 90% of master's length; one push at a time, 409 if busy; dryRun returns a preview and writes nothing; branch `roadmap-sync/app`, PR title "[roadmap-sync] app edits", body "Roadmap: none" plus counts and up to 40 changed lines; audit entry on a real push). POST /roadmap/sync/push (admin, Throttle 6/min, DTOs in common/dto/dtos.ts). Add appEditsToPush to the status in roadmap-sync.service.ts (count of 'to-file' log entries; null if no state row). Daily @Cron('15 6 * * *', Europe/Dublin): always a safety-net autoPull, and a push only if ROADMAP_DAILY_PUSH === 'true'. Service tests with a fake GithubPort (cases in design section 7); update route-auth.spec.ts providers if needed.
4. apps/web/src/app/project2: banner line "N edits in the app are not on GitHub yet" and a "Send app edits to GitHub" button (gold only when N > 0), plus a PushDialog modelled on components/pull-dialog.tsx (dry run preview in plain words using describeEntry, diff preview, Apply, toast with the PR link). Goldilocks design system rules in the handoff apply. Helper tests in sync-state.spec.ts. Do not touch /project.

Rules: no Co-Authored-By or "Generated with" lines anywhere; never merge; PR body from .github/pull_request_template.md with "Roadmap: 1.20 | Slice 3". Before every commit clean the tracked dist folders (handoff gotcha 1). Run the checks in handoff section 4 (module tests per commit, full suites once before pushing). Add the new variable to apps/api/.env.example and docs/DEPLOYMENT.md (ROADMAP_DAILY_PUSH, optional, default off). Open the PR, subscribe to it, fix any red CI, then report once, briefly: what was built, test counts, and what the owner should check after deploy (open /project2, press Check, make a tick on /project, expect "1 edit not on GitHub yet", press Send, review the PR, merge it, confirm the webhook pulls it back and the banner says Matches master). Never run a manual workflow on master.
```
