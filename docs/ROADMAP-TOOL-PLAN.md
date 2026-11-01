# Plan: roadmap tool inside the Goldilocks app

Status: approved by the owner for slices 0 to 5 on 2026-11-01 (see section 12). No code and no migration is included in this PR.
Date: 2026-11-01. Follows `docs/WORKFLOW-PLAN.md` (phase C).

## 1. Goal

One place, the `/project` page of the app, where the owner captures ideas, sorts them, and ticks, edits and adds roadmap tasks, and where one click (or a schedule) really syncs with `docs/ROADMAP.md` on `master` through a reviewed pull request. The claude.ai "Goldilocks Backlog" page and its scheduled Claude tasks stay in use alongside it (owner decision); see the two-partner rules in section 9.

Rules that carry over unchanged:
- `docs/ROADMAP.md` stays the record. The owner merges every sync PR by hand. The app never merges.
- A sync PR changes only `docs/ROADMAP.md`.
- Nothing is deleted silently. A task missing from the file is flagged, not removed.
- Notes and edits are never lost: sync never overwrites app-side work it has not shown the owner.
- Business Central remains the system of record for business data. This tool is the project plan only.
- Every write is audited in the same transaction (roadmap ground rule 6). Zod schemas in `shared-types`. No new repository layer (roadmap decision on persistence boundary); a port only at the external seam (GitHub).

## 2. What already exists (important)

The first draft of this idea (the F11 proposal) assumed the roadmap would be rebuilt as tables of sections and nested tasks. The code says that is not needed:

| Piece | Today |
|---|---|
| Storage | `roadmap_document` table: **one row holding the whole Markdown**, `version` for optimistic locking, `updatedBy`, `updatedAt` (`apps/api/prisma/schema.prisma`) |
| API | `GET /roadmap`, `POST /roadmap/edit` (admin only): toggle, add, delete, edit one task by line index plus its current text, so a stale edit is refused. Version conflict gives HTTP 409. Audit entry in the same transaction (`roadmap.service.ts`) |
| Shared logic | `packages/shared-types/src/roadmap.ts`: `parseRoadmap`, `countTasks`, `applyRoadmapEdit`, with tests |
| Web | `apps/web/src/app/project/views/roadmap-view.tsx`: sections with icons and progress, tick, add, edit, delete |
| File link | `roadmap:import` / `roadmap:export` scripts (manual, diff first), plus a local-checkout write-back |
| Problem | The deployed row is stale: version 28, last edited 2026-10-19, 361 of 715 lines differ from the file. Nothing keeps it current, and the Railway deploy has no `docs/ROADMAP.md` to seed from |

What the claude.ai page has that the app lacks: Inbox (quick capture and triage), a backlog board (features, bugs and fixes, decisions), task notes, nesting display with subtask counts, and the three-way sync to GitHub.

## 3. Options

**A. Keep the Markdown row; add GitHub sync, inbox and backlog tables (recommended).**
The roadmap stays one Markdown document. Sync is a text three-way merge between the file at the last sync (base), the file now on `master`, and the app row. New tables are added only for things that are not in the Markdown today: inbox notes, backlog items, decisions, and the sync state.
- Smallest change; reuses parser, edit API, view and audit already in production.
- The merge works on the same text on both sides, so there is no title matching between two different data models (the main source of complexity in `tools/roadmap-sync`).
- Notes on a task would be stored in the Markdown itself (`*( ... )*`, the format the file already uses), so they survive any sync.
- Weakness: line-based storage, so large re-organisations of the file are merged as text. Mitigated by the conflict rule below.

**B. Normalised tables (sections, tasks with parent id, notes, tags).**
Cleaner for queries, drag-and-drop ordering and per-task history, but it needs a Markdown-to-rows importer and a rows-to-Markdown exporter that reproduces the file byte for byte, or every sync PR becomes a noisy reformat. About 2 to 3 times the work of A, with a second source of drift (rows vs file). Not recommended unless per-task history or assignment is wanted later.

**C. Keep the claude.ai page; only fix the mirror.** Cheapest, but keeps two editable copies. Rejected by the owner (decision recorded in `WORKFLOW-PLAN.md`).

The rest of this plan is option A.

## 4. Data model (additive migrations only)

All new tables; `roadmap_document` is unchanged. Each slice that needs a table has its own migration, approved by the owner before it is applied (dev and production share one Supabase database; a migration has no dev-only phase).

```
roadmap_sync_state          (single row, id = 1)
  base_commit  text         commit SHA of master at the last successful sync
  base_markdown text        the file as of base_commit (the "base" of the three-way merge)
  last_synced_at timestamptz
  open_pr_number int?       the open [roadmap-sync] PR, if any
  open_pr_branch text?

roadmap_inbox
  id uuid pk, text text, kind enum(IDEA, TASK, FIX), source enum(APP, GITHUB_ISSUE, SHORTCUT),
  github_issue int? unique, status enum(NEW, PROMOTED, DISCARDED), created_at, created_by,
  handled_at?, promoted_to text?          -- e.g. "roadmap 1.12" or "backlog item <id>"

backlog_item
  id uuid pk, kind enum(FEATURE, BUG, DECISION), title, detail text?, status enum(...),
  priority?, effort?, file_ref text? (path:line for bugs), recommendation text? (decisions),
  sort_order, created_at, updated_at, updated_by
```

`audit_log` is reused as is. No table for tasks, sections or notes (option A).

The artifact's 51 existing backlog items (28 features, 15 bugs and fixes, 8 decisions) and its unsorted inbox notes are imported once, by a script that prints what it would write and needs `--apply` (same pattern as `roadmap:import`).

## 5. Shared types (`packages/shared-types`)

- Zod schemas: `RoadmapSyncStatus`, `InboxNote`, `InboxCreate`, `InboxTriage` (promote to roadmap section as a task, to backlog, or discard), `BacklogItem`, `BacklogItemUpdate`, `SyncRequest`, `SyncResult` (counts, log lines, PR URL).
- Pure functions, with tests, in the same package so the web app and API cannot disagree:
  - `mergeRoadmap(base, file, app) -> { forApp, forFile, log, appChanged, fileChanged }` (section 7).
  - Reuse `parseRoadmap` / `applyRoadmapEdit`; add `taskNote` helpers if notes are edited from the UI.

## 6. API (`apps/api/src/modules/roadmap`, plus `backlog` and `inbox` sub-modules)

| Endpoint | Purpose | Roles |
|---|---|---|
| `GET /roadmap`, `POST /roadmap/edit` | unchanged | admin |
| `GET /roadmap/sync` | status: base commit, app version, file changed on master?, app changed since base?, open sync PR | admin |
| `POST /roadmap/sync/pull` | bring master's file into the app (slice 2) | admin |
| `POST /roadmap/sync/push` | open or update the `[roadmap-sync]` PR from the app's changes (slice 3) | admin |
| `GET/POST /inbox`, `POST /inbox/:id/triage` | capture and triage | admin (capture also by a token, see 6.2) |
| `GET/POST/PATCH /backlog` | features, bugs and decisions | admin |

### 6.1 GitHub access

- A `GithubPort` (interface plus DI token) with one implementation using the REST API over `fetch`, so no new dependency and a fake in tests. This is the one genuinely swappable external seam the roadmap's persistence decision allows a port for.
- Operations needed: read `docs/ROADMAP.md` at `master` (content and commit SHA), list issues labelled `roadmap` and close one, create or update a branch and file, open or update a pull request, read a PR's state.
- Token: `GITHUB_SYNC_TOKEN`, a fine-grained PAT limited to `AdrianMoreland/goldilocks` with Contents, Pull requests and Issues read/write, stored as a Railway variable (never in the repo, never logged). 90-day expiry; the admin status endpoint shows the days left (GitHub returns the expiry header) so the app warns before it lapses. Renewal stays a manual step.
- All outbound calls get a timeout and no automatic retry on writes. Failures return a clear error and change nothing.

### 6.2 When sync runs

- **Button:** "Sync with GitHub" on the Roadmap view (pull, then push if the app has changes).
- **After a merge to `master`:** a repository webhook (push events) calls `POST /roadmap/sync/webhook`; the API verifies the `X-Hub-Signature-256` header against a shared secret `GITHUB_WEBHOOK_SECRET` (Railway variable, GitHub webhook secret) and runs a pull. No user token is involved.
- **After a deploy:** on API start-up a pull runs once in the background, so a fresh deploy never serves a stale roadmap.
- **Daily schedule:** the existing scheduler mechanism (to be confirmed against roadmap 0.7) runs a pull, and a push when the app has unsynced changes, once a day.
- Pull is always safe to repeat. Push respects the one-open-PR rule and never runs if a pull reported a conflict that needs a look.

### 6.3 Phone capture

Today the iOS Shortcut creates a GitHub issue labelled `roadmap`. Keep that: it needs no new public endpoint and no second token on the phone. The app's sync step turns each labelled issue into one inbox note (`github_issue` unique, so no duplicate) and closes the issue. Until slice 4 ships, the Claude daily sync keeps doing this for the page. Direct capture from the app UI is the quick-add box in section 8.

## 7. The merge

Inputs: `base` (stored in `roadmap_sync_state.base_markdown`), `file` (master now), `app` (the `roadmap_document` row). Same rules as the existing tool, restated:

| Situation | Result |
|---|---|
| Only the app changed a task line | goes to the file (sync push) |
| Only the file changed it | goes to the app (sync pull) |
| Both changed it | the app wins; the log lists it |
| Task added on one side | placed after the same sibling on the other |
| Task deleted in the app | removed from the file only if the file did not change that task since base |
| Task gone from the file | flagged in the app, never auto-deleted |
| Anything else (heading edits, prose) | line-level three-way merge; a conflict keeps the app's text and is logged |

Implementation: `mergeRoadmap(base, file, app)` in `packages/shared-types/src/roadmap-merge.ts`, a line-level three-way merge on the Markdown (slice 1). It returns two texts, `forApp` and `forFile`, because the "never delete from the app" rule makes them differ, plus a log of every region it decided. It is written fresh, with tests from the table above. It is not a port of `tools/roadmap-sync`: that tool works on the claude.ai page's own data model (ids, edit flags), and the 23 scenario checks its README mentions are not in the repo. `tools/roadmap-sync` stays, because the Claude daily sync for the page still runs it.

State markers (`base_commit`, `base_markdown`) move forward only when app and file agree and no sync PR is open (requirement R13).

## 8. Web (`apps/web/src/app/project2`, route `/project2`)

Built beside the current `/project` page, which is not touched (owner decision, 2026-11-01). When `/project2` does everything `/project` does, `/project` is removed and `/project2` takes its place. Reuse the existing design system (`DESIGN.md`), TanStack Query hooks (`roadmap.api.ts`), and `roadmap-view.tsx`.

- Roadmap view: add a sync banner (state, button "Sync with GitHub", link to the open PR), task notes, "not in file" flags, subtask done/total.
- New Inbox view and a global quick-add (a floating `+` and the `n` key), kinds Idea, Task, Fix; triage buttons: to roadmap (choose section), to backlog, discard, restore.
- New Backlog view: board by status, Bugs and fixes (with file:line), Decisions (with recommendation).
- Mobile first for quick add and tick; keep the existing page shell and routes.

## 9. Delivery in slices (each its own PR)

| # | Slice | Needs migration? | Size | Outcome |
|---|---|---|---|---|
| 0 | Add this tool to `docs/ROADMAP.md` as a section with these slices | no | S | Visible on the roadmap it manages |
| 1 | `GithubPort` + `GET /roadmap/sync` + read-only sync status banner on the new `/project2` page; `mergeRoadmap` written fresh with tests | no | M | Stale mirror becomes visible; merge logic proven, nothing written |
| 2 | Sync pull: new migration `roadmap_sync_state`; first run overwrites the stale row **after** the owner confirms a backup export; `POST /roadmap/sync/pull` | yes (1 table) | M | The app copy follows `master`; supersedes the manual import/export |
| 3 | Sync push: `POST /roadmap/sync/push` opens or updates `roadmap-sync/<date>`; merge-by-hand rule enforced (the API never calls merge) | no | M | One click gives a reviewed PR |
| 4 | Inbox: migration `roadmap_inbox`; capture, triage, GitHub issue intake; quick add | yes (1 table) | M | Phone and in-app capture land in one inbox |
| 5 | Backlog: migration `backlog_item`; board, bugs, decisions; one-off import from the artifact data | yes (1 table) | M | Everything the claude.ai page does exists in the app |
| 6 | ~~Retire~~ **Not approved.** The claude.ai page and the Claude sync tasks stay. Revisit later | - | - | - |

Slices 0 to 5 are approved (2026-11-01). Slices 1 to 3 give the owner what hurts most (a mirror that follows the file, and sync in one click). Slices 4 and 5 can be reordered without affecting them. Total, roughly 3 to 4 weeks of part-time work.

The claude.ai page and its daily and weekly Claude tasks **stay** (owner decision), so the file has two sync partners, the app and the page, each three-way merging against `master`. The file is the hub: page and app never talk to each other directly, only through merged PRs. Rules that make this safe:
- Only one `[roadmap-sync]` PR is open at a time. The app checks for an open one (any branch under `roadmap-sync/`) before opening its own, and updates it instead; the Claude sync is already told the same (requirement R17).
- The app pulls after every merge to `master`, so a PR merged from either side reaches the app within minutes.
- Edits made in the page and in the app to the same task before either has synced are a normal both-changed conflict: the side that syncs second sees the file already changed and the rule "both changed, the app (or page) wins" applies on that side only. This is the one place a human may need to look; the log lists it.
- Two editable surfaces (page and app) will drift more than one. If that proves annoying, retiring the page (the old slice 6) is the fix; it is left out of this plan on purpose.

## 10. Testing

- `shared-types`: merge scenarios (ported), schema tests.
- API: service tests with a fake `GithubPort` (no network); a version-conflict test; an "audit written in the same transaction" test, matching `roadmap.service.spec.ts`.
- Web: component tests with MSW for the sync banner and triage.
- CI is unchanged (`ci` already runs all of these). Migrations are checked by the existing `migration-check` job after merge.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Overwriting the stale app roadmap loses text that exists nowhere else (361 lines, not in git) | Slice 2 first exports it to a file the owner keeps (`roadmap:export` with a diff) and requires an explicit confirm. Its 78 ticked tasks are all ticked in the file, so no ticks are lost |
| PAT leaks or expires | Railway variable only; repo-scoped; 90-day expiry shown in the app; revoke and replace is a one-minute change |
| Two writers to the file (app sync and the old daily Claude sync) | Slice 2 turns the old sync's push off first; rename to a single `roadmap-sync/` branch family stays unchanged |
| A bad merge corrupts the Markdown | Merge result is validated by `parseRoadmap` (section and task counts) before anything is saved; the sync PR diff is reviewed by the owner anyway |
| Shared production/dev database | Additive migrations, approved first, one table per slice; no test data written to it |
| Scope growth (per-task history, assignees, comments) | Out of scope here; revisit option B if wanted |

## 12. Decisions (owner, 2026-11-01)

1. **Option A** (Markdown row). Reasons: the app already stores, edits, versions and audits the roadmap as Markdown; sync then compares Markdown with Markdown; and option B needs a lossless rows-to-Markdown export or every sync PR reformats the file.
2. **Slices 0 to 5 approved. The claude.ai page is not retired** (slice 6 dropped).
3. **Sync triggers:** a button, plus a daily schedule, plus automatically after a merge to `master` and after a deploy (section 6.2).
4. **Roles:** admin only, as today.
5. **Tokens:** the app's GitHub token is separate from the iOS Shortcut's and from the Actions' `ROADMAP_BOT_TOKEN`. Scope as in 6.1. New secrets on Railway: `GITHUB_SYNC_TOKEN` (needed from slice 1) and `GITHUB_WEBHOOK_SECRET` (needed from slice 2, together with the repository webhook).

## 13. Not in this plan

Auto-merge of sync PRs (separate decision after a clean trial), AI-written roadmap edits, per-user permissions inside the roadmap, customer-visible roadmap, and any change to Business Central integration.
